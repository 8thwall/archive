import {responseToJsonOrText} from '../common/fetch-utils'
import {resolveServerRoute} from '../common/paths'
import type {RequestInit} from '../common/public-api-fetch'
import useActions from '../common/use-actions'
import userSessionActions from '../user/user-session-actions'

const _fetch = async (path: URL | string, options: RequestInit, json: boolean) => {
  const res = await fetch(path, {
    credentials: 'same-origin',
    headers: json ? {'Content-Type': 'application/json'} : {},
    ...options,
  })
  return responseToJsonOrText(res)
}

const useAuthFetch = () => {
  const {refreshJwtIfExpired} = useActions(userSessionActions)
  // eslint-disable-next-line arrow-parens
  const authFetch = async <T>(path: string, options?: RequestInit, json = true): Promise<T> => {
    await refreshJwtIfExpired()
    return _fetch(resolveServerRoute(path), options, json)
  }

  return authFetch
}

export {
  useAuthFetch,
}
