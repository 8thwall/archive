// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @dep(//bzl/js:fetch)

// @attr[](data = "fetch-test-with-cache-worker")

import path from 'path'

import {describe, it, assert, beforeEach, afterEach} from '@nia/bzl/js/chai-js'

import {
  createFetchWithDefaultBase,
  createUrlClass,
  FetchFn,
} from './fetch-overload'
import {createHttpCache} from './http-cache/http-cache'
import type {WorkerLogs} from './fetch-worker-helper'

const runfilesDir = process.env.RUNFILES_DIR || ''
const fetchWorkerPath = path.join(runfilesDir, '_main/c8/dom/fetch-test-with-cache-worker.js')

describe('fetch-overload with cache tests', () => {
  let fetchOverloadFn: FetchFn
  let fetchObject
  let currFetchWorker

  const TEST_URL = 'https://www.example.com/'
  const URLWithDefaultBase = createUrlClass(TEST_URL)

  const CACHE_STORAGE_OPTIONS = [
    {cache: createHttpCache(), label: 'in-memory'},
    {cache: createHttpCache(`file://${process.env.TEST_SRCDIR}`), label: 'disk'},
  ]

  afterEach(() => {
    fetchObject.dispose()
    CACHE_STORAGE_OPTIONS.forEach(({cache}) => {
      cache.cleanCache()
    })
  })

  CACHE_STORAGE_OPTIONS.forEach(({cache, label}) => {
    describe(`when the cache storage is ${label}`, () => {
      beforeEach(() => {
        fetchObject = createFetchWithDefaultBase(URLWithDefaultBase, fetchWorkerPath)
        fetchOverloadFn = fetchObject.fetchWithDefaultBase
        currFetchWorker = fetchObject.fetchWorker
        currFetchWorker.postMessage({
          type: 'update-cache',
          cachePath: cache.internalStoragePath,
        })
      })

      const NO_CACHE_HEADERS = [
        {'cache-control': 'no-store'},
        {'cache-control': 'max-age=0'},
        // TODO(alvinp): Respones without a max-age header are treated as immediately stale. This
        // unit test should be updated once we implement a heuristic caching policy.
        {'cache-control': 'public'},
      ]

      NO_CACHE_HEADERS.forEach((headers) => {
        describe(`When the response has a cache-control of ${JSON.stringify(headers)}`, () => {
          beforeEach(() => {
            currFetchWorker.postMessage({type: 'reset'})
            currFetchWorker.postMessage({headers})
          })

          it('should not use cached responses', async () => {
            await fetchOverloadFn(TEST_URL)
            await fetchOverloadFn(TEST_URL)
            const {callCount} = await new Promise<WorkerLogs>((resolve) => {
              currFetchWorker.postMessage({type: 'test', testCase: 'no-cache'})
              currFetchWorker.on('message', (msg) => {
                const {testCase} = msg
                if (testCase === 'no-cache') {
                  resolve(msg)
                }
              })
            })

            assert.equal(callCount, 2)
          })
        })
      })

      const STALE_RESPONSE_HEADERS = [
        {'cache-control': 'max-age=1'},
      ]

      STALE_RESPONSE_HEADERS.forEach((headers) => {
        describe(`When the response has a cache-control of ${JSON.stringify(headers)}`, () => {
          beforeEach(() => {
            currFetchWorker.postMessage({type: 'reset'})
            currFetchWorker.postMessage({headers})
          })

          it('should not use staled cached responses since', async () => {
            await fetchOverloadFn(TEST_URL)
            await fetchOverloadFn(TEST_URL)
            // since the fetch is called in worker, sinon.useFakeTimers() does not work
            // so we need to wait for the cache to be stale using setTimeout
            await new Promise(resolve => setTimeout(resolve, 1100))
            await fetchOverloadFn(TEST_URL)
            await new Promise(resolve => setTimeout(resolve, 1100))
            const {callCount} = await new Promise<WorkerLogs>((resolve) => {
              currFetchWorker.postMessage({type: 'test', testCase: 'cache-stale'})
              currFetchWorker.on('message', (msg) => {
                const {testCase} = msg
                if (testCase === 'cache-stale') {
                  resolve(msg)
                }
              })
            })

            assert.equal(callCount, 2)
          }).timeout(8000)
        })
      })

      const CACHABLE_RESPONSE_HEADERS = [
        {'cache-control': 'max-age=60'},
      ]

      CACHABLE_RESPONSE_HEADERS.forEach((headers) => {
        describe(`When the response has a cache-control of ${JSON.stringify(headers)}`, () => {
          beforeEach(() => {
            currFetchWorker.postMessage({type: 'reset'})
            currFetchWorker.postMessage({headers})
          })

          it('should use cached responses', async () => {
            await fetchOverloadFn(TEST_URL)
            await fetchOverloadFn(TEST_URL)
            const {callCount} = await new Promise<WorkerLogs>((resolve) => {
              currFetchWorker.postMessage({type: 'test', testCase: 'cache-basic'})
              currFetchWorker.on('message', (msg) => {
                const {testCase} = msg
                if (testCase === 'cache-basic') {
                  resolve(msg)
                }
              })
            })

            assert.equal(callCount, 1)
          })

          it('should return the cached response regardless of relative or absolute', async () => {
            await fetchOverloadFn(`${TEST_URL}assets/my-image.jpg`)
            await fetchOverloadFn('/assets/my-image.jpg')
            const {callCount} = await new Promise<WorkerLogs>((resolve) => {
              currFetchWorker.postMessage({
                type: 'test',
                testCase: 'cache-relative-absolute',
              })
              currFetchWorker.on('message', (msg) => {
                const {testCase} = msg
                if (testCase === 'cache-relative-absolute') {
                  resolve(msg)
                }
              })
            })

            assert.equal(callCount, 1)
          })
        })
      })

      describe('When the request is a NON-GET request', () => {
        beforeEach(() => {
          currFetchWorker.postMessage({type: 'change-fetch', value: 'non-get'})
        })

        afterEach(() => {
          currFetchWorker.postMessage({type: 'change-fetch', value: 'default'})
        })

        it('should not use cached responses', async () => {
          await fetchOverloadFn(TEST_URL)
          const response = await fetchOverloadFn(TEST_URL, {method: 'OPTIONS'})
          assert.equal(response.status, 204)
        })
      })
    })
  })
})
