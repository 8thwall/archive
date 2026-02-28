import keyBy from 'lodash/keyBy'
import type {DeepReadonly} from 'ts-essentials'
import type {Expanse} from '@ecs/shared/scene-graph'

import {fs, g8} from '../worker/client'
import type {DependencyDiff, IDiffInfo, IG8Client, MergeDecision} from './g8-dto'
import {
  IG8DiffParams,
  IG8FileDiff,
  IG8FileInfoStatus,
  IG8GitProgress,
  IG8GitProgressLoad,
  IG8InspectParams,
  IG8MergeAnalysisInfo,
  IG8MergeTriplet,
  IG8SyncParams,
  IGit,
  IGitFile,
  IRepo,
  MergeChoice,
} from './g8-dto'
import {isFileMode} from '../common/file-mode'
import {rawActions as userSessionActions} from '../user/user-session-actions'
import {
  isAssetPath,
  isBackendPath,
  isDependencyPath,
  isFolderPath,
  validateBackendFileName,
  validateFile,
  validateFileError,
  validatePath,
} from '../common/editor-files'
import {fileExt} from '../editor/editor-common'
import {clearRepositoryDirtyBit} from '../common/repo-coordination'
import type {Dispatch, Thunk} from '../common/types/actions'
import type {AsyncThunk, DispatchifiedActions} from '../common/types/actions'
import {dispatchify} from '../common'
import type {RepoAction} from './tab-synchronization'
import {
  multiTabSyncBeginDualWrite, multiTabSyncEndDualWrite, withRunQueue, withSync, withWriteBlock,
  withWriteBlockComplete, multiTabSyncBeginWrite, multiTabSyncEndWrite,
} from './tab-synchronization'
import authenticatedFetch from '../common/authenticated-fetch'
import {
  applyMergeMarkers, decodeMergeHunks, generateSplitDiff, keepDependencies, lineCount,
} from './utils'
import type {ModuleDependency} from '../../shared/module/module-dependency'

import {
  gitChangesetsAction, gitDiffAction, gitErrorAction, gitErrorClearAction,
  gitProgressAction, gitUpdateAction,
} from './direct-git-actions'
import {errorAction} from '../common/error-action'
import type {MergePhase, NonLogicalConflictMerge} from '../editor/modals/MergePhase'
import {getRepoState} from './repo-state'
import type {ScopedFileLocation} from '../editor/editor-file-location'
import {
  DependencyConflictDetails, autoMergeDependencies, generateDependencyConflictDetails,
  resolveDependencyConflicts,
} from '../editor/dependency-conflicts'
import type {IDependencyContext} from '../editor/dependency-context'
import type {IMultiRepoContext} from '../editor/multi-repo-context'
import {EXPANSE_FILE_PATH} from '../studio/common/studio-files'
import {loadHistoryFromExpanse} from '../studio/actions/automerge-storage-actions'
import {VALID_CLIENT_NAME_REGEX} from './g8-common'

const DEFAULT_CLIENT = 'default'

const LOCAL_GIT_STATE = ['files', 'logs', 'changesets', 'clients', 'conflicts']
const FILE_UPDATE_GIT_STATE = ['files', 'changesets', 'conflicts']

const logErrorDetails = (
  repoId: string, msgstr: string, err?: Error
): Thunk<string> => (dispatch, getState) => {
  const sep = (err && '; ') || ''
  const errmsg = (err && err.message) || (err && JSON.stringify(err)) || ''
  const msg = `${msgstr}${sep}${errmsg}`
  // Add extra context to the message for logging.
  const repoState = getRepoState(getState, repoId)
  const {handle, repositoryName} = repoState?.repo || {}
  const client = repoState?.clients?.find(c => c.active)?.name || 'noclient'
  const logmessage = `${msg} {${repositoryName || 'no.repo'}:${handle || 'nohandle'}-${client}}`
  if (err?.stack) {
    err.message = logmessage
    // eslint-disable-next-line no-console
    console.error(err)
  } else {
    // eslint-disable-next-line no-console
    console.error(logmessage)
  }
  return msg
}
// This displays the error banner on top of the screen
const showErr = (repoId: string, msgstr: string, err?: Error): Thunk => (dispatch) => {
  const msg = dispatch(logErrorDetails(repoId, msgstr, err))
  dispatch(errorAction(msg))
}

// This opens the git error modal providing options for page refresh and repo re-sync
const showGitErr = (repoId: string, msgstr: string, err?: Error): Thunk => (dispatch) => {
  const msg = dispatch(logErrorDetails(repoId, msgstr, err))
  dispatch(gitErrorAction(repoId, msg))
}

const gitLoadProgress = (repoId: string, load: IG8GitProgressLoad) => (
  gitProgressAction(repoId, {load})
)

const gitDiffProgress = (repoId: string, diff: IG8GitProgress['diff']) => (
  gitProgressAction(repoId, {diff})
)

const combineGitState = async (
  aMaybePromise: Partial<IGit> | Promise<Partial<IGit>>,
  bMaybePromise: Partial<IGit> | Promise<Partial<IGit>>
): Promise<Partial<IGit>> => {
  const a = await aMaybePromise
  const b = await bMaybePromise
  // Make sure that a and b contain non-overlapping sets of information.
  const duplicateKeys = Object.keys(a).filter(k => k in b)
  if (duplicateKeys.length) {
    // eslint-disable-next-line no-console
    console.error('[git-actions] Duplicate keys when combining git state', duplicateKeys, a, b)
    throw new Error('Duplicate keys when combining git state')
  }

  // Return the union of data.
  return {...a, ...b}
}

const getParent = (filePath: string) => {
  const slashIndex = filePath.lastIndexOf('/')
  if (slashIndex === -1) {
    return null
  } else {
    return filePath.substring(0, slashIndex)
  }
}

const notifyClientCreated = (repoId: string): Thunk<void> => (dispatch, getState) => {
  const app = getState().apps.find(e => e.repoId === repoId)
  if (app) {
    dispatch({type: 'EDITOR_CLIENT_CREATED', key: app.appKey})
  }
}

const listFiles = (repo: IRepo): AsyncThunk<string[]> => () => fs.keys(repo.repositoryName)

const produceFiles = (repo: IRepo) => fs.keys(repo.repositoryName)
  .then(keys => Promise.all(keys.map(key => fs.get(repo.repositoryName, key))))
  .then(files => files.map(file => ({
    ...file,
    isDirectory: !isFileMode(file.mode),
    repoId: repo.repoId,
  })))
  .then((files: IGitFile[]): Partial<IGit> => {
    files.sort((a, b) => a.filePath.localeCompare(b.filePath))

    const childrenByPath: Record<string, string[]> = {}
    const filesByPath: Record<string, IGitFile> = {}
    const topLevelPaths: string[] = []
    const filePaths = files.map(file => file.filePath)

    files.forEach((baseFile) => {
      if (baseFile.isDirectory && !childrenByPath[baseFile.filePath]) {
        childrenByPath[baseFile.filePath] = []
      }

      const {filePath} = baseFile
      filesByPath[filePath] = baseFile
      const parentPath = getParent(filePath)
      if (parentPath) {
        if (!childrenByPath[parentPath]) {
          childrenByPath[parentPath] = []
        }
        childrenByPath[parentPath].push(filePath)
      } else {
        topLevelPaths.push(filePath)
      }
    })

    return {
      files,
      filesByPath,
      filePaths,
      topLevelPaths,
      childrenByPath,
    }
  })

const produceChangesets = (repo: IRepo) => (
  g8.listChangesets(repo)
    .then(changes => ({changesets: keyBy(changes, 'id')}))
)

const produceChangeClient = (repo: IRepo, clientName: string) => (
  g8.changeClient(repo, {clientName})
    .then(({clients}) => ({clients}))  // ignore extra fields (merges, mergeId).
)

