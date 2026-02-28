// @visibility(//visibility:public)
// @dep(//bzl/js:fetch)

import crypto from 'crypto'

import type {
  Headers,
  Request,
  Response,
  RequestInfo,
  RequestInit,
} from 'undici-types'

import {
  type CacheEntry,
  createHttpCacheDiskStorage,
  createHttpCacheMemoryStorage,
  type ResponseData,
} from './http-cache-storage'

interface HttpCache {
  isCacheableResponse(
    input: RequestInfo,
    init: RequestInit | undefined,
    response: Response
  ): boolean
  getCachedResponse(
    url: string,
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Response | undefined>
  writeResponse(url: string, response: Response): Promise<void>
  internalStoragePath?: string
  isStaleResponse(response: Response): boolean
  updateCachedResponseExpiration(url: string, response: Response): Promise<void>
  invalidateCachedResponses(url: string): Promise<void>
  cleanCache(): Promise<void>
}

const global = globalThis as any
const builtIn = {
  Headers: global.Headers as typeof Headers,
  Request: global.Request as typeof Request,
  Response: global.Response as typeof Response,
}

const CACHABLE_REQUEST_METHODS = new Set(['GET'])
const CACHABLE_STATUS_CODES = new Set([200, 203, 204, 300, 301, 308, 404, 405, 410, 414, 501])

// These are status codes that can be cached according to the spec, but are not supported by
// by this cache yet.
const UNSUPPORTED_STATUS_CODES = new Set([206])

const MILLIS_PER_SECOND = 1000

const createHttpCache = (internalStoragePath?: string): HttpCache => {
  // TODO(alvinp): Add support for file system storage.
  const storage = internalStoragePath
    ? createHttpCacheDiskStorage(internalStoragePath)
    : createHttpCacheMemoryStorage()

  const _getRequestMethod = (input: RequestInfo, init?: RequestInit): string => {
    if (input instanceof builtIn.Request) {
      return input.method
    }

    return init?.method ?? 'GET'
  }

  const isCacheableResponse = (
    input: RequestInfo,
    init: RequestInit | undefined,
    response: Response
  ): boolean => {
    // A response can only be cached if:
    // https://www.rfc-editor.org/rfc/rfc9111.html#name-storing-responses-in-caches

    // 1. The request method is understood by the cache (GET
    if (!CACHABLE_REQUEST_METHODS.has(_getRequestMethod(input, init))) {
      return false
    }

    // 2. The response status code is final (e.g. not 1xx)
    if (response.status < 200) {
      return false
    }

    // 3. If the response status code is 206 or 304, or the "must-understand" cache directive is
    // set, the cache must understand the response status code.
    if (UNSUPPORTED_STATUS_CODES.has(response.status)) {
      return false
    }

    const cacheControl = response.headers.get('cache-control')

    // 4. If the "no-store" cache directive must not be set.
    // TODO(alvinp): This should only apply when the directive has no arguments.
    if (cacheControl?.includes('no-store')) {
      return false
    }

    // 5. If the "private" cache directive is set, the request must not be shared.
    // No-op. This isn't a shared cache. It's private / client-side.

    // 6. If the cache is shared, the Autorization header must not be set.
    // No-op. This isn't a shared cache. It's private / client-side.

    // 7. The response contains one of the following:
    // 7a. A public response directive.
    if (cacheControl?.includes('public')) {
      return true
    }

    // 7b. A private response directive, if the cache is not shared.
    if (cacheControl?.includes('private')) {
      return true
    }

    // 7c. An expires header field
    if (response.headers.has('expires')) {
      return true
    }

    // 7d. A max-age response directive.
    if (cacheControl?.includes('max-age')) {
      return true
    }

    // 7e. A s-maxage response directive, if the cache is shared.
    // No-op. This isn't a shared cache. It's private / client-side.

    // 7f. A cache extension is specified
    // TODO(alvinp): Not sure how to implement this yet.

    // 7g. The status code is cachable.
    // https://www.rfc-editor.org/rfc/rfc9110#section-15.1
    return CACHABLE_STATUS_CODES.has(response.status)
  }

  const _getCacheKey = (url: string): string => (
    // Since we're only caching GET requests, we can use the request URL as the cache key.
    // https://www.rfc-editor.org/rfc/rfc9111.html#section-2-3
    // We'll use the base64url encoding of the URL as the cache key to make it filesystem-safe.

    // TODO(alvinp): Should we use an approach that guarantees uniqueness? MD5 is highly likely to
    // collide, but not _technically_ guaranteed. Using MD5 to at least unblock crashes people
    // are seeing with file names (which use cache keys) being too long.
    crypto.createHash('md5').update(url).digest('hex')
  )

  const _isCachedResponseFresh = (entry: CacheEntry): boolean => (
    // TODO(alvinp): If no expiration was provided, use define a heuristic freshness lifetime.
    // https://www.rfc-editor.org/rfc/rfc9111.html#name-calculating-heuristic-fresh
    entry.expirationMillis > Date.now()
  )

  const _canUseStaleResponse = (entry: CacheEntry): boolean => {
    const cacheControl = entry.response.headers['cache-control']
    const maxStaleMatch = cacheControl?.match(/max-stale=(\d+)/)
    const maxStale = maxStaleMatch ? parseInt(maxStaleMatch[1], 10) : 0

    // Check if the response is stale but within the max-stale duration
    // From Spec: https://httpwg.org/specs/rfc9111.html#cache-request-directive.max-stale
    //  If a value is present, then the client is willing to accept a response that has exceeded its
    //  freshness lifetime by no more than the specified number of seconds.
    if (maxStale > 0 && Date.now() < entry.expirationMillis + maxStale * MILLIS_PER_SECOND) {
      return true
    }

    // Could be fresh or stale, but doesn't have a max-stale duration or it's expired.
    return false
  }

  const _reconstructResponse = async (entry: CacheEntry): Promise<Response> => {
    const headers = new builtIn.Headers({
      ...entry.response.headers,
      'expires': entry.expirationMillis.toString(),
    })
    const buffer = entry.response.body

    // TODO(alvinp): The Age header must be regenerated to be equal to the current age of the
    // response.

    return new builtIn.Response(buffer, {
      status: entry.response.status,
      headers,
    })
  }

  const getCachedResponse = async (
    url: string,
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Response | undefined> => {
    if (!CACHABLE_REQUEST_METHODS.has(_getRequestMethod(input, init))) {
      return undefined
    }

    const cachedResponse = await storage.readResponse(_getCacheKey(url))
    if (!cachedResponse) {
      return undefined
    }

    if (_isCachedResponseFresh(cachedResponse)) {
      // The response is fresh. Return it.
      return _reconstructResponse(cachedResponse)
    }

    if (_canUseStaleResponse(cachedResponse)) {
      // The response is stale, but the client is willing to accept it.
      const response = await _reconstructResponse(cachedResponse)
      response.headers.append('cache-control', 'stale-while-revalidate')
      return response
    }

    return undefined
  }

  const _createCachedResponse = async (response: Response): Promise<CacheEntry> => {
    // The data from a response can only be consumed once. Let's clone it so it can be cached
    // and then re-used.
    const clonedResponse: Response = response.clone()
    const clonedHeaders = {} as Record<string, string>
    clonedResponse.headers.forEach((value, key) => {
      clonedHeaders[key] = value
    })

    const cacheControl = response.headers.get('cache-control')

    // TODO(alvinp): If the "no-cache" directive has arguments, we should remove those headers.

    // TODO(alvinp): This should use the functions in fetch-methods.ts to parse headers.
    const maxAge = parseInt(cacheControl?.match(/max-age=(\d+)/)?.[1] ?? '0', 10)

    // TODO(alvinp): This should also consider the "expires" header.
    const expiresAt = Date.now() + (maxAge * MILLIS_PER_SECOND)

    const responseData: ResponseData = {
      status: clonedResponse.status,
      headers: clonedHeaders,
      body: await clonedResponse.arrayBuffer(),
    }

    return {
      response: responseData,
      expirationMillis: expiresAt,
    }
  }

  const writeResponse = async (
    url: string,
    response: Response
  ): Promise<void> => {
    const cacheKey = _getCacheKey(url)

    // TODO(alvinp): 304s should update the cached response with the new headers, and not
    // update the full response body.

    const cacheEntry = await _createCachedResponse(response)
    await storage.writeResponse(cacheKey, cacheEntry)
  }

  // Note: Could be moved to a separate module if needed. Not dependent on anything in HttpCache
  const isStaleResponse = (response: Response): boolean => {
    const cacheControl = response.headers.get('cache-control')

    if (cacheControl?.includes('no-cache') || cacheControl?.includes('no-store') ||
    cacheControl?.includes('must-revalidate') || cacheControl?.includes('stale-while-revalidate')) {
      return true
    }

    const expiresHeader = response.headers.get('expires')
    if (expiresHeader) {
      const expiresTime = new Date(expiresHeader).getTime()
      return Date.now() > expiresTime
    }

    const maxAgeMatch = cacheControl?.match(/max-age=(\d+)/)
    if (maxAgeMatch) {
      const maxAge = parseInt(maxAgeMatch[1], 10)

      const dateHeader = response.headers.get('date')
      const responseDate = dateHeader ? new Date(dateHeader).getTime() : 0

      const expirationTime = responseDate + (maxAge * MILLIS_PER_SECOND)

      return Date.now() > expirationTime
    }

    // TODO(lreyna): Could use a heuristic freshness lifetime if no expiration is provided.
    return true
  }

  const updateCachedResponseExpiration = async (
    url: string,
    response: Response
  ): Promise<void> => {
    const cacheKey = _getCacheKey(url)
    const cachedEntry = await storage.readResponse(cacheKey)

    if (!cachedEntry) {
      return
    }

    const cacheControl = response.headers.get('cache-control')
    let newExpirationTime = Date.now()

    const maxAgeMatch = cacheControl?.match(/max-age=(\d+)/)
    if (maxAgeMatch) {
      const maxAge = parseInt(maxAgeMatch[1], 10)
      newExpirationTime += maxAge * MILLIS_PER_SECOND
    } else {
      const expiresHeader = response.headers.get('expires')
      if (expiresHeader) {
        const expiresTime = new Date(expiresHeader).getTime()
        newExpirationTime = expiresTime
      } else {
        // If no explicit expiration, add a default (1 hour)
        newExpirationTime += 3600 * MILLIS_PER_SECOND
      }
    }

    const updatedEntry: CacheEntry = {
      ...cachedEntry,
      expirationMillis: newExpirationTime,
    }

    response.headers.forEach((value, key) => {
      if (!['content-length', 'content-encoding'].includes(key.toLowerCase())) {
        updatedEntry.response.headers[key] = value
      }
    })

    await storage.writeResponse(cacheKey, updatedEntry)
  }

  const invalidateCachedResponses = async (url: string): Promise<void> => {
    // For now, just remove the exact URL
    const cacheKey = _getCacheKey(url)
    await storage.deleteResponse(cacheKey)
  }

  const cleanCache = async (): Promise<void> => {
    await storage.cleanCache()
  }
  return {
    isCacheableResponse,
    getCachedResponse,
    writeResponse,
    isStaleResponse,
    updateCachedResponseExpiration,
    invalidateCachedResponses,
    internalStoragePath,
    cleanCache,
  }
}

export type {
  HttpCache,
}

export {
  createHttpCache,
}
