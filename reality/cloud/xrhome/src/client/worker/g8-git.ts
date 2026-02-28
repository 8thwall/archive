// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Scott Pollack (scott@8thwall.com)
//
// Wrapper for g8-git package
//

import localForage from 'localforage'

import {
  IG8DiffParams, IG8SyncParams, IRepo, MergeChoice, G8DiffResponse, IG8InspectParams,
  G8InspectResponse, G8GetBlobsResponse, IG8PatchParams,
} from '../git/g8-dto'
import {G8MergeAnalysis} from '../static/g8-git/g8-api.capnp'
import {delFullPath} from './fs'
import {start, end} from './perf'

const window = globalThis  // we are a Worker
if (!window._c8) {
  window._c8 = {}
}

// Set by configureWorker()
let root
let dbStoreName

const reposConsistencyToken = () => `8wIRE.reposConsistencyToken.${dbStoreName}.${root}`

const capnp = require('capnp-ts')

const Module = require('../static/g8-git/g8-git-asm')
const c8 = require('../static/g8-git/g8-api.capnp')

// Quick fns
const repoPath = ({repositoryName}) => `${root}/${repositoryName}`
const tempRepoPath = ({repositoryName}) => `${root}/tmp-${repositoryName}`

const getRepo = res => res.getRepo().replace(`${root}/`, '')
const capnpListToJSArray = (capnpList) => {
  if (!capnpList) {
    return []
  }
  return [...Array(capnpList.getLength()).keys()].map(i => capnpList.get(i))
}

interface WorkerConfiguration {
  dbStoreName: string
  fsRoot: string
}

let instance

// We only allow configuration to take place once
const configureWorker = async (workerConfiguration: WorkerConfiguration) => {
  if (instance) {
    throw new Error('Worker is already configured.')
  }

  if (!workerConfiguration.dbStoreName || !workerConfiguration.fsRoot) {
    throw new Error('ConfigureWorker is missing an expected parameter.')
  }

  // eslint-disable-next-line prefer-destructuring
  dbStoreName = workerConfiguration.dbStoreName
  root = workerConfiguration.fsRoot

  instance = await Module()

  try {
    instance.FS.mkdir(root)
  } catch (err) {
    // pass
  }

  const {IDBFS} = instance.FS.filesystems
  IDBFS.DB_STORE_NAME = dbStoreName
  instance.FS.mount(IDBFS, {}, root)

  window.fs = instance.FS  // DEBUG

  // eslint-disable-next-line no-use-before-define,@typescript-eslint/no-use-before-define
  await syncfs(true)  // Read back IDB to FS on initialization only.
}

const getConsistencyToken = async (): Promise<string> => (
  localForage.getItem(reposConsistencyToken())
)

const generateNewConsistencyToken = async (): Promise<string> => {
  const arr = new Uint8Array(8)
  window.crypto.getRandomValues(arr)
  const newToken = arr.toString()
  return localForage.setItem(reposConsistencyToken(), newToken)
}

const syncfsImpl = syncFromIdb => new Promise<void>((_resolve, _reject) => {
  start(`syncfsImpl ${syncFromIdb ? '[load from IDB]' : '[save to IDB]'}`)
  instance.FS.syncfs(syncFromIdb, (err) => {
    end(`syncfsImpl ${syncFromIdb ? '[load from IDB]' : '[save to IDB]'}`)
    if (err) {
      _reject(err)
    } else {
      _resolve()
    }
  })
})

let consistencyToken = 'notinitialized'

const syncfs = async (syncFromIdb: boolean) => {
  if (syncFromIdb) {
    const tok = await getConsistencyToken()
    if (tok === consistencyToken) {
      return
    }
    consistencyToken = tok
    await syncfsImpl(syncFromIdb)
  } else {
    await syncfsImpl(syncFromIdb)
    consistencyToken = await generateNewConsistencyToken()
  }
}

/**
 * @param {*} message the actual capnp message to send
 * @param {*} retType choose from the c8.G8*Response types.
 *                    This will choose which g8 command to invoke.
 */
