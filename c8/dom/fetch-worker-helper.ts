// @package(npm-rendering)

import fs from 'fs'
import path from 'path'

import {workerData} from 'worker_threads'

import {setGlobalDispatcher, Agent} from 'undici'

import type {
  fetch,
  BodyInit,
  Headers,
  Request,
  Response,
  RequestInfo,
  RequestInit,
  ResponseInit,
} from 'undici-types'

import {type HttpCache, createHttpCache} from '@nia/c8/dom/http-cache/http-cache'

const global = globalThis as any
const builtIn = {
  Headers: global.Headers as typeof Headers,
  Request: global.Request as typeof Request,
  Response: global.Response as typeof Response,
}

const mimeTypeMap: Record<string, string> = {
  '.txt': 'text/plain',
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.zip': 'application/zip',
  // Add more file extensions and corresponding mime types as needed
}

type MsgData = {
  protocol?: string
  href?: string
  pathname?: string
  input?: any
  init?: any
  requestId?: number
}

type WorkerLogs = {
  callCount: number
  requestsLog: MsgData[]
  testCase: string
}

const getStoredCommitId = async (): Promise<string | undefined> => {
  if (!workerData.internalStoragePath) {
    return undefined
  }

  const metadataPath = path.join(workerData.internalStoragePath, 'metadata.json')
  try {
    const metadata = await fs.promises.readFile(metadataPath, 'utf-8')
    const parsedMetadata = JSON.parse(metadata)
    return parsedMetadata.commitId
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetch-worker-helper] Error reading metadata.json:', error)
    return undefined
  }
}

const writeStoredCommitId = async (commitId: string): Promise<void> => {
  if (!workerData.internalStoragePath) {
    return
  }

  const metadataPath = path.join(workerData.internalStoragePath, 'metadata.json')
  try {
    const metadata = await fs.promises.readFile(metadataPath, 'utf-8')
    const parsedMetadata = JSON.parse(metadata)
    parsedMetadata.commitId = commitId
    await fs.promises.writeFile(metadataPath, JSON.stringify(parsedMetadata, null, 2))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetch-worker-helper] Error writing metadata.json:', error)
  }
}

// NOTE(akashmahesh): The stored commitId is read from the metadata.json file in the app files.
// The currCommitId is parsed from the appUrl at runtime and represents the current state of the
// studio project. If there is a mismatch, we know that the prod studio url has changed since the
// app was built.
let _storedCommitId: string | undefined
let _currCommitId = ''

getStoredCommitId().then((commitId) => {
  _storedCommitId = commitId
})

const updateCurrCommitId = (commitId: string) => {
  _currCommitId = commitId
}

const getMimeType = (filename: string): string => {
  const extension = path.extname(filename)
  return mimeTypeMap[extension] || 'application/octet-stream'
}
class ResponseWithDefaultBase extends builtIn.Response {
  constructor(body?: BodyInit, init?: ResponseInit) {
    super(body, init)
    if (body?.constructor.name === 'Blob' && this.url === '') {
      Object.defineProperty(this, 'url', {
        value: 'about:blank',
      })
    }
  }
}

const builtInFetch: typeof fetch = (...args) => {
  const dispatcher = new Agent({
    connections: 6,
    keepAliveTimeout: 300_000,
    keepAliveMaxTimeout: 300_000,
    maxHeaderSize: 256 * 1024,
    connect: {
      timeout: 30_000,
    },
  })
  setGlobalDispatcher(dispatcher)

  return global.fetch(...args)
}

