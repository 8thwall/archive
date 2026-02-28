// @sublibrary(:dom-core-lib)
import type {
  ErrorEvent,
  MessageEvent,
} from './dom-events'

import {createEventHandlerIdlAttribute} from './events-internal'

type MakeNullable<T> = {
  [K in keyof T]: T[K] | null
}

const workerEventHandlerNames = ['onmessage', 'onmessageerror', 'onerror'] as const

type WorkerEventHandlers = MakeNullable<{
  onmessage: (ev: MessageEvent) => any
  onmessageerror: (ev: MessageEvent) => any
  onerror: (ev: ErrorEvent) => any
}>

const mixinWorkerEventHandlers = <T extends WorkerEventHandlers>(proto: T) => {
  workerEventHandlerNames.forEach((name) => {
    Object.defineProperty(proto, name, createEventHandlerIdlAttribute(name))
  })
}

export {WorkerEventHandlers, mixinWorkerEventHandlers, workerEventHandlerNames}