const transport = async (message, retType) => {
  if (!message) {
    throw new Error('g8Transport requires a message to be sent.')
  }
  if (!retType) {
    throw new Error('g8Transport requires defined return type.')
  }

  const buf = message.toArrayBuffer()
  const ptr = instance._malloc(buf.byteLength)
  instance.writeArrayToMemory(new Uint8Array(buf), ptr)
  const c8fn = {
    [c8.G8RepositoryResponse]: '_c8EmAsm_g8Repository',
    [c8.G8ClientResponse]: '_c8EmAsm_g8Client',
    [c8.G8ChangesetResponse]: '_c8EmAsm_g8Changeset',
    [c8.G8FileResponse]: '_c8EmAsm_g8File',
    [c8.G8DiffBlobsResponse]: '_c8EmAsm_g8DiffBlobs',
    [c8.G8CreateBlobResponse]: '_c8EmAsm_g8CreateBlob',
    [c8.G8BlobResponse]: '_c8EmAsm_g8GetBlob',
    [c8.G8MergeFileResponse]: '_c8EmAsm_g8MergeFile',
    [c8.G8DiffResponse]: '_c8EmAsm_g8Diff',
    [c8.G8InspectResponse]: '_c8EmAsm_g8Inspect',
  }[retType]

  if (!c8fn) {
    throw new Error(`Unsupported transport request: ${retType}`)
  }

  instance[c8fn](ptr, buf.byteLength)
  instance._free(ptr)

  const {g8Response, g8ResponseSize} = window._c8
  if (!g8Response || !g8ResponseSize) {
    throw new Error(`Unknown g8 Error: ${JSON.stringify(window._c8)}`)
  }
  const byteBuffer = instance.HEAPU8.subarray(g8Response, g8Response + g8ResponseSize)
  const response = new capnp.Message(byteBuffer, false).getRoot(retType)

  if (response.getStatus().getCode()) {
    throw new Error(response.getStatus().getMessage())
  }

  return response
}

const checkRepo = (repo: IRepo) => {
  if (!repo || !repo.repositoryName || !repo.handle) {
    throw new Error('Repository name and handle must be supplied.')
  }
}

// //////////////////////// EXPORTS //////////////////////////

const info = async () => ({
  dbName: root,
  fs: instance.FS,
  storeName: instance.FS.filesystems.IDBFS.DB_STORE_NAME,
  version: instance.FS.filesystems.IDBFS.DB_VERSION,
})

interface CloneOptions {
  tmpDir: boolean
  authorName?: string
  cloneCommitId?: string
}

const clone = async (repo: IRepo, options: CloneOptions = {tmpDir: false}) => {
  checkRepo(repo)

  const message = new capnp.Message()
  const req = message.initRoot(c8.G8RepositoryRequest)
  req.setRepo(options.tmpDir ? tempRepoPath(repo) : repoPath(repo))

  const baseUrl = Build8.PLATFORM_TARGET === 'desktop'
    // NOTE(cindyhu): we need a fake https server redirect for electron because libgit2 does not
    // support custom protocols, see reality/cloud/studiohub/app/desktop-app/protocol.ts
    ? 'https://desktop-server'
    : window.location.origin

  const url = new URL(`/v1/repos/${repo.repoId}.git`, baseUrl).toString()

  req.setUrl(url)
  req.setUser(repo.handle)
  if (options.authorName) {
    req.setAuthorName(options.authorName)
  }

  if (options.cloneCommitId) {
    req.setCloneCheckoutId(options.cloneCommitId)
  }

  try {
    const res = await transport(message, c8.G8RepositoryResponse)
    return {
      repo: getRepo(res),
    }
  } catch (err) {
    throw new Error(`Error when cloning repository "${repo.repoId}" (${err})`)
  }
}

