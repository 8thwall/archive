import authenticatedFetch from '../common/authenticated-fetch'

import {rawActions as userSessionActions} from '../user/user-session-actions'
import {
  multiTabSyncBeginWrite, multiTabSyncEndWrite, RepoAction, withRunQueue, withSync,
} from './tab-synchronization'
import {g8, fs} from '../worker/client'
import {
  LOCAL_GIT_STATE,
  produceGitState,
  showGitErr,
  syncRepoStateFromDisk,
  gitLoadProgress, checkLocalRepoState, checkClients,
} from './core-git-actions'
import type {AsyncThunk, DispatchifiedActions} from '../common/types/actions'
import {dispatchify} from '../common'
import type {IRepo} from './g8-dto'
import {gitClearAction, gitRepoAction, gitUpdateAction} from './direct-git-actions'
import {getRepoState} from './repo-state'
import {MANIFEST_FILE_PATH} from '../common/editor-files'

const INITIAL_MODULE_FILES = {
  'module.js': `// module.js is the main entry point for your 8th Wall module.
// Code here will execute before the project is loaded.

import {subscribe} from 'config'  // config is how you access your module options

subscribe((config) => {
  console.log('My Module Printed This!', config)
})

export {
  // export properties here
}
`,
  'manifest.json': JSON.stringify({
    version: 1,
    config: {
      fields: {},
      groups: {},
    },
  }, null, 2),
}

const produceModuleRepo = (repoId: string) => async (dispatch) => {
  const repo = await dispatch(authenticatedFetch(`/v1/git/${repoId}`))
  dispatch(gitRepoAction(repo.repoId, repo))
  return repo
}

const bootstrapModuleRepo = (
  repoId: string,
  nestedWriteBlockOperation = false
): AsyncThunk => async (dispatch) => {
  await dispatch(userSessionActions.refreshJwtIfExpired())
  dispatch(gitLoadProgress(repoId, 'START'))
  try {
    const repo = await dispatch(produceModuleRepo(repoId))
    if (!nestedWriteBlockOperation) {
      await dispatch(multiTabSyncBeginWrite(repo, 'bootstrapModuleRepo', syncRepoStateFromDisk))
    }
    try {
      if (!await dispatch(checkLocalRepoState(repo, {ensureLocalClone: true}))) {
        return
      }

      await dispatch(checkClients(repo))

      dispatch(gitLoadProgress(repoId, 'LOADING_FILES'))
      const git = await produceGitState(LOCAL_GIT_STATE, repo)

      dispatch(gitUpdateAction(repoId, 'BOOTSTRAP_REPO', git))
      dispatch(gitLoadProgress(repoId, 'DONE'))
    } finally {
      if (!nestedWriteBlockOperation) {
        await multiTabSyncEndWrite(repo, 'bootstrapModuleRepo')
      }
    }
  } catch (err) {
    dispatch(showGitErr(repoId, 'Could not bootstrap module repo', err))
  }
}

/*
 * @param repoId
 */
const initializeModuleRepo = (
  repoId: string,
  files: Record<string, string> = INITIAL_MODULE_FILES
) => async (dispatch, getState) => {
  if (getRepoState(getState, repoId).progress.load !== 'NEEDS_INIT') {
    return
  }

  dispatch(gitLoadProgress(repoId, 'INIT_REPO'))
  const repo = await dispatch(produceModuleRepo(repoId))

  const authorName = `${getState().user.given_name} ${getState().user.family_name}`
  await dispatch(userSessionActions.refreshJwtIfExpired())

  await dispatch(multiTabSyncBeginWrite(repo, 'initializeModuleRepo', syncRepoStateFromDisk))
  let initialized = false
  try {
    await fs.initRepo(repo.repositoryName)
    await g8.clone(repo)

    await Promise.all(Object.entries(files).map(([fileName, content]) => (
      fs.put(repo.repositoryName, fileName, content)
    )))

    // Now make initial commit.
    await g8.initialCommit(repo, authorName, 'Initialize Module')
    initialized = true
  } finally {
    await multiTabSyncEndWrite(repo, 'initializeModuleRepo')
  }

  if (initialized) {
    await dispatch(bootstrapModuleRepo(repoId))
  }
}

/*
 * @param newRepoId: repo name of the destination repo (not uuid)
 * @param srcRepoId: repo name of the source repo (not uuid)
 */
