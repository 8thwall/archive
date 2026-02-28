// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import type {
  Response,
} from 'undici-types'

import {assert, describe, it, beforeEach} from '@nia/bzl/js/chai-js'
import {type HttpCache, createHttpCache} from './http-cache'

const TEST_URL = 'http://example.com'

describe('HttpCache isCacheableResponse Tests', () => {
  let cache: HttpCache

  beforeEach(() => {
    cache = createHttpCache()
  })

  // Using the real constructor makes it tricky to mock out 1xx responses.
  const createMockResponse = (
    url: string,
    status: number,
    headers: Record<string, string>
  ): Response => ({
    url,
    status,
    headers: {
      get: (name: string) => headers[name],
      has: (name: string) => headers[name] !== undefined,
    },
  } as unknown as Response)

  describe('When the request method is non-GET', () => {
    const NON_GET_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']
    NON_GET_METHODS.forEach((method) => {
      describe(`and the request init method is ${method}`, () => {
        it(`should return false (${method})`, () => {
          const response = createMockResponse(TEST_URL, 200, {})
          assert.isFalse(cache.isCacheableResponse(TEST_URL, {method}, response))
        })
      })

      describe(`and the request info method is ${method}`, () => {
        it(`should return false (${method})`, () => {
          const request = new globalThis.Request(TEST_URL, {method})
          const response = createMockResponse(TEST_URL, 200, {})
          assert.isFalse(cache.isCacheableResponse(request, undefined, response))
        })
      })
    })
  })

  describe('When the response status code is not final', () => {
    [100, 101, 102, 103].forEach((code) => {
      it(`should return false (HTTP ${code})`, () => {
        const response = createMockResponse(TEST_URL, code, {})
        assert.isFalse(cache.isCacheableResponse(TEST_URL, undefined, response))
      })
    })
  })

  describe('When the response status code is unsupported', () => {
    [206].forEach((code) => {
      it(`should return false (HTTP ${code})`, () => {
        const response = createMockResponse(TEST_URL, code, {})
        assert.isFalse(cache.isCacheableResponse(TEST_URL, undefined, response))
      })
    })
  })

  describe('When the cache control header contains "no-store"', () => {
    it('should return false', () => {
      const response = createMockResponse(TEST_URL, 200, {'cache-control': 'no-store'})
      assert.isFalse(cache.isCacheableResponse(TEST_URL, undefined, response))
    })
  })

  describe('When the cache control header contains "public"', () => {
    it('should return true', () => {
      const response = createMockResponse(TEST_URL, 200, {'cache-control': 'public'})
      assert.isTrue(cache.isCacheableResponse(TEST_URL, undefined, response))
    })
  })

  describe('When the headers contains "expires"', () => {
    it('should return true', () => {
      const response = createMockResponse(TEST_URL, 200, {expires: '1234'})
      assert.isTrue(cache.isCacheableResponse(TEST_URL, undefined, response))
    })
  })

  describe('When the cache control header contains "max-age"', () => {
    it('should return true', () => {
      const response = createMockResponse(TEST_URL, 200, {'cache-control': 'max-age=60'})
      assert.isTrue(cache.isCacheableResponse(TEST_URL, undefined, response))
    })
  })

  describe('When the status code is cachable', () => {
    const CACHABLE_STATUS_CODES = [200, 203, 204, 300, 301, 308, 404, 405, 410, 414, 501]
    CACHABLE_STATUS_CODES.forEach((code) => {
      it(`should return true (HTTP ${code})`, () => {
        const response = createMockResponse(TEST_URL, code, {})
        assert.isTrue(cache.isCacheableResponse(TEST_URL, undefined, response))
      })
    })
  })
})