// Expectations:
// - Both src and dst repos exist on codecommit
const prepareCopyRepo = async (
  dstRepo: IRepo, srcRepo: IRepo, authorName: string, cloneCommitId?: string
) => {
  const srcDir = tempRepoPath(srcRepo)
  const dstDir = repoPath(dstRepo)

  delFullPath({fs: instance.FS}, srcDir)
  delFullPath({fs: instance.FS}, dstDir)

  await clone(srcRepo, {tmpDir: true, cloneCommitId})
  await clone(dstRepo, {tmpDir: false, authorName})

  // Dedicated user for cloning?
  //

  const getFilesToCopy = (src, dst, subdir = '') => (
    instance.FS.readdir(`${src}${subdir}`).filter(path => ![
      '.',
      '..',
      '.git',
    ].includes(path)).map(name => ({
      name,
      src: `${src}${subdir}/${name}`,
      dst: `${dst}${subdir}/${name}`,
    })).map(file => ({
      ...file,
      contents: instance.FS.isDir(instance.FS.stat(file.src).mode) &&
        getFilesToCopy(src, dst, `${subdir}/${file.name}`),
    }))
  )

  const doCopy = files => files.forEach((file) => {
    if (file.contents) {
      instance.FS.mkdir(file.dst)
      doCopy(file.contents)
    } else {
      instance.FS.writeFile(file.dst, instance.FS.readFile(file.src))
    }
  })

  doCopy(getFilesToCopy(srcDir, dstDir))
  delFullPath({fs: instance.FS}, srcDir)
}

const finalizeCopyRepo = async (dstRepo: IRepo, srcRepo: IRepo) => {
  const message = new capnp.Message()
  const req = message.initRoot(c8.G8RepositoryRequest)
  req.setRepo(repoPath(dstRepo))
  req.setMessage(`Initialize project from ${srcRepo.repositoryName}`)
  req.setAction(c8.G8RepositoryRequest.Action.INITIAL_COMMIT)
  try {
    const res = await transport(message, c8.G8RepositoryResponse)
    return {
      repo: getRepo(res),
    }
  } catch (err) {
    throw new Error(`Error while forking repository ${srcRepo.repositoryName} (${err})`)
  }
}

const copyRepo = async (
  dstRepo: IRepo, srcRepo: IRepo, authorName: string, cloneCommitId?: string
) => {
  await prepareCopyRepo(dstRepo, srcRepo, authorName, cloneCommitId)
  await finalizeCopyRepo(dstRepo, srcRepo)
}

const initialCommit = async (repo: IRepo, authorName, commitMessage: string) => {
  checkRepo(repo)

  const message = new capnp.Message()
  const req = message.initRoot(c8.G8RepositoryRequest)
  req.setMessage(commitMessage)
  req.setRepo(repoPath(repo))
  req.setAction(c8.G8RepositoryRequest.Action.INITIAL_COMMIT)
  try {
    const res = await transport(message, c8.G8RepositoryResponse)
    return {
      repo: getRepo(res),
    }
  } catch (err) {
    throw new Error(`Error making initial commit for ${repo.repositoryName}`)
  }
}

const syncMaster = async (repo: IRepo) => {
  checkRepo(repo)

  const message = new capnp.Message()
  const req = message.initRoot(c8.G8RepositoryRequest)
  req.setRepo(repoPath(repo))
  req.setAction(c8.G8RepositoryRequest.Action.SYNC_MASTER)
  req.setUser(repo.handle)

  const res = await transport(message, c8.G8RepositoryResponse)
  return {
    repo: getRepo(res),
  }
}

const getLogs = async (repo: IRepo, depth) => {
  // console.log(`Getting logs for repo ${repoPath(repo)} for depth=${depth}`)

  const message = new capnp.Message()
  const req = message.initRoot(c8.G8RepositoryRequest)

  req.setRepo(repoPath(repo))
  req.setLogDepth(depth || 20)
  req.setAction(c8.G8RepositoryRequest.Action.GET_COMMIT_LOG)

  const res = await transport(message, c8.G8RepositoryResponse)
  return capnpListToJSArray(res.getCommitLog()).map(log => ({
    id: log.getId(),
    signature: {
      name: log.getSignature().getName(),
      email: log.getSignature().getEmail(),
      when: new Date(log.getSignature().getWhen().toNumber() * 1000),
    },
    summary: log.getSummary(),
    description: log.getDescription(),
  }))
}