const duplicateModuleRepo = (
  newRepoId: string,
  srcRepoId: string,
  commitId?: string
) => async (dispatch, getState) => {
  if (getRepoState(getState, newRepoId).progress.load !== 'NEEDS_INIT') {
    return
  }
  dispatch(gitLoadProgress(newRepoId, 'INIT_REPO'))
  const newRepo = await dispatch(produceModuleRepo(newRepoId))

  const authorName = `${getState().user.given_name} ${getState().user.family_name}`
  await dispatch(userSessionActions.refreshJwtIfExpired())

  await dispatch(multiTabSyncBeginWrite(newRepo, 'initializeModuleRepo', syncRepoStateFromDisk))
  let initialized = false
  try {
    await fs.initRepo(newRepo.repositoryName)
    // Copy the srcRepo
    const srcRepo = {repositoryName: srcRepoId, repoId: srcRepoId, handle: 'studio8'}
    await g8.copyRepo(newRepo, srcRepo, authorName, commitId)
    initialized = true
  } finally {
    await multiTabSyncEndWrite(newRepo, 'initializeModuleRepo')
  }

  if (initialized) {
    await dispatch(bootstrapModuleRepo(newRepoId))
  }
}

interface ForkModuleArgs {
  newRepoId: string
  srcRepoId: string
  srcCommitId: string
  srcModuleId: string
}

const forkModuleRepo = ({
  newRepoId, srcRepoId, srcCommitId, srcModuleId,
}: ForkModuleArgs): AsyncThunk => async (dispatch, getState) => {
  if (getRepoState(getState, newRepoId).progress.load !== 'NEEDS_INIT') {
    return
  }
  dispatch(gitLoadProgress(newRepoId, 'INIT_REPO'))
  const newRepo = await dispatch(produceModuleRepo(newRepoId))
  const authorName = `${getState().user.given_name} ${getState().user.family_name}`
  await dispatch(userSessionActions.refreshJwtIfExpired())
  await dispatch(multiTabSyncBeginWrite(newRepo, 'forkModuleRepo', syncRepoStateFromDisk))
  let initialized = false
  try {
    await fs.initRepo(newRepo.repoId)
    const srcRepo = {repositoryName: srcRepoId, repoId: srcRepoId, handle: 'studio8'}
    await g8.prepareCopyRepo(newRepo, srcRepo, authorName, srcCommitId)
    const forkedManifest = JSON.stringify({
      ...JSON.parse((await fs.get(newRepoId, MANIFEST_FILE_PATH)).content),
      forkInfo: {
        srcModuleId,
        srcRepoId,
        srcCommitId,
      },
    })
    await fs.put(newRepoId, MANIFEST_FILE_PATH, forkedManifest)
    await g8.finalizeCopyRepo(newRepo, srcRepo)
    initialized = true
  } finally {
    await multiTabSyncEndWrite(newRepo, 'forkModuleRepo')
  }

  if (initialized) {
    await dispatch(bootstrapModuleRepo(newRepoId))
  }
}

const revertModuleToSave = (repo: IRepo) => dispatch => (
  fs.deleteRepo(repo.repositoryName)
    .then(() => dispatch(gitClearAction(repo.repoId)))
    .then(() => dispatch(bootstrapModuleRepo(repo.repoId, true)))
    .catch(err => dispatch(showGitErr(repo.repoId, 'Couldn\'t revert to save', err)))
)

const synchronized = <FIRST_ARG extends IRepo, P extends any[], R>(
  func: RepoAction<FIRST_ARG, P, R>, name: string
) => (
    withSync<FIRST_ARG, P, R>(func, name, syncRepoStateFromDisk)
  )

const rawActions = {
  duplicateModuleRepo: withRunQueue(duplicateModuleRepo),
  revertModuleToSave: synchronized(revertModuleToSave, 'revertModuleToSave'),
  bootstrapModuleRepo: withRunQueue(bootstrapModuleRepo),
  initializeModuleRepo: withRunQueue(initializeModuleRepo),
  forkModuleRepo: withRunQueue(forkModuleRepo),
}

type ModuleGitActions = DispatchifiedActions<typeof rawActions>

const actions = dispatchify(rawActions)

export {
  actions as default,
  rawActions,
  ModuleGitActions,
}
