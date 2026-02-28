// @sublibrary(:dom-core-lib)
import type {EnvironmentSettings} from './environment'
import {DOMException} from './dom-exception'
import {defaultScriptFetchOptions} from './script'
import {
  Request,
  getRequestState,
} from './fetch-api'
import {createClassicScript} from './create-classic-script'
import {extractMimeType, isJavaScriptMimeType, MimeType} from './mime-type'

import {syncFetch} from '@nia/c8/dom/sync-fetch/sync-fetch'

// To fetch a classic worker-imported script given a URL url,
// an environment settings object settingsObject, and an optional
// perform the fetch hook performFetch, run these steps.
// The algorithm will return a classic script on success, or throw an exception on failure.
// See https://html.spec.whatwg.org/multipage/webappapis.html#fetch-a-classic-worker-imported-script
const fetchClassicWorkerImportedScript = (
  url: URL,
  settingsObject: EnvironmentSettings,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  performFetch?: (request: Request, isTopLevel: boolean, processCustomFetch: any) => void
) => {
  // 1. Let response be null.
  let response: Response | null = null

  // 2. Let bodyBytes be null.
  let bodyBytes: ArrayBuffer | null = null

  // 3. Let request be a new request whose URL is url, client is settingsObject,
  // destination is "script", initiator type is "other", parser metadata is "not parser-inserted",
  // and whose use-URL-credentials flag is set.
  const request = new Request(url.href, {
    mode: 'same-origin',
    credentials: 'same-origin',
  })
  const requestState = getRequestState(request)
  requestState.client = settingsObject
  requestState.initiator = 'other'
  requestState.destination = 'script'
  requestState.parserMetadata = 'not-parser-inserted'
  requestState.useCredentials = true

  // 5. If performFetch was given, run performFetch with request, isTopLevel,
  // and with processResponseConsumeBody as defined above.
  // [IMPLEMENTATION NOTE] performFetch is not supported in this implementation
  ;({response, bodyBuffer: bodyBytes} = syncFetch(request))

  // 6. Pause until response is not null.
  // [IMPLEMENTATION NOTE] This is a blocking operation in the spec
  // [IMPLEMENTATION NOTE] This is taken care of by the synchronous fetch

  // 7. Set response to response's unsafe response.
  // [IMPLEMENTATION NOTE] nothing to do here.

  // 8. If any of the following are true:
  // bodyBytes is null or failure;
  // response's status is not an ok status,
  // or the result of extracting a MIME type
  // from response's header list is not a JavaScript MIME type;
  // then throw a "NetworkError" DOMException.
  const shouldThrowNetworkError = !response.ok || bodyBytes === null ||
    !isJavaScriptMimeType(extractMimeType(response.headers) as MimeType)

  if (shouldThrowNetworkError) {
    throw new DOMException('Fetch Classic Worker Imported Script Failed', 'NetworkError')
  }

  // 9. Let sourceText be the result of UTF-8 decoding bodyBytes.
  const sourceText = new TextDecoder('utf-8').decode(bodyBytes)

  // 10. Let mutedErrors be true if response was CORS-cross-origin, and false otherwise.
  const mutedErrors = response.type === 'cors'

  const responseUrl = response.url ? new URL(response.url) : url

  // 11. Let script be the result of creating a classic script given sourceText, settingsObject,
  // response's URL, the default script fetch options, and mutedErrors.
  const script = createClassicScript(
    sourceText, settingsObject, responseUrl, defaultScriptFetchOptions, mutedErrors
  )

  // 12. Return script.
  return script
}

export {
  fetchClassicWorkerImportedScript,
}
