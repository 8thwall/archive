// @attr[](data = ":sync-fetch-worker")
import path from 'path'

import type {
  RequestInfo,
  RequestInit,
  Response,
} from 'undici-types'

import {createSyncFn} from '@nia/c8/dom/sync-fetch/sync-threads'

import {
  serializeFetchRequest,
  deserializeFetchResponse,
} from '@nia/c8/dom/sync-fetch/sync-fetch-serialization'

const isProcessDefined = typeof process !== 'undefined'
const runfilesDir = (isProcessDefined)
  ? process.env.RUNFILES_DIR : (globalThis as any).__niaRunfilesDir

const syncFetchWorkerPath = path.join(runfilesDir, '_main/c8/dom/sync-fetch/sync-fetch-worker.js')
const SharedBufferSize = 8 * 1024 * 1024  // 8MB
const syncCall = createSyncFn(syncFetchWorkerPath, SharedBufferSize)

const syncFetch = (
  input: RequestInfo,
  init?: RequestInit
): {response: Response, bodyBuffer: ArrayBuffer | null} => {
  const serializedInput = serializeFetchRequest(input, init!)
  const serializedResponse = syncCall(serializedInput)
  const {response, buffer} = deserializeFetchResponse(serializedResponse)

  return {response, bodyBuffer: buffer}
}

export {syncFetch}
