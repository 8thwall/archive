// @rule(js_binary)
// @package(npm-rendering)
// @attr(target = "node")

import {parentPort, workerData} from 'worker_threads'
import fs from 'fs'

import type {MsgData} from '../fetch-worker-helper'
import {workerFetch, createHttpCache, updateCurrCommitId} from '../fetch-worker-helper'

if (!process.env.TEST_APP_URL_RESPONSE_PATH) {
  throw new Error('TEST_APP_URL_RESPONSE_PATH environment variable is not set')
}

const DEFAULT_APP_RESPONSE = fs.readFileSync(process.env.TEST_APP_URL_RESPONSE_PATH, 'utf8')

const global = globalThis as any

const globalCache = workerData.cachePath === 'no-cache'
  ? undefined
  : createHttpCache(workerData.cachePath)

const requestsLog: MsgData[] = []
let callCount = 0
const fetchNaeApp = async () => {
  const response = new global.Response(DEFAULT_APP_RESPONSE, {
    headers: new globalThis.Headers({
      'status': '200',
      'content-type': 'text/html',
      'cache-control': 'max-stale=31536000',
    }),
  })
  callCount += 1
  return response
}

global.fetch = fetchNaeApp

parentPort?.on('message', (msg) => {
  if (msg.type === 'test') {
    parentPort?.postMessage({
      requestsLog,
      callCount,
      testCase: msg.testCase,
    })
    return
  } else if (msg.type === 'reset') {
    requestsLog.length = 0
    callCount = 0
    return
  }

  requestsLog.push(msg)
  const {protocol, href, pathname, requestId, input, init, commitId} = msg

  if (commitId) {
    updateCurrCommitId(commitId)
  }

  workerFetch(protocol, href, pathname, input, init, globalCache).then((response) => {
    response.arrayBuffer().then((arrayBuffer) => {
      parentPort?.postMessage({
        status: response.status,
        statusText: response.statusText,
        headers: [...response.headers.entries()],
        url: response.url,
        requestId,
        arrayBuffer: arrayBuffer.byteLength ? arrayBuffer : null,
      }, [arrayBuffer])
    })
  }).catch((error) => {
    const errorResponse = {
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
      requestId,
    }
    parentPort?.postMessage(errorResponse)
  })
})
