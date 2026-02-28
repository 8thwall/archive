// @attr(target = "node")
// @attr(esnext = 1)
// @package(npm-rendering)

import path from 'path'
import vm from 'vm'
import fs from 'fs'
import {webcrypto as crypto} from 'node:crypto'

import {
  createFetchWithDefaultBase,
  createRequestClass,
  createUrlClass,
  ResponseWithDefaultBase,
  Headers,
  NaeBuildMode,
} from '@nia/c8/dom/fetch-overload'

import * as ImageDecodingAddon from '@nia/c8/dom/image-decoding/image-decoding'
import {createXmlHttpRequestClass} from '@nia/c8/dom/xml-http-request'
import {createHttpCache} from '@nia/c8/dom/http-cache/http-cache'

const fetchScriptData = async (pathname: string): Promise<string> => {
  try {
    const fetchScriptFile = await fs.promises.readFile(pathname)
    return fetchScriptFile.toString()
  } catch (e) {
    console.error(`Error fetching script: ${e}`)  // eslint-disable-line no-console
    throw e
  }
}

interface ContextOptions {
  url?: string
  width?: number
  height?: number
  title?: string
  context?: object
  cookie?: string
  internalStoragePath?: string
  fetchWorkerPath?: string
  naeBuildMode?: NaeBuildMode
}

const createVMContext = <S, T extends ContextOptions>(
  options: T
): S & vm.Context => {
  const userOptions = options.context || {}

  const runfilesDir = process.env.RUNFILES_DIR || path.join(__dirname, '{label}.runfiles')

  const URLWithDefaultBase = createUrlClass(options.url)
  const RequestWithDefaultBase = createRequestClass(URLWithDefaultBase)
  const {fetchWorker, fetchWithDefaultBase} = createFetchWithDefaultBase(
    URLWithDefaultBase,
    options.fetchWorkerPath,
    options.internalStoragePath ? createHttpCache(options.internalStoragePath) : undefined,
    {
      internalStoragePath: options.internalStoragePath,
      naeBuildMode: options.naeBuildMode,
      appUrl: options.url,
    }
  )

  // Minimal shim for XMLHttpRequest to support subset used in webgl conformance tests.
  const XMLHttpRequest = createXmlHttpRequestClass(
    URLWithDefaultBase, fetchWithDefaultBase, fs
  )

  return vm.createContext({
    ...userOptions,
    __niaInternalStoragePath: options.internalStoragePath,
    __niaRunfilesDir: runfilesDir,
    __niaNodeVersion: process.version,
    __niaImageDecoding: ImageDecodingAddon,
    console,
    performance,
    TextEncoder,
    TextDecoder,
    EventTarget,
    Event,
    URL: URLWithDefaultBase,
    URLSearchParams,
    fetch: fetchWithDefaultBase,
    fetchWorker,
    Request: RequestWithDefaultBase,
    Response: ResponseWithDefaultBase,
    Headers,
    AbortController,
    Array,
    ArrayBuffer,
    Buffer,
    DataView,
    Date,
    Error,
    TypeError,
    RangeError,
    Float32Array,
    Float64Array,
    Int8Array,
    Int16Array,
    Int32Array,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Uint8ClampedArray,
    Map,
    Number,
    Object,
    Promise,
    RegExp,
    Set,
    String,
    Symbol,
    WeakMap,
    WeakSet,
    XMLHttpRequest,
    JSON,
    setTimeout,
    setInterval,
    clearInterval,
    clearTimeout,
    structuredClone: globalThis.structuredClone || null,
    crypto,
    vm,
  }) as S & vm.Context
}

export {createVMContext, fetchScriptData, ContextOptions}
