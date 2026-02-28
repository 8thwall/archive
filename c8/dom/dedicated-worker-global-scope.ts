// @sublibrary(:dom-core-lib)
import threads from 'node:worker_threads'

import type {Transferable} from './window-or-worker-global-scope'

import {WorkerGlobalScope} from './worker-global-scope'
import {eventTargetSym} from './events-internal'

type TransferOptions = {transfer?: Transferable[]}

class DedicatedWorkerGlobalScope extends WorkerGlobalScope {
  // Should mirror implementation in Worker
  postMessage = (data: any, transferOrOptions?: Transferable[] | TransferOptions) => {
    let transferList: threads.TransferListItem[] | undefined
    if (transferOrOptions) {
      let transfer: Transferable[]

      if (Array.isArray(transferOrOptions)) {
        transfer = transferOrOptions
      } else if (Array.isArray(transferOrOptions?.transfer)) {
        transfer = transferOrOptions.transfer
      } else {
        transfer = []
      }

      // Convert the transfer list to a list of blob objects.
      transferList = transfer.map((item) => {
        if (item instanceof ArrayBuffer) {
          return item
        } else if (item instanceof Blob) {
          return item
        } else {
          throw new TypeError('Invalid transfer item')
        }
      })
    }

    threads.parentPort?.postMessage(data, transferList)
  }

  close = () => {
    this.__nia.closing = true
    threads.parentPort?.close()

    // NOTE: Not spec compliant, but we need to force exit the worker
    this.__nia.processExit()
  }
}

Object.defineProperty(DedicatedWorkerGlobalScope.prototype,
  'DedicatedWorkerGlobalScope', {value: DedicatedWorkerGlobalScope})

// TODO(lreyna): make abstract for supporting SharedWorkerGlobalScope
const createWorkerGlobalContextOnTarget = (
  target: object
): WorkerGlobalScope => {
  const workerGlobal = new DedicatedWorkerGlobalScope()
  Object.getOwnPropertyNames(workerGlobal).forEach((name) => {
    const descriptor = Object.getOwnPropertyDescriptor(workerGlobal, name)!
    if (descriptor.value === workerGlobal) {
      descriptor.value = target
    }
    Object.defineProperty(target, name, descriptor)
  })
  Object.getOwnPropertySymbols(workerGlobal).forEach((symbol) => {
    const descriptor = Object.getOwnPropertyDescriptor(workerGlobal, symbol)!
    if (descriptor.value === workerGlobal) {
      descriptor.value = target
    }
    Object.defineProperty(target, symbol, descriptor)
  })
  Object.setPrototypeOf(target, Object.getPrototypeOf(workerGlobal))

  // Node's globalThis object in a vm context is special, and has a hidden constructor in the
  // prototype chain. setPrototypeOf does not change it, and node only considers classes valid
  // event targets if their constructor has a [eventTargetSym] property.
  const specialConstructor = target.constructor
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const renamedConstructor = function DedicatedWorkerGlobalScope(...args: any[]) {
    return specialConstructor.apply(this, args)
  }
  Object.defineProperty(renamedConstructor, 'name', {value: 'DedicatedWorkerGlobalScope'})
  renamedConstructor[eventTargetSym] = true
  target.constructor = renamedConstructor

  return target as WorkerGlobalScope
}

export {DedicatedWorkerGlobalScope, createWorkerGlobalContextOnTarget}