const listChangesets = (repo: IRepo) => async (dispatch) => {
  try {
    await dispatch(userSessionActions.refreshJwtIfExpired())
    const {changesets} = await produceChangesets(repo)
    dispatch(gitChangesetsAction(repo.repoId, changesets))
    return Object.values(changesets)
  } catch (err) {
    return dispatch(showErr(repo.repoId, 'Couldn\'t list changesets', err))
  }
}

const saveClient = (repo: IRepo, {forceSave = true} = {}) => async (dispatch) => {
  try {
    await dispatch(userSessionActions.refreshJwtIfExpired())
    // Update changeset command does not force save so if we want to force we need to use this.
    await g8.saveClient(repo, {forceSave})
    // This updates all changesets. Network operations are not made unless needed.
    // This is so that all the status checks may be accurate since they are based on changesets
    // and a file that exists in a changeset does not appear in working changes.
    await g8.updateChangeset(repo, {}, null)
    return dispatch(listChangesets(repo))  // Reset dirty bits.
  } catch (err) {
    return dispatch(showErr(repo.repoId, 'Couldn\'t save client', err))
  }
}

const produceGitState = async (
  fields: string[],
  repo: IRepo
): Promise<Partial<IGit>> => {
  fields.forEach((f) => {
    if (!LOCAL_GIT_STATE.includes(f)) {
      throw new Error(`Invalid git state query: ${f}`)
    }
  })

  // If needed, start deployment first, since it involves a network request.
  const gitState: Promise<Partial<IGit>>[] = []
  if (fields.includes('files')) {
    gitState.push(produceFiles(repo))
  }

  if (fields.includes('logs')) {
    const getLogs = async () => {
      const l = await g8.getLogs(repo, 100)
      return {logs: l}
    }
    gitState.push(getLogs())
  }

  if (fields.includes('changesets')) {
    gitState.push(produceChangesets(repo))
  }

  if (fields.includes('clients')) {
    const listClients = async () => {
      const {clients} = await g8.listClients(repo)
      return {clients}
    }
    gitState.push(listClients())
  }

  if (fields.includes('conflicts')) {
    const drySyncClient = async () => {
      const {merges} = await g8.drySyncClient(repo)
      return {conflicts: merges}
    }
    gitState.push(drySyncClient())
  }

  return gitState.reduce(combineGitState, {})
}

const changeClient = (repo: IRepo, client) => async (dispatch) => {
  try {
    await dispatch(userSessionActions.refreshJwtIfExpired())
    const {clients} = await produceChangeClient(repo, client)
    const git = await combineGitState(
      {clients},
      produceGitState(FILE_UPDATE_GIT_STATE, repo)
    )
    return dispatch(gitUpdateAction(repo.repoId, 'CHANGE_CLIENT', git))
  } catch (err) {
    return dispatch(showGitErr(repo.repoId, `Couldn't change to client ${client})`, err))
  }
}

const newClient = (
  repo: IRepo,
  clientName: string
) => async (dispatch) => {
  try {
    const validClientName = VALID_CLIENT_NAME_REGEX.test(clientName)
    if (!validClientName) {
      throw new Error(
        `"${clientName}" is an invalid name; only numbers, lower-case letters, and un-bounding
        underscores (_) ([a-z0-9])`
      )
    }
    await dispatch(userSessionActions.refreshJwtIfExpired())
    await g8.newClient(repo, {clientName})
    dispatch(notifyClientCreated(repo.repoId))
    return dispatch(changeClient(repo, clientName))
  } catch (err) {
    return dispatch(showGitErr(repo.repoId, 'Couldn\'t create a new client', err))
  }
}

const deleteClient = (
  repo: IRepo,
  clientName: string
) => async (dispatch) => {
  try {
    await dispatch(userSessionActions.refreshJwtIfExpired())
    await g8.deleteClient(repo, {clientName})
    return dispatch(changeClient(repo, DEFAULT_CLIENT))
  } catch (err) {
    return dispatch(showGitErr(repo.repoId, `Couldn't delete ${clientName}`, err))
  }
}

// The API of *Changeset has to be compatible to each other.
const newChangeset = (repo: IRepo, {description, selectedFiles}) => async (
  dispatch
) => {
  try {
    await dispatch(userSessionActions.refreshJwtIfExpired())
    await g8.newChangeset(
      repo,
      {description, selectedFiles},
      null
    )
    return dispatch(listChangesets(repo))
  } catch (err) {
    return dispatch(showErr(repo.repoId, 'Couldn\'t create a new changeset', err))
  }
}

const deleteChangeset = (repo: IRepo, {changesetId}) => async (dispatch) => {
  try {
    await dispatch(userSessionActions.refreshJwtIfExpired())
    await g8.deleteChangeset(repo, {}, changesetId)
    return dispatch(listChangesets(repo))
  } catch (err) {
    return dispatch(showErr(repo.repoId, `Couldn't delete changeset ${changesetId}`, err))
  }
}

// cleanupAfterLand() should be called after doLandChangeset() to bring the local state into
// harmony with remote state; may be called in paralleled with publish since doLandChangeset()
// returns the new commit id
const cleanupAfterLand = (
  repo: IRepo,
  clientName: string,
  changesetId: string,
  commitId: string
) => async (dispatch) => {
  await dispatch(userSessionActions.refreshJwtIfExpired())
  dispatch(gitProgressAction(repo.repoId, {land: 'SYNCING'}))
  // NOTE(pawel) Since we just landed, we expect this to be a clean sync. Nonetheless it is a
  // very tiny race condition if someone else landed a conflicting change were landed
  // between our latest sync and this land.
  await g8.syncClient(repo, {
    clientName,
    // This flag will avoid a network operation so that we can close the land modal.
    skipPushAfterSync: true,
    syncParams: {
      syncCommitId: commitId,
      mergeDecisions: [],
    },
  })
  // At this point we can close the land modal and cleanup is asynchronous.
  dispatch(gitProgressAction(repo.repoId, {land: 'CLEAN_UP'}))
  dispatch(gitProgressAction(repo.repoId, {save: 'START'}))
  await Promise.all([
    // This save will push the synced client synced we skipped it in the sync.
    g8.saveClient(repo, {forceSave: true})
      .then(() => dispatch(gitProgressAction(repo.repoId, {save: 'DONE'}))),
    // This deletes the changeset branch locally and remotely.
    g8.deleteChangeset(repo, {}, changesetId),
  ])
  dispatch(gitProgressAction(repo.repoId, {land: 'LOADING_FILES'}))
  return produceGitState(LOCAL_GIT_STATE, repo)
}

// the land endpoint returns the squashed commit id that was merged to master
// this function passes through that commit id
const doLandChangesetByRepoId = (
  repo: IRepo,
  clientName: string,
  changesetId: string,
  description: string
): AsyncThunk<string> => (dispatch, getState) => {
  const body = {
    branchName: `${repo.handle}-${clientName}-CS${changesetId}`,
    description,
    selectedAccountUuid: getState().accounts.selectedAccount,
  }
  // NOTE(pawel) For git-controller endpoints, including land, we use the repoId.
  // Remember that for apps repositoryName is projectSpecifier and for modules is repoId.
  return dispatch(authenticatedFetch<string>(`/v1/git/${repo.repoId}/land`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    }))
}

const createBlob = (repo: IRepo, data: string) => async (dispatch) => {
  if (data === undefined || data === null) {
    dispatch(showErr(repo.repoId, 'You have to specify the data of the blob', null))
    return null
  }

  try {
    return await g8.createBlob(repo, data)
  } catch (err) {
    dispatch(showErr(repo.repoId, 'Couldn\'t create blob', err))
    return null
  }
}

