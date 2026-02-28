// @sublibrary(:dom-core-lib)
import type {EnvironmentSettings} from './environment'
import {
  type ClassicScript,
  defaultScriptFetchOptions,
} from './script'
import {
  type Destination,
  Request,
  fetch,
  getRequestState,
} from './fetch-api'
import {
  createClassicScript,
} from './create-classic-script'
import {extractMimeType, isJavaScriptMimeType, MimeType} from './mime-type'
import type {PerformFetchHook} from './fetch-methods'

// To fetch a classic worker script given a URL url, an environment settings object fetchClient,
// a destination destination, an environment settings object settingsObject,
// an algorithm onComplete, and an optional perform the fetch hook performFetch, run these steps.
// onComplete must be an algorithm accepting null (on failure) or a classic script (on success).
// See: https://html.spec.whatwg.org/multipage/webappapis.html#fetch-a-classic-worker-script
const fetchClassicWorkerScript = (
  url: URL,
  fetchClient: EnvironmentSettings,
  destination: Destination,
  settingsObject: EnvironmentSettings,
  onComplete: (result: ClassicScript | null) => void,
  performFetch?: PerformFetchHook
) => {
  // 1. Let request be a new request whose URL is url, client is fetchClient,
  // destination is destination, initiator type is "other", mode is "same-origin",
  // credentials mode is "same-origin", parser metadata is "not parser-inserted",
  // and whose use-URL-credentials flag is set.
  const request = new Request(url.href, {
    mode: 'same-origin',
    credentials: 'same-origin',
  })
  getRequestState(request).client = fetchClient
  getRequestState(request).initiator = 'other'
  getRequestState(request).destination = destination
  getRequestState(request).parserMetadata = 'not parser-inserted'
  getRequestState(request).useCredentials = true

  // In both cases, let processResponseConsumeBody given response response and null, failure,
  // or a byte sequence bodyBytes be the following algorithm:
  const processResponseConsumeBody = (response: Response, bodyBytes: ArrayBuffer | null) => {
    // 1. Set response to response's unsafe response.
    // [IMPLEMENTATION NOTE] nothing to do here.

    // 2. If any of the following are true:
    // bodyBytes is null or failure; or
    // response's status is not an ok status,
    // then run onComplete given null, and abort these steps.
    if (!response.ok || bodyBytes === null) {
      onComplete(null)
      return
    }

    // 3. If all of the following are true:
    //    - response's URL's scheme is an HTTP(S) scheme; and
    //    - the result of extracting a MIME type from response's header list
    //      is not a JavaScript MIME type,
    // then run onComplete given null, and abort these steps.
    if (response.url.startsWith('http') &&
      !isJavaScriptMimeType(extractMimeType(response.headers) as MimeType)) {
      onComplete(null)
      return
    }

    // 4. Let sourceText be the result of UTF-8 decoding bodyBytes.
    const sourceText = (new TextDecoder('UTF-8')).decode(bodyBytes)

    // 5. Let script be the result of creating a classic script using sourceText,
    // settingsObject, response's URL, and the default script fetch options.
    const script = createClassicScript(
      sourceText, settingsObject, new URL(response.url), defaultScriptFetchOptions
    )

    // 6. Run onComplete given script.
    onComplete(script)
  }

  // 2. If performFetch was given, run performFetch with request, true,
  // and with processResponseConsumeBody as defined below. Otherwise, fetch request with
  // processResponseConsumeBody set to processResponseConsumeBody as defined below.
  if (performFetch) {
    performFetch(request, true, processResponseConsumeBody)
  } else {
    fetch(request).then((response) => {
      response.arrayBuffer().then((bodyBytes) => {
        processResponseConsumeBody(response, bodyBytes)
      })
    })
  }
}

export {
  fetchClassicWorkerScript,
}
