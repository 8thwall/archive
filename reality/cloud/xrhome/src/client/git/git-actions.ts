/**
 * When updating these functions, if the function uses g8 commands, wrap
 * the exported rawActions with withSync to make sure the changes in WASM
 * FS gets copied to IDB. See rawActions definition in this file.
 */

import type {Expanse} from '@ecs/shared/scene-graph'

import {dispatchify} from '../common/index'
import {rawActions as userSessionActions} from '../user/user-session-actions'
import authenticatedFetch from '../common/authenticated-fetch'
import fetchLog from '../common/fetch-log'
import {fs, g8} from '../worker/client'
import type {IDeployment, IRepo} from './g8-dto'

import {
  multiTabSyncBeginWrite, multiTabSyncEndWrite, RepoAction, withRunQueue, withSync,
} from './tab-synchronization'
import type {AsyncThunk, DispatchifiedActions, Thunk} from '../common/types/actions'
import {wrapDeprecatedActions} from '../common/wrapped-deprecated-actions'
import {
  combineGitState,
  gitLoadProgress,
  LOCAL_GIT_STATE,
  produceGitState,
  rawActions as rawCoreGitActions,
  showErr,
  showGitErr,
  syncRepoStateFromDisk,
  checkLocalRepoState, checkClients,
} from './core-git-actions'
import {isDependencyPath} from '../common/editor-files'
import {isValidDependency} from '../../shared/module/validate-module-dependency'
import {isFileMode} from '../common/file-mode'
import {rawActions as dependencyActions} from '../editor/dependency-actions'
import {rawActions as backendServicesActions} from '../editor/backend-services-actions'
import {
  gitClearAction, gitDeploymentAction, gitRepoAction, gitUpdateAction,
} from './direct-git-actions'
import type {IApp} from '../common/types/models'
import type {RootState} from '../reducer'
import {getRepoState} from './repo-state'
import {errorAction} from '../common/error-action'
import type {ModuleDependency} from '../../shared/module/module-dependency'
import type {SlotValues} from '../../shared/gateway/gateway-types'
import {publicApiFetch} from '../common/public-api-fetch'
import {EXPANSE_FILE_PATH} from '../studio/common/studio-files'
import {uploadHistory} from '../studio/actions/automerge-storage-actions'

declare global {
  interface Window {
    g8?: typeof g8
    fs?: typeof fs
  }
}

// For debugging
if (BuildIf.LOCAL_DEV) {
  // window.g8 can be used to make g8 calls
  // e.g. await g8.listClients({repositoryName: '8w.JsDev', handle: 'scott' }, null)
  if (typeof window !== 'undefined') {
    window.g8 = g8
    window.fs = fs
  }

  // window.fs in the main thread access IndexDB via a simple wrapper
  // window.fs in the worker thread access the Emscripten Filesytem
  // e.g.
  // fs.readdir('/repos')
  // new TextDecoder().decode(fs.readFile('/repos/8w.JsDev/.git/config'))
}

const repoIdForApp = (state: RootState, appUuid: string): string => (
  state.apps.find(a => a.uuid === appUuid).repoId
)

const produceAppRepo = (
  appUuid: string, ensureRemoteRepo: boolean, opts = {makePublic: false}
): AsyncThunk<{repo: IRepo}> => (
  (dispatch, getState) => dispatch(authenticatedFetch<IRepo & { app?: Partial<IApp>} >(
    `/v1/git/${appUuid}`, {
      method: ensureRemoteRepo ? 'PUT' : 'GET',
      body: JSON.stringify({
        ...(ensureRemoteRepo ? opts : {}),
        selectedAccountUuid: getState().accounts.selectedAccount,
      }),
    }
  )).then((repo) => {
    if (ensureRemoteRepo && repo.app) {
      dispatch({type: 'APPS_UPDATE', app: repo.app})
    } else if (repo.repoId) {
      dispatch({type: 'APPS_UPDATE', app: {uuid: appUuid, repoId: repo.repoId}})
    }
    if (repo.repositoryName) {
      dispatch(gitRepoAction(repo.repoId, repo))
    }
    return {repo}
  })
)

type NestedDeployment = {deployment: IDeployment}

type DeployResponse = {commitId: string}

const makeDeployRoute = (appUuid: string, stage: string) => `/v1/app-deployment/${appUuid}/${stage}`

