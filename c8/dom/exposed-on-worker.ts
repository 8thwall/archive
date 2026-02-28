// @sublibrary(:dom-core-lib)
import {
  ErrorEvent,
  MessageEvent,
} from './dom-events'
import {ImageData} from './image-data'
import {OffscreenCanvas} from './offscreen-canvas'
import {WebGLRenderingContext} from './webgl-rendering-context'
import {WebGL2RenderingContext} from './webgl2-rendering-context'
import {WebAssembly} from './web-assembly'
import {Worker} from './worker'

type ExposedOnWorker = {

  readonly ErrorEvent: typeof ErrorEvent

  readonly MessageEvent: typeof MessageEvent

  readonly OffscreenCanvas: typeof OffscreenCanvas

  readonly ImageData: typeof ImageData

  readonly WebAssembly: typeof WebAssembly

  readonly WebGLRenderingContext: typeof WebGLRenderingContext

  readonly WebGL2RenderingContext: typeof WebGL2RenderingContext

  readonly Worker: typeof Worker
}

const mixinExposedOnWorker = <T extends ExposedOnWorker>(proto: T) => {
  // Add all of the other DOM classes to the window.
  Object.defineProperties(proto, {
    ErrorEvent: {
      value: ErrorEvent,
    },
    MessageEvent: {
      value: MessageEvent,
    },
    OffscreenCanvas: {
      value: OffscreenCanvas,
    },
    ImageData: {
      value: ImageData,
    },
    // When running node in jitless mode (i.e. on iOS), WebAssembly is undefined, so define it.
    ...(typeof (globalThis as any).WebAssembly === 'undefined' ? {
      WebAssembly: {
        value: WebAssembly,
      },
    } : {}),
    WebGLRenderingContext: {
      value: WebGLRenderingContext,
    },
    WebGL2RenderingContext: {
      value: WebGL2RenderingContext,
    },
    Worker: {
      value: Worker,
    },
  })
}

export {ExposedOnWorker, mixinExposedOnWorker}
