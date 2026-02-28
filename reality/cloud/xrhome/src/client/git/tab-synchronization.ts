// either repo object has a repositoryName or the first parameter is the repositoryName
import type {IRepo} from './g8-dto'
import {
  beginWriteOperation, endWriteOperation, waitForRepositoryWriteBlock,
} from '../common/repo-coordination'
import {g8} from '../worker/client'
import {makeRunQueue} from '../../shared/run-queue'
import type {AsyncThunk} from '../common/types/actions'
import type {RootState} from '../reducer'

// All repo actions take IRepo as the first arg to allow for synchronization
type RepoAction<FIRST_ARG extends IRepo, P extends any[], R> = (
  repo: FIRST_ARG, ...args: P
) => AsyncThunk<R>

// When a git action is synchronized, we can upgrade a repoId string to a full IRepo object so
// we accept either here.
type SynchronizedRepoAction<FIRST_ARG extends IRepo, P extends any[], R> = (
  (repoOrRepoId: CompatibleFirstArg<FIRST_ARG>, ...args: P) => AsyncThunk<R>
)

// However, if the first arg is a type extending IRepo, we can't just accept a string, we always
//  need the full object.
type CompatibleFirstArg<FIRST_ARG extends IRepo> = IRepo extends FIRST_ARG
  ? string | FIRST_ARG
  : FIRST_ARG

// Wrapping a repo action with a synchronizer wrapper like withSync will upgrade the action to
// a Synchronized version
type Synchronized<T> = T extends RepoAction<infer FIRST_ARG, infer P, infer R>
  ? SynchronizedRepoAction<FIRST_ARG, P, R>
  : never

// This function upgrades strings to full IRepo objects. We have to assume that if an object is
// passed, it is assignable to FIRST_ARG. We also have to assume that if a string is passed,
// the function accepts IRepo.
const extractRepo = <FIRST_ARG extends IRepo>(
  // eslint-disable-next-line arrow-parens
  repoOrRepoId: CompatibleFirstArg<FIRST_ARG>, getState: () => RootState
): FIRST_ARG => {
  if (typeof repoOrRepoId === 'object') {
    return repoOrRepoId as FIRST_ARG
  } else if (typeof repoOrRepoId === 'string') {
    return getState().git.byRepoId[repoOrRepoId].repo as FIRST_ARG
  } else {
    throw new Error('Invalid repo argument')
  }
}

// NOTE(pawel) There is a __tiny__ race condition here between dirty bit being cleared and
// starting the write operation; this is not an issue for normal operations but should it prove
// to be problematic then we'd need to look into a tighter locking mechanism.
const multiTabSyncBeginWrite = (
  repo: IRepo,
  actionName: string,
  onDirty: (repo: IRepo) => AsyncThunk<unknown>
) => async (dispatch) => {
  const dirty = await waitForRepositoryWriteBlock(repo.repositoryName, actionName)
  if (dirty) {
    await dispatch(onDirty(repo))
  }
  await beginWriteOperation(repo.repositoryName, actionName)
}

const multiTabSyncEndWrite = async (repo: IRepo, actionName: string) => {
  await g8.syncFsToIdb(repo)
  await endWriteOperation(repo?.repositoryName, actionName)
}

// Write to two repo at the same time. If locking the second fails, we will release the first and
// rethrow the error.
const multiTabSyncBeginDualWrite = (
  repoA: IRepo,
  repoB: IRepo,
  actionName: string,
  onDirty: (repo: IRepo) => AsyncThunk<unknown>
): AsyncThunk => async (dispatch) => {
  if (repoA.repositoryName === repoB.repositoryName) {
    await dispatch(multiTabSyncBeginWrite(repoA, actionName, onDirty))
    return
  }

  // NOTE(christoph): Obtain locks in a stable order to avoid deadlocks
  const aIsFirst = repoA.repositoryName < repoB.repositoryName
  const firstRepo = aIsFirst ? repoA : repoB
  const secondRepo = aIsFirst ? repoB : repoA

  await dispatch(multiTabSyncBeginWrite(firstRepo, actionName, onDirty))
  try {
    await dispatch(multiTabSyncBeginWrite(secondRepo, actionName, onDirty))
  } catch (err) {
    multiTabSyncEndWrite(firstRepo, actionName)
    throw err
  }
}