const produceDeployments = (
  appUuid: string
): AsyncThunk<NestedDeployment> => async (dispatch) => {
  const [master, staging, production] = await Promise.all([
    dispatch(authenticatedFetch<DeployResponse>(makeDeployRoute(appUuid, 'master'))),
    dispatch(authenticatedFetch<DeployResponse>(makeDeployRoute(appUuid, 'staging'))),
    dispatch(authenticatedFetch<DeployResponse>(makeDeployRoute(appUuid, 'production'))),
  ])
  return {
    deployment: {
      master: master.commitId,
      staging: staging.commitId,
      production: production.commitId,
    },
  }
}

const populateDeployments = (appUuid: string, repoId: string): AsyncThunk => async (dispatch) => {
  const git = await dispatch(produceDeployments(appUuid))
  dispatch(gitUpdateAction(repoId, 'LOAD_DEPLOYMENTS', git))
}

const produceDeployBranch = (
  appUuid: string,
  branchName: string,
  commitId: string
): AsyncThunk<Partial<IDeployment>> => async (dispatch) => {
  await dispatch(authenticatedFetch(
    makeDeployRoute(appUuid, branchName),
    {method: 'POST', body: JSON.stringify({commitId})}
  ))
  return {[branchName]: commitId}
}

const produceUndeployBranch = (
  appUuid: string, branchName: string
): AsyncThunk<Partial<IDeployment>> => async (dispatch) => {
  await dispatch(authenticatedFetch(makeDeployRoute(appUuid, branchName), {method: 'DELETE'}))
  return {[branchName]: ''}
}

// Sets a write block unless useWriteBlock is set to false. The reason for this is because this
// function is called from initializeAppRepo and we want to prevent a nested write block situation.
// @TODO(pawel) this is a quick fix for release; replace this with a nested write block mechanism
const bootstrapAppRepo = (
  appUuid: string,
  {ensureLocalClone = false, nestedWriteBlockOperation = false} = {}
): AsyncThunk => async (dispatch) => {
  await dispatch(userSessionActions.refreshJwtIfExpired())

  let appRepoRes
  try {
    appRepoRes = await dispatch(produceAppRepo(appUuid, true))
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to produce repo in bootstrap for app:', appUuid, err)
    dispatch(errorAction('Couldn\'t produce repo'))
    return
  }

  const {repo, repo: {repoId}} = appRepoRes
  try {
    dispatch(gitLoadProgress(repoId, 'START'))

    if (!nestedWriteBlockOperation) {
      await dispatch(multiTabSyncBeginWrite(repo, 'bootstrapRepo', syncRepoStateFromDisk))
    }

    try {
      if (!await dispatch(checkLocalRepoState(repo, {ensureLocalClone}))) {
        return
      }
      await dispatch(checkClients(repo))

      dispatch(gitLoadProgress(repoId, 'LOADING_FILES'))
      const git = await produceGitState(LOCAL_GIT_STATE, repo)

      dispatch(gitUpdateAction(repoId, 'BOOTSTRAP_REPO', git))
      dispatch(gitLoadProgress(repoId, 'DONE'))
    } finally {
      if (!nestedWriteBlockOperation) {
        await multiTabSyncEndWrite(repo, 'bootstrapRepo')
      }
    }
  } catch (err) {
    dispatch(showGitErr(repoId, 'Couldn\'t bootstrap repo', err))
  }
}

const SIMULATOR_BUILD_TIMESTAMP = new Date('2023-12-04T19:44:30.946Z').valueOf()

const notifySimulatorBuildRequired = (
  appKey: string
): Thunk<void> => (dispatch) => {
  dispatch({type: 'EDITOR_SIMULATOR_BUILD_REQUIRED', key: appKey})
}

const ensureSimulatorReady = (repo: IRepo): Thunk<void> => (dispatch, getState) => {
  const activeClient = getState().git.byRepoId[repo.repoId]?.clients?.find(e => e.active)
  const app = getState().apps.find(a => a.repoId === repo.repoId)

  if (!activeClient || !app) {
    return
  }

  const lastSaveTime = new Date(activeClient.lastSaveTime).valueOf()

  if (lastSaveTime < SIMULATOR_BUILD_TIMESTAMP) {
    dispatch(notifySimulatorBuildRequired(app.appKey))
    dispatch(rawCoreGitActions.saveClient(repo, {forceSave: true}))
  }
}

const sanitizeSlotValues = (values: SlotValues) => {
  if (!values) {
    return undefined
  }
  return Object.entries(values).reduce<SlotValues>((acc, [slotId, value]) => {
    if (value.type !== 'secret') {
      acc[slotId] = value
    }
    return acc
  }, {})
}

