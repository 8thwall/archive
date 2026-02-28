// @sublibrary(:dom-core-lib)
import type {HTMLScriptElement} from './html-script-element'
import type {ClassicScript, ModuleScript} from './script'
import type {CompletionRecord} from './completion-record'
import type {SourceTextModuleRecord} from './vm-record'
import type {ImportMapParseResult} from './import-map'
import type {EnvironmentSettings} from './environment'
import {nodeDocument} from './node-internal'
import {DOMException} from './dom-exception'
import {
  registerImportMap,
  reportException,
} from './window-methods'
import {
  preparationDocumentSym,
  fromExternalFileSym,
  typeSym,
  resultSym,
} from './html-script-element-symbols'

import {unblockRendering} from './document-methods'

import {
  environmentSettingsSym,
  ignoreDestructiveWritesCounterSym,
} from './document-symbols'

// 1. If the global object specified by settings is a Window object whose Document object is not
// fully active, then return "do not run".
// [NOT IMPLEMENTED] as we only have one document which is always fully active.
// 2. If scripting is disabled for settings, then return "do not run".
// [NOT IMPLEMENTED]
// 3. Return "run".
// See: https://html.spec.whatwg.org/multipage/webappapis.html#check-if-we-can-run-script
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkIfWeCanRunScript = (settings: EnvironmentSettings): 'run' | 'do not run' => 'run'

// The steps to prepare to run script with an environment settings object settings are as follows:
// See: https://html.spec.whatwg.org/multipage/webappapis.html#prepare-to-run-script
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const prepareToRunScript = (settings: EnvironmentSettings): void => {
  // 1. Push settings's realm execution context onto the JavaScript execution context stack; it is
  // now the running JavaScript execution context.
  // [NOT IMPLEMENTED]

  // 2. Add settings to the surrounding agent's event loop's currently running task's script
  // evaluation environment settings object set.
  // [NOT IMPLEMENTED]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cleanUpAfterRunningScript = (settings: EnvironmentSettings): void => {
  // 1. Assert: settings's realm execution context is the running JavaScript execution context.
  // [NOT IMPLEMENTED]

  // 2. Remove settings's realm execution context from the JavaScript execution
  // context stack.
  // [NOT IMPLEMENTED]

  // 3. If the JavaScript execution context stack is now empty, perform a microtask checkpoint. (If
  // this runs scripts, these algorithms will be invoked reentrantly.)
  // Note: These algorithms are not invoked by one script directly calling another, but they can be
  // invoked reentrantly in an indirect manner, e.g. if a script dispatches an event which has event
  // listeners registered.  The running script is the script in the [[HostDefined]] field in the
  // ScriptOrModule component of the running JavaScript execution context.
  // [NOT IMPLEMENTED]
}

// See: https://html.spec.whatwg.org/multipage/webappapis.html#run-a-classic-script
const runClassicScript = (
  script: ClassicScript, rethrowErrors: boolean = false
): CompletionRecord => {
  // 1. Let settings be the settings object of script.
  const {settings} = script

  // 2. Check if we can run script with settings. If this returns "do not run" then return
  // NormalCompletion(empty).
  if (checkIfWeCanRunScript(settings) === 'do not run') {
    return {
      type: 'normal',
      value: null,
      target: null,
    }
  }

  // 3. Record classic script execution start time given script.
  // [NOT IMPLEMENTED]

  // 4. Prepare to run script given settings.
  prepareToRunScript(settings)

  // 5. Let evaluationStatus be null.
  let evaluationStatus: CompletionRecord | null = null

  // 6. If script's error to rethrow is not null, then set evaluationStatus to Completion {
  // [[Type]]: throw, [[Value]]: script's error to rethrow, [[Target]]: empty }.
  if (script.errorToRethrow !== null) {
    evaluationStatus = {
      type: 'throw',
      value: script.errorToRethrow,
      target: null,
    }
  }

  // 7. Otherwise, set evaluationStatus to ScriptEvaluation(script's record).
  let result
  try {
    result = script.record!.runInContext(
      settings.realmExecutionContext,
      {filename: script.baseURL!.href}
    )
    evaluationStatus = {
      type: 'normal',
      value: result,
      target: null,
    }
    // If ScriptEvaluation does not complete because the user agent has aborted the running script,
    // leave evaluationStatus as null.
    // [NOT IMPLEMENTED]
  } catch (e) {
    // 8. If evaluationStatus is an abrupt completion, then:
    evaluationStatus = {
      type: 'throw',
      value: e,
      target: null,
    }
    // 1. If rethrow errors is true and script's muted errors is false, then
    if (rethrowErrors && !script.mutedErrors) {
      // 1. Clean up after running script with settings.
      cleanUpAfterRunningScript(settings)

      // 2. Rethrow evaluationStatus.[[Value]].
      throw e
    } else if (rethrowErrors && script.mutedErrors) {
    // 2. If rethrow errors is true and script's muted errors is true, then:
      // 1. Clean up after running script with settings.
      cleanUpAfterRunningScript(settings)

      // 2. Throw a "NetworkError" DOMException.
      throw new DOMException('Script evaluation failed', 'NetworkError')
    } else {  // 3. Otherwise, rethrow errors is false. Perform the following steps:
      // 1. Report an exception given by evaluationStatus.[[Value]] for script's settings object's
      // global object.
      reportException(e, settings.globalObject)

      // 2. Clean up after running script with settings.
      cleanUpAfterRunningScript(settings)

      // 3. Return evaluationStatus.
      return evaluationStatus
    }
  }

  // 9. Clean up after running script with settings.
  cleanUpAfterRunningScript(settings)

  // 10. If evaluationStatus is a normal completion, then return evaluationStatus.
  if (evaluationStatus.type === 'normal') {
    return evaluationStatus
  }

  // 11. If we've reached this point, evaluationStatus was left as null because the script was
  // aborted prematurely during evaluation. Return Completion { [[Type]]: throw, [[Value]]: a new
  // "QuotaExceededError" DOMException, [[Target]]: empty }.
  return {
    type: 'throw',
    value: new DOMException('Script aborted prematurely during evaluation', 'QuotaExceededError'),
    target: null,
  }
}

