// @sublibrary(:dom-core-lib)
import type {Destination} from './fetch-api'
import {Request, type RequestMode, type RequestCredentials} from './fetch-api'

// See: https://html.spec.whatwg.org/multipage/urls-and-fetching.html#cors-settings-attributes
enum CorsSettingAttributeState {
  NO_CORS,
  ANONYMOUS,
  USE_CREDENTIALS,
}

  type CorsSettingAttributeKeyword = 'anonymous' | '' | 'use-credentials' | null

const getCorsSettingAttributeState = (
  value: CorsSettingAttributeKeyword
): CorsSettingAttributeState => {
  switch (value) {
    case null:
      return CorsSettingAttributeState.NO_CORS
    case 'use-credentials':
      return CorsSettingAttributeState.USE_CREDENTIALS
    case 'anonymous':
      // fallthrough
    case '':
      // fallthrough
    default:  // invalid default is 'anonymous'
      return CorsSettingAttributeState.ANONYMOUS
  }
}

// https://html.spec.whatwg.org/multipage/urls-and-fetching.html#create-a-potential-cors-request
// To create a potential-CORS request, given a url, destination,
// corsAttributeState, and an optional same-origin fallback flag, run these
// steps:
const createPotentialCorsRequest = (
  url: URL,
  destination: Destination,
  corsAttributeState: CorsSettingAttributeState,
  sameOriginFallbackFlag?: boolean
): Request => {
  // 1. Let mode be "no-cors" if corsAttributeState is No CORS, and "cors"
  // otherwise.
  let mode: RequestMode =
      corsAttributeState === CorsSettingAttributeState.NO_CORS ? 'no-cors' : 'cors'

  // 2. If same-origin fallback flag is set and mode is "no-cors", set mode to
  // "same-origin".
  if (sameOriginFallbackFlag && mode === 'no-cors') {
    mode = 'same-origin'
  }

  // 3. Let credentialsMode be "include".
  let credentialsMode: RequestCredentials = 'include'

  // 4. If corsAttributeState is Anonymous, set credentialsMode to
  // "same-origin".
  if (corsAttributeState === CorsSettingAttributeState.ANONYMOUS) {
    credentialsMode = 'same-origin'
  }

  // 5. Let request be a new request whose URL is url, destination is
  // destination, mode is mode, credentials mode is credentialsMode, and whose
  // use-URL-credentials flag is set.
  const request = new Request(url.href, {
    mode,
    credentials: credentialsMode,
  })
  // As Request doesn't expose certain browser-set parameters, we get them manually.
  const stateSym =
    Object.getOwnPropertySymbols(request).find(s => s.description === 'state') as symbol
    ;(request as any)[stateSym].destination = destination
  ;(request as any)[stateSym].useCredentials = true
  return request
}

export {
  CorsSettingAttributeState,
  CorsSettingAttributeKeyword,
  RequestCredentials,
  getCorsSettingAttributeState,
  createPotentialCorsRequest,
}