const initializeAppRepo = (appUuid: string, {
  repoName = 'templates.blank-project',
  deployment = undefined,
}): AsyncThunk<void> => async (dispatch, getState): Promise<void> => {
  try {
    let cloneCommitId
    if (deployment) {
      const [shortName, appName] = repoName.split('.')
      const path = `/repos-public/${shortName}/${appName}/deployment/${deployment}`
      const res = await dispatch(publicApiFetch<{commitId: string}>(path, {method: 'GET'}))
      cloneCommitId = res.commitId
      if (!cloneCommitId) {
        throw new Error(`Could not get deployment ${deployment} for app ${appUuid}`)
      }
    }

    const {repo} = await dispatch(produceAppRepo(appUuid, true))
    if (!repo) {
      throw new Error(`Could not create repo for app ${appUuid}`)
    }
    const srcRepo = {
      repositoryName: repoName,
      // TODO(pawel) Pass real repoId into initializeAppRepo().
      repoId: repoName,
      handle: 'studio8',
    }
    const authorName = `${getState().user.given_name} ${getState().user.family_name}`
    await dispatch(userSessionActions.refreshJwtIfExpired())

    await dispatch(multiTabSyncBeginWrite(repo, 'initializeRepo', syncRepoStateFromDisk))
    try {
    // This initial check should find the repo empty.
      // TODO(pawel) Make a helper function that clones, checks for empty repo, then cleans up.
      await dispatch(bootstrapAppRepo(appUuid, {
        ensureLocalClone: true,
        nestedWriteBlockOperation: true,
      }))

      // TODO(pawel) This should be replaced by the helper function mentioned above.
      if (getRepoState(getState, repo).progress.load !== 'NEEDS_INIT') {
        const err = new Error('Cannot initialize an already initialized repo')
        dispatch(showErr(repo.repoId, 'Error initializing repo', err))
        throw err
      }

      dispatch(gitLoadProgress(repo.repoId, 'COPY_REPO'))
      await g8.prepareCopyRepo(repo, srcRepo, authorName, cloneCommitId)

      const allPaths = await fs.keys(repo.repositoryName)
      const dependencyFiles = await Promise.all(
        allPaths.filter(isDependencyPath)
          .map(async dependencyPath => fs.get(repo.repositoryName, dependencyPath))
      )

      let hasRequestedAwsAccount = false

      for (let i = 0; i < dependencyFiles.length; i++) {
        const file = dependencyFiles[i]
        if (isFileMode(file.mode)) {
          const dependencyData = JSON.parse(file.content)

          if (!isValidDependency(dependencyData)) {
            // eslint-disable-next-line no-console
            console.error('Invalid dependency during clone:', file.filePath, dependencyData)
            throw new Error('Unable to process module dependency')
          }

          // eslint-disable-next-line no-await-in-loop
          const newDependency = await dispatch(
            dependencyActions.fetchModuleImportDependency(dependencyData.moduleId, appUuid)
          )

          // Include config/target from original
          const finalDependency: ModuleDependency = {...dependencyData, ...newDependency}

          if (finalDependency.backendTemplates?.length && !hasRequestedAwsAccount) {
            // eslint-disable-next-line no-await-in-loop
            await dispatch(backendServicesActions.requestAccount(appUuid))
            hasRequestedAwsAccount = true
          }

          finalDependency.backendSlotValues = sanitizeSlotValues(finalDependency.backendSlotValues)

          const newContent = JSON.stringify(finalDependency, null, 2)

          // eslint-disable-next-line no-await-in-loop
          await fs.put(repo.repositoryName, file.filePath, newContent)
        }
      }

      if (allPaths.includes(EXPANSE_FILE_PATH)) {
        const file = await fs.get(repo.repositoryName, EXPANSE_FILE_PATH)
        const sceneData: Expanse = JSON.parse(file.content)
        delete sceneData.history
        delete sceneData.historyVersion
        const {createEmptySceneDoc} = await import('@ecs/shared/crdt')
        const newDoc = createEmptySceneDoc('')
        newDoc.update(() => sceneData)
        const history = newDoc.save()
        sceneData.historyVersion = await dispatch(uploadHistory(repo.repoId, history))
        await fs.put(repo.repositoryName, EXPANSE_FILE_PATH, JSON.stringify(sceneData, null, 2))
      }

      await g8.finalizeCopyRepo(repo, srcRepo)

      fetchLog('s', {
        action: 'COPY_REPO',
        appUuid,
        srcRepositoryName: srcRepo.repositoryName,
        userUuid: getState().user.uuid,
      })
      // TODO(pawel) This should be something more like "bootstrapReduxState".
      await dispatch(bootstrapAppRepo(appUuid, {
        nestedWriteBlockOperation: true,
        ensureLocalClone: true,
      }))
    } finally {
      await multiTabSyncEndWrite(repo, 'initializeRepo')
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Could not create repo for app:', appUuid, err)
    dispatch(errorAction('Error creating repo'))
    throw err
  }
}

// Updates deployment information in redux and returns boolean to determine if deployment was set.
const trySetDeploymentBranch = (appUuid: string, branchName: string, commitId: string):
AsyncThunk<boolean> => async (
  dispatch,
  getState
) => {
  const repoId = repoIdForApp(getState(), appUuid)
  try {
    const deployment = await dispatch(produceDeployBranch(
      appUuid,
      branchName,
      commitId
    ))
    dispatch(gitDeploymentAction(repoId, deployment))
    return true
  } catch (err) {
    dispatch(showErr(repoId, `Couldn't advance ${branchName} to ${commitId}`, err))
    return false
  }
}

// Redeploy branches: Make sure we have up to date versions of deployments for each branch, and
// then republish the current version.
const redeployBranches = (appUuid: string): AsyncThunk => async (dispatch) => {
  const {deployment: {master, staging, production}} = await dispatch(produceDeployments(appUuid))
  await Promise.all([
    master && dispatch(produceDeployBranch(appUuid, 'master', master)),
    staging && dispatch(produceDeployBranch(appUuid, 'staging', staging)),
    production && dispatch(produceDeployBranch(appUuid, 'production', production)),
  ])
}

const undeployBranch = (
  appUuid: string, branchName: string
): AsyncThunk => async (dispatch, getState) => {
  const repoId = repoIdForApp(getState(), appUuid)
  try {
    const deployment = await dispatch(produceUndeployBranch(appUuid, branchName))
    dispatch(gitDeploymentAction(repoId, deployment))
  } catch (err) {
    dispatch(showErr(repoId, `Couldn't undeploy ${branchName}`, err))
  }
}

// Syncs data about the cross-user state of the repo including recent commits and deployments,
// and potentially new clients created by this user. The expectation is that this updates our
// knowledge of available git state, but doesn't actually mutate any of the user's active state.
const syncRepoStateFromServer = (repo: IRepo, appUuid: string) => async (dispatch) => {
  try {
    await dispatch(userSessionActions.refreshJwtIfExpired())
    const git = await combineGitState(
      dispatch(produceDeployments(appUuid)),
      g8.syncMaster(repo)
        .then(() => produceGitState(LOCAL_GIT_STATE, repo))
    )

    return dispatch(gitUpdateAction(repo.repoId, 'SYNC_REPO_STATE_FROM_SERVER', git))
  } catch (err) {
    return dispatch(showErr(repo.repoId, 'Couldn\'t sync repo state from server', err))
  }
}

const revertToSave = ({repositoryName, repoId}: IRepo, appUuid: string) => dispatch => (
  fs.deleteRepo(repositoryName)
    .then(() => dispatch(gitClearAction(repoId)))
    .then(() => dispatch(populateDeployments(appUuid, repoId)))
    .then(() => dispatch(bootstrapAppRepo(appUuid, {
      ensureLocalClone: true,
      nestedWriteBlockOperation: true,
    })))
    .catch(err => dispatch(showErr(repoId, 'Couldn\'t revert to save', err)))
)

const synchronized = <FIRST_ARG extends IRepo, P extends any[], R>(
  func: RepoAction<FIRST_ARG, P, R>, name: string
) => (
    withSync<FIRST_ARG, P, R>(func, name, syncRepoStateFromDisk)
  )

const makeMessage = (key: string) => `Deprecated use of CoreGitActions.${key} through GitActions`

const rawActions = {
  bootstrapAppRepo: withRunQueue(bootstrapAppRepo),
  initializeAppRepo: withRunQueue(initializeAppRepo),
  syncRepoStateFromServer: synchronized(syncRepoStateFromServer, 'syncRepoStateFromServer'),
  redeployBranches,
  trySetDeploymentBranch,
  undeployBranch,
  populateDeployments,
  revertToSave: synchronized(revertToSave, 'revertToSave'),
  ensureSimulatorReady,
  notifySimulatorBuildRequired,

  // TODO(Tri): remove this spread
  ...wrapDeprecatedActions(rawCoreGitActions, makeMessage),
}

type GitActions = DispatchifiedActions<typeof rawActions>

const actions = dispatchify(rawActions)

export {
  rawActions as default,
  GitActions,
  actions,
}
