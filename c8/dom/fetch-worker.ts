// @rule(js_binary)
// @package(npm-rendering)
// @attr(target = "node")

import {parentPort, workerData} from 'worker_threads'

import {workerFetch, createHttpCache, updateCurrCommitId} from './fetch-worker-helper'

const globalCache = workerData.cachePath === 'no-cache' ? undefined
  : createHttpCache(workerData.cachePath)

parentPort?.on('message', (msg) => {
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
        arrayBuffer,
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
