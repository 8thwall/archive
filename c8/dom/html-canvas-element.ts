// @sublibrary(:dom-core-lib)
import type {DOMString, USVString} from './strings'
import {DOMRect} from './dom-rect'
import {HTMLElement} from './html-element'
import type {Document} from './document'
import {CanvasRenderingContext2D} from './canvas-rendering-context-2d'
import {throwIllegalConstructor} from './exception'
import type {OffscreenCanvas} from './offscreen-canvas'
import {
  WebGLRenderingContext,
  createContext as createWebGLContext,
} from './webgl-rendering-context'
import {
  WebGL2RenderingContext,
  createContext as createWebGL2Context,
} from './webgl2-rendering-context'
import {createImage, createImageFromData, ImageKind} from './raw-image'
import {addAttributeChangeSteps} from './attribute-change-steps'
import {nodeDocument, kids} from './node-internal'

// Stub types for now.
type ImageBitmapRenderingContext = any
type GPUCanvasContext = any

type RenderingContext = CanvasRenderingContext2D
  | ImageBitmapRenderingContext
  | WebGLRenderingContext
  | WebGL2RenderingContext
  | GPUCanvasContext

type BlobCallback = (blob?: Blob) => void;

let inFactory = false

class HTMLCanvasElement extends HTMLElement {
  private _context: RenderingContext | null = null

  private _contextType: DOMString | null = null

  constructor(ownerDocument: Document) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, 'canvas')

    addAttributeChangeSteps(this, (
      element: HTMLCanvasElement,
      localName: string,
      oldValue: string | null,
      value: string | null,
      namespace: string | null
    ): void => {
      // If namespace is not null, then return.
      if (namespace !== null) {
        return
      }
      if ((localName === 'width' || localName === 'height') && oldValue !== value) {
        element.resetIfNeeded()
      }
    })
  }

  private resetIfNeeded() {
    // When the user agent is to set bitmap dimensions to width and height, it must run these steps:
    // 1. Reset the rendering context to its default state.
    // [NOT IMPLEMENTED]

    // 2. Resize the output bitmap to the new width and height.
    if (this._context && this._contextType === '2d') {
      this._context._image = createImage(this.width, this.height)
    }
    // Handle other contexts here
  }

  /* eslint-disable no-dupe-class-members */
  getContext(contextId: '2d', options?: any): CanvasRenderingContext2D | null

  getContext(contextId: 'webgl', options?: any): WebGLRenderingContext | null

  getContext(contextId: 'webgl2', options?: any): WebGL2RenderingContext | null

  getContext(contextId: 'bitmaprenderer', options?: any): ImageBitmapRenderingContext | null

  getContext(contextId: 'webgpu', options?: any): GPUCanvasContext | null

  getContext(contextId: DOMString, options?: any): RenderingContext | null {
    if (this._context) {
      if (contextId === this._contextType) {
        return this._context
      } else {
        return null
      }
    }

    const contextOptions = options || {}

    // TODO(mc): Improve and encapsulate this logic. For now, if a nativeWindow parameter is
    // set at the global scope, render into it for webgl contexts.
    const nativeWindow = (globalThis as any)?.nativeWindow
    if (nativeWindow && !options?.nativeWindow) {
      contextOptions.nativeWindow = (globalThis as any)?.nativeWindow
    }

    switch (contextId) {
      case '2d':
        this._context = new CanvasRenderingContext2D(this)
        break
      case 'webgl':
        this._context = createWebGLContext(this.width, this.height, contextOptions)
        this._context.makeXRCompatible = async () => {
          // eslint-disable-next-line no-console
          console.warn('makeXRCompatible is not implemented')
        }
        break
      case 'webgl2':
        // webgl2 not fully implemented, uncomment following line to enable webgl2.
        this._context = createWebGL2Context(this.width, this.height, contextOptions)
        this._context.makeXRCompatible = async () => {
          // eslint-disable-next-line no-console
          console.warn('makeXRCompatible is not implemented')
        }
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toDataURL(type: DOMString = 'image/png', _quality?: any): USVString {
    if (this._context && (this._contextType === 'webgl' || this._contextType === 'webgl2')) {
      // Read the pixels from the WebGL context.
      const pixels = new Uint8Array(this.width * this.height * 4)
      this._context.readPixels(
        0, 0, this.width, this.height, this._context.RGBA, this._context.UNSIGNED_BYTE, pixels
      )

      const image =
        createImageFromData(this.width, this.height, pixels, {kind: ImageKind.RGBA})
      return image.toDataURL(type)
    } else if (this._context && this._contextType === '2d') {
      return this._context._image.toDataURL(type)
    }
    throw new Error(`toDataURL is not implemented for context type ${this._contextType}`)
  }

  getBoundingClientRect(): DOMRect {
    return new DOMRect(0, 0, this.clientWidth, this.clientHeight)
  }

  // NOTE(lreyna): These calculations don't take CSS or scroll bars into account.
  get clientWidth(): number {
    return Math.floor(this.width / (globalThis as any).window.devicePixelRatio)
  }

  get clientHeight(): number {
    return Math.floor(this.height / (globalThis as any).window.devicePixelRatio)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  toBlob(callback: BlobCallback, type: DOMString = 'image/png', quality?: any): void {
    throw new Error('toBlob is not implemented')
  }

  // eslint-disable-next-line class-methods-use-this
  transferControlToOffscreen(): OffscreenCanvas {
    throw new Error('transferControlToOffscreen is not implemented')
  }

  get width(): number {
    const value = parseInt(this.getAttribute('width')!, 10)
    return Number.isNaN(value) || value < 0 ? 300 : value
  }

  set width(value: number) {
    this.setAttribute('width', value.toString())
  }

  get height(): number {
    const value = parseInt(this.getAttribute('height')!, 10)
    return Number.isNaN(value) || value < 0 ? 150 : value
  }

  set height(value: number) {
    this.setAttribute('height', value.toString())
  }

  cloneNode(deep?: boolean): HTMLCanvasElement {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const clone = createHTMLCanvasElement(nodeDocument(this))

    // Copy attributes
    for (const attr of this._attributes) {
      clone.setAttribute(attr.name, attr.value)
    }

    const myKids = kids(this)
    if (deep) {
      for (let i = 0; i < myKids.length; i++) {
        const child = myKids[i]
        if (child) {
          clone.appendChild(child.cloneNode(true))
        }
      }
    }

    return clone
  }
}

Object.defineProperty(HTMLCanvasElement.prototype.constructor, 'name', {
  value: 'HTMLCanvasElement',
})

const createHTMLCanvasElement = (ownerDocument: Document): HTMLCanvasElement => {
  inFactory = true
  try {
    return new HTMLCanvasElement(ownerDocument)
  } finally {
    inFactory = false
  }
}

export {HTMLCanvasElement, RenderingContext, BlobCallback, createHTMLCanvasElement}
