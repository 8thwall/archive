// @rule(js_binary)
// @package(npm-rendering)
// @attr(target = "node")

import {parentPort, workerData} from 'worker_threads'

import type {Request, RequestInfo} from 'undici-types'

import type {MsgData} from './fetch-worker-helper'
import {workerFetch, createHttpCache} from './fetch-worker-helper'

const global = globalThis as any

const TEST_URL = 'https://www.example.com/'

const FETCH_OVERLOADS_HTML = `<!DOCTYPE html>
<html>
<head>
    <script type="module">
      await window.fetch('/some-path')

      const request = new Request('https://www.example2.com' , {
        mode: 'cors',
      })
      await window.fetch(request)
    </script>
</body>
</html>
`

const requestsLog: MsgData[] = []
let callCount = 0

const globalCache = workerData.cachePath === 'no-cache' ? undefined
  : createHttpCache(workerData.cachePath)

const fetchStub = async (info: RequestInfo) => {
  const url = (info as URL).href || (info as Request).url || (info as string)
  if (url === TEST_URL) {
    const response = new global.Response(FETCH_OVERLOADS_HTML, {
      headers: {'Content-Type': 'text/html'},
    })
    callCount += 1
    return response
  }

  if (url === `${TEST_URL}some-path` || url === 'https://www.example2.com/') {
    callCount += 1
    return new global.Response('SUCCESS', {
      headers: {'Content-Type': 'text/plain'},
    })
  }

  throw new Error('Unexpected fetch call')
}
global.fetch = fetchStub

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
  const {protocol, href, pathname, requestId, input, init} = msg

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
