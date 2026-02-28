import {getHeaders, responseToJsonOrText} from './fetch-utils'

const _fetchWithJwt = <T>(url, jwt, options = {}): Promise<T> => fetch(url, {
  credentials: 'same-origin',
  ...options,
  headers: getHeaders(jwt, options),
}).then(res => responseToJsonOrText(res))

export default _fetchWithJwt