interface IClientParams {
  clientName?: string
  creds?: {
    user: string
    pass: string
  }
  syncParams?: IG8SyncParams
  patchParams?: IG8PatchParams
  forceSave?: boolean
  skipPushAfterSync?: boolean
}

const client = action => async (
  repo: IRepo,
  {clientName, creds, syncParams, patchParams, forceSave, skipPushAfterSync}: IClientParams = {}
) => {
  checkRepo(repo)

  const message = new capnp.Message()
  const req = message.initRoot(c8.G8ClientRequest)
  req.setRepo(repoPath(repo))
  req.setAction(action)
  if (clientName) {
    req.initClient(1)
    req.getClient().set(0, clientName)
  }
  req.setUser(repo.handle)

  if (creds) {
    const auth = req.getAuth()
    auth.setUser(creds.user)
    auth.setPass(creds.pass)
  }

  if (forceSave) {
    req.setForceSave(forceSave)
  }

  // NOTE(pawel) If skipping push after save, be sure to follow up with force save client.
  if (skipPushAfterSync) {
    req.setSkipPushAfterSync(skipPushAfterSync)
  }

  if (patchParams) {
    const {ref} = patchParams
    req.getPatchParams().setRef(ref)
  }

  if (syncParams) {
    const {inspectRegex, inspectComplete, syncCommitId} = syncParams
    if (syncCommitId) {
      req.getSyncParams().setSyncCommitId(syncCommitId)
    }
    if (inspectRegex) {
      req.getSyncParams().setInspectRegex(inspectRegex)
    }
    req.getSyncParams().setInspectComplete(!!inspectComplete)

    // TODO(pawel) Added support for additionalChanges.

    if (syncParams.mergeDecisions) {
      const decisions = req.getSyncParams().initDecision(syncParams.mergeDecisions.length)
      syncParams.mergeDecisions.forEach((mergeDecision, i) => {
        const decision = decisions.get(i)
        if (mergeDecision.choice === MergeChoice.Mine) {
          decision.setChoice(c8.G8MergeDecision.Choice.YOUR_CHANGE)
        } else if (mergeDecision.choice === MergeChoice.Theirs) {
          decision.setChoice(c8.G8MergeDecision.Choice.THEIR_CHANGE)
        } else if (mergeDecision.choice === MergeChoice.Merge) {
          if (mergeDecision.mergeBlobId) {
            decision.setChoice(c8.G8MergeDecision.Choice.MANUAL_MERGE)
            decision.setBlobId(mergeDecision.mergeBlobId)
          } else {
            decision.setChoice(c8.G8MergeDecision.Choice.AUTO_MERGE)
          }
        } else {
          throw new Error(
            `[g8-git] You didn't choose one of the MergeChoice. You chose ${mergeDecision.choice}`
          )
        }
        decision.getFileId().setOriginal(mergeDecision.fileId.original)
        decision.getFileId().setTheirs(mergeDecision.fileId.theirs)
        decision.getFileId().setYours(mergeDecision.fileId.yours)
      })
    }
  }

  const res = await transport(message, c8.G8ClientResponse)

  const mergeId = res.getMerge().getMergeId()
  return {
    needsAction: res.getMerge().getStatus() === G8MergeAnalysis.MergeStatus.NEEDS_ACTION,
    clients: capnpListToJSArray(res.getClient()).map(client => ({
      name: client.getName(),
      active: client.getActive(),
      forkId: client.getForkId(),
      lastSaveTime: new Date(client.getLastSaveTimeSeconds().toNumber() * 1000),
    })),
    merges: capnpListToJSArray(res.getMerge().getInfo()).map(mergeAnalysis => ({
      status: mergeAnalysis.getStatus(),
      path: mergeAnalysis.getPath(),
      previousPath: mergeAnalysis.getPreviousPath(),
      fileId: {
        original: mergeAnalysis.getFileId().getOriginal(),
        theirs: mergeAnalysis.getFileId().getTheirs(),
        yours: mergeAnalysis.getFileId().getYours(),
      },
      choice: mergeAnalysis.getChoice(),
      mergeBlobId: mergeAnalysis.getMergeBlobId(),
    })),
    mergeId: {
      original: mergeId.getOriginal(),
      theirs: mergeId.getTheirs(),
      yours: mergeId.getYours(),
    },
    inspectResult: capnpListToJSArray(res.getMerge().getInspect()).map(inspect => ({
      path: inspect.getPath(),
      nextBlobId: inspect.getNextBlobId(),
      previousBlobId: inspect.getPreviousBlobId(),
      source: inspect.getSource(),
      status: inspect.getStatus(),
    })),
  }
}

