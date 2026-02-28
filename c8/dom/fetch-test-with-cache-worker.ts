// @rule(js_binary)
// @package(npm-rendering)
// @attr(target = "node")

import {parentPort, workerData} from 'worker_threads'

import type {RequestInit} from 'undici-types'

import type {MsgData} from './fetch-worker-helper'
import {workerFetch, createHttpCache} from './fetch-worker-helper'

const global = globalThis as any

let globalCache = workerData.cachePath === 'no-cache' ? undefined
  : createHttpCache(workerData.cachePath)

let testHeaders
const requestsLog: MsgData[] = []
let callCount = 0

const fetchStub = async () => {
  const response = new global.Response(JSON.stringify({message: 'success'}), {
    headers: new global.Headers({
      'content-type': 'application/json',
      ...testHeaders,
    }),
    status: 200,
  })
  testHeaders = undefined
  callCount += 1
  return response
}
global.fetch = fetchStub

const fetchStubNonGet = async (_, init?: RequestInit) => {
  // Return a 204 for OPTIONS, return a 200 for GETS
  const status = init?.method === 'OPTIONS' ? 204 : 200
  const response = new global.Response(
    status === 200 ? JSON.stringify({message: 'success'}) : null,
    {
      headers: new global.Headers({
        'content-type': 'application/json',
        'cache-control': 'max-age=60',
      }),
      status,
    }
  )
  return response
}

parentPort?.on('message', (msg) => {
  if (msg.type === 'test') {
    parentPort?.postMessage({
      requestsLog,
      callCount,
      testCase: msg.testCase,
    })
    return
  } else if (msg.type === 'update-cache') {
    globalCache = createHttpCache(msg.cachePath)
    return
  } else if (msg.type === 'change-fetch') {
    global.fetch = msg.value === 'default' ? fetchStub : fetchStubNonGet
    return
  } else if (msg.type === 'reset') {
    requestsLog.length = 0
    callCount = 0
    return
  }

  requestsLog.push(msg)
  const {protocol, href, pathname, requestId, input, init, headers} = msg

  if (headers) {
    testHeaders = headers
    return
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