const diffBlobs = (repo: IRepo, baseId: string, newId: string) => async (dispatch) => {
  try {
    return await g8.diffBlobs({...repo, baseId, newId})
  } catch (err) {
    dispatch(showErr(repo.repoId, 'Couldn\'t diff blobs', err))
    return null
  }
}

const getBlobs = (repo: IRepo, blobIds: string[]) => async (dispatch) => {
  try {
    return await g8.getBlobs(repo, blobIds)
  } catch (err) {
    dispatch(showErr(repo.repoId, 'Couldn\'t get blobs', err))
    return null
  }
}

const performDiff = (
  diffParams: DeepReadonly<IG8DiffParams>
): AsyncThunk<IDiffInfo> => async (dispatch) => {
  const {repositoryName, repoId} = diffParams
  dispatch(gitDiffProgress(repoId, 'REQUEST_SENT'))

  try {
    const res = await g8.diff(diffParams)

    const diffList = res.diffList as IG8FileDiff[]
    const blobsRequested = []

    diffList.forEach((diff) => {
      if (diff.info.blobId) {
        blobsRequested.push(diff.info.blobId)
      }
      if (diff.info.oldBlobId) {
        blobsRequested.push(diff.info.oldBlobId)
      }
    })

    if (blobsRequested.length === 0) {
      const empty = {diffList: [], blobContents: {}}
      dispatch(gitDiffProgress(repoId, 'READY'))
      dispatch(gitDiffAction(repoId, empty))
      return empty
    }

    const result = await g8.getBlobs({repositoryName}, blobsRequested)

    const blobs = result.data as string[]
    if (blobs.length !== blobsRequested.length) {
      throw new Error(`Requested ${blobsRequested.length} blobs but got back ${blobs.length}`)
    }

    const blobContents = {}
    // mapping file oids to blob content
    blobs.forEach((content) => {
      blobContents[blobsRequested.shift()] = content
    })
    const diffResult = {
      diffList,
      blobContents,
    }
    dispatch(gitDiffAction(repoId, diffResult))
    dispatch(gitDiffProgress(repoId, 'READY'))
    return diffResult
  } catch (err) {
    dispatch(gitDiffProgress(repoId, 'FAILED'))
    throw err
  }
}

const mergeBlobs = (
  repo: IRepo,
  mergeId: IG8MergeTriplet,
  fileId: IG8MergeTriplet,
  path: string
) => async (dispatch) => {
  if (!mergeId) {
    return dispatch(showErr(repo.repoId, 'You have to specify mergeId', null))
  }
  if (!fileId) {
    return dispatch(showErr(repo.repoId, 'You have to specify fileId', null))
  }
  if (!path) {
    return dispatch(showErr(repo.repoId, 'You have to specify fileId', null))
  }

  try {
    return await g8.mergeBlobs(repo, mergeId, fileId, path)
  } catch (err) {
    return dispatch(showErr(repo.repoId, 'Couldn\'t merge blobs', err))
  }
}

const updateChangeset = (
  repo: IRepo,
  {changesetId, description, selectedFiles}
) => async (dispatch) => {
  try {
    await dispatch(userSessionActions.refreshJwtIfExpired())
    await g8.updateChangeset(
      repo,
      {description, selectedFiles},
      changesetId
    )
    return dispatch(listChangesets(repo))
  } catch (err) {
    return dispatch(showErr(repo.repoId, `Couldn't update changeset ${changesetId}`, err))
  }
}

type ClientRevertOptions = {
  pathsToPreserve?: string[]
}

const revertClient = (repo: IRepo, options?: ClientRevertOptions) => async (dispatch) => {
  try {
    await g8.revert(repo, {pathsToPreserve: options?.pathsToPreserve})
    const git = await produceGitState(FILE_UPDATE_GIT_STATE, repo)
    dispatch(gitUpdateAction(repo.repoId, 'REVERT_CLIENT', git))
  } catch (err) {
    dispatch(showErr(repo.repoId, 'Couldn\'t revert client', err))
  }
}

const revertFile = (repo: IRepo, filePath: string) => async (dispatch) => {
  try {
    await g8.revert(repo, {pathsToRevert: [filePath]})
    const git = await produceGitState(FILE_UPDATE_GIT_STATE, repo)
    return dispatch(gitUpdateAction(repo.repoId, 'REVERT_FILE', git))
  } catch (err) {
    return dispatch(showErr(repo.repoId, `Couldn't revert ${filePath}`, err))
  }
}

const completeSyncClient = (
  repo: IRepo,
  clientName: string,
  syncParams: IG8SyncParams
): AsyncThunk => async (dispatch) => {
  try {
    await dispatch(userSessionActions.refreshJwtIfExpired())
    await g8.syncClient(repo, {clientName, syncParams})
    const updatedGit = await produceGitState(LOCAL_GIT_STATE, repo)
    await dispatch(gitUpdateAction(repo.repoId, 'SYNC_CLIENT_COMPLETE', updatedGit))
  } catch (err) {
    dispatch(showErr(repo.repoId, 'Couldn\'t sync with server', err))
  }
}

const computeDependencyConflict = async (
  repo: IRepo,
  merge: IG8MergeAnalysisInfo
): Promise<MergeDecision | null> => {
  const {fileId} = merge
  if (!fileId.yours || !fileId.theirs) {
    return null
  }

  const [yours, theirs, original] = (
    await g8.getBlobs(repo, [fileId.yours, fileId.theirs, fileId.original])
  ).data.map(raw => JSON.parse(raw) as ModuleDependency)

  const merged = autoMergeDependencies(yours, theirs, original)

  if (!merged) {
    return null
  }

  const mergeBlobId = (await g8.createBlob(repo, JSON.stringify(merged, null, 2))).id

  return {
    fileId: merge.fileId,
    choice: MergeChoice.Merge,
    mergeBlobId,
  }
}

const GIT_ACTION_ACTOR_ID = 'cc'  // Arbitrary hex, shouldn't matter

const computeExpanseConflict = (
  repo: IRepo,
  merge: IG8MergeAnalysisInfo
): AsyncThunk<MergeDecision | null> => async (dispatch) => {
  const {fileId} = merge
  if (!fileId.yours || !fileId.theirs) {
    return null
  }

  const [yours, theirs] = (
    await g8.getBlobs(repo, [fileId.yours, fileId.theirs])
  ).data.map(raw => JSON.parse(raw) as Expanse)

  const {loadSceneDoc} = await import('@ecs/shared/crdt')
  const {bytesToString} = await import('@ecs/shared/data')

  const [yourHistory, theirHistory] = await Promise.all([
    dispatch(loadHistoryFromExpanse(repo.repoId, yours)),
    dispatch(loadHistoryFromExpanse(repo.repoId, theirs)),
  ])

  if (!yourHistory || !theirHistory) {
    // NOTE(cindyhu): if we are unable to load history from expanse to continue the merge, we will
    // allow it to be surfaced as manual resolution.
    return null
  }

  const yourScene = loadSceneDoc(yourHistory.file, GIT_ACTION_ACTOR_ID)
  yourScene.update(() => yours)
  yourScene.merge(loadSceneDoc(theirHistory.file, GIT_ACTION_ACTOR_ID))

  const result: Expanse = {...yourScene.distill()}
  if (theirHistory.historyVersion) {
    result.historyVersion = theirs.historyVersion
  } else {
    result.history = bytesToString(yourScene.save())
  }

  const mergeBlobId = (await g8.createBlob(repo, JSON.stringify(result, null, 2))).id

  return {
    fileId: merge.fileId,
    choice: MergeChoice.Merge,
    mergeBlobId,
  }
}

