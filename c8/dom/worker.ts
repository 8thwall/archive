// @sublibrary(:dom-core-lib)
import URL from 'url'
import path from 'path'

import threads from 'node:worker_threads'
import {resolveObjectURL} from 'node:buffer'

import type {Transferable} from './window-or-worker-global-scope'

import {
  WorkerEventHandlers,
  mixinWorkerEventHandlers,
} from './worker-event-handlers'

import {ErrorEvent, MessageEvent} from './dom-events'
import type {
  EventHandler,
  EventListener,
  EventListenerOptions,
  AddEventListenerOptions,
} from './events-internal'
import {
  addEventListenerWrapped,
  removeEventListenerWrapped,
} from './events-methods'

interface WorkerOptions {
  type?: 'classic' | 'module'
  credentials?: 'omit' | 'same-origin' | 'include'
  name?: string
}

const defaultWorkerOptions: WorkerOptions = {
  type: 'classic',
  credentials: 'omit',
}

type WorkerData = Required<WorkerOptions> & {
  url: string
  creationUrl: string
  internalStoragePath: string
  blob?: Blob
}

type TransferOptions = { transfer?: Transferable[] }

// Summary of Worker Flow:
// - The Worker Constructor will spawn a node worker thread to run the `worker-runner.js` script.
// - worker-runner creates a vm context with an initModule that creates a WorkerGlobalScope on
//   the globalThis object (call to createWorkerGlobalContextOnTarget).
//   This will also fill any globalThis properties / methods that require
//   overloads from the vm context. For example, fetch should be fetchWithDefaultBase.
// - Once the context is created, the worker-fetch-execution script is run in the vm context.
// - The worker-fetch-execution script sets up event listeners, then runs the worker script provided
//   to the window.Worker constructor.
// - At this point, messages and errors can be sent to and from the worker thread.
// Notes:
// - The internal Worker set up follows a similar paradigm to the Window.
// - worker-core is needed to provide types to the separate Worker binaries (worker-runner, etc.)
//   - These binaries should only import types, implementations should be handled in the initModule
//     in worker-context.
class Worker extends EventTarget implements WorkerEventHandlers {
  private _workerThread: threads.Worker

  constructor(url: string, options?: WorkerOptions) {
    super()
    const {name, credentials, type} = {...defaultWorkerOptions, ...options}

    let mod: URL
    let blob: Blob | undefined
    if (url.startsWith('data:')) {
      mod = new URL.URL(url)
    } else if (url.startsWith('blob:nodedata:')) {
      blob = resolveObjectURL(url)
      if (blob === undefined) {
        throw new Error('Worker: Invalid Blob URL')
      }
      mod = new URL.URL(url)
    } else {
      mod = new URL.URL(url, (globalThis as any).window.location.href)
    }

    const creationUrl = URL.pathToFileURL(
      path.join((globalThis as any).__niaRunfilesDir, '_main/c8/dom/worker/worker-runner.js')
    )

    this._workerThread = new threads.Worker(
      creationUrl,
      {
        workerData: {
          url: mod.href,
          creationUrl: creationUrl.href,
          type,
          credentials,
          name,
          internalStoragePath: (globalThis as any).__niaInternalStoragePath,
          naeBuildMode: (globalThis as any).niaBuildMode,
          blob,
        } as WorkerData,
        transferList: blob ? [blob] : undefined,
      }
    )
    this._workerThread.on('error', (error) => {
      const event = new ErrorEvent('error', {
        error,
        message: error.message,
      })

      if (!(globalThis as any).__niaNaeOpt) {
        // NOTE(lreyna): App code is generally supposed to handle errors from workers, but in case
        // they don't log anything to the console, we log it here to help with debugging.
        /* eslint-disable-next-line no-console */
        console.error('[Worker] Received Error:', error.message)
      }
      this.dispatchEvent(event)
    })
    this._workerThread.on('message', (data) => {
      const event = new MessageEvent('message', {
        data,
      })
      this.dispatchEvent(event)
    })
    this._workerThread.on('messageerror', (data) => {
      const event = new MessageEvent('message', {
        data,
      })
      this.dispatchEvent(event)
    })
  }

  // See: https://dom.spec.whatwg.org/#dom-eventtarget-addeventlistener
  addEventListener(
    type: string,
    callback?: EventHandler | EventListener,
    options?: AddEventListenerOptions | boolean
  ) {
    return addEventListenerWrapped(this, type, callback, options)
  }

  // See: https://dom.spec.whatwg.org/#dom-eventtarget-removeeventlistener
  removeEventListener(
    type: string,
    callback?: EventHandler | EventListener,
    options?: EventListenerOptions | boolean
  ) {
    return removeEventListenerWrapped(this, type, callback, options)
  }

  // Should mirror implementation in DedicatedWorkerGlobalScope
  postMessage(message: any, transferOrOptions?: Transferable[] | TransferOptions) {
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

    const eventData = {
      data: message,
      origin: (globalThis as any).origin,
      source: JSON.stringify(this),
    }

    this._workerThread.postMessage(eventData, transferList)
  }

  terminate(): void {
    const eventData = {
      data: {__nia: 'terminate'},
      origin: (globalThis as any).origin,
      source: '__nia',
    }

    this._workerThread.postMessage(eventData)
  }
}

// Add mixin properties and methods via declaration merging.
interface Worker extends WorkerEventHandlers { }  // eslint-disable-line no-redeclare

// Add the mixin additions to Window's prototype.
Object.defineProperty(Worker.prototype, 'Worker', {value: Worker})
mixinWorkerEventHandlers(Worker.prototype)

export {Worker, WorkerOptions, WorkerData}