// To run a module script given a module script script and an optional boolean preventErrorReporting
// (default false):
// See: https://html.spec.whatwg.org/multipage/webappapis.html#run-a-module-script
const runModuleScript = (
  script: ModuleScript,
  preventErrorReporting: boolean = false
): Promise<any | undefined> => {
  // 1. Let settings be the settings object of script.
  const {settings} = script

  // 2. Check if we can run script with settings. If this returns "do not run", then return a
  // promise resolved with undefined.
  if (checkIfWeCanRunScript(settings) === 'do not run') {
    return Promise.resolve(undefined)
  }

  // 3. Record module script execution start time given script.
  // [NOT IMPLEMENTED]

  // 4. Prepare to run script given settings.
  prepareToRunScript(settings)

  // 5. Let evaluationPromise be null.
  let evaluationPromise: Promise<any> | null = null

  // 6. If script's error to rethrow is not null, then set evaluationPromise to a promise rejected
  // with script's error to rethrow.
  if (script.errorToRethrow !== null) {
    evaluationPromise = Promise.reject(script.errorToRethrow)
  } else {  // 7. Otherwise:
    // 1. Let record be script's record.
    const record = script.record as SourceTextModuleRecord

    // 2. Set evaluationPromise to record.Evaluate().
    // Note: This step will recursively evaluate all of the module's dependencies.
    evaluationPromise = new Promise<void>((resolve, reject) => {
      record.evaluate().then(() => {
        resolve()
      }).catch((e) => {
        reject(e)
      })
    })

    // If Evaluate fails to complete as a result of the user agent aborting the running script, then
    // set evaluationPromise to a promise rejected with a new "QuotaExceededError" DOMException.
    // [NOT IMPLEMENTED]
  }

  // 8. If preventErrorReporting is false, then upon rejection of evaluationPromise with reason,
  // report an exception given by reason for script's settings object's global object.
  if (!preventErrorReporting) {
    evaluationPromise.catch((reason: Error) => {
      reportException(reason, settings.globalObject)
    })
  }

  // 9. Clean up after running script with settings.
  cleanUpAfterRunningScript(settings)

  // 10. Return evaluationPromise.
  return evaluationPromise
}

const executeScript = (el: HTMLScriptElement): void => {
  // 1. Let document be el's node document.
  const doc = nodeDocument(el)

  // 2. If el's preparation-time document is not equal to document, then return.
  if (el[preparationDocumentSym] !== doc) {
    return
  }

  // 3. Unblock rendering on el.
  unblockRendering(el)

  // 4. If el's result is null, then fire an event named error at el, and return.
  if (el[resultSym] === null) {
    el.dispatchEvent(new Event('error'))
    return
  }

  // 5. If el's from an external file is true, or el's type is "module", then increment document's
  // ignore-destructive-writes counter.
  let incrementedIgnoreDestructiveWritesCounter = false
  if (el[fromExternalFileSym] || el[typeSym] === 'module') {
    doc[ignoreDestructiveWritesCounterSym]++
    incrementedIgnoreDestructiveWritesCounter = true
  }

  // 6. Switch on el's type:
  switch (el[typeSym]) {
    case 'classic': {
      // 1. Let oldCurrentScript be the value to which document's currentScript object was most
      // recently set.
      const oldCurrentScript = doc.currentScript

      // 2. If el's root is not a shadow root, then set document's currentScript attribute to el.
      // Otherwise, set it to null.
      // Note: This does not use the in a document tree check, as el could have been removed from
      // the document prior to execution, and in that scenario currentScript still needs to point to
      // it.
      // [IMPLEMENTATION NOTE] Shadow roots are not implemented.
      doc.currentScript = el

      // 3. Run the classic script given by el's result.
      runClassicScript(el[resultSym] as ClassicScript)

      // 4. Set document's currentScript attribute to oldCurrentScript.
      doc.currentScript = oldCurrentScript
      break
    }
    case 'module': {
      // 1. Assert: document's currentScript attribute is null.
      if (doc.currentScript !== null) {
        throw new Error('document\'s currentScript attribute must be null')
      }
      // 2. Run the module script given by el's result.
      runModuleScript(el[resultSym] as ModuleScript)
      break
    }
    case 'importmap': {
      // 1. Register an import map given el's relevant global object and el's result.
      const settings = doc[environmentSettingsSym]

      // @ts-ignore settings.globalObject will be a Window object
      registerImportMap(settings.globalObject as Window, el[resultSym] as ImportMapParseResult)
      break
    }
    default:
      break
  }

  // 7. Decrement the ignore-destructive-writes counter of document, if it was incremented in the
  // earlier step.
  if (incrementedIgnoreDestructiveWritesCounter) {
    doc[ignoreDestructiveWritesCounterSym]--
  }

  // 8. If el's from an external file is true, then fire an event named load at el.
  if (el[fromExternalFileSym]) {
    el.dispatchEvent(new Event('load'))
  }
}

export {runClassicScript, runModuleScript, executeScript}
