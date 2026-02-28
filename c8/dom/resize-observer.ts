// @sublibrary(:dom-core-lib)
import type {Element} from './element'

type ResizeObserverSize = {
  readonly inlineSize: number;
  readonly blockSize: number;
}

// TODO(akashmahesh): Implement this type properly according to the spec.
// eslint-disable-next-line local-rules/acronym-capitalization
type DOMRectReadOnly = any

type ResizeObserverEntry = {
  readonly target: Element
  readonly contentRect: DOMRectReadOnly
  readonly borderBoxSize: ReadonlyArray<ResizeObserverSize>
  readonly contentBoxSize: ReadonlyArray<ResizeObserverSize>
  readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>
}

type ResizeObserverCallback = (
  entries: ReadonlyArray<ResizeObserverEntry>,
  observer: ResizeObserver
) => void

type ResizeObserverOptions = {
  box?: 'content-box' | 'border-box' | 'device-pixel-content-box'
}

// NOTE(akashmahesh): The ResizeObserver is an API for observing changes to Element’s size.
// See spec (https://www.w3.org/TR/resize-observer/) for more details.
class ResizeObserver {
  // eslint-disable-next-line no-unused-vars
  private _callback: ResizeObserverCallback

  private _observedElements: WeakMap<Element, { options?: ResizeObserverOptions }> | null

  constructor(callback: ResizeObserverCallback) {
    if (typeof callback !== 'function') {
      throw new TypeError('ResizeObserver callback must be a function')
    }

    this._callback = callback
    this._observedElements = new WeakMap()
  }

  observe(target: Element, options?: ResizeObserverOptions): void {
    if (this._observedElements === null) {
      this._observedElements = new WeakMap()
    }

    this._observedElements.set(target, {options})

    // TODO(akashmahesh): Implement the logic to observe the target element
  }

  unobserve(target: Element): void {
    if (this._observedElements?.get(target) === undefined) {
      return
    }

    this._observedElements.delete(target)
  }

  disconnect(): void {
    this._observedElements = null
  }
}

export {
  ResizeObserver,
  ResizeObserverEntry,
  ResizeObserverSize,
  ResizeObserverOptions,
  ResizeObserverCallback,
}