// Returns true if a conflict resolution is needed.
const trySyncClient = (
  repo: IRepo,
  clientName: string
): AsyncThunk<boolean> => async (dispatch) => {
  try {
    await dispatch(userSessionActions.refreshJwtIfExpired())
    const syncRes = await g8.syncClient(repo, {clientName})
    const remainingConflicts: IG8MergeAnalysisInfo[] = []
    const autoResolvedConflicts: MergeDecision[] = []

    await Promise.all(syncRes.merges.map(async (merge) => {
      if (isDependencyPath(merge.path)) {
        const autoResolved = await computeDependencyConflict(repo, merge)
        if (autoResolved) {
          autoResolvedConflicts.push(autoResolved)
        } else {
          remainingConflicts.push(merge)
        }
        return
      }
      if (merge.path === EXPANSE_FILE_PATH) {
        autoResolvedConflicts.push(await dispatch(computeExpanseConflict(repo, merge)))
        return
      }
      remainingConflicts.push(merge)
    }))

    if (autoResolvedConflicts.length && !remainingConflicts.length) {
      // No actual logical conflicts, just resolve them and move on with life.
      await dispatch(completeSyncClient(repo, clientName, {
        syncCommitId: syncRes.mergeId.theirs,
        mergeDecisions: autoResolvedConflicts,
      }))
      return false
    }

    // Sync returns only this client; prevent overwriting existing client list.
    delete syncRes.clients
    if (remainingConflicts.length) {
      const gitWithChangesets = await combineGitState(syncRes, produceChangesets(repo))
      await dispatch(gitUpdateAction(repo.repoId, 'SYNC_CLIENT_MERGE_CONFLICT', gitWithChangesets))
      return true
    } else {
      const updatedGit = await produceGitState(LOCAL_GIT_STATE, repo)
      await dispatch(gitUpdateAction(repo.repoId, 'SYNC_CLIENT', updatedGit))
      return false
    }
  } catch (err) {
    dispatch(showErr(repo.repoId, 'Couldn\'t sync with server', err))
    return null
  }
}

const newClientFromCommit = (
  repo: IRepo,
  clientName: string,
  commitId: string
) => async (dispatch) => {
  await dispatch(newClient(repo, clientName))
  return dispatch(completeSyncClient(repo, clientName, {syncCommitId: commitId}))
}

const newClientFromExistingClient = (
  repo: IRepo, clientName: string, client: Pick<IG8Client, 'forkId' | 'name'>
): AsyncThunk => async (dispatch) => {
  try {
    await dispatch(newClientFromCommit(repo, clientName, client.forkId))
    await dispatch(userSessionActions.refreshJwtIfExpired())
    await g8.patchClient(repo, {clientName, patchParams: {ref: client.name}})
    const updatedGit = await produceGitState(LOCAL_GIT_STATE, repo)
    dispatch(gitUpdateAction(repo.repoId, 'PATCH_CLIENT_COMPLETE', updatedGit))
  } catch (err) {
    dispatch(showErr(repo.repoId, 'Couldn\'t sync with server', err))
  }
}

type CreateFileOptions = {
  skipValidate?: boolean
  timestamp?: number
}

const createFile = (
  repo: IRepo,
  filePath: string,
  content?: string,
  options: CreateFileOptions = {}
) => async (dispatch: Dispatch) => {
  if (!options.skipValidate) {
    const err = validateFileError(filePath, {requireAssetContent: true, content})
    if (err) {
      dispatch(errorAction(err))
      return
    }
  }

  try {
    await fs.put(repo.repositoryName, filePath, content, {timestamp: options.timestamp})
    const git = await produceGitState(FILE_UPDATE_GIT_STATE, repo)
    dispatch(gitUpdateAction(repo.repoId, 'CREATE_FILE', git))
  } catch (err) {
    // eslint-disable-next-line local-rules/hardcoded-copy
    dispatch(showErr(repo.repoId, 'Couldn\'t write file', err))
  }
}

const validateFileMove = (fileSrc: string, fileDest: string) => {
  if (isAssetPath(fileSrc) !== isAssetPath(fileDest)) {
    return 'Can\'t move in or out of assets.'
  }

  const isBackend = isBackendPath(fileSrc)

  if (isBackend !== isBackendPath(fileDest)) {
    // eslint-disable-next-line local-rules/hardcoded-copy
    return 'Can\'t move in or out of backends.'
  }

  if (isBackend && validateBackendFileName(fileDest)) {
    return null
  }

  const isFolder = isFolderPath(fileSrc)

  if (isFolder && !validatePath(fileDest, true)) {
    return 'Invalid folder name'
  }

  if (!isFolder && !validateFile(fileDest, {previousExtension: fileExt(fileSrc)})) {
    return 'Invalid filename'
  }

  return null
}

const renameFile = (
  repo: IRepo,
  fileSrc: string,
  fileDest: string
): AsyncThunk => async (dispatch) => {
  if (fileSrc === fileDest) {
    return
  }

  const moveError = validateFileMove(fileSrc, fileDest)
  if (moveError) {
    dispatch(errorAction(moveError))
    throw new Error(moveError)
  }

  try {
    await fs.rename(repo.repositoryName, fileSrc, fileDest)
    const git = await produceGitState(FILE_UPDATE_GIT_STATE, repo)
    dispatch(gitUpdateAction(repo.repoId, 'RENAME_FILE', git))
  } catch (err) {
    dispatch(showErr(repo.repoId, `Couldn't rename ${fileSrc} to ${fileDest}`, err))
  }
}

const createFolder = (repo: IRepo, folderPath: string) => (dispatch) => {
  if (!validatePath(folderPath)) {
    return Promise.resolve(dispatch(errorAction('Invalid folder name')))
  }
  return fs.mkdir(repo.repositoryName, folderPath)
    .then(() => produceGitState(FILE_UPDATE_GIT_STATE, repo))
    .then(git => dispatch(gitUpdateAction(repo.repoId, 'CREATE_FOLDER', git)))
    .catch(err => dispatch(showErr(repo.repoId, 'Couldn\'t create folder', err)))
}

type FileSaveInfo = {
  filePath: string
  content: string
  timestamp?: number
}

const saveFiles = (repo: IRepo, files: FileSaveInfo[]) => async (dispatch) => {
  try {
    await Promise.all(files.map(({filePath, content, timestamp}) => (
      fs.put(repo.repositoryName, filePath, content, {timestamp})
    )))
    const git = await produceGitState(FILE_UPDATE_GIT_STATE, repo)
    dispatch(gitUpdateAction(repo.repoId, 'SAVE_FILES', git))
  } catch (err) {
    // eslint-disable-next-line local-rules/hardcoded-copy
    dispatch(showErr(repo.repoId, 'Couldn\'t save files', err))
  }
}

type FileTransform = (file: IGitFile) => string | Promise<string>
interface FileMutation {
  filePath: string
  transform: FileTransform
  generate?: () => string | Promise<string>  // Optional, but required if the file doesn't exist yet
  newPath?: string
}
const mutateFile = (repo: IRepo, {filePath, transform, generate, newPath}: FileMutation) => (
  async (dispatch) => {
    try {
      const current = await fs.get(repo.repositoryName, filePath) as IGitFile
      const newContent = await (current ? transform(current) : generate())
      if (newContent === null) {
        if (current) {
          await fs.del(repo.repositoryName, filePath)
        }
      } else {
        await fs.put(repo.repositoryName, filePath, newContent)
        if (newPath) {
          await fs.rename(repo.repositoryName, filePath, newPath)
        }
      }
      const git = await produceGitState(FILE_UPDATE_GIT_STATE, repo)
      await dispatch(gitUpdateAction(repo.repoId, 'MUTATE_FILE', git))
    } catch (err) {
      dispatch(showErr(repo.repoId, `Couldn't mutate ${filePath}`, err))
      throw err
    }
  }
)