const fetchRemoteClients = async (repo: IRepo) => {
  checkRepo(repo)

  const message = new capnp.Message()
  const req = message.initRoot(c8.G8ClientRequest)
  req.setRepo(repoPath(repo))
  req.setAction(c8.G8ClientRequest.Action.LIST)
  req.setUser(repo.handle)
  req.setIncludeRemote(true)

  const res = await transport(message, c8.G8ClientResponse)
  return capnpListToJSArray(res.getRemoteClient()).map(remote => ({
    name: remote.getName(),
    active: false,
    forkId: remote.getForkId(),
    lastSaveTime: new Date(remote.getLastSaveTimeSeconds().toNumber() * 1000),
  }))
}

const toFileInfos = fileInfoLists => capnpListToJSArray(fileInfoLists).map(fileInfo => ({
  status: fileInfo.getStatus(),
  path: fileInfo.getPath(),
  previousPath: fileInfo.getPreviousPath(),
  dirty: fileInfo.getDirty(),
}))

interface IChangesetParams {
  description?: string
  creds?: {
    user: string
    pass: string
  }
  selectedFiles?: Record<string, boolean>
}

/** Changeset actions are done on the current client only
  @note CREATE requires that id list is empty
*/
const changeset = action => async (
  repo: IRepo,
  {description, creds, selectedFiles}: IChangesetParams = {},
  changesetId: string = null
) => {
  checkRepo(repo)

  const message = new capnp.Message()
  const req = message.initRoot(c8.G8ChangesetRequest)
  req.setRepo(repoPath(repo))
  // HEAD points to the active client
  req.setClient('HEAD')
  req.setAction(action)
  req.setIncludeCommitId(true)
  req.setIncludeSummary(true)
  req.setIncludeDescription(true)
  req.setIncludeFileInfo(true)
  req.setIncludeRemoteBranch(true)
  req.setIncludeWorkingChanges(true)

  if (description) {
    req.setDescription(description)
  }

  if (selectedFiles && Object.keys(selectedFiles).length) {
    // selectedFiles is like: {
    //   'path1': true,
    //   'path2': false,
    //   'path3': true,
    // }
    // and we want fileList = ['path1', 'path3']
    const fileList = Object.keys(selectedFiles).filter(k => selectedFiles[k])
    req.initFileUpdate(fileList.length)
    for (let i = 0; i < fileList.length; i++) {
      req.getFileUpdate().set(i, fileList[i])
    }
    req.setFileUpdateAction(c8.G8ChangesetRequest.FileUpdateAction.REPLACE)
  }

  if (changesetId) {
    req.initId(1)
    req.getId().set(0, changesetId)
  }

  // req.setFileUpdateaction(c8.G8ChangesetRequest.FileUpdateAction.REPLACE)
  if (creds) {
    const auth = req.getAuth()
    auth.setUser(creds.user)
    auth.setPass(creds.pass)
  }
  // console.log(message.dump())
  const res = await transport(message, c8.G8ChangesetResponse)
  return capnpListToJSArray(res.getChangeset()).map(changeset => ({
    id: changeset.getId(),
    summary: changeset.getSummary(),
    description: changeset.getDescription(),
    files: toFileInfos(changeset.getFileList().getInfo()),
    updated: changeset.getUpdated(),
    remoteBranch: changeset.getRemoteBranch(),
    commitId: changeset.getCommitId(),
  }))
}

