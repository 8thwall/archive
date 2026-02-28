// @sublibrary(:dom-core-lib)
import type {
  BeforeUnloadEvent,
  HashChangeEvent,
  MessageEvent,
  PageTransitionEvent,
  PopStateEvent,
  PromiseRejectionEvent,
  StorageEvent,
} from './dom-events'

import {createEventHandlerIdlAttribute} from './events-internal'
import {windowEventHandlerNames} from './window-event-handler-names'

type MakeNullable<T> = {
  [K in keyof T]: T[K] | null
}

type WindowEventHandlers = MakeNullable<{
  onafterprint: (ev: Event) => any
  onbeforeprint: (ev: Event) => any
  onbeforeunload: (ev: BeforeUnloadEvent) => any
  onhashchange: (ev: HashChangeEvent) => any
  onlanguagechange: (ev: Event) => any
  onmessage: (ev: MessageEvent) => any
  onmessageerror: (ev: MessageEvent) => any
  onoffline: (ev: Event) => any
  ononline: (ev: Event) => any
  onpagehide: (ev: PageTransitionEvent) => any
  onpageshow: (ev: PageTransitionEvent) => any
  onpopstate: (ev: PopStateEvent) => any
  onrejectionhandled: (ev: PromiseRejectionEvent) => any
  onstorage: (ev: StorageEvent) => any
  onunhandledrejection: (ev: PromiseRejectionEvent) => any
  onunload: (ev: Event) => any
}>

const mixinWindowEventHandlers = <T extends WindowEventHandlers>(proto: T) => {
  windowEventHandlerNames.forEach((name) => {
    Object.defineProperty(proto, name, createEventHandlerIdlAttribute(name))
  })
}

export {
  WindowEventHandlers,
  mixinWindowEventHandlers,
}
