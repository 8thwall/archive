// @rule(js_binary)
// @package(npm-rendering)
// @attr(target = "node")
import {workerData} from 'worker_threads'

import {runAsWorker} from '@nia/c8/dom/sync-fetch/sync-threads'

import {
  createFetchWithDefaultBase,
  createUrlClass,
} from '@nia/c8/dom/fetch-overload'

import {createHttpCache} from '@nia/c8/dom/http-cache/http-cache'

import {
  deserializeFetchRequest,
  serializeFetchResponse,
} from '@nia/c8/dom/sync-fetch/sync-fetch-serialization'

const URL = createUrlClass()
const {fetchWithDefaultBase} = createFetchWithDefaultBase(
  URL,
  undefined,
  workerData.internalStoragePath ? createHttpCache(workerData.internalStoragePath) : undefined,
  {naeBuildMode: workerData.naeBuildMode}
)

const workerErrorPrefix = 'Sync Fetch Worker Error:'

runAsWorker(async (inputString: string) => {
  if (!inputString || inputString === '') {
    throw new Error(`${workerErrorPrefix} No input provided`)
  }

  try {
    const {input: requestInfo, init} = deserializeFetchRequest(inputString)
    const response = await fetchWithDefaultBase(requestInfo, init)
    return await serializeFetchResponse(response)
  } catch (error) {
    throw new Error(`${workerErrorPrefix} ${error.message}`)
  }
})
