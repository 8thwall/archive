// @package(npm-rendering)
// @attr(target = "node")
import type {
  Request as RequestType,
} from 'undici-types'

import {assert, describe, it, after} from '@nia/bzl/js/chai-js'

import {
  createFetchWithDefaultBase,
  createRequestClass,
  createUrlClass,
  ResponseWithDefaultBase,
} from '@nia/c8/dom/fetch-overload'

import {createHttpCache} from '@nia/c8/dom/http-cache/http-cache'

import {syncFetch} from '@nia/c8/dom/sync-fetch/sync-fetch'

const URL = createUrlClass()
const Request = createRequestClass(URL)
const Response = ResponseWithDefaultBase
const {fetchWithDefaultBase, dispose} = createFetchWithDefaultBase(URL)

const USE_NETWORK = false
const TEST_URL = USE_NETWORK ? 'https://www.example.com' : `file://${__filename}`

describe('Sync Fetch tests', () => {
  after(() => {
    dispose()
  })

  it('test with string url', async () => {
    const {response: syncResponse, bodyBuffer: syncArrayBuffer} = syncFetch(TEST_URL)
    assert.strictEqual(syncResponse.status, 200)
    const syncResponseBody: string = new TextDecoder().decode(syncArrayBuffer)
    assert.isAbove(syncResponseBody.length, 0)

    // Compare with async fetch
    const asyncResponse = await fetchWithDefaultBase(TEST_URL)
    const asyncResponseArray = await asyncResponse.arrayBuffer()
    const asyncResponseBody: string = new TextDecoder().decode(asyncResponseArray)

    assert.strictEqual(syncResponseBody, asyncResponseBody)
  })

  it('test with URL Object', () => {
    const {response} = syncFetch(new URL(TEST_URL))
    assert.strictEqual(response.status, 200)
  })

  it('test with Request Object', () => {
    const request: RequestType = new Request(TEST_URL)

    const {response} = syncFetch(request)
    assert.strictEqual(response.status, 200)
  })

  it('test with string url with caching', async () => {
    const cachePath = `file://${process.env.TEST_SRCDIR}`

    // Specifically has to be this global variable, see `context-helpers.ts`
    ;(globalThis as any).__niaInternalStoragePath = cachePath
    const cacheManager = createHttpCache(cachePath)

    // Essentially mock the response, we shouldn't be doing network requests in tests
    const exampleUrl = new URL('https://www.example.com')
    const exampleResponseBody = 'cached response'
    const exampleResponse = new Response(exampleResponseBody)
    exampleResponse.headers.set('cache-control', 'max-age=1000')
    await cacheManager.writeResponse(exampleUrl.href, exampleResponse)

    const {response: syncResponse, bodyBuffer: syncArrayBuffer} = syncFetch(exampleUrl)
    assert.strictEqual(syncResponse.status, 200)
    const syncResponseBody: string = new TextDecoder().decode(syncArrayBuffer)
    assert.isAbove(syncResponseBody.length, 0)
    assert.strictEqual(syncResponseBody, exampleResponseBody)
  })
})
