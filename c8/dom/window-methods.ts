// @sublibrary(:dom-core-lib)
import type {Window} from './window'
import type {WorkerGlobalScope} from './worker-global-scope'
import type {DedicatedWorkerGlobalScope} from './dedicated-worker-global-scope'
import {
  resultSym,
} from './html-script-element-symbols'
import type {EnvironmentSettings} from './environment'
import {
  errorReportingModeSym,
  importMapSym,
  importMapsAllowedSym,
} from './window-symbols'
import {
  ClassicScript,
} from './script'
import {
  isEmptyImportMap,
  type ImportMapParseResult,
} from './import-map'
import {
  ErrorEvent,
} from './dom-events'

// See: https://html.spec.whatwg.org/multipage/webappapis.html#extract-error
const extractErrorInformation = (e: Error): any => {
  // 1. Let attributes be an empty map keyed by IDL attributes.
  const attributes: any = {}

  // 2. Set attributes[error] to exception.
  attributes.error = e

  // 3. Set attributes[message], attributes[filename], attributes[lineno], and attributes[colno] to
  // implementation-defined values derived from exception.
  const lines = e.stack?.split('\n')
  const stackLine = (lines && lines[1]) || ''
  const stackRegex = /at\s+.*\(([^:]+):(\d+):(\d+)\)/
  const match = stackLine.match(stackRegex) || []
  Object.assign(attributes, {
    message: e.message,
    filename: match[1] || '',
    lineno: parseInt(match[2], 10) || 0,
    colno: parseInt(match[3], 10) || 0,
  })
  // Note: Browsers implement behavior not specified here or in the JavaScript specification to
  // gather values which are helpful, including in unusual cases (e.g., eval). In the future, this
  // might be specified in greater detail.

  // 4. Return attributes.
  return attributes
}

// See: https://html.spec.whatwg.org/multipage/webappapis.html#report-an-exception
const reportException = (
  e: Error,
  global: Window | WorkerGlobalScope,
  omitError: boolean = false
): void => {
  // 1. Let notHandled be true.
  let notHandled = true

  // 2. Let errorInfo be the result of extracting error information from exception.
  const errorInfo = extractErrorInformation(e)

  // 3. Let script be a script found in an implementation-defined way, or null.  This should usually
  // be the running script (most notably during run a classic script).
  let script
  if (Object.prototype.hasOwnProperty.call(global, 'Window')) {
    script = (global as Window).document.currentScript?.[resultSym] || null
  } else {
    script = (global as WorkerGlobalScope).__nia.currentScript
  }

  // 4. If script is a classic script and script's muted errors is true, then set errorInfo[error]
  // to null, errorInfo[message] to "Script error.", errorInfo[filename] to the empty string,
  // errorInfo[lineno] to 0, and errorInfo[colno] to 0.
  if (script instanceof ClassicScript && script.mutedErrors) {
    Object.assign(errorInfo, {
      error: null,
      message: 'Script error.',
      filename: '',
      lineno: 0,
      colno: 0,
    })
  }

  // 5. If omitError is true, then set errorInfo[error] to null.
  if (omitError) {
    errorInfo.error = null
  }

  // 6. If global is not in error reporting mode, then:
  if (!global[errorReportingModeSym]) {
    // 1. Set global's in error reporting mode to true.
    global[errorReportingModeSym] = true

    // 2. If global implements EventTarget, then set notHandled to the result of firing an event
    // named error at global, using ErrorEvent, with the cancelable attribute initialized to true,
    // and additional attributes initialized according to errorInfo.
    // Note: Returning true in an event handler cancels the event per the event handler processing
    // algorithm.
    if (global instanceof EventTarget) {
      const ev = new ErrorEvent('error', {cancelable: true})
      Object.assign(ev, errorInfo)
      notHandled = !global.dispatchEvent(ev)
    }

    // 3. Set global's in error reporting mode to false.
    global[errorReportingModeSym] = false
  }

  // 7. If notHandled is true, then:
  if (notHandled) {
    // 1. Set errorInfo[error] to null.
    errorInfo.error = null

    // 2. If global implements DedicatedWorkerGlobalScope, queue a global task on the DOM
    // manipulation task source with the global's associated Worker's relevant global object to run
    // these steps:
    if (Object.prototype.hasOwnProperty.call(global, 'DedicatedWorkerGlobalScope')) {
      // 1. Let workerObject be the Worker object associated with global.
      const workerObject = (global as DedicatedWorkerGlobalScope).__nia.associatedWorker

      // 2. Set notHandled be the result of firing an event named error at workerObject, using
      // ErrorEvent, with the cancelable attribute initialized to true, and additional attributes
      // initialized according to errorInfo.
      try {
        workerObject.postMessage(new ErrorEvent('error', {cancelable: true, ...errorInfo}))
        notHandled = false  // postMessage succeeded
      } catch (error) {
        notHandled = true  // postMessage failed
      }

      // 3. If notHandled is true, then report exception for workerObject's relevant global object
      // with omitError set to true.
      if (notHandled) {
        reportException(e, global, true)
      }
    }
  } else {
    // 8. Otherwise, the user agent may report exception to a developer console.
    // eslint-disable-next-line no-console
    console.error('Window report exception:', e.message, e.stack?.substring(0, 1000))
  }
}

// To register an import map given a Window global and an import map parse result result:
// See: https://html.spec.whatwg.org/multipage/webappapis.html#register-an-import-map
const registerImportMap = (global: Window, result: ImportMapParseResult): void => {
  // 1. If result's error to rethrow is not null, then report an exception given by result's error
  // to rethrow for global and return.
  if (result.errorToRethrow !== null) {
    reportException(result.errorToRethrow, global)
    return
  }

  // 2. Assert: global's import map is an empty import map.
  if (!isEmptyImportMap(global[importMapSym])) {
    throw new Error('global import map is not empty')
  }

  // 3. Set global's import map to result's import map.
  global[importMapSym] = result.importMap!
}

// Disallow further import maps given an environment settings object.
// See: https://html.spec.whatwg.org/multipage/webappapis.html#import-map-processing-model
const disallowFurtherImportMaps = (settings: EnvironmentSettings): void => {
  // 1. Let global be settingsObject's global object.
  const global = settings.globalObject as Window

  // If global does not implement Window, then return.
  if (!(global.constructor.name === 'Window')) {
    return
  }

  global[importMapsAllowedSym] = false
}

export {
  reportException,
  registerImportMap,
  disallowFurtherImportMaps,
}
