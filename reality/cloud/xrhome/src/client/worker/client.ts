// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Scott Pollack (scott@8thwall.com)
//
// Client API to access methods on the Worker.
//
// e.g.,
//    import workerInterface from './client'
//    const {g8} = workerInterface
//    await info = g8.info()
//

// List of modules and methods, keep in sync with g8-git.js
import type {G8Api, G8Functions} from './g8-git'
import type {FsApi, FsFunctions} from './g8'

type ValuesOf<T> = T[keyof T]

type MustInclude<T, U extends T[]> = [T] extends [ValuesOf<U>] ? U : never

const enumerate = <T>() => (
  <U extends Array<T>>(...elements: MustInclude<T, U>) => elements
)

const modules = {
  g8: [
    // Repository commands.
    'info', 'clone', 'getLogs', 'syncMaster', 'copyRepo', 'initialCommit',
    'prepareCopyRepo', 'finalizeCopyRepo',
    // Client commands.
    'listClients', 'saveClient', 'newClient', 'changeClient', 'deleteClient', 'syncClient',
    'drySyncClient', 'fetchRemoteClients', 'patchClient',
    // Changeset commands.
    'listChangesets', 'newChangeset', 'updateChangeset', 'deleteChangeset',
    // Blob commands.
    'createBlob', 'diffBlobs', 'getBlobs', 'mergeBlobs',
    // Misc commands.
    'revert', 'diff', 'inspect',
    // Worker commands.
    'printG8Stats',
    'syncIdbToFs', 'syncFsToIdb',
    'configureWorker',
  ],
  fs: [
    // Read operations
    'get', 'keys',
    // Write operations
    'initRepo', 'put', 'mkdir', 'rename', 'del', 'deleteRepo',
    // Mirror operations
    'readFromMirror',
  ],
} as const

// If this throws a typescript error that means we are missing some fields or have extra fields.
// TODO(pawel) Is there a way to get typescript to tell us _exactly_ which property is problematic?
enumerate<G8Functions>()(...modules.g8)
enumerate<FsFunctions>()(...modules.fs)

const messages = {}

const workerPromises: Record<string, Promise<Worker>> = {}

const initWorker = async (repositoryName: string): Promise<Worker> => {
  const fsRoot = `/repo_${repositoryName}`
  const dbStoreName = 'repo_files'

  let workerPromise = workerPromises[repositoryName]
  if (workerPromise) {
    return workerPromise
  }

  workerPromise = new Promise((resolveWorker) => {
    const worker = Build8.PLATFORM_TARGET === 'desktop'
      ? new Worker('desktop://dist/worker/client/g8-worker.js')
      : new Worker(`/${Build8.DEPLOYMENT_PATH}/client/g8-worker.js`)

    worker.onmessage = ({data}) => {
      const {id, error, response} = data
      if (id === 'g8_loaded') {
        worker.postMessage({
          id: 'g8_ready',
          module: 'g8',
          method: 'configureWorker',
          args: [{
            dbStoreName,
            fsRoot,
          }],
        })
        return
      } else if (id === 'g8_ready') {
        resolveWorker(worker)
        return
      } else if (id === 'intercept-error') {
        // NOTE(pawel) Forward compatability for reporting errors from the worker.
        return
      } else if (messages[id] === undefined) {
        // eslint-disable-next-line no-console
        console.error(`No promise found for id ${id} from: [${Object.keys(messages).join(',')}]`)
        return
      }
      const {resolve, reject} = messages[id]
      delete messages[id]
      if (error) {
        reject(response)
      } else {
        resolve(response)
      }
    }
  })

  workerPromises[repositoryName] = workerPromise
  return workerPromise
}

let idCounter = 0

const sendMessage = (module, method, args) => new Promise((resolve, reject) => {
  // Search arguments for anything that can tip us off to which worker to use
  // all fs operations provide repo as first arg
  // some g8 operations provide repo as first arg
  // some g8 operations take repositoryName as first arg
  const firstArg = args[0] || {repositoryName: '__MISSING__'}
  if (!firstArg) {
    throw new Error(`Missing argument for ${module}:${method} (${firstArg})`)
  }
  const repositoryName = firstArg.repositoryName || firstArg
  if (typeof repositoryName !== 'string') {
    throw new Error(`Could not discern repositoryName from args (${JSON.stringify(args[0])})`)
  }
  if (repositoryName === '__MISSING__') {
    throw new Error(`Missing repositoryName ${module}:${method}`)
  }
  const id = `${module}::${method}-${Date.now()}-${idCounter++}`
  messages[id] = {resolve, reject}
  initWorker(repositoryName).then(worker => worker.postMessage({id, module, method, args}))
})

// This ensures that only the functions that are actually specified in the above list are
// available to typescript via the workerInterface.
type G8Client = Pick<G8Api, typeof modules.g8[number]> & {
  // NOTE(christoph): When these functions are called from outside the worker, repo
  // must be provided for the worker to init correctly.
  syncFsToIdb: (repo: Readonly<{repositoryName: string}>) => Promise<void>
  syncIdbToFs: (repo: Readonly<{repositoryName: string}>) => Promise<void>
}
type FsClient = Pick<FsApi, typeof modules.fs[number]>

interface IGitWorker {
  g8: G8Client
  fs: FsClient
}

const g8 = modules.g8.reduce((g8_, fn) => {
  g8_[fn] = (...args) => sendMessage('g8', fn, args)
  return g8_
}, {}) as G8Client

const fs = modules.fs.reduce((fs_, fn) => {
  fs_[fn] = (...args) => sendMessage('fs', fn, args)
  return fs_
}, {}) as FsClient

const workerInterface = {g8, fs} as IGitWorker

export {
  workerInterface as default,
  g8,
  fs,
}
