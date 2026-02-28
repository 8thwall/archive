// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @dep(//bzl/js:fetch)

// @attr[](data = "//c8/dom/build-mode-fetch-test-data")

import path from 'path'

import fs from 'fs'

import type {Worker} from 'worker_threads'

import {describe, it, assert, beforeEach, afterEach} from '@nia/bzl/js/chai-js'

import type {
  FetchFn,
  NaeBuildMode,
} from './fetch-overload'

import {createHttpCache, HttpCache} from './http-cache/http-cache'
import type {WorkerLogs} from './fetch-worker-helper'
import {
  createDom,
  type Dom,
} from '@nia/c8/dom/dom'

const runfilesDir = process.env.RUNFILES_DIR || ''
const RELATIVE_PATH = '_main/c8/dom/build-mode-fetch-test-data'
const TEST_FETCH_WORKER_PATH = path.join(runfilesDir, RELATIVE_PATH, 'build-mode-fetch-worker.js')

// We need to use a temporary directory to do safe writes to the metadata.json file
// these happen implicitly in fetch-worker-helper.ts using the internalStoragePath
const INTERNAL_STORAGE_PATH = process.env.TEST_TMPDIR
if (!INTERNAL_STORAGE_PATH) {
  throw new Error('TEST_TMPDIR environment variable is not set')
}

fs.copyFileSync(
  path.join(runfilesDir, RELATIVE_PATH, 'metadata.json'),
  path.join(INTERNAL_STORAGE_PATH, 'metadata.json')
)

const APP_URL_V1_RESPONSE_PATH = path.join(
  runfilesDir, RELATIVE_PATH, 'build-mode-fetch-test-0.html'
)
const APP_URL_V2_RESPONSE_PATH = path.join(
  runfilesDir, RELATIVE_PATH, 'build-mode-fetch-test-1.html'
)
const APP_URL_V1_RESPONSE_HTML = fs.readFileSync(APP_URL_V1_RESPONSE_PATH, 'utf8')
const APP_URL_V2_RESPONSE_HTML = fs.readFileSync(APP_URL_V2_RESPONSE_PATH, 'utf8')

const MOCK_APP_URL = 'https://www.not-actually-used.8thwall.app/just-for-testing'

let currFetchWorker: Worker
const currentCache: HttpCache = createHttpCache(INTERNAL_STORAGE_PATH)
let currDom: Dom
let fetchOverloadFunc: FetchFn

describe('NAE Build Mode Tests', () => {
  const simulateFreshInstall = async () => {
    currentCache.cleanCache()
    await currentCache.writeResponse(MOCK_APP_URL, new globalThis.Response(APP_URL_V1_RESPONSE_HTML,
      {
        headers: new globalThis.Headers({
          'content-type': 'text/html',
          'cache-control': 'max-stale=31536000',
        }),
      }))
  }

  // NOTE(akashmahesh): Creating DOM also creates a new fetch worker. This worker will be used for
  // the first html fetch of the appUrl. Therefore, to accurately test the html parser and commitId
  // propagation, we need to use separate workers with different fetch stubs by default.
  const simulateOpeningNaeApp = async (naeBuildMode: NaeBuildMode, appUrlResponsePath: string) => {
    // NOTE(lreyna): See corresponding worker file (build-mode-fetch-worker.ts) for the
    // how the stubbed fetch worker is used.
    process.env.TEST_APP_URL_RESPONSE_PATH = appUrlResponsePath

    currDom = await createDom({
      url: MOCK_APP_URL,
      fetchWorkerPath: TEST_FETCH_WORKER_PATH,
      naeBuildMode,
      internalStoragePath: INTERNAL_STORAGE_PATH,
    })
    fetchOverloadFunc = currDom.getCurrentContext().fetch
    currFetchWorker = currDom.getCurrentContext().fetchWorker
  }

  describe('NAE Static Build Mode Tests', () => {
    beforeEach(async () => {
      await simulateFreshInstall()

      // Creating dom here represents opening the native app for the first time
      await simulateOpeningNaeApp('static', APP_URL_V1_RESPONSE_PATH)
    })

    afterEach(async () => {
      await currDom.dispose()
    })

    it('should use the cached response for appUrl in static mode', async () => {
      // Simulating reopening the native app by re-fetching the appUrl
      const response = await fetchOverloadFunc(MOCK_APP_URL)

      const {callCount} = await new Promise<WorkerLogs>((resolve) => {
        currFetchWorker.postMessage({type: 'test', testCase: 'static-mode'})
        currFetchWorker.on('message', (msg) => {
          const {testCase} = msg
          if (testCase === 'static-mode') {
            resolve(msg)
          }
        })
      })

      // NOTE(akashmahesh): In NAE builds, responses are pre-cached in the packager. All fetches to
      // the appUrl in static mode should use the cached response.
      assert.equal(callCount, 0)
      assert.equal(APP_URL_V1_RESPONSE_HTML, await response.text())
    })
  })

  describe('NAE Hot-Reload Build Mode Tests', () => {
    beforeEach(async () => {
      await simulateFreshInstall()

      // Creating dom here represents opening the native app for the first time
      await simulateOpeningNaeApp('hot-reload', APP_URL_V1_RESPONSE_PATH)
    })

    afterEach(async () => {
      await currDom.dispose()
    })

    it('should fetch a new response when the prod app changes', async () => {
      // Simulates reopening a nae app after a prod app change by creating dom with a new
      // stubbed response.
      await currDom.dispose()
      await simulateOpeningNaeApp('hot-reload', APP_URL_V2_RESPONSE_PATH)

      const newResponse = await fetchOverloadFunc(MOCK_APP_URL)

      const {callCount} = await new Promise<WorkerLogs>((resolve) => {
        currFetchWorker.postMessage({type: 'test', testCase: 'hot-reload-mode'})
        currFetchWorker.on('message', (msg) => {
          const {testCase} = msg
          if (testCase === 'hot-reload-mode') {
            resolve(msg)
          }
        })
      })

      assert.equal(callCount, 2)
      assert.equal(APP_URL_V2_RESPONSE_HTML, await newResponse.text())
    })
  })
})
