// @sublibrary(:dom-core-lib)
import {
  ExposedOnWorker,
  mixinExposedOnWorker,
} from './exposed-on-worker'

import {
  NiaWorkerGlobalScope,
  mixinNiaWorkerGlobalScope,
} from './nia-worker-global-scope'

import {
  WindowOrWorkerGlobalScope,
  mixinWindowOrWorkerGlobalScope,
} from './window-or-worker-global-scope'

import {
  WorkerEventHandlers,
  mixinWorkerEventHandlers,
} from './worker-event-handlers'

import {
  errorReportingModeSym,
} from './window-symbols'

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

import {DOMException} from './dom-exception'

type WorkerLocation = URL

class WorkerGlobalScope extends EventTarget implements ExposedOnWorker,
  NiaWorkerGlobalScope, WindowOrWorkerGlobalScope, WorkerEventHandlers {
  [errorReportingModeSym]: boolean = false

  readonly self: WorkerGlobalScope = this

  readonly location: WorkerLocation = new URL('about:blank')

  readonly navigator: {readonly userAgent: string}

  importScripts(...urls: string[]) {
    // Some conformance tests (in conformance2/offscreencanvas) run importScripts() without an
    // object, relying on the default globalThis from non-strict Javascript. In this implmentation,
    // WorkerGlobalScope is an ES6 class, so this is effectively run in strict mode, which defaults
    // to undefined for this this pointer. Here we use a non-strict equivalent to globalThis to
    // handle this case.
    const nonStrictThis = this ?? (globalThis as unknown as WorkerGlobalScope)

    // 1. Let urlStrings be « ».
    let urlStrings: string[] = []

    // 2. For each url of urls:
    // 1. Append the result of invoking the Get Trusted Type compliant string algorithm with
    // TrustedScriptURL, this's relevant global object, url, "Worker importScripts", and "script"
    // to urlStrings.
    // [NOT IMPLEMENTED]

    // 3. Import scripts into worker global scope given this and urlStrings.
    urlStrings = urls

    // 4. If worker global scope's type is "module", throw a TypeError exception.
    if (nonStrictThis.__nia.type === 'module') {
      throw new TypeError('WorkerGlobalScope.importScripts is not available in module workers')
    }

    // 5. Let settings object be the current settings object.
    const settingsObject = nonStrictThis.__nia.environmentSettings

    // 6. If urls is empty, return.
    if (urlStrings.length === 0) {
      return
    }

    // 7. Let urlRecords be « ».
    const urlRecords: URL[] = []

    // 8. For each url of urls:
    for (const url of urlStrings) {
      try {
        // 1. Let urlRecord be the result of encoding-parsing a URL given url,
        // relative to settings object.
        const urlRecord = new URL(url)

        // Append urlRecord to urlRecords.
        urlRecords.push(urlRecord)
      } catch {
        // 2. If urlRecord is failure, then throw a "SyntaxError" DOMException.
        throw new DOMException('Invalid URL', 'SyntaxError')
      }
    }

    // 9. For each urlRecord of urlRecords:
    for (const urlRecord of urlRecords) {
      // 1. Fetch a classic worker-imported script given urlRecord and settings object,
      // passing along performFetch if provided. If this succeeds, let script be the result.
      // Otherwise, rethrow the exception.
      const script = nonStrictThis.__nia.fetchClassicWorkerImportedScript(
        urlRecord,
        settingsObject
      )

      // 2. Run the classic script script, with the rethrow errors argument set to true.
      // If an exception was thrown or if the script was prematurely aborted,
      // then abort all these steps, letting the exception or aborting continue
      // to be processed by the calling script.
      nonStrictThis.__nia.runClassicScript(script, true)
    }
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
}

/* eslint-disable no-redeclare */
interface WorkerGlobalScope {readonly WorkerGlobalScope: typeof WorkerGlobalScope}
interface WorkerGlobalScope extends ExposedOnWorker {}
interface WorkerGlobalScope extends NiaWorkerGlobalScope {}
interface WorkerGlobalScope extends WindowOrWorkerGlobalScope {}
interface WorkerGlobalScope extends WorkerEventHandlers {}
/* eslint-enable no-redeclare */

// Add the mixin additions to WorkerGlobalScope's prototype.
Object.defineProperty(WorkerGlobalScope.prototype, 'WorkerGlobalScope', {value: WorkerGlobalScope})
mixinExposedOnWorker(WorkerGlobalScope.prototype)
mixinNiaWorkerGlobalScope(WorkerGlobalScope.prototype)
mixinWindowOrWorkerGlobalScope(WorkerGlobalScope.prototype)
mixinWorkerEventHandlers(WorkerGlobalScope.prototype)

export {WorkerGlobalScope}