const workerFetch = async (
  protocol: string,
  href: string,
  pathname: string,
  input: RequestInfo,
  init: RequestInit,
  globalCache?: HttpCache
): Promise<Response> => {
  if (protocol === 'file:') {
    const file = pathname
    return new ResponseWithDefaultBase(fs.createReadStream(file), {
      headers: {'Content-Type': getMimeType(file)},
    })
  } else if (href.startsWith('data:application/octet-stream;base64,')) {
    // TODO: Support more mime types that are not application/octet-stream
    const nodeVersion = (global.__niaNodeVersion || process.version)
    const nodeMajorVersion = parseInt(nodeVersion.match(/v(\d+)\./)?.[1], 10)
    if (nodeMajorVersion < 18) {
      const base64Data = Uint8Array.from(Buffer.from(href.slice(37), 'base64'))

      // default status is 200
      return new ResponseWithDefaultBase(base64Data)
    }

    return builtInFetch(href, init)
  }

  const cachedResponse = globalCache && (await globalCache.getCachedResponse(href, input, init))
  const isHotReload = workerData.naeBuildMode === 'hot-reload'
  const commmitIdChanged = _currCommitId ? _currCommitId !== _storedCommitId : false
  const refreshAssets = isHotReload && commmitIdChanged

  if (!isHotReload && href === workerData.appUrl && !cachedResponse) {
    // eslint-disable-next-line no-console
    console.error('[fetch-worker-helper] We do not have a cachedResponse for workerData.appUrl' +
      ` (${workerData.appUrl}), but we are in static build mode. This is a bug.`)
  }

  if (refreshAssets) {
    globalCache?.cleanCache()
    _storedCommitId = _currCommitId
    writeStoredCommitId(_currCommitId)
  }

  if (cachedResponse) {
    // NOTE(akashmahesh): For static NAE apps, we want to always default to the cached value of
    // the project URL stored at build time to prevent live changes from being reflected.
    if (!isHotReload && href === workerData.appUrl) {
      return cachedResponse
    }

    if (globalCache?.isStaleResponse(cachedResponse)) {
      const validationHeaders = new builtIn.Headers(init?.headers || {})

      const etag = cachedResponse.headers.get('ETag')
      if (etag) {
        validationHeaders.set('If-None-Match', etag)
      }

      const lastModified = cachedResponse.headers.get('Last-Modified')
      if (lastModified) {
        validationHeaders.set('If-Modified-Since', lastModified)
      }

      const validationInit = {
        ...init,
        headers: validationHeaders,
      }

      const requestInput = input instanceof builtIn.Request ? input : href
      let validationResponse: Response
      try {
        validationResponse = await builtInFetch(requestInput, validationInit)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          '[fetch-worker-helper] Error validating cached responsereturning stale response', error
        )
        return cachedResponse
      }

      if (validationResponse.status === 304) {
        await globalCache.updateCachedResponseExpiration(href, cachedResponse)

        const mergedHeaders = new builtIn.Headers(cachedResponse.headers)
        validationResponse.headers.forEach((value, key) => {
          if (!['content-length', 'content-encoding'].includes(key.toLowerCase())) {
            mergedHeaders.set(key, value)
          }
        })

        return new ResponseWithDefaultBase(
          cachedResponse.body,
          {
            status: cachedResponse.status,
            statusText: cachedResponse.statusText,
            headers: mergedHeaders,
          }
        )
      }

      // If server returns a new response, update the cache and return the new response
      if (
        validationResponse.ok &&
        globalCache?.isCacheableResponse(input, validationInit, validationResponse)
      ) {
        await globalCache.writeResponse(href, validationResponse.clone())
      }

      return validationResponse
    }

    return cachedResponse
  }

  // For fresh cache misses, proceed with the original logic
  const requestInfo: RequestInfo = input instanceof builtIn.Request ? input : href
  const response = await builtInFetch(requestInfo, init)

  if (globalCache?.isCacheableResponse(input, init, response)) {
    await globalCache.writeResponse(href, response)
  }

  // Invalidate cached responses for unsafe methods
  if (response.ok && init?.method && !['GET', 'HEAD'].includes(init.method.toUpperCase())) {
    await globalCache?.invalidateCachedResponses(href)
  }

  return response
}

export {
  createHttpCache,
  mimeTypeMap,
  MsgData,
  getMimeType,
  ResponseWithDefaultBase,
  workerFetch,
  WorkerLogs,
  updateCurrCommitId,
}
