// @sublibrary(:dom-core-lib)
import {
  fetch,
  Request as RequestType,
  Response as ResponseType,
  Headers as HeadersType,
  BodyInit,
  RequestInit,
  RequestMode,
  RequestCredentials,
} from 'undici-types'

import type {EnvironmentSettings} from './environment'

const builtinFetch = (globalThis as any).fetch as typeof fetch
const builtinRequest = (globalThis as any).Request as typeof RequestType
const builtinResponse = (globalThis as any).Response as typeof ResponseType
const builtinHeaders = (globalThis as any).Headers as typeof HeadersType

declare global {
  type Headers = HeadersType
  type Response = ResponseType
  type Request = RequestType
}

// A request has an associated destination, which is the empty string, "audio",
// "audioworklet", "document", "embed", "font", "frame", "iframe", "image",
// "json", "manifest", "object", "paintworklet", "report", "script",
// "serviceworker", "sharedworker", "style", "track", "video", "webidentity",
// "worker", or "xslt". Unless stated otherwise it is the empty string.  See:
// https://fetch.spec.whatwg.org/#concept-request-destination
type Destination = '' | 'audio' | 'audioworklet' | 'document' | 'embed' |
  'font' | 'frame' | 'iframe' | 'image' | 'json' | 'manifest' | 'object' |
  'paintworklet' | 'report' | 'script' | 'serviceworker' | 'sharedworker' |
  'style' | 'track' | 'video' | 'webidentity' | 'worker' | 'xslt'

// A request has an associated referrer, which is "no-referrer", "client", or a
// URL. Unless stated otherwise it is "client".
type Referrer = 'no-referrer' | 'client' | URL

type RequestRedirect = 'error' | 'follow' | 'manual'

type RequestCache =
  | 'default'
  | 'force-cache'
  | 'no-cache'
  | 'no-store'
  | 'only-if-cached'
  | 'reload'

// Some request properties are not exposed in the Fetch API, but exist in the
// Request object. Provide an internal-use method to give access to the state.
const getRequestState = (request: Request) => {
  const stateSym = Object.getOwnPropertySymbols(request).find(
    s => s.description === 'state'
  ) as symbol
  return (request as any)[stateSym] as {
    method: string
    localURLsOnly: boolean
    unsafeRequest: boolean
    body: BodyInit | null
    client: EnvironmentSettings
    reservedClient: EnvironmentSettings | null
    replacesClientId: string
    window: string
    keepalive: boolean
    serviceWorkers: string
    initiator: string
    destination: Destination
    priority: 'auto' | 'high' | 'low' | null
    origin: string
    policyContainer: string
    referrer: string
    referrerPolicy: string
    mode: RequestMode
    useCORSPreflightFlag: boolean
    credentials: RequestCredentials
    useCredentials: boolean
    cache: RequestCache
    redirect: RequestRedirect
    integrity: string
    cryptoGraphicsNonceMetadata: string
    parserMetadata: string
    reloadNavigation: boolean
    historyNavigation: boolean
    userActivation: boolean
    taintedOrigin: boolean
    redirectCount: number
    responseTainting: string
    preventNoCacheCacheControlHeaderModification: boolean
    done: boolean
    timingAllowFailed: boolean
    headersList: any
    urlList: URL[]
    url: URL
  }
}

export {
  Destination,
  builtinFetch as fetch,
  builtinRequest as Request,
  builtinHeaders as Headers,
  builtinResponse as Response,
  RequestInit,
  RequestMode,
  RequestCache,
  RequestCredentials,
  RequestRedirect,
  Referrer,
  getRequestState,
}