const diffBlobs = async ({repositoryName, baseId, newId}) => {
  const message = new capnp.Message()
  const req = message.initRoot(c8.G8DiffBlobsRequest)
  req.setRepo(repoPath({repositoryName}))
  req.setBaseId(baseId)
  req.setNewId(newId)

  const res = await transport(message, c8.G8DiffBlobsResponse)

  return {
    repo: res.getRepo(),
    lines: capnpListToJSArray(res.getLine()).map(line => ({
      origin: line.getOrigin(),
      content: line.getContent(),
      baseLineNumber: line.getBaseLineNumber(),
      newLineNumber: line.getNewLineNumber(),
    })),
  }
}

const getBlobs = async ({repositoryName}: IRepo, ids: string[]): Promise<G8GetBlobsResponse> => {
  const message = new capnp.Message()
  const req = message.initRoot(c8.G8BlobRequest)
  req.setRepo(repoPath({repositoryName}))
  const filteredIds = ids.filter(id => !!id)
  req.initIds(filteredIds.length)
  filteredIds.forEach((id, idx) => req.getIds().set(idx, id))
  const res = await transport(message, c8.G8BlobResponse)

  return {
    data: capnpListToJSArray(res.getBlobData()),
  }
}

const setId = (idTriplet, value) => {
  if (value.theirs) {
    idTriplet.setTheirs(value.theirs)
  }
  if (value.yours) {
    idTriplet.setYours(value.yours)
  }
  if (value.original) {
    idTriplet.setOriginal(value.original)
  }
}

const decodeHunk = hunk => ({
  start: hunk.getStart(),
  size: hunk.getSize(),
})

const mergeBlobs = async ({repositoryName}: IRepo, mergeId, fileId, path) => {
  const message = new capnp.Message()
  const mergeReq = message.initRoot(c8.G8MergeFileRequest)
  mergeReq.setRepo(repoPath({repositoryName}))
  setId(mergeReq.getMergeId(), mergeId)
  setId(mergeReq.getFileId(), fileId)
  mergeReq.setPath(path)

  const res = await transport(message, c8.G8MergeFileResponse)

  return {
    repo: res.getRepo(),
    merge: {
      // hunk: res.getMerge().getHunk(),
      hunk: capnpListToJSArray(res.getMerge().getHunk()).map(hunk => ({
        original: decodeHunk(hunk.getOriginal()),
        theirs: decodeHunk(hunk.getTheirs()),
        yours: decodeHunk(hunk.getYours()),
      })),
      content: res.getMerge().getContent(),
    },
  }
}

const createBlob = async ({repositoryName}: IRepo, data) => {
  const message = new capnp.Message()
  const req = message.initRoot(c8.G8CreateBlobRequest)
  req.setRepo(repoPath({repositoryName}))

  const dataBytes: Uint8Array = new TextEncoder().encode(data)
  req.initData(dataBytes.length)
  req.getData().copyBuffer(dataBytes)

  const res = await transport(message, c8.G8CreateBlobResponse)

  return {
    repo: res.getRepo(),
    id: res.getId(),
  }
}

type RevertArgs = {
  pathsToRevert?: string[]
  pathsToPreserve?: string[]
}

const revert = async (
  {repositoryName}: IRepo, {pathsToRevert: paths, pathsToPreserve}: RevertArgs
) => {
  const message = new capnp.Message()
  const req = message.initRoot(c8.G8FileRequest)

  req.setRepo(repoPath({repositoryName}))
  req.setClient('HEAD')

  if (paths && paths.length) {
    req.initPaths(paths.length)
    for (let i = 0; i < paths.length; i++) {
      req.getPaths().set(i, paths[i])
    }
  }

  if (pathsToPreserve) {
    req.initPathsToPreserve(pathsToPreserve.length)
    for (let i = 0; i < pathsToPreserve.length; i++) {
      req.getPathsToPreserve().set(i, pathsToPreserve[i])
    }
  }

  req.setAction(c8.G8FileRequest.Action.REVERT)
  req.setDryRun(false)
  await transport(message, c8.G8FileResponse)
}

