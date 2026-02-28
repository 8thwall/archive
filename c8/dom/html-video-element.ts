// @sublibrary(:dom-core-lib)
import {HTMLMediaElement} from './html-media-element'
import {throwIllegalConstructor} from './exception'

import type {Document} from './document'
import {DOMException} from './dom-exception'

let inFactory = false

class HTMLVideoElement extends HTMLMediaElement {
  _paused: boolean = false

  private _abortController: AbortController | null = null

  constructor(ownerDocument: Document) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, 'video')
  }

  _video?: any | null = null  // Not marked as private, as friend to CanvasRenderingContext2d.

  get videoWidth(): number {
    return this._video ? this._video.width : 0
  }

  get videoHeight(): number {
    return this._video ? this._video.height : 0
  }

  get width(): number {
    const attr = this.getAttribute('width')
    if (attr === null) {
      return this.videoWidth
    } else {
      return +attr
    }
  }

  set width(value: number | string) {
    this.setAttribute('width', String(Number(value)))
  }

  get height(): number {
    const attr = this.getAttribute('height')
    if (attr === null) {
      return this.videoHeight
    } else {
      return +attr
    }
  }

  set height(value: number | string) {
    this.setAttribute('height', String(Number(value)))
  }

  get src() {
    return super.src
  }

  set src(value: string) {
    super.src = value

    // Abort all previous load requests
    this._abortController?.abort()
    this._abortController = null
  }

  throwAbortError = (signal: AbortSignal) => {
    if (signal.aborted) {
      throw new DOMException('The operation was aborted.', 'AbortError')
    }
  }

  // TODO(yuyan): implement fetch
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadVideoAsync = async (url: string) => {
    try {
      // Dispatch the canplaythrough event when done loading
      this.dispatchEvent(new Event('canplaythrough'))
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw error
      }
    }
  }

  finishedCallback = () => {
    if (this.loop) {
      this.play()
    } else {
      this._paused = true
      this.dispatchEvent(new Event('ended'))
    }
  }

  play(): Promise<void> {
    this._paused = false
    this.dispatchEvent(new Event('play'))
    return Promise.resolve()
  }

  load() {
    // Abort all previous load requests
    this._abortController?.abort()
    this._abortController = null

    // const src = this.getAttribute('src')
  }

  pause() {
    this._paused = true
    this.dispatchEvent(new Event('pause'))
  }
}

const createHTMLVideoElement = (ownerDocument: Document): HTMLVideoElement => {
  inFactory = true
  try {
    return new HTMLVideoElement(ownerDocument)
  } finally {
    inFactory = false
  }
}

export {HTMLVideoElement, createHTMLVideoElement}
