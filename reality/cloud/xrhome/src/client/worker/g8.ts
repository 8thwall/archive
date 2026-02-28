// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Scott Pollack (scott@8thwall.com)
//
// g8 interface that git-actions utilize
//
// This is the main entry point for communication with the g8-worker
// as well as all IndexedDB filesystem access.

import type {Tuple} from 'ts-essentials'

import g8 from './g8-git'
import {
  initRepoImpl,
  getImpl,
  putImpl,
  mkdirImpl,
  renameImpl,
  delImpl,
  deleteRepoImpl,
  keysImpl,
  FsHandle,
} from './fs'

let getFsOnce_ = null  // lazy to let the worker initialize

const getFs = () => new Promise<FsHandle>((resolve) => {
  // If already lazy-initialzied, wait for promise or return immediately.
  if (getFsOnce_) {
    getFsOnce_.then(({fs, root}) => resolve({fs, root}))
    return
  }

  // If we haven't yet kicked off a request to get info, kick one off and return when done.
  getFsOnce_ = g8.info().then(({dbName, fs}) => {
    const nfs = {root: dbName, fs}
    resolve(nfs)  // Resolve initial promise.
    return nfs  // Return value for getFsOnce_ promise.
  })
})

// Mirror file system writes to IDB so they will be persisted across sessions.
const mirrorWrite = <T extends Tuple>(...args: T) => g8.syncFsToIdb().then(() => args)

// Read file system from IDB mirror.
const mirrorRead = <T extends Tuple>(...args: T) => g8.syncIdbToFs().then(() => args)

type ImplAction<Args extends Tuple, Result extends unknown> = (
  (...args: Args) => (handle: FsHandle) => Promise<Result> | Result
)

const readOperation = <A extends Tuple, R extends unknown>(fsAction: ImplAction<A, R>) => (
  (...args: A) => getFs().then(fsAction(...args))
)

const writeOperation = <A extends Tuple, R extends unknown>(fsAction: ImplAction<A, R>) => (
  (...args: A) => getFs().then(fsAction(...args)).then(mirrorWrite)
)

// Exported read operations.
const get = readOperation(getImpl)
const keys = readOperation(keysImpl)

// Exported write operations.
const initRepo = writeOperation(initRepoImpl)
const put = writeOperation(putImpl)
const mkdir = writeOperation(mkdirImpl)
const rename = writeOperation(renameImpl)
const del = writeOperation(delImpl)
const deleteRepo = writeOperation(deleteRepoImpl)

// Mirror force points
const readFromMirror = mirrorRead

interface FsApi {
  get: typeof get
  keys: typeof keys
  initRepo: typeof initRepo
  put: typeof put
  mkdir: typeof mkdir
  rename: typeof rename
  del: typeof del
  deleteRepo: typeof deleteRepo
  readFromMirror: typeof readFromMirror
}

 type FsFunctions = keyof FsApi

export {
  get,
  keys,
  initRepo,
  put,
  mkdir,
  rename,
  del,
  deleteRepo,
  readFromMirror,
}

export type {
  FsApi,
  FsFunctions,
}
