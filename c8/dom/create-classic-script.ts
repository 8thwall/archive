// @sublibrary(:dom-core-lib)
import type {EnvironmentSettings} from './environment'
import {ClassicScript, type ScriptFetchOptions} from './script'
import {getRequestState} from './fetch-api'

// To create a classic script, given a string source, an environment settings object settings, a URL
// baseURL, a script fetch options options, an optional boolean mutedErrors (default false), and an
// optional URL-or-null sourceURLForWindowScripts (default null):
// See: https://html.spec.whatwg.org/multipage/webappapis.html#creating-a-classic-script
const createClassicScript = (
  source: string,
  settings: EnvironmentSettings,
  baseURL: URL,
  options: ScriptFetchOptions,
  mutedErrors = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sourceURLForWindowScripts: URL | null = null
): ClassicScript => {
  // 1. If mutedErrors is true, then set baseURL to about:blank.  Note: When mutedErrors is true,
  // baseURL is the script's CORS-cross-origin response's url, which shouldn't be exposed to
  // JavaScript. Therefore, baseURL is sanitized here.
  if (mutedErrors) {
    baseURL = new URL('about:blank')  // eslint-disable-line no-param-reassign
  }

  // 2. If scripting is disabled for settings, then set source to the empty string.
  // [NOT IMPLEMENTED]

  // 3. Let script be a new classic script that this algorithm will subsequently initialize.
  const script = new ClassicScript()
  // 4. Set script's settings object to settings.
  script.settings = settings
  // 5. Set script's base URL to baseURL.
  script.baseURL = baseURL
  // 6. Set script's fetch options to options.
  script.fetchOptions = options
  // 7. Set script's muted errors to mutedErrors.
  script.mutedErrors = mutedErrors
  // 8. Set script's parse error and error to rethrow to null.
  script.parseError = null
  script.errorToRethrow = null
  script.record = null

  // 9. Record classic script creation time given script and sourceURLForWindowScripts.
  // [NOT IMPLEMENTED]

  // 10. Let result be ParseScript(source, settings's realm, script).
  // Note: Passing script as the last parameter here ensures result.[[HostDefined]] will be script.
  let result = null
  try {
    result = new (globalThis as any).vm.Script(
      source,
      {
        filename: baseURL.href,
      }
    )
  } catch (e) {
    // 11. If result is a list of errors, then:
    // 12. Set script's parse error and its error to rethrow to result[0].
    script.parseError = e
    script.errorToRethrow = e
  }

  script.record = result

  // 13. Return script.
  return script
}

// Given a request request and a script fetch options options, we define:
// Set up the classic script request
// See: https://html.spec.whatwg.org/multipage/webappapis.html#set-up-the-classic-script-request
const setupClassicScriptRequest = (request: Request, options: ScriptFetchOptions): void => {
  // Set request's cryptographic nonce metadata to options's cryptographic nonce, its integrity
  // metadata to options's integrity metadata, its parser metadata to options's parser metadata, its
  // referrer policy to options's referrer policy, its render-blocking to options's render-blocking,
  // and its priority to options's fetch priority.
  const requestState = getRequestState(request)
  requestState.cryptoGraphicsNonceMetadata = options.cryptographicNonce
  requestState.integrity = options.integrityMetadata
  requestState.parserMetadata = options.parserMetadata
  requestState.referrerPolicy = options.referrerPolicy
  // Prop renderBlocking Doesn't exist on node Request state, so set on the request itself.
  ;(request as any).renderBlocking = options.renderBlocking
  requestState.priority = options.fetchPriority
}

export {
  createClassicScript,
  setupClassicScriptRequest,
}
