// @sublibrary(:dom-core-lib)
import {Blob} from 'node:buffer'

import type {XMLHttpRequest} from './xml-http-request.d'

import {DOMException} from './dom-exception'

type ExposedOnAll = {
  readonly URL: typeof URL

  readonly URLSearchParams: typeof URLSearchParams

  readonly Blob: typeof Blob

  readonly console: typeof console

  readonly performance: typeof performance

  readonly TextEncoder: typeof TextEncoder

  readonly TextDecoder: typeof TextDecoder

  readonly EventTarget: typeof EventTarget

  readonly XMLHttpRequest: typeof XMLHttpRequest

  readonly DOMException: typeof DOMException

  readonly AbortController: typeof AbortController

  readonly Event: typeof Event
}

const mixinExposedOnAll = <T extends ExposedOnAll>(proto: T) => {
  // Add all of the other DOM classes to the window.
  Object.defineProperties(proto, {
    URL: {
      value: URL,
    },
    URLSearchParams: {
      value: URLSearchParams,
    },
    Blob: {
      value: Blob,
    },
    console: {
      value: console,
    },
    performance: {
      value: performance,
    },
    TextEncoder: {
      value: TextEncoder,
    },
    TextDecoder: {
      value: TextDecoder,
    },
    EventTarget: {
      value: EventTarget,
    },
    DOMException: {
      value: DOMException,
    },
    AbortController: {
      value: AbortController,
    },
    Event: {
      value: Event,
    },
  })
}

export {ExposedOnAll, mixinExposedOnAll}