const transformFile = (
  repo: IRepo, filePath: string, transform: FileTransform, ignoreNonexistent?: boolean
) => (mutateFile(repo, {
  filePath,
  transform,
  generate: () => {
    if (!ignoreNonexistent) {
      throw new Error(`Failed to transform ${filePath}`)
    }
    return null
  },
})
)

// Syncs data about the within-user state of the repo as potentially modified by other instances
// of the same browser.
const syncRepoStateFromDisk = (repo: IRepo) => dispatch => fs.readFromMirror(repo)
  .then(() => clearRepositoryDirtyBit(repo.repositoryName))
  .then(() => produceGitState(LOCAL_GIT_STATE, repo))
  .then(git => dispatch(gitUpdateAction(repo.repoId, 'SYNC_REPO_STATE_FROM_DISK', git)))
  .catch(err => dispatch(showGitErr(repo.repoId, 'Couldn\'t sync repo state from disk', err)))

// NOTE(pawel) This doesn't fetch new deployments like the old version in git-actions does.
// TODO(pawel) Dispatch some progress events?
const syncRepo = (repo: IRepo) => async (dispatch) => {
  try {
    await dispatch(userSessionActions.refreshJwtIfExpired())
    const git = await g8.syncMaster(repo)
      .then(() => produceGitState(LOCAL_GIT_STATE, repo))
    return dispatch(gitUpdateAction(repo.repoId, 'SYNC_REPO_STATE_FROM_SERVER', git))
  } catch (err) {
    return dispatch(showErr(repo.repoId, 'Couldn\'t sync repo state from server', err))
  }
}

const deleteFile = (repo: IRepo, filePath: string) => (dispatch) => {
  if (!filePath) {
    dispatch(showErr(repo.repoId, 'You need to specify a file path', null))
    return Promise.resolve()
  }
  if (!repo.repositoryName) {
    dispatch(showErr(repo.repoId, 'You need to specify a repository name', null))
    return Promise.resolve()
  }
  return fs.del(repo.repositoryName, filePath)
    .then(() => produceGitState(FILE_UPDATE_GIT_STATE, repo))
    .then(git => dispatch(gitUpdateAction(repo.repoId, 'DELETE_PATH', git)))
    .catch(err => dispatch(showErr(repo.repoId, `Couldn't delete ${filePath}`, err)))
}

const deleteFiles = (
  repo: IRepo,
  filePaths: DeepReadonly<Array<string>>
): AsyncThunk<void> => async (dispatch) => {
  try {
    await Promise.all(filePaths.map(filePath => fs.del(repo.repositoryName, filePath)))
    const git = await produceGitState(FILE_UPDATE_GIT_STATE, repo)
    dispatch(gitUpdateAction(repo.repoId, 'DELETE_PATHS', git))
  } catch (err) {
    // eslint-disable-next-line local-rules/hardcoded-copy
    dispatch(showErr(repo.repoId, 'Couldn\'t delete files', err))
  }
}

const landFiles = (
  repo: IRepo,
  clientName: string,
  description: string,
  paths: string[],
  onRemoteLanded?: (commitId: string) => void  // Called asynchronously after remote land completes.
): AsyncThunk => async (dispatch, getState) => {
  const {changesets} = getRepoState(getState, repo)
  const selectedFiles: Record<string, true> = {}
  paths.forEach((path) => {
    selectedFiles[path] = true
  })
  const existingChangesetIds = Object.values(changesets).map(cs => cs.id)
  const newChangesets = await dispatch(newChangeset(repo, {
    description,
    selectedFiles,
  }))
  const changesetId = newChangesets.find(cs => !existingChangesetIds.includes(cs.id)).id
  try {
    const commitId = await dispatch(
      doLandChangesetByRepoId(repo, clientName, changesetId, description)
    )
    // Do this outside this stack in case the function throws.
    queueMicrotask(() => onRemoteLanded?.(commitId))
    const git = await dispatch(cleanupAfterLand(repo, clientName, changesetId, commitId))
    await dispatch(gitUpdateAction(repo.repoId, 'LAND_CHANGESET', git))
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)  // So that we can track this in prod errors.
    dispatch(gitProgressAction(repo.repoId, {land: 'DONE'}))  // Landing done.
    dispatch(showErr(repo.repoId, 'Error when landing. Please try again.', err))
    await dispatch(userSessionActions.refreshJwtIfExpired())
    await g8.deleteChangeset(repo, {}, changesetId)
  }
}

interface DependencyFile {
  path: string  // The path that was added/removed.
  contents: ModuleDependency  // The contents of the file.
}

type IDependencyDiffParams = DeepReadonly<IRepo & {
  basePoint?: string
  changePoint?: string
}>

/**
 * Perform a non-rename diff to figure out what happened to the dependency files.
 * This doesn't touch the redux state because it would conflict with the diff state.
 * The results are used locally by the caller. If this needs to change then we need to add
 * diffNoRename state into the git redux.
 */
const getDependencyDiff = (params: IDependencyDiffParams) => async ():
Promise<DependencyDiff[]> => {
  const {repositoryName, repoId} = params
  const g8DiffRes = await g8.diff({
    repositoryName,
    repoId,
    findRenames: false,
    basePoint: params.basePoint || 'FORK',
    changePoint: params.changePoint || 'HEAD',
  })

  const dependencyDiffList = keepDependencies(g8DiffRes.diffList)

  if (dependencyDiffList.length === 0) {
    return []
  }

  const blobsRequested: string[] = []
  dependencyDiffList.forEach(({info: {blobId, oldBlobId}}) => {
    if (blobId) {
      blobsRequested.push(blobId)
    }
    if (oldBlobId) {
      blobsRequested.push(oldBlobId)
    }
  })
  if (blobsRequested.length === 0) {
    throw new Error('Diff entries are present but there are no corresponding blobs')
  }
  const g8BlobsRes = await g8.getBlobs({repositoryName}, blobsRequested)
  if (g8BlobsRes.data.length !== blobsRequested.length) {
    throw new Error(`Requested ${blobsRequested.length} blobs but got ${g8BlobsRes.data.length}`)
  }
  const blobContents: Record<string, string> = {}
  g8BlobsRes.data.forEach((blob) => {
    // G8 returns the blobs in the order they were requested.
    blobContents[blobsRequested.shift()] = blob
  })

  const addRecords: Record<string, DependencyFile> = {}
  const deleteRecords: Record<string, DependencyFile> = {}
  const discoveredDependencyIds = new Set<string>()

  // Precondition: dependency files are valid so, we don't wrap the json parsing in try/catch.
  // If a dependency is renamed and its previous alias reused, it'll appear as a ADD
  // record and the old part of the MODIFIED record.
  dependencyDiffList.forEach((diff) => {
    switch (diff.info.status) {
      case IG8FileInfoStatus.ADDED: {
        const parsed = JSON.parse(blobContents[diff.info.blobId])
        const {dependencyId} = parsed
        addRecords[dependencyId] = {
          path: diff.info.path,
          contents: parsed,
        }
        discoveredDependencyIds.add(dependencyId)
        break
      }
      case IG8FileInfoStatus.DELETED: {
        const parsed = JSON.parse(blobContents[diff.info.oldBlobId])
        const {dependencyId} = parsed
        deleteRecords[dependencyId] = {
          path: diff.info.path,
          contents: parsed,
        }
        discoveredDependencyIds.add(dependencyId)
        break
      }
      // It is totally possible for a module to be removed then re-imported or
      // removed and a different module imported under the same alias.
      // Both cases we treat as if we added/removed a totally separate module.
      // Module id might not be a good way to match dependencies because we allow
      // for the possibility of two dependencies on the same module (different alias
      // for different release/version).
      case IG8FileInfoStatus.MODIFIED: {
        const parsedNew = JSON.parse(blobContents[diff.info.blobId])
        const parsedOld = JSON.parse(blobContents[diff.info.oldBlobId])
        const newDependencyId = parsedNew.dependencyId
        const oldDependencyId = parsedOld.dependencyId
        addRecords[newDependencyId] = {
          path: diff.info.path,
          contents: parsedNew,
        }
        deleteRecords[oldDependencyId] = {
          path: diff.info.path,
          contents: parsedOld,
        }
        discoveredDependencyIds.add(newDependencyId)
        discoveredDependencyIds.add(oldDependencyId)
        break
      }
      default:
        throw new Error(`Unexpected diff status ${diff.info.status}`)
    }
  })

  return [...discoveredDependencyIds].map((dependencyId) => {
    const addRecord = addRecords[dependencyId]
    const deleteRecord = deleteRecords[dependencyId]
    let status, previousAlias

    if (addRecord && deleteRecord) {
      status = 'MODIFIED'
      const aliasChanged = addRecord.contents.alias !== deleteRecord.contents.alias
      previousAlias = aliasChanged ? deleteRecord.contents.alias : undefined
    } else {
      status = addRecord ? 'ADDED' : 'DELETED'
    }

    // If a dependency is deleted we don't have current contents, so we look in the previous.
    const {alias} = (addRecord || deleteRecord).contents

    return {
      dependencyId,
      status,

      alias,
      previousAlias,

      filePath: (addRecord || deleteRecord).path,
      previousFilePath: deleteRecord?.path,

      // The parsed contents of the file.
      currentContents: addRecord?.contents,
      previousContents: deleteRecord?.contents,
    }
  })
}

