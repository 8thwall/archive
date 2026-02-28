// @sublibrary(:dom-core-lib)
import type {EnvironmentSettings} from './environment'
import type {
  ClassicScript,
  ScriptFetchOptions,
} from './script'
import {
  type CorsSettingAttributeState,
  createPotentialCorsRequest,
} from './cors'
import {
  fetch,
  getRequestState,
} from './fetch-api'
import type {Encoding} from './encoding'
import {
  createClassicScript,
  setupClassicScriptRequest,
} from './create-classic-script'
import {extractMimeType} from './mime-type'
import {legacyExtractEncoding} from './fetch-methods'

// To fetch a classic script given a URL url, an environment settings object settingsObject, a
// script fetch options options, a CORS settings attribute state corsSetting, an encoding encoding,
// and an algorithm onComplete, run these steps. onComplete must be an algorithm accepting null (on
// failure) or a classic script (on success).
// See: https://html.spec.whatwg.org/multipage/webappapis.html#fetch-a-classic-script
const fetchClassicScript = (
  url: URL,
  settingsObject: EnvironmentSettings,
  options: ScriptFetchOptions,
  classicScriptCorsSetting: CorsSettingAttributeState,
  encoding: Encoding,
  onComplete: (result: ClassicScript | null) => void
) => {
  // 1. Let request be the result of creating a potential-CORS request given url, "script", and
  // corsSetting.
  const request = createPotentialCorsRequest(url, 'script',
    classicScriptCorsSetting)

  // 2. Set request's client to settingsObject.
  getRequestState(request).client = settingsObject

  // 3. Set request's initiator type to "script".
  getRequestState(request).initiator = 'script'

  // 4. Set up the classic script request given request and options.
  setupClassicScriptRequest(request, options)

  // 5. Fetch request with the following processResponseConsumeBody steps given response response
  // and null, failure, or a byte sequence bodyBytes:
  // Note: response can be either CORS-same-origin or CORS-cross-origin. This only affects how error
  // reporting happens.
  fetch(request).then((response) => {
    // 1. Set response to response's unsafe response.
    // [IMPLEMENTATION NOTE] nothing to do here.

    // 2. If any of the following are true:
    // bodyBytes is null or failure; or
    // response's status is not an ok status,
    // then run onComplete given null, and abort these steps.
    if (!response.ok) {
      onComplete(null)
      return
    }
    // Note: For historical reasons, this algorithm does not include MIME type checking, unlike the
    // other script-fetching algorithms in this section.

    // 3. Let potentialMIMETypeForEncoding be the result of extracting a MIME type given response's
    // header list.
    const potentialMIMETypeForEncoding = extractMimeType(response.headers)

    // 4. Set encoding to the result of legacy extracting an encoding given
    // potentialMIMETypeForEncoding and encoding.  Note: This intentionally ignores the MIME type
    // essence.
    // eslint-disable-next-line no-param-reassign
    encoding = legacyExtractEncoding(potentialMIMETypeForEncoding, encoding)

    // 5. Let sourceText be the result of decoding bodyBytes to Unicode, using encoding as the
    // fallback encoding.
    const sourceTextPromise = response.arrayBuffer().then(
      bodyBytes => (new TextDecoder(encoding)).decode(bodyBytes)
    )

    // Note: The decode algorithm overrides encoding if the file contains a BOM.

    // 6. Let mutedErrors be true if response was CORS-cross-origin, and false otherwise.
    const mutedErrors = response.type === 'cors'

    sourceTextPromise.then((sourceText) => {
      // 7. Let script be the result of creating a classic script given sourceText, settingsObject,
      // response's URL, options, mutedErrors, and url.
      const script = createClassicScript(
        sourceText, settingsObject, new URL(response.url), options, mutedErrors, url
      )

      // 8. Run onComplete given script.
      onComplete(script)
    })
  })
}

export {
  fetchClassicScript,
}