// The only time we look for renames is when we show diff information to the user.
// internally we handle renames as standard add/delete.
// The reason MergeModal needs to not look for renames
// is to properly be able to compute diffs in merges, which we treat only as add/delete
const diff = async (diffParams: IG8DiffParams): Promise<G8DiffResponse> => {
  const {repositoryName, basePoint, changePoint, findRenames} = diffParams
  const message = new capnp.Message()
  const req = message.initRoot(c8.G8DiffRequest)

  req.setRepo(repoPath({repositoryName}))
  req.setBasePoint(basePoint || 'FORK')
  req.setChangePoint(changePoint || 'HEAD')
  req.setFindRenamesAndCopies(findRenames || false)

  const res = await transport(message, c8.G8DiffResponse)

  return {
    diffList: capnpListToJSArray(res.getDiffList()).map(diffEntry => ({
      info: {
        status: diffEntry.getInfo().getStatus(),
        path: diffEntry.getInfo().getPath(),
        previousPath: diffEntry.getInfo().getPreviousPath(),
        blobId: diffEntry.getInfo().getBlobId(),
        oldBlobId: diffEntry.getInfo().getOldBlobId(),
        dirty: diffEntry.getInfo().getDirty(),
      },
      lines: capnpListToJSArray(diffEntry.getLines()).map(line => ({
        origin: line.getOrigin(),
        content: line.getContent(),
        baseLineNumber: line.getBaseLineNumber(),
        newLineNumber: line.getNewLineNumber(),
      })),
    })),
  }
}

// Inspect files anywhere in the repository.
// Right now you can pass an inspectPoint (like a client name, commit, or special names like FORK)
// Pass in an inspectRegex for the files that you are interested in.
// Currently this returns a list of files that match the regex and their blobIds.
// This lets you learn what files of interest existed in a particular point in time and their
// contents.
const inspect = async (inspectParams: IG8InspectParams): Promise<G8InspectResponse> => {
  const {repositoryName, inspectPoint, inspectRegex} = inspectParams
  const message = new capnp.Message()
  const req = message.initRoot(c8.G8InspectRequest)

  req.setRepo(repoPath({repositoryName}))
  req.setInspectPoint(inspectPoint)
  req.setInspectRegex(inspectRegex)

  const res = await transport(message, c8.G8InspectResponse)

  return {
    info: capnpListToJSArray(res.getInfo()).map(infoEntry => ({
      path: infoEntry.getPath(),
      blobId: infoEntry.getBlobId(),
    })),
  }
}

// NOTE(dat): Make sure you call syncFsToIdb if you call a g8 command that modify the FS
//            See git-actions for general usage. Delay the call until you are finish
//            with your g8 call chains

const g8api = {
  info,
  clone,
  getLogs,
  syncMaster,
  copyRepo,
  initialCommit,
  prepareCopyRepo,
  finalizeCopyRepo,

  listClients: client(c8.G8ClientRequest.Action.LIST),
  saveClient: client(c8.G8ClientRequest.Action.SAVE),
  newClient: client(c8.G8ClientRequest.Action.CREATE),
  changeClient: client(c8.G8ClientRequest.Action.SWITCH),
  deleteClient: client(c8.G8ClientRequest.Action.DELETE),
  syncClient: client(c8.G8ClientRequest.Action.SYNC),
  drySyncClient: client(c8.G8ClientRequest.Action.DRY_SYNC),
  fetchRemoteClients,
  patchClient: client(c8.G8ClientRequest.Action.PATCH),

  listChangesets: changeset(c8.G8ChangesetRequest.Action.LIST),
  newChangeset: changeset(c8.G8ChangesetRequest.Action.CREATE),
  updateChangeset: changeset(c8.G8ChangesetRequest.Action.UPDATE),
  deleteChangeset: changeset(c8.G8ChangesetRequest.Action.DELETE),

  createBlob,
  diffBlobs,
  getBlobs,
  mergeBlobs,
  inspect,

  revert,
  diff,

  printG8Stats: () => Promise.resolve(instance && instance._c8EmAsm_printG8Stats()),

  syncIdbToFs: () => syncfs(true),
  syncFsToIdb: () => syncfs(false),

  configureWorker,
} as const

type G8Api = typeof g8api
type G8Functions = keyof G8Api

// @ts-ignore
postMessage({id: 'g8_loaded', error: false, response: 'g8-git loaded'})

export type {G8Api, G8Functions}

export {
  g8api as default,
}