/**
 * Verifies that the repo exists locally and is not empty.
 * Return true when repo is ready, false when it needs clone or init.
 * @param repo
 * @param ensureLocalClone
 */
const checkLocalRepoState = (
  repo: IRepo,
  {ensureLocalClone = false} = {}
): AsyncThunk<boolean> => async (dispatch) => {
  // NOTE(pawel) supply repo for worker selection
  await fs.readFromMirror(repo)

  // NOTE(pawel) For modules this is repoId and for apps this is projectSpecifier.
  // Whenever we key into the filesystem, always use repositoryName and for keying
  // into redux use repoId.
  const {repositoryName, repoId} = repo

  const [repoDir, gitDir, refMaster] = await Promise.all([
    fs.get(repositoryName),
    fs.get(repositoryName, '.git'),
    fs.get(repositoryName, '.git/refs/heads/master'),
  ])

  if (repoDir && gitDir && refMaster) {
    dispatch(gitLoadProgress(repoId, 'SYNC_MASTER'))
    await g8.syncMaster(repo)
    return true
  }

  // Repo exists but does not have a master branch.
  // This happens when we just created a fresh code commit repo.
  // Purge the local empty repo and signal a need to init.
  if (repoDir && gitDir && !refMaster) {
    await fs.deleteRepo(repositoryName)
    dispatch(gitLoadProgress(repoId, 'NEEDS_INIT'))
    return false
  }

  // Reaching here, we don't have a repo directory which means we need to clone.
  // If we don't want to clone, signal that a clone needs to happen.
  if (!ensureLocalClone) {
    dispatch(gitLoadProgress(repoId, 'HAS_REPO_NEEDS_CLONE'))
    return false
  }

  dispatch(gitLoadProgress(repoId, 'CLONE_REPO'))
  await fs.initRepo(repositoryName)
  await g8.clone(repo)

  // Check to see if repo is empty after cloning.
  if (!await fs.get(repositoryName, '.git/refs/heads/master')) {
    await fs.deleteRepo(repositoryName)
    dispatch(gitLoadProgress(repoId, 'NEEDS_INIT'))
    return false
  }

  // Repo exists in the filesystem, has a master branch and is synced.
  return true
}

/**
 * Ensure that there is a default client and that we are on an active client.
 * @param repo
 */
const checkClients = (repo: IRepo): AsyncThunk => async (dispatch) => {
  const {repoId} = repo
  await dispatch(gitLoadProgress(repoId, 'CHECK_CLIENTS'))
  let {clients} = await g8.listClients(repo)

  // Ensure that a DEFAULT_CLIENT exists if there is none.
  if (!clients || !clients.some(({name}) => name === DEFAULT_CLIENT)) {
    dispatch(gitLoadProgress(repoId, 'INIT_DEFAULT_CLIENT'))
    // eslint-disable-next-line no-lone-blocks,block-spacing
    { ({clients} = await g8.newClient(repo, {clientName: DEFAULT_CLIENT})) }
    dispatch(notifyClientCreated(repo.repoId))
  } else {
    dispatch(gitLoadProgress(repoId, 'CLIENTS_OK'))
  }

  dispatch(gitLoadProgress(repoId, 'CHECK_ACTIVE_CLIENT'))
  if (!clients.some(({active}) => active)) {
    dispatch(gitLoadProgress(repoId, 'SET_ACTIVE_CLIENT'))
    // eslint-disable-next-line no-lone-blocks,block-spacing
    { ({clients} = await produceChangeClient(repo, DEFAULT_CLIENT)) }
  }
  dispatch(gitLoadProgress(repoId, 'ACTIVE_CLIENT_OK'))
}

const fetchRemoteClients = (repo: IRepo): AsyncThunk => async (dispatch) => {
  try {
    const remoteClients = await g8.fetchRemoteClients(repo)
    dispatch(gitUpdateAction(repo.repoId, 'FETCH_REMOTE_CLIENTS', {remoteClients}))
  } catch {
    // eslint-disable-next-line local-rules/hardcoded-copy
    const message = `Failed to fetch remote clients for ${repo.repoId}`
    dispatch(errorAction(message))
    throw new Error(message)
  }
}

const inspectFiles = (
  repo: IRepo,
  params: Pick<IG8InspectParams, 'inspectPoint' | 'inspectRegex'>
): AsyncThunk<Array<{
  path: string
  contents: string
}>> => async () => {
  const {repositoryName} = repo
  const {info} = await g8.inspect({repositoryName, ...params})
  if (info.length === 0) {
    return []
  }
  const blobIds = info.map(i => i.blobId)
  const {data: blobs} = await g8.getBlobs({repositoryName}, blobIds)
  if (blobs.length !== blobIds.length) {
    throw new Error(`Requested ${blobIds.length} blobs but got back ${blobs.length}`)
  }
  return info.map((entry, idx) => ({
    path: entry.path,
    contents: blobs[idx],
  }))
}

type PrepareMergePhasesResult = DeepReadonly<{
  mergePhases: MergePhase[]
  nonLogicalConflicts: NonLogicalConflictMerge[]
}>

