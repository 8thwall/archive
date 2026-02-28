// @attr[](data = ":fetch-worker")
// @dep(//bzl/js:fetch)
// @package(npm-rendering)

/* eslint-disable max-classes-per-file */
import {Worker} from 'worker_threads'

import path from 'path'

import {resolveObjectURL} from 'node:buffer'

import {errors} from 'undici'

import type {
  BodyInit,
  Headers,
  Request,
  Response,
  RequestInfo,
  RequestInit,
  ResponseInit,
} from 'undici-types'

import {
  createSerializableRequest,
} from '@nia/c8/dom/sync-fetch/sync-fetch-serialization'

import type {HttpCache} from './http-cache/http-cache'

type RequestCallbacks = {
  resolve: (value: Response | PromiseLike<Response>) => void,
  reject: (reason?: any) => void,
  abortSignal?: {signal: AbortSignal, signalHandler: () => void},
}
type RequestMap = Map<number, RequestCallbacks>

type FetchFn = ReturnType<typeof createFetchWithDefaultBase>['fetchWithDefaultBase']

type NaeBuildMode = 'static' | 'hot-reload'

type FetchWorkerData = {
  internalStoragePath?: string,
  naeBuildMode?: NaeBuildMode,
  appUrl?: string,
}

const global = globalThis as any
const builtIn = {
  Headers: global.Headers as typeof Headers,
  Request: global.Request as typeof Request,
  Response: global.Response as typeof Response,
}

const builtinHeaders = builtIn.Headers

const constructResponseObject = (response: any): Response => {
  const res = new builtIn.Response(response.arrayBuffer, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  })
  Object.defineProperty(res, 'url', {value: response.url})
  return res
}

const initializeWorker = (requestMap: RequestMap, workerPath?: string,
  cache?: HttpCache, data?: any): Worker => {
  const runfilesDir = process?.env.RUNFILES_DIR ?? global.__niaRunfilesDir
  const fetchWorkerPath = workerPath || path.join(runfilesDir, '_main/c8/dom/fetch-worker.js')
  const cachePath = cache ? cache.internalStoragePath : 'no-cache'
  const workerData = {cachePath, ...data}
  const fetchWorker = new Worker(fetchWorkerPath, {workerData})

  fetchWorker.on('message', (msg) => {
    const request = requestMap.get(msg.requestId)
    if (request) {
      const {resolve, reject, abortSignal} = request
      requestMap.delete(msg.requestId)
      if (abortSignal) {
        const {signal, signalHandler} = abortSignal
        signal.removeEventListener('abort', signalHandler)
      }
      if (msg.errorName) {
        const error = new Error(msg.errorMessage)
        error.name = msg.errorName
        error.stack = msg.stack
        reject(error)
      } else {
        resolve(constructResponseObject(msg))
      }
    }
  })

  fetchWorker.on('error', (error) => {
    requestMap.forEach(req => req.reject(error))
    requestMap.clear()
  })

  fetchWorker.on('exit', (code) => {
    if (code !== 0) {
      const error = new Error(`Worker stopped with exit code ${code}`)
      requestMap.forEach(req => req.reject(error))
      requestMap.clear()
    }
  })

  return fetchWorker
}

type URLType = typeof URL
const createUrlClass = (
  defaultBaseUrl?: string
) => class URLWithDefaultBase extends URL {
  constructor(url: string, base?: string) {
    super(url, base || defaultBaseUrl || undefined)
  }
}

const createRequestClass = (
  URL: URLType
) => class RequestWithDefaultBase extends builtIn.Request {
  constructor(input: RequestInfo, init?: RequestInit) {
    let req = input
    if (req instanceof URL) {
      req = req.href
    }
    if (typeof req === 'string') {
      super(new URL(req).href, init)
    } else {
      super(req, init)
    }
  }
}

const getRequestInfoUrl = (URL: URLType, info: RequestInfo): URL => {
  if (info instanceof URL) {
    return new URL(info.href)
  } else if (typeof info === 'string') {
    return new URL(info)
  } else {
    // Type is Request
    return new URL(info.url)
  }
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

const createFetchWithDefaultBase = (URL: URLType, fetchWorkerPath?: string,
  cache?: HttpCache, workerData?: FetchWorkerData) => {
  let requestId = 0
  const requestMap: RequestMap = new Map()
  const fetchWorker = initializeWorker(requestMap, fetchWorkerPath, cache, workerData)

  const fetchWithDefaultBase = async (input: RequestInfo, init?: RequestInit):
  Promise<Response> => new Promise((resolve, reject) => {
    const url = getRequestInfoUrl(URL, input)
    const {protocol, href, pathname} = url
    const signal = init?.signal
    let abortSignal

    // NOTE(akashmahesh): blob needs to be resolved, sending data to worker isn't performant.
    if (protocol === 'blob:') {
      const resolvedBlob = resolveObjectURL(href)
      resolve(new ResponseWithDefaultBase(resolvedBlob))
    } else {
      const isRequest = input instanceof builtIn.Request
      requestId++

      if (signal) {
        const signalHandler = () => {
          requestMap.delete(requestId)
          reject(new errors.RequestAbortedError())
        }
        signal.addEventListener('abort', signalHandler)
        abortSignal = {signal, signalHandler}
      }

      // TODO(akashmahesh): handle case for other untransferable init types
      const msgData = {
        protocol,
        href,
        pathname,
        input: isRequest ? createSerializableRequest(input) : href,
        init: signal ? undefined : init,
        requestId,
      }

      requestMap.set(requestId, {resolve, reject, abortSignal})
      fetchWorker!.postMessage(msgData)
    }
  })

  return {
    fetchWorker,
    fetchWithDefaultBase,
    dispose() {
      fetchWorker.terminate()
    },
  }
}

export {
  createUrlClass,
  createFetchWithDefaultBase,
  createRequestClass,
  ResponseWithDefaultBase,
  builtinHeaders as Headers,
  FetchFn,
  NaeBuildMode,
}