const multiTabSyncEndDualWrite = async (repoA: IRepo, repoB: IRepo, actionName: string) => {
  await multiTabSyncEndWrite(repoA, actionName)
  if (repoA.repositoryName !== repoB.repositoryName) {
    await multiTabSyncEndWrite(repoB, actionName)
  }
}

// synchronize certain destructive filesystem operations
// revertToSave() with bootstrapRepo() for example
const fsRunQueue = makeRunQueue()

// Functions that only need the run queue and perform multiTabSyncBeginWrite
// and multiTabSyncEndWrite internally.
const withRunQueue = <T extends (...args: any[]) => any>(dispatchFactoryFunc: T): T => (
  (...args) => dispatch => fsRunQueue.next(
    () => dispatch(dispatchFactoryFunc(...args))
  )
) as T

// Wrap your raw action (a factory function that make dispatchable functions)
// so that your function is called when it is dispatched and then multiTabSyncEndWrite()
// is called. Uses the given repo to perform the sync
// First argument is repo possessing repositoryName for worker selection
//
// @returns If your function returns a promise, this method will call after your promise
//          is resolved and return your original function's return. If your function doesn't
//          return a promise, calls after your function is done and return your original
//          function's return
const withSync = <FIRST_ARG extends IRepo, P extends any[], R>(
  dispatchFactoryFunc: RepoAction<FIRST_ARG, P, R>,
  actionName: string,
  onDirty: (repo: IRepo) => AsyncThunk<unknown>
): SynchronizedRepoAction<FIRST_ARG, P, R> => (
    (repoOrRepoId, ...args) => async (dispatch, getState) => fsRunQueue.next(async () => {
      const repo = extractRepo(repoOrRepoId, getState)
      await dispatch(multiTabSyncBeginWrite(repo, actionName, onDirty))
      try {
        return await dispatch(dispatchFactoryFunc(repo, ...args))
      } finally {
        await multiTabSyncEndWrite(repo, actionName)
      }
    })
  )

// Like withSync but without the call to multiTabSyncEndWrite(), which calls g8.syncFsToIdb().
// This applies to fs calls that already perform the synchronization internally.
const withWriteBlock = <FIRST_ARG extends IRepo, P extends any[], R>(
  dispatchFactoryFunc: RepoAction<FIRST_ARG, P, R>,
  actionName: string,
  onDirty: (repo: IRepo) => AsyncThunk<unknown>
): SynchronizedRepoAction<FIRST_ARG, P, R> => (
    (repoOrRepoId, ...args) => async (dispatch, getState) => fsRunQueue.next(async () => {
      const repo = extractRepo(repoOrRepoId, getState)
      await dispatch(multiTabSyncBeginWrite(repo, actionName, onDirty))
      try {
        return await dispatch(dispatchFactoryFunc(repo, ...args))
      } finally {
        await endWriteOperation(repo?.repositoryName, actionName)
      }
    })
  )

// Simply waits for write block to end before continuing. Does not sync if the repo state is dirty.
const withWriteBlockComplete = <FIRST_ARG extends IRepo, P extends any[], R>(
  dispatchFactoryFunc: RepoAction<FIRST_ARG, P, R>,
  actionName: string
): SynchronizedRepoAction<FIRST_ARG, P, R> => (
    (repoOrRepoId, ...args) => async (dispatch, getState) => fsRunQueue.next(async () => {
      const repo = extractRepo(repoOrRepoId, getState)
      await waitForRepositoryWriteBlock(repo.repositoryName, actionName)
      return dispatch(dispatchFactoryFunc(repo, ...args))
    })
  )

export {
  multiTabSyncBeginWrite,
  multiTabSyncEndWrite,
  multiTabSyncBeginDualWrite,
  multiTabSyncEndDualWrite,
  withSync,
  withWriteBlock,
  withWriteBlockComplete,
  withRunQueue,
}

export type {
  Synchronized,
  SynchronizedRepoAction,
  RepoAction,
}