const prepareMergePhases = (repo: IRepo): AsyncThunk<PrepareMergePhasesResult> => async (
  dispatch, getState
) => {
  const {mergeId} = getRepoState(getState, repo)
  // Do not look for renames
  await dispatch(performDiff({
    repositoryName: repo.repositoryName,
    repoId: repo.repoId,
    basePoint: mergeId.yours,
    changePoint: mergeId.theirs,
    findRenames: false,
  }))
  const {diff: {diffList}, merges} = getRepoState(getState, repo)
  const blobContentsOrEmpty = oid => getRepoState(getState, repo).diff.blobContents[oid] || ''

  let emptyFileOidPromise: Promise<{id: string}>

  const mergePhases: DeepReadonly<MergePhase>[] = []
  const nonLogicalConflicts: NonLogicalConflictMerge[] = []

  await Promise.all(merges.map(async (merge) => {
    const diff: DeepReadonly<IG8FileDiff> = diffList.find(d => d.info.path === merge.path)
    const {fileId} = merge
    const deleteHappened = !fileId.yours || !fileId.theirs

    // NOTE(pawel) We only compute dependency details for conflicts not involving deletes.
    let dependencyConflictDetails: DependencyConflictDetails = null
    if (isDependencyPath(merge.path) && !deleteHappened) {
      // NOTE(pawel) Dependency files are random uuids, so it is extremely unlikely that
      // the conflict will be due to the same file path appearing. We're using this assumption
      // when fetching the original dependency file. We need the original to determine when someone
      // reset a config value to default (it removes that key from the config object).
      const originalBlob = (await g8.getBlobs(repo, [fileId.original])).data[0]

      const yours = JSON.parse(blobContentsOrEmpty(fileId.yours)) as ModuleDependency
      const theirs = JSON.parse(blobContentsOrEmpty(fileId.theirs)) as ModuleDependency
      const original = JSON.parse(originalBlob) as ModuleDependency

      dependencyConflictDetails = generateDependencyConflictDetails(yours, theirs, original)

      const merged = resolveDependencyConflicts(dependencyConflictDetails)

      if (merged) {
        const mergeBlobId = (await g8.createBlob(repo, JSON.stringify(merged, null, 2))).id
        nonLogicalConflicts.push({
          repoId: repo.repoId,
          mergeId,
          merge,
          fileIds: fileId,
          mergeBlobId,
        })
        return
      }
    }

    if (merge.path === EXPANSE_FILE_PATH) {
      const expanseMergeDecision = await dispatch(computeExpanseConflict(repo, merge))
      if (expanseMergeDecision) {
        nonLogicalConflicts.push({
          repoId: repo.repoId,
          mergeId,
          merge,
          fileIds: fileId,
          mergeBlobId: expanseMergeDecision.mergeBlobId,
        })
        return
      }
    }

    // deleted files don't have an OID so lazily create a blank blob for diffing purposes
    if (deleteHappened && !emptyFileOidPromise) {
      // eslint-disable-next-line no-await-in-loop
      emptyFileOidPromise = dispatch(createBlob(repo, ''))
    }

    // this can occur when there is no diff between master and client
    if (!diff) {
      if (fileId.theirs !== fileId.yours) {
        // sanity check; this should never occur
        throw new Error(`Files are different but no diff exists for them (${merge.path})`)
      }
      if (!blobContentsOrEmpty(fileId.theirs)) {
        // this is to catch edge cases that we have not yet encountered
        throw new Error(`No diff exists for merge conflict (${merge.path})`)
      }
    }

    // eslint-disable-next-line no-await-in-loop
    const merged = await dispatch(mergeBlobs(repo, mergeId, fileId, merge.path))

    const {hunk} = merged.merge
    const mergeContent = merged.merge.content
    const mergeLineTypes = decodeMergeHunks(hunk, lineCount(mergeContent))

    // make a blob of the merge since we can only diff trees or blobs
    // eslint-disable-next-line no-await-in-loop
    const {id} = await dispatch(createBlob(repo, mergeContent))
    // eslint-disable-next-line no-await-in-loop
    const mergeDiff = await dispatch(
      diffBlobs(repo, fileId.yours || (await emptyFileOidPromise).id, id)
    )
    const [mergeDiffViewA, initialViewB] = generateSplitDiff(
      blobContentsOrEmpty(fileId.yours), mergeContent, mergeDiff.lines
    )
    const mergeDiffViewB = applyMergeMarkers(initialViewB, mergeLineTypes)

    const hunkStarts = hunk.map(({original}) => original.start)

    mergePhases.push({
      repoId: repo.repoId,
      mergeId,

      merge,
      choice: deleteHappened ? MergeChoice.Mine : MergeChoice.Merge,
      // NOTE(pawel) this inline definition for mineYoursDiff when diff
      //  is undefined catches the case where a conflict exists for a file
      // that has no diff between master and client. These cases ought to
      // be optimized away by g8 internally but for now this keeps the UI
      // from breaking. The empty array passed when diff is undefined on
      // mineTheirsDiffView below is part of this
      mineYoursDiff: diff || {
        info: {
          path: merge.path,
          blobId: fileId.yours,
          status: IG8FileInfoStatus.RENAMED,
          dirty: false,
          previousPath: null,
          oldBlobId: null,
        },
        lines: null,
      },
      // --
      // blank edit buffer ==> this is filled on first click of edit
      editBuffer: '',
      madeEdits: false,
      choiceMade: false,
      // --
      fileIds: fileId,
      editBlobId: null,
      mergeBlobId: id,
      // --
      mineBuffer: blobContentsOrEmpty(fileId.yours),
      theirsBuffer: blobContentsOrEmpty(fileId.theirs),
      mergeBuffer: mergeContent,
      // --
      hunks: hunk,
      hunkStarts,
      currentScrollLine: hunkStarts[0],  // scroll to first hunk
      hasHunksForward: hunkStarts.length > 1,
      hasHunksBackward: false,
      currentHunk: 0,
      totalHunks: hunkStarts.length,
      // --
      mineTheirsDiffView: generateSplitDiff(blobContentsOrEmpty(fileId.yours),
        blobContentsOrEmpty(fileId.theirs), diff ? diff.lines : []),
      mineMineDiffView: generateSplitDiff(blobContentsOrEmpty(fileId.yours),
        blobContentsOrEmpty(fileId.yours), []),
      mineEditDiffView: generateSplitDiff('', '', []),
      mineMergeDiffView: [mergeDiffViewA, mergeDiffViewB],
      // -
      dependencyConflictDetails,
    })
  }))

  return {
    mergePhases,
    nonLogicalConflicts,
  }
}

// Wraps the supplied action in progress state updates START and DONE on the requested field.
const trackProgress = <P extends any[], R>(
  action: RepoAction<IRepo, P, R>, field: string
): typeof action => (
    (...args) => {
      const [repoOrRepoId] = args
      const repoId = typeof repoOrRepoId === 'string' ? repoOrRepoId : repoOrRepoId.repoId
      const dispatchable = action(...args)
      return (dispatch: Dispatch) => {
        dispatch(gitProgressAction(repoId, {[field]: 'START'}))
        return dispatch(dispatchable)
          .then((val) => {
            dispatch(gitProgressAction(repoId, {[field]: 'DONE'}))
            return val
          })
      }
    }
  )

