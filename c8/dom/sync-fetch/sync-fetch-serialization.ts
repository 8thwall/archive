// @package(npm-rendering)
import type {
  Headers as HeadersType,
  ReferrerPolicy,
  Response as ResponseType,
  Request as RequestType,
  RequestCache,
  RequestCredentials,
  RequestRedirect,
  RequestInfo,
  RequestInit,
  RequestMode,
} from 'undici-types'

const Request = (globalThis as any).Request as typeof RequestType
const Headers = (globalThis as any).Headers as typeof HeadersType

interface SerializableRequest {
  url: string,
  method: string,
  headers: [string, string][],
  body: string | null,
  mode: RequestMode,
  credentials: RequestCredentials,
  cache: RequestCache,
  redirect: RequestRedirect,
  referrer: string,
  referrerPolicy: ReferrerPolicy,
  integrity: string,
  keepalive: boolean,
}

interface SerializableResponse {
  body: string,
  headers: [string, string][],
  status: number,
  statusText: string,
  url: string,
}

const createSerializableRequest = (obj: RequestType): SerializableRequest => {
  if (obj.signal && obj.signal.aborted) {
    throw new Error('Abort Signal in Request')
  }

  return {
    url: obj.url,
    method: obj.method,
    headers: [...obj.headers.entries()],
    body: obj.body ? obj.body.toString() : null,
    mode: obj.mode,
    credentials: obj.credentials,
    cache: obj.cache,
    redirect: obj.redirect,
    referrer: obj.referrer,
    referrerPolicy: obj.referrerPolicy,
    integrity: obj.integrity,
    keepalive: obj.keepalive,
  }
}

const createSerializableResponse = (obj: ResponseType, body: string): SerializableResponse => ({
  body,
  headers: [...obj.headers.entries()],
  status: obj.status,
  statusText: obj.statusText,
  url: obj.url,
})

const serializeFetchRequest = (input: RequestInfo, init: RequestInit): string => {
  let reqInfo: string | SerializableRequest
  if (input instanceof Request) {
    reqInfo = createSerializableRequest(input)
  } else if (input instanceof URL) {
    reqInfo = input.href
  } else if (typeof input === 'string') {
    reqInfo = input
  } else {
    throw new Error('Invalid RequestInfo')
  }

  const inputObject = {input: reqInfo, init}

  return JSON.stringify(inputObject)
}

const serializeFetchResponse = async (response: ResponseType): Promise<string> => {
  const responseBuffer = await response.arrayBuffer()
  const base64String = Buffer.from(responseBuffer).toString('base64')
  const serializableResponse = createSerializableResponse(response, base64String)

  return JSON.stringify(serializableResponse)
}

const createRequest = (serializableRequest: SerializableRequest): RequestType => {
  // Reconstruct headers
  const headers = new Headers()
  serializableRequest.headers.forEach(([key, value]: [string, string]) => {
    headers.append(key, value)
  })

  // Create a new Request object
  const request = new Request(serializableRequest.url, {
    method: serializableRequest.method,
    headers,
    body: serializableRequest.body,
    mode: serializableRequest.mode,
    credentials: serializableRequest.credentials,
    redirect: serializableRequest.redirect,
    referrer: serializableRequest.referrer,
    referrerPolicy: serializableRequest.referrerPolicy,
    integrity: serializableRequest.integrity,
    keepalive: serializableRequest.keepalive,
  })

  return request
}

const deserializeFetchRequest =
  (input: string): {input: RequestInfo, init: RequestInit} => {
    const inputData: {input: string | SerializableRequest, init: RequestInit} = JSON.parse(input)

    let request: RequestType
    if (typeof inputData.input !== 'string') {
      request = createRequest(inputData.input)
    } else {
      request = new Request(inputData.input, inputData.init)
    }

    return {input: request, init: inputData.init}
  }

const deserializeFetchResponse =
(input: string): {response: ResponseType, buffer: ArrayBuffer | null} => {
  const parsedResponse: SerializableResponse = JSON.parse(input)

  const responseBuffer = parsedResponse.body ? Buffer.from(parsedResponse.body, 'base64') : null
  const response = new (globalThis as any).Response(responseBuffer, parsedResponse)
  Object.defineProperty(response, 'url', {
    value: parsedResponse.url,
  })
  return {response, buffer: responseBuffer}
}

export {
  createSerializableRequest,
  serializeFetchRequest,
  serializeFetchResponse,
  deserializeFetchRequest,
  deserializeFetchResponse,
}
