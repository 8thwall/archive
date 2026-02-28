// @sublibrary(:dom-core-lib)
import type {DOMString} from './strings'
import {OffscreenCanvasRenderingContext2D} from './offscreen-canvas-rendering-context-2d'
import {
  WebGLRenderingContext,
  createContext as createWebGLContext,
} from './webgl-rendering-context'
import {
  WebGL2RenderingContext,
  createContext as createWebGL2Context,  // eslint-disable-line @typescript-eslint/no-unused-vars
} from './webgl2-rendering-context'

// Stub types for now.
type ImageBitmapRenderingContext = any
type GPUCanvasContext = any

type OffscreenRenderingContext = OffscreenCanvasRenderingContext2D
  | ImageBitmapRenderingContext
  | WebGLRenderingContext
  | WebGL2RenderingContext
  | GPUCanvasContext

type ImageEncodeOptions = {
  type: DOMString
  quality: number
};

type OffscreenRenderingContextId = '2d' | 'bitmaprenderer' | 'webgl' | 'webgl2' | 'webgpu'

class OffscreenCanvas extends EventTarget {
  width: number = 300

  height: number = 150

  oncontextlost: ((ev: Event) => any) | null = null

  oncontextrestored: ((ev: Event) => any) | null = null

  private _context: OffscreenRenderingContext | null = null

  private _contextType: DOMString | null = null

  constructor(width: number, height: number) {
    super()
    this.width = width
    this.height = height
  }

  /* eslint-disable no-dupe-class-members */
  getContext(contextId: '2d', options?: any): OffscreenCanvasRenderingContext2D | null

  getContext(contextId: 'webgl', options?: any): WebGLRenderingContext | null

  getContext(contextId: 'webgl2', options?: any): WebGL2RenderingContext | null

  getContext(contextId: 'bitmaprenderer', options?: any): ImageBitmapRenderingContext | null

  getContext(contextId: 'webgpu', options?: any): GPUCanvasContext | null

  getContext(
    contextId: OffscreenRenderingContextId,
    options?: any
  ): OffscreenRenderingContext | null {
    if (this._context) {
      if (contextId === this._contextType) {
        return this._context
      } else {
        return null
      }
    }

    switch (contextId) {
      case '2d':
        this._context = new OffscreenCanvasRenderingContext2D(this)
        break
      case 'webgl':
        this._context = createWebGLContext(this.width, this.height, options || {})
        break
      case 'webgl2':
        // webgl2 not fully implemented, uncomment following line to enable webgl2.
        this._context = createWebGL2Context(this.width, this.height, options || {})
        break
      case 'bitmaprenderer':
        // bitmaprenderer not implemented.
        break
      case 'webgpu':
        // webgpu not implemented.
        break
      default:
        break
    }

    if (this._context) {
      this._contextType = contextId
      Object.defineProperty(this._context, 'canvas', {
        enumerable: true,
        writable: false,
        value: this,
        configurable: false,
      })
    }

    return this._context
  }
  /* eslint-enable no-dupe-class-members */

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  convertToBlob(options?: ImageEncodeOptions): void {
    throw new Error('toBlob is not implemented')
  }
}

Object.defineProperty(OffscreenCanvas.prototype.constructor, 'name', {
  value: 'OffscreenCanvas',
})

export {OffscreenCanvas}