const performMove = (
  source: ScopedFileLocation, target: ScopedFileLocation
): AsyncThunk => async (dispatch, getState) => {
  const sourceState = getRepoState(getState, source.repoId)
  const sourceRepo = sourceState?.repo
  const targetRepo = getRepoState(getState, target.repoId)?.repo
  if (!sourceRepo || !targetRepo) {
    const message = 'Missing repo state, cannot performMove'
    dispatch(errorAction(message))
    throw new Error(message)
  }
  const actionName = 'performMove'
  await dispatch(multiTabSyncBeginDualWrite(
    sourceRepo, targetRepo, actionName, syncRepoStateFromDisk
  ))

  try {
    if (source.repoId === target.repoId) {
      await dispatch(renameFile(sourceState?.repo, source.filePath, target.filePath))
      return
    }

    const moveError = validateFileMove(source.filePath, target.filePath)
    if (moveError) {
      dispatch(errorAction(moveError))
      throw new Error(moveError)
    }

    // If the source is a folder, we need to move all contained files.
    // If the source is a file, we need to move just that one file.
    const sourceFile = await fs.get(sourceRepo.repositoryName, source.filePath)
    if (!sourceFile) {
      const message = `File does not exist: ${source.filePath}`
      dispatch(errorAction(message))
      throw new Error(message)
    }
    if (isFileMode(sourceFile.mode)) {
      await fs.put(targetRepo.repositoryName, target.filePath, sourceFile.content)
      await fs.del(sourceRepo.repositoryName, source.filePath)
    } else {
      const sourceFolderPrefix = `${source.filePath}/`
      const targetFolderPrefix = `${target.filePath}/`

      // NOTE(christoph): Even though fs.put doesn't require that the enclosing folder
      // is present, we want to be able to drag an empty folder, so always start by creating it.
      await fs.mkdir(targetRepo.repositoryName, target.filePath)

      const allPaths = await fs.keys(sourceRepo.repositoryName)
      const pathsToMove = allPaths.filter(e => e.startsWith(sourceFolderPrefix))
      await Promise.all(pathsToMove.map(async (sourcePath) => {
        const targetPath = sourcePath.replace(sourceFolderPrefix, targetFolderPrefix)
        const file = await fs.get(sourceRepo.repositoryName, sourcePath)
        if (isFileMode(file.mode)) {
          await fs.put(targetRepo.repositoryName, targetPath, file.content)
        } else {
          await fs.mkdir(targetRepo.repositoryName, targetPath)
        }
      }))

      await fs.del(sourceRepo.repositoryName, source.filePath)
    }
    const [sourceUpdate, targetUpdate] = await Promise.all([
      produceGitState(FILE_UPDATE_GIT_STATE, sourceRepo),
      produceGitState(FILE_UPDATE_GIT_STATE, targetRepo),
    ])

    // NOTE(christoph): We dispatch both updates synchronously to reduce jank.
    dispatch(gitUpdateAction(sourceRepo.repoId, 'PERFORM_MOVE', sourceUpdate))
    dispatch(gitUpdateAction(targetRepo.repoId, 'PERFORM_MOVE', targetUpdate))
  } finally {
    await multiTabSyncEndDualWrite(sourceRepo, targetRepo, actionName)
  }
}

const saveMultiRepo = (
  repos: DeepReadonly<IRepo[]>,
  dependencyContext: DeepReadonly<IDependencyContext>,
  multiRepoContext: DeepReadonly<IMultiRepoContext>
): AsyncThunk => async (dispatch) => {
  const saveRepo = async (
    repo: IRepo,
    opts?: {forceSave?: boolean}
  ) => {
    dispatch(multiTabSyncBeginWrite(repo, 'saveMultiRepo', syncRepoStateFromDisk))
    try {
      await dispatch(saveClient(repo, {forceSave: !!opts?.forceSave}))
      dispatch(gitProgressAction(repo.repoId, {'save': 'DONE'}))
    } finally {
      await multiTabSyncEndWrite(repo, 'saveMultiRepo')
    }
  }

  const backendFnRepos: IRepo[] = []
  const otherRepos: IRepo[] = []

  if (dependencyContext && multiRepoContext) {
    repos.forEach((repo) => {
      const depId = multiRepoContext.repoIdToDependencyId[repo.repoId]
      const depPath = dependencyContext.dependencyIdToPath[depId]
      const dep = dependencyContext.dependenciesByPath[depPath]
      if (dep?.backendTemplates?.some(t => t.type === 'function')) {
        backendFnRepos.push(repo)
        return
      }
      otherRepos.push(repo)
    })
  } else {
    otherRepos.push(...repos)
  }

  repos.forEach(repo => dispatch(gitProgressAction(repo.repoId, {'save': 'START'})))
  await Promise.all(backendFnRepos.map(repo => saveRepo(repo)))
  await Promise.all(otherRepos.map((repo, idx) => saveRepo(repo, {forceSave: idx === 0})))
}

const synchronized = <FIRST_ARG extends IRepo, P extends any[], R>(
  func: RepoAction<FIRST_ARG, P, R>, name: string
) => (
    withSync<FIRST_ARG, P, R>(func, name, syncRepoStateFromDisk)
  )

const synchronizedWriteBlock = <FIRST_ARG extends IRepo, P extends any[], R>(
  func: RepoAction<FIRST_ARG, P, R>, name: string
) => (
    withWriteBlock<FIRST_ARG, P, R>(func, name, syncRepoStateFromDisk)
  )

const rawActions = {
  // Repo
  syncRepoStateFromDisk: withWriteBlockComplete(syncRepoStateFromDisk, 'syncRepoStateFromDisk'),
  syncRepo: synchronized(syncRepo, 'syncRepo'),
  // Blobs
  diffBlobs: synchronized(diffBlobs, 'diffBlobs'),
  mergeBlobs: synchronized(mergeBlobs, 'mergeBlobs'),
  getBlobs: synchronized(getBlobs, 'getBlobs'),
  createBlob: synchronized(createBlob, 'createBlob'),
  performDiff: synchronized(performDiff, 'performDiff'),
  prepareMergePhases: synchronized(prepareMergePhases, 'prepareMergePhases'),
  // Changesets
  newChangeset: synchronized(newChangeset, 'newChangeset'),
  updateChangeset: synchronized(updateChangeset, 'updateChangeset'),
  deleteChangeset: synchronized(deleteChangeset, 'deleteChangeset'),
  landFiles: synchronized(trackProgress(landFiles, 'land'), 'landFiles'),
  // Files
  mutateFile: synchronizedWriteBlock(mutateFile, 'mutateFile'),
  transformFile: synchronizedWriteBlock(transformFile, 'transformFile'),
  saveFiles: synchronizedWriteBlock(saveFiles, 'saveFiles'),
  createFolder: synchronizedWriteBlock(createFolder, 'createFolder'),
  renameFile: synchronizedWriteBlock(renameFile, 'renameFile'),
  deleteFile: synchronizedWriteBlock(deleteFile, 'deleteFile'),
  deleteFiles: synchronizedWriteBlock(deleteFiles, 'deleteFiles'),
  createFile: synchronizedWriteBlock(createFile, 'createFile'),
  revertFile: synchronized(revertFile, 'revertFile'),
  performMove: withRunQueue(performMove),
  listFiles: synchronized(listFiles, 'listFiles'),
  // Clients
  newClient: synchronized(trackProgress(newClient, 'client'), 'newClient'),
  newClientFromCommit: synchronized(
    trackProgress(newClientFromCommit, 'client'), 'newClientFromCommit'
  ),
  newClientFromExistingClient: synchronized(
    trackProgress(newClientFromExistingClient, 'patch'), 'patchClient'
  ),
  changeClient: synchronized(trackProgress(changeClient, 'client'), 'changeClient'),
  deleteClient: synchronized(trackProgress(deleteClient, 'client'), 'deleteClient'),
  saveClient: synchronized(trackProgress(saveClient, 'save'), 'saveClient'),
  revertClient: synchronized(trackProgress(revertClient, 'client'), 'revertClient'),
  trySyncClient: synchronized(trackProgress(trySyncClient, 'sync'), 'trySyncClient'),
  completeSyncClient: synchronized(trackProgress(completeSyncClient, 'sync'), 'completeSyncClient'),
  fetchRemoteClients: synchronized(fetchRemoteClients, 'fetchRemoteClients'),

  getDependencyDiff: synchronized(getDependencyDiff, 'getDependencyDiff'),
  inspectFiles: synchronized(inspectFiles, 'inspectFiles'),

  // Multi-client
  saveMultiRepo: withRunQueue(saveMultiRepo),

  // Misc
  clearGitErr: gitErrorClearAction,
}

type CoreGitActions = DispatchifiedActions<typeof rawActions>
const actions = dispatchify(rawActions)

export {
  DEFAULT_CLIENT,
  LOCAL_GIT_STATE,

  produceGitState,
  showErr,
  showGitErr,
  createFile,
  gitLoadProgress,
  combineGitState,
  syncRepoStateFromDisk,
  checkLocalRepoState,
  checkClients,

  actions as default,
  rawActions,
  CoreGitActions,
  CreateFileOptions,
}
