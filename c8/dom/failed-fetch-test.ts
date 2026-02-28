// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @attr[](data = "fetch-test-worker")

import path from 'path'

import {describe, it, assert, after} from '@nia/bzl/js/chai-js'
import {createUrlClass, createFetchWithDefaultBase} from './fetch-overload'
import type {WorkerLogs} from './fetch-worker-helper'

const runfilesDir = process.env.RUNFILES_DIR || ''
const fetchWorkerPath = path.join(runfilesDir!, '_main/c8/dom/fetch-test-worker.js')

describe('failed-fetch tests', () => {
  const TEST_URL = 'https://www.example.com/'
  const BAD_URL = 'https://badurl.com/'
  const URLWithDefaultBase = createUrlClass(TEST_URL)
  const {fetchWithDefaultBase, fetchWorker, dispose} =
    createFetchWithDefaultBase(URLWithDefaultBase, fetchWorkerPath)

  after(() => {
    dispose()
  })

  it('should not exit/terminate the worker when a fetch fails', async () => {
    try {
      await fetchWithDefaultBase(BAD_URL)
    } catch (e) {
      assert.equal(e.message, 'Unexpected fetch call')
    }
    await fetchWithDefaultBase(TEST_URL)

    const {callCount, requestsLog} = await new Promise<WorkerLogs>((resolve) => {
      fetchWorker.postMessage({type: 'test', testCase: 'failed-fetch'})
      fetchWorker.on('message', (msg: WorkerLogs) => {
        const {testCase} = msg
        if (testCase === 'failed-fetch') {
          resolve(msg)
        }
      })
    })

    assert.equal(callCount, 1)

    const requestInfo1 = requestsLog[0].href
    assert.equal(requestInfo1, BAD_URL)

    const requestInfo2 = requestsLog[1].href
    assert.equal(requestInfo2, TEST_URL)
  })
})
