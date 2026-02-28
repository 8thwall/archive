// @sublibrary(:dom-core-lib)
import type {
  fetch,
  Headers,
  Request,
  Response,
} from 'undici-types'

import type {
  ImageBitmap,
  ImageBitmapOptions,
  ImageBitmapSource,
} from './image-bitmap'

import type {DOMString, USVString} from './strings'

import type {OffscreenCanvas} from './offscreen-canvas'

const global = globalThis as any
const builtIn = {
  fetch: global.fetch as typeof fetch,
  Headers: global.Headers as typeof Headers,
  Request: global.Request as typeof Request,
  Response: global.Response as typeof Response,
}

type TimerHandler = (...args: any[]) => void

type Transferable = OffscreenCanvas | ImageBitmap | ArrayBuffer
// Also:
// MessagePort | MediaSourceHandle | ReadableStream | WritableStream |
// TransformStream | VideoFrame | */ ArrayBuffer

interface StructuredSerializeOptions {
  transfer?: Transferable[];
}

interface WindowOrWorkerGlobalScope {
  readonly origin: USVString
  readonly isSecureContext: boolean
  readonly crossOriginIsolated: boolean

  reportError(e: any): void

  btoa(data: DOMString): DOMString
  atob(data: DOMString): string

  setTimeout(handler: TimerHandler, timeout?: number, ...args: any[]): number
  setInterval(handler: TimerHandler, timeout?: number, ...args: any[]): number
  clearInterval(id: number): void
  clearTimeout(id: number): void

  // Not implemented:
  // queueMicrotask(callback: VoidFunction) => void): void

  createImageBitmap(
    image: ImageBitmapSource, options?: ImageBitmapOptions): Promise<ImageBitmap>

  createImageBitmap(
    image: ImageBitmapSource,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    options?: ImageBitmapOptions,
  ): Promise<ImageBitmap>

  structuredClone<T = any>(value: T, options?: StructuredSerializeOptions): T

  readonly fetch: typeof fetch
  readonly Headers: typeof Headers
  readonly Request: typeof Request
  readonly Response: typeof Response
}

const mixinWindowOrWorkerGlobalScope = <T extends WindowOrWorkerGlobalScope>(proto: T) => {
  Object.defineProperties(proto, {
    origin: {enumerable: true, value: null},
    isSecureContext: {enumerable: true, value: false},
    crossOriginIsolated: {enumerable: true, value: false},
  })

  proto.reportError = function reportError(e: any): void {
    throw e
  }

  proto.btoa = function btoa(data: DOMString): DOMString {
    return Buffer.from(data, 'binary').toString('base64')
  }

  proto.atob = function atob(data: DOMString): string {
    return Buffer.from(data, 'base64').toString('binary')
  }

  const {
    setTimeout: setTimeoutF,
    setInterval: setIntervalF,
    clearInterval: clearIntervalF,
    clearTimeout: clearTimeoutF,
  } = globalThis

  const structuredCloneF = globalThis.structuredClone || null

  proto.setTimeout = function setTimeout(
    handler: TimerHandler, timeout?: number, ...args: any[]
  ): number {
    // Use + to convert to number, as Symbol.toPrimitive is defined for Node Timer.
    return +setTimeoutF(handler, timeout, ...args)
  }

  proto.setInterval = function setInterval(
    handler: TimerHandler, timeout?: number, ...args: any[]
  ): number {
    // Use + to convert to number, as Symbol.toPrimitive is defined for Node Timer.
    return +setIntervalF(handler, timeout, ...args)
  }

  proto.clearInterval = function clearInterval(id: number): void {
    return clearIntervalF(id)
  }

  proto.clearTimeout = function clearTimeout(id: number): void {
    return clearTimeoutF(id)
  }

  // TODO(lreyna): Update ImageBitmap to use native graphics API
  // Many Web APIs will prioritize using ImageBitmaps, but using ImageJs is too slow.
  // Disable this for now, so our NativeImage implmenetation in `raw-image.ts` is used.

  // eslint-disable-next-line max-len
  // See the Chromium Implementation: https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/imagebitmap/image_bitmap.cc

  // proto.createImageBitmap = function createImageBitmap(
  //   image: ImageBitmapSource,
  //   sxOrOptions?: number | ImageBitmapOptions,
  //   sy?: number,
  //   sw?: number,
  //   sh?: number,
  //   options?: ImageBitmapOptions
  // ): Promise<ImageBitmap> {
  //   if (typeof sxOrOptions === 'number') {
  //     return createImageBitmapImpl(
  //       image, sxOrOptions, sy!, sw!, sh!, options as ImageBitmapOptions
  //     )
  //   } else {
  //     return createImageBitmapImpl(image, sxOrOptions as ImageBitmapOptions)
  //   }
  // }

  if (structuredCloneF) {
    proto.structuredClone = function structuredClone<K = any>(
      value: K,
      options?: StructuredSerializeOptions
    ): K {
      return structuredCloneF(value, options as any)
    }
  } else {
    proto.structuredClone = function structuredClone<K = any>(
      value: K,
      options?: StructuredSerializeOptions  // eslint-disable-line @typescript-eslint/no-unused-vars
    ): K {
      console.log('(debug) Using JSON for structuredClone')  // eslint-disable-line no-console
      return JSON.parse(JSON.stringify(value))
    }
  }

  Object.defineProperties(proto, {
    fetch: {value: builtIn.fetch},
    Headers: {value: builtIn.Headers},
    Request: {value: builtIn.Request},
    Response: {value: builtIn.Response},
  })
}

export {WindowOrWorkerGlobalScope, mixinWindowOrWorkerGlobalScope, Transferable}
