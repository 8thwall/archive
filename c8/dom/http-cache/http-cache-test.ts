// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import type {
  Headers,
  Response,
} from 'undici-types'

import {assert, describe, it, beforeEach, sinon} from '@nia/bzl/js/chai-js'
import {createHttpCache} from './http-cache'

const global = globalThis as any
const builtIn = {
  Headers: global.Headers as typeof Headers,
  Response: global.Response as typeof Response,
}

const TEST_URL = 'http://example.com'

describe('HttpCache Tests', () => {
  // TODO(lreyna): Use better mocking strategy, so we don't have to write into cache and use clock
  describe('getCachedResponse', () => {
    let httpCache: ReturnType<typeof createHttpCache>
    const clock: sinon.SinonFakeTimers = sinon.useFakeTimers()

    beforeEach(() => {
      httpCache = createHttpCache()
    })

    it('should return undefined if the request method is not cacheable', async () => {
      const result = await httpCache.getCachedResponse(TEST_URL, 'POST')
      assert.isUndefined(result)
    })

    it('should return undefined if there is no cached response', async () => {
      const result = await httpCache.getCachedResponse(TEST_URL, 'GET')
      assert.isUndefined(result)
    })

    it('should return the cached response if it is fresh', async () => {
      const responseHeaders = new builtIn.Headers({
        'cache-control': 'max-age=600',
      })
      const freshCacheEntry = new builtIn.Response('fresh', {
        status: 200,
        headers: responseHeaders,
      })

      await httpCache.writeResponse(TEST_URL, freshCacheEntry)

      const result = await httpCache.getCachedResponse(TEST_URL, 'GET')
      assert.strictEqual(result?.status, 200)
    })

    it('should return the cached response if it is stale within max-stale duration', async () => {
      const responseHeaders = new builtIn.Headers({
        'cache-control': 'max-age=10,max-stale=20',
      })

      const staleCacheResponse = new builtIn.Response('stale', {
        status: 200,
        headers: new builtIn.Headers(responseHeaders),
      })

      await httpCache.writeResponse(TEST_URL, staleCacheResponse)

      clock.tick(10001)

      // TODO(lreyna): Need a specific way to check if the response is stale
      const result = await httpCache.getCachedResponse(TEST_URL, 'GET')
      assert.strictEqual(result?.status, 200)
    })

    it('should return undefined if cached response is stale exceeds duration', async () => {
      const responseHeaders = new builtIn.Headers({
        'cache-control': 'max-age=10,max-stale=10',
      })

      const staleCacheResponse = new builtIn.Response('stale', {
        status: 200,
        headers: new builtIn.Headers(responseHeaders),
      })

      await httpCache.writeResponse(TEST_URL, staleCacheResponse)

      // Mock the passage of time, so Date.now() is greater than the expiration time
      clock.tick(20001)

      const result = await httpCache.getCachedResponse(TEST_URL, 'GET')
      assert.isUndefined(result)
    })

    it('should return undefined if cached response stale and no max-stale directive', async () => {
      const responseHeaders = new builtIn.Headers({
        'cache-control': 'max-age=10',
      })

      const staleCacheResponse = new builtIn.Response('stale', {
        status: 200,
        headers: new builtIn.Headers(responseHeaders),
      })

      await httpCache.writeResponse(TEST_URL, staleCacheResponse)

      clock.tick(10001)

      const result = await httpCache.getCachedResponse(TEST_URL, 'GET')
      assert.isUndefined(result)
    })
  })

  describe('isStaleResponse', () => {
    let httpCache: ReturnType<typeof createHttpCache>

    beforeEach(() => {
      httpCache = createHttpCache()
    })

    it('should return true if the response has a no-cache directive', () => {
      const response = new builtIn.Response('body', {
        status: 200,
        headers: new builtIn.Headers({
          'cache-control': 'no-cache',
        }),
      })

      const result = httpCache.isStaleResponse(response)
      assert.isTrue(result)
    })

    it('should return true if the response has a stale-while-revalidate directive', () => {
      const response = new builtIn.Response('body', {
        status: 200,
        headers: new builtIn.Headers({
          'cache-control': 'stale-while-revalidate',
        }),
      })

      const result = httpCache.isStaleResponse(response)
      assert.isTrue(result)
    })

    it('should return true if the response is past its expires header', () => {
      const expiresDate = new Date(Date.now() - 1000).toUTCString()
      const response = new builtIn.Response('body', {
        status: 200,
        headers: new builtIn.Headers({
          'expires': expiresDate,
        }),
      })

      const result = httpCache.isStaleResponse(response)
      assert.isTrue(result)
    })

    it('should return false if the response is within its max-age directive', () => {
      const responseDate = new Date(Date.now() - 5000).toUTCString()
      const response = new builtIn.Response('body', {
        status: 200,
        headers: new builtIn.Headers({
          'cache-control': 'max-age=10',
          'date': responseDate,
        }),
      })

      const result = httpCache.isStaleResponse(response)
      assert.isFalse(result)
    })

    it('should return true if the response is past its max-age directive', () => {
      const responseDate = new Date(Date.now() - 15000).toUTCString()
      const response = new builtIn.Response('body', {
        status: 200,
        headers: new builtIn.Headers({
          'cache-control': 'max-age=10',
          'date': responseDate,
        }),
      })

      const result = httpCache.isStaleResponse(response)
      assert.isTrue(result)
    })

    it('should return true if no expiration information is provided', () => {
      const response = new builtIn.Response('body', {
        status: 200,
        headers: new builtIn.Headers(),
      })

      const result = httpCache.isStaleResponse(response)
      assert.isTrue(result)
    })
  })
})
