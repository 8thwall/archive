// @sublibrary(:dom-core-lib)
/* eslint-disable no-await-in-loop */

import type {RequestCredentials} from './cors'
import type {EnvironmentSettings} from './environment'
import type {Window} from './window'
import type {
  ModuleScript,
  ScriptFetchOptions,
} from './script'
import {
  type Destination,
  type Referrer,
  fetch,
  Request,
  getRequestState,
} from './fetch-api'
import {
  extractMimeType,
  mimeTypeEssence,
  isJavaScriptMimeType,
  isJsonMimeType,
} from './mime-type'
import type {PerformFetchHook} from './fetch-methods'
import {
  type ModuleRequestRecord,
  fetchDestinationFromModuleType,
  moduleTypeFromModuleRequest,
  moduleTypeAllowed,
} from './module-methods'
import {
  createJavaScriptModuleScript,
  setupModuleScriptRequest,
} from './create-module-script'
import {moduleMapKey} from './environment'
import {disallowFurtherImportMaps, reportException} from './window-methods'
import {importMapSym} from './window-symbols'
import {parseReferrerPolicy} from './referrer-policy'
import type {ModuleRecord} from './vm-record'
import {resolveImport} from './import-map'

// To fetch a single module script, given a URL url, an environment settings object fetchClient, a
// destination destination, a script fetch options options, an environment settings object
// settingsObject, a referrer referrer, an optional ModuleRequest Record moduleRequest, a boolean
// isTopLevel, an algorithm onComplete, and an optional perform the fetch hook performFetch, run
// these steps. onComplete must be an algorithm accepting null (on failure) or a module script (on
// success).
// See: https://html.spec.whatwg.org/multipage/webappapis.html#fetch-a-single-module-script
const fetchSingleModuleScript = async (params: {
  url: URL,
  fetchClient: EnvironmentSettings,
  destination: Destination,
  options: ScriptFetchOptions,
  settingsObject: EnvironmentSettings,
  referrer: Referrer,
  moduleRequest?: ModuleRequestRecord,
  isTopLevel: boolean,
  onComplete: (result: ModuleScript | null) => void,
  performFetch?: PerformFetchHook,
}) => {
  // 1. Let moduleType be "javascript".
  let moduleType: string | null = 'javascript'

  // 2. If moduleRequest was given, then set moduleType to the result of running the module type
  // from module request steps given moduleRequest.
  if (params.moduleRequest) {
    moduleType = moduleTypeFromModuleRequest(params.moduleRequest)
  }

  // 3. Assert: the result of running the module type allowed steps given moduleType and
  // settingsObject is true. Otherwise, we would not have reached this point because a failure would
  // have been raised when inspecting moduleRequest.[[Attributes]] in create a JavaScript module
  // script or fetch a single imported module script.
  if (!moduleTypeAllowed(moduleType, params.settingsObject)) {
    throw new Error('Module type assertion failure')
  }

  // 4. Let moduleMap be settingsObject's module map.
  const {moduleMap} = params.settingsObject

  // 5. If moduleMap[(url, moduleType)] is "fetching", wait in parallel until that entry's value
  // changes, then queue a task on the networking task source to proceed with running the following
  // steps.
  const key = moduleMapKey(params.url, moduleType)
  while (moduleMap.get(key) === 'fetching') {
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // 6. If moduleMap[(url, moduleType)] exists, run onComplete given moduleMap[(url, moduleType)],
  // and return.
  if (moduleMap.has(key)) {
    params.onComplete(moduleMap.get(key) as ModuleScript | null)
    return
  }

  // 7. Set moduleMap[(url, moduleType)] to "fetching".
  moduleMap.set(key, 'fetching')

  // 8. Let request be a new request whose URL is url, mode is "cors", referrer is referrer, and
  // client is fetchClient.
  let reqReferrer
  if (params.referrer instanceof URL) {
    reqReferrer = params.referrer.href
  } else if (params.referrer === 'client') {
    reqReferrer = params.fetchClient.creationUrl.href
  }
  const request = new Request(params.url, {
    mode: 'cors',
    referrer: reqReferrer,
  })
  const requestState = getRequestState(request)
  requestState.client = params.fetchClient

  // 9. Set request's destination to the result of running the fetch destination from module type
  // steps given destination and moduleType.
  requestState.destination = fetchDestinationFromModuleType(params.destination, moduleType)

  // 10. If destination is "worker", "sharedworker", or "serviceworker", and isTopLevel is true,
  // then set request's mode to "same-origin".
  if (['worker', 'sharedworker', 'serviceworker'].includes(params.destination) &&
      params.isTopLevel) {
    requestState.mode = 'same-origin'
  }

  // 11. Set request's initiator type to "script".
  requestState.initiator = 'script'

  // 12. Set up the module script request given request and options.
  setupModuleScriptRequest(request, params.options)

  // In both cases, let processResponseConsumeBody given response response and null, failure, or a
  // byte sequence bodyBytes be the following algorithm:
  const processResponseConsumeBody = (
    response: Response,  // Note: response is always CORS-same-origin.
    bodyBytes: ArrayBuffer | null
  ) => {
    // 1. If any of the following are true:
    if (
      // bodyBytes is null or failure; or
      bodyBytes === null ||
      // response's status is not an ok status,
      !response.ok
    ) {
      // then set moduleMap[(url, moduleType)] to null, run onComplete given null, and abort these
      // steps.
      moduleMap.set(key, null)
      params.onComplete(null)
      return
    }

    // 2. Let sourceText be the result of UTF-8 decoding bodyBytes.
    const sourceText = new TextDecoder().decode(bodyBytes)

    // 3. Let mimeType be the result of extracting a MIME type from response's header list.
    const mimeType = extractMimeType(response.headers)
    // It is a fatal error if MIME type is failure.
    if (mimeType === null) {
      reportException(
        new Error('Failed to extract MIME type from response'),
        params.fetchClient.globalObject
      )
      params.onComplete(null)
    }

    // 4. Let moduleScript be null.
    let moduleScript: ModuleScript | null = null

    // 5. Let referrerPolicy be the result of parsing the `Referrer-Policy` header given response.
    // [REFERRERPOLICY]
    const referrerPolicy = parseReferrerPolicy(response)

    // 6. If referrerPolicy is not the empty string, set options's referrer policy to
    // referrerPolicy.
    if (referrerPolicy !== '') {
      params.options.referrerPolicy = referrerPolicy
    }

    // 7. If mimeType is a JavaScript MIME type and moduleType is "javascript", then set
    // moduleScript to the result of creating a JavaScript module script given sourceText,
    // settingsObject, response's URL, and options.
    if (mimeType !== null &&
      isJavaScriptMimeType(mimeType) &&
      moduleType === 'javascript') {
      moduleScript = createJavaScriptModuleScript(
        sourceText, params.settingsObject, new URL(response.url), params.options
      )
    }

    // 8. If the MIME type essence of mimeType is "text/css" and moduleType is "css", then set
    // moduleScript to the result of creating a CSS module script given sourceText and
    // settingsObject.
    // [NOT IMPLEMENTED]
    if (mimeType !== null && mimeTypeEssence(mimeType) === 'text/css' && moduleType === 'css') {
      reportException(
        new Error('CSS module scripts are not yet implemented'),
        params.fetchClient.globalObject
      )
      params.onComplete(null)
    }

    // 9. If mimeType is a JSON MIME type and moduleType is "json", then set moduleScript to the
    // result of creating a JSON module script given sourceText and settingsObject.
    // [NOT IMPLEMENTED]
    if (mimeType !== null && isJsonMimeType(mimeType) && moduleType === 'json') {
      reportException(
        new Error('JSON module scripts are not yet implemented'),
        params.fetchClient.globalObject
      )
      params.onComplete(null)
    }

    // 10. Set moduleMap[(url, moduleType)] to moduleScript, and run onComplete given moduleScript.
    // Note: It is intentional that the module map is keyed by the request URL, whereas the base URL
    // for the module script is set to the response URL.  The former is used to deduplicate fetches,
    // while the latter is used for URL resolution.
    moduleMap.set(key, moduleScript)
    params.onComplete(moduleScript)
  }

  // 13. If performFetch was given, run performFetch with request, isTopLevel, and with
  // processResponseConsumeBody as defined below (above).
  if (params.performFetch) {
    params.performFetch(request, params.isTopLevel, processResponseConsumeBody)
  } else {
    // Otherwise, fetch request with processResponseConsumeBody set to processResponseConsumeBody as
    // defined below.
    // [IMPLEMENTATION NOTE] Just doing a regular fetch here.
    fetch(request).then((response) => {
      response.arrayBuffer().then((bodyBytes) => {
        processResponseConsumeBody(response, bodyBytes)
      })
    })
  }
}

// To fetch the descendants of and link a module script moduleScript, given an environment settings
// object fetchClient, a destination destination, an algorithm onComplete, and an optional perform
// the fetch hook performFetch, run these steps. onComplete must be an algorithm accepting null (on
// failure) or a module script (on success).
// See: /multipage/webappapis.html#fetch-the-descendants-of-and-link-a-module-script
const fetchDescendantsAndLinkModuleScript = (
  moduleScript: ModuleScript,
  fetchClient: EnvironmentSettings,
  destination: Destination,
  onComplete: (result: ModuleScript | null) => void,
  performFetch?: PerformFetchHook
): void => {
  // 1. Let record be moduleScript's record.
  const {record} = moduleScript

  // 2. If record is null, then:
  if (record === null) {
    // 1. Set moduleScript's error to rethrow to moduleScript's parse error.
    moduleScript.errorToRethrow = moduleScript.parseError

    // 2. Run onComplete given moduleScript.
    onComplete(moduleScript)

    // 3. Return.
    return
  }

  // 3. Let state be Record { [[ParseError]]: null, [[Destination]]: destination, [[PerformFetch]]:
  // null, [[FetchClient]]: fetchClient }.
  const state = {
    parseError: null as any,
    destination,
    performFetch: null as PerformFetchHook | null,
    fetchClient,
  }

  // 4. If performFetch was given, set state.[[PerformFetch]] to performFetch.
  if (performFetch) {
    state.performFetch = performFetch
  }

  // 5. Let loadingPromise be record.LoadRequestedModules(state).  Note: This step will recursively
  // load all the module transitive dependencies.
  // 6. Upon fulfillment of loadingPromise, run the following steps:
  // 1. Perform record.Link().
  // Note: This step will recursively call Link on all of the module's unlinked dependencies.  If
  // this throws an exception, catch it, and set moduleScript's error to rethrow to that exception.
  // 2. Run onComplete given moduleScript.
  // 7. Upon rejection of loadingPromise, run the following steps:
  // 1. If state.[[ParseError]] is not null, set moduleScript's error to rethrow to
  // state.[[ParseError]] and run onComplete given moduleScript.
  // 2. Otherwise, run onComplete given null.  Note: state.[[ParseError]] is null when
  // loadingPromise is rejected due to a loading error.
  // [IMPLEMENTATION NOTE] Instead of following the instructions above, we are going to load and
  // link in the same step, using vm.link.

  const {moduleMap, globalObject} = fetchClient

  // If the global object is a Window, use the import map from the global object.
  // Otherwise, use an empty import map (generally for WorkerGlobalScopes).
  const importMap = (globalObject.constructor.name === 'Window')
    ? (globalObject as Window)[importMapSym] : ({imports: {}, scopes: {}})

  const loadImportLinker = async (
    specifier: string, referencingModule: ModuleRecord
  ): Promise<ModuleRecord> => {
    // Use the url, the importmap, and the specifier to determine the actual url, with both bare
    // modules and mapping path prefixes per the spec.
    // eslint-disable-next-line prefer-const
    let {resolvedImport, matched} = resolveImport(
      specifier, importMap, new URL(referencingModule.identifier)
    )
    if (!resolvedImport) {
      throw new Error(`Could not resolve import specifier: ${specifier}`)
    }

    const moduleType = 'javascript'
    if (!matched) {
      if (moduleType !== 'javascript') {
        throw new Error(`Unsupported module type: ${moduleType}`)
      }
    }

    const moduleKey = moduleMapKey(resolvedImport, moduleType)

    // Check if the module is already in the module map.
    if (moduleMap.has(moduleKey)) {
      let module = moduleMap.get(moduleKey)
      // Spin if another dependency path is actively fetching this module.
      while (module === 'fetching') {
        await new Promise(resolve => setTimeout(resolve, 100))
        module = moduleMap.get(moduleKey)
      }
      if (!module) {
        throw new Error(`Module ${specifier} failed to load from ${resolvedImport}`)
      }
      // Return the promise for the module.
      return Promise.resolve(module.record!)
    }

    moduleMap.set(moduleKey, 'fetching')
    const promise = new Promise<ModuleRecord>((resolve, reject) => {
      fetch(resolvedImport)
        .then((response: Response) => response.text())
        .then((fetchedCode: string) => {
          const newModuleScript: ModuleScript = {
            record: null,
            settings: fetchClient,
            baseURL: new URL(resolvedImport.href),
            parseError: null,
            fetchOptions: null,
            errorToRethrow: null,
          }
          try {
            newModuleScript.record = new (globalThis as any).vm.SourceTextModule(fetchedCode, {
              context: referencingModule.context,
              identifier: newModuleScript.baseURL!.href,
              initializeImportMeta: (meta: ImportMeta) => {
                meta.url = resolvedImport.href
              },
            })
          } catch (error) {
            newModuleScript.parseError = error
            newModuleScript.errorToRethrow = error
          }
          moduleMap.set(moduleKey, newModuleScript)
          if (!newModuleScript.record) {
            reject(newModuleScript.errorToRethrow)
            return
          }
          resolve(newModuleScript.record)
        })
        .catch((error: any) => {
          moduleMap.set(moduleKey, null)
          reject(error)
        })
    })
    return promise
  }

  // Link the modules.
  record.link(loadImportLinker).then(() => {
    onComplete(moduleScript)
  }).catch((error: any) => {
    moduleScript.errorToRethrow = error
    onComplete(moduleScript)
  })
}

// To fetch an inline module script graph given a string sourceText, a URL baseURL, an environment
// settings object settingsObject, a script fetch options options, and an algorithm onComplete, run
// these steps. onComplete must be an algorithm accepting null (on failure) or a module script (on
// success).
// See: https://html.spec.whatwg.org/multipage/webappapis.html#fetch-an-inline-module-script-graph
const fetchInlineModuleScriptGraph = (
  sourceText: string,
  baseURL: URL,
  settingsObject: EnvironmentSettings,
  options: ScriptFetchOptions,
  onComplete: (result: ModuleScript | null) => void
): void => {
  // 1. Disallow further import maps given settingsObject.
  disallowFurtherImportMaps(settingsObject)

  // 2. Let script be the result of creating a JavaScript module script using sourceText,
  // settingsObject, baseURL, and options.
  const script = createJavaScriptModuleScript(sourceText, settingsObject, baseURL, options)

  // 3. Fetch the descendants of and link script, given settingsObject, "script", and onComplete.
  fetchDescendantsAndLinkModuleScript(script, settingsObject, 'script', onComplete)
}

// See: https://html.spec.whatwg.org/multipage/webappapis.html#fetch-a-module-script-tree
const fetchExternalModuleScriptGraph = (
  url: URL,
  settingsObject: EnvironmentSettings,
  options: ScriptFetchOptions,
  onComplete: (result: ModuleScript | null) => void
) => {
  // 1. Disallow further import maps given settingsObject.
  disallowFurtherImportMaps(settingsObject)

  // 2. Fetch a single module script given url, settingsObject, "script", options, settingsObject,
  // "client", true, and with the following steps given result:
  fetchSingleModuleScript({
    url,
    fetchClient: settingsObject,
    destination: 'script',
    options,
    settingsObject,
    referrer: 'client',
    isTopLevel: true,
    onComplete: (result: ModuleScript | null) => {
      // 1. If result is null, run onComplete given null, and abort these steps.
      if (result === null) {
        onComplete(null)
        return
      }

      // 2. Fetch the descendants of and link result given settingsObject, "script", and onComplete.
      fetchDescendantsAndLinkModuleScript(result, settingsObject, 'script', onComplete)
    },
  })
}

// eslint-disable-next-line max-len
// See: https://html.spec.whatwg.org/multipage/webappapis.html#fetch-a-worklet/module-worker-script-graph
const fetchModuleWorkerScriptGraph = (
  url: URL,
  fetchClient: EnvironmentSettings,
  destination: Destination,
  credentialsMode: RequestCredentials,
  settingsObject: EnvironmentSettings,
  onComplete: (result: ModuleScript | null) => void,
  performFetch?: PerformFetchHook
) => {
  // 1. Let options be a script fetch options whose cryptographic nonce is the empty string,
  // integrity metadata is the empty string, parser metadata is "not-parser-inserted",
  // credentials mode is credentialsMode, referrer policy is the empty string,
  // and fetch priority is "auto".
  const options: ScriptFetchOptions = {
    cryptographicNonce: '',
    integrityMetadata: '',
    parserMetadata: 'not-parser-inserted',
    credentialsMode,
    referrerPolicy: '',
    renderBlocking: false,  // Unless otherwise stated, its value is false.
    fetchPriority: 'auto',
  }

  // 2. Fetch a single module script given url, fetchClient, destination, options, settingsObject,
  // "client", true, and onSingleFetchComplete as defined below. If performFetch was given,
  // pass it along as well.
  const onSingleFetchComplete = (result: ModuleScript | null) => {
    // 1. If result is null, run onComplete given null, and abort these steps.
    if (result === null) {
      onComplete(null)
      return
    }

    // 2. Fetch the descendants of and link result given fetchClient, destination, and onComplete.
    fetchDescendantsAndLinkModuleScript(result, fetchClient, destination, onComplete, performFetch)
  }

  fetchSingleModuleScript({
    url,
    fetchClient,
    destination,
    options,
    settingsObject,
    referrer: 'client',
    isTopLevel: true,
    onComplete: onSingleFetchComplete,
    performFetch,
  })
}

export {
  fetchInlineModuleScriptGraph,
  fetchExternalModuleScriptGraph,
  fetchModuleWorkerScriptGraph,
}
