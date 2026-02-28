// @sublibrary(:dom-core-lib)
import type {EnvironmentSettings} from './environment'
import type {ModuleScript, ScriptFetchOptions} from './script'
import {getRequestState} from './fetch-api'
import type {SourceTextModuleRecord} from './vm-record'
import {
  type ModuleRequestRecord,
  moduleTypeFromModuleRequest,
  moduleTypeAllowed,
  resolveModuleSpecifier,
} from './module-methods'

// To create a JavaScript module script, given a string source, an environment settings object
// settings, a URL baseURL, and a script fetch options options:
// See: https://html.spec.whatwg.org/multipage/webappapis.html#creating-a-javascript-module-script
const createJavaScriptModuleScript = (
  source: string,
  settings: EnvironmentSettings,
  baseURL: URL,
  options: ScriptFetchOptions
): ModuleScript => {
  // 1. If scripting is disabled for settings, then set source to the empty string.
  // [NOT IMPLEMENTED]

  // 2. Let script be a new module script.
  const script: ModuleScript = {
    // 3. Set script's settings object to settings.
    settings,
    // 4. Set script's base URL to baseURL.
    baseURL,
    // 5. Set script's fetch options to options.
    fetchOptions: options,
    // 6. Set script's parse error and error to rethrow to null.
    parseError: null,
    errorToRethrow: null,
    record: null,
  }

  // 7. Let result be ParseModule(source, settings's realm, script).  Note: Passing script as the
  // last parameter here ensures result.[[HostDefined]] will be script.
  let result: SourceTextModuleRecord | null = null
  try {
    result = new (globalThis as any).vm.SourceTextModule(
      source,
      {
        context: settings.realmExecutionContext,
        identifier: script.baseURL!.href,
        initializeImportMeta: (meta: ImportMeta) => {
          meta.url = baseURL.href
        },
      }
    )
  } catch (e) {  // 8. If result is a list of errors, then:
    // 1. Set script's parse error to result[0].
    // 2. Return script.
    script.parseError = e
    return script
  }

  // 9. For each ModuleRequest record requested of result.[[RequestedModules]]:
  for (const specifier of result?.dependencySpecifiers ?? []) {
    // [IMPLEMENTATION NOTE] ECMAScript 2023 changes result.[[RequestedModules]] to an array of
    // ModuleRequestRecord objects, but vm.SourceTextModule implements the older spec in which it is
    // a list of strings. Here we adapt the specs, assuming the module is a default javascrpt module
    // with no type attribute.
    const requested: ModuleRequestRecord = {
      specifier,
      attributes: [],
    }

    // 1. If requested.[[Attributes]] contains a Record entry such that
    // entry.[[Key]] is not "type", then:
    if (requested.attributes.some(entry => entry.key !== 'type')) {
      // 1. Let error be a new SyntaxError exception.
      const error = new SyntaxError('Invalid module request attributes')

      // 2. Set script's parse error to error.
      script.parseError = error

      // 3. Return script.
      // Note: The JavaScript specification re-performs this validation when loading script's
      // dependencies. It is duplicated here to skip unnecessary work given that, in case of an
      // invalid attribute key, loading the module graph would fail anyway. Additionally, this makes
      // the errors reported for invalid static imports consistent with dynamic imports, for which
      // invalid attributes are reported before calling into HTML and thus before validating the
      // imported specifier.
      return script
    }

    // 2. Resolve a module specifier given script and requested.[[Specifier]],
    // catching any exceptions.
    try {
      resolveModuleSpecifier(script, requested.specifier)
    } catch (e) {  // 3. If the previous step threw an exception, then:
      // 1. Set script's parse error to that exception.
      script.parseError = e

      // 2. Return script.
      return script
    }

    // 4. Let moduleType be the result of running the module type from module request steps given
    // requested.
    const moduleType = moduleTypeFromModuleRequest(requested)

    // 5. If the result of running the module type allowed steps given moduleType and settings is
    // false, then:
    if (!moduleTypeAllowed(moduleType, settings)) {
      // 1. Let error be a new TypeError exception.
      const error = new TypeError('Invalid module type')

      // 2. Set script's parse error to error.
      script.parseError = error

      // 3. Return script.
      return script

      // Note: This step is essentially validating all of the requested module specifiers and type
      // attributes. We treat a module with unresolvable module specifiers or unsupported type
      // attributes the same as one that cannot be parsed; in both cases, a syntactic issue makes it
      // impossible to ever contemplate linking the module later.
    }
  }

  // 10. Set script's record to result.
  script.record = result

  // 11. Return script.
  return script
}

// Set request's cryptographic nonce metadata to options's cryptographic nonce, its integrity
// metadata to options's integrity metadata, its parser metadata to options's parser metadata, its
// credentials mode to options's credentials mode, its referrer policy to options's referrer policy,
// its render-blocking to options's render-blocking, and its priority to options's fetch priority.
// See: https://html.spec.whatwg.org/multipage/webappapis.html#set-up-the-module-script-request
const setupModuleScriptRequest = (
  request: Request, options: ScriptFetchOptions
): void => {
  const requestState = getRequestState(request)
  requestState.cryptoGraphicsNonceMetadata = options.cryptographicNonce
  requestState.integrity = options.integrityMetadata
  requestState.parserMetadata = options.parserMetadata
  requestState.credentials = options.credentialsMode
  requestState.referrerPolicy = options.referrerPolicy
  // Prop renderBlocking Doesn't exist on node Request state, so set on the request itself.
  ;(request as any).renderBlocking = options.renderBlocking
  requestState.priority = options.fetchPriority
}

export {
  createJavaScriptModuleScript,
  setupModuleScriptRequest,
}
