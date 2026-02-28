import {getHeaders} from './fetch-utils'
import {rawActions as userSessionActions} from '../user/user-session-actions'
import type {AsyncThunk} from './types/actions'
import {resolveServerRoute} from './paths'

type XhrOptions = {
  method: string
  body?: string | Blob | FormData
  json?: boolean
  headers?: Record<string, string | number | boolean>
}

type ProgressXhr = <T>(
  url: string,
  options: XhrOptions,
  onProgress: (p: number) => void
) => AsyncThunk<T>

/**
 * This sends an http request, using XMLHttpRequest.upload.progress
 * to monitor file upload progress from the client side
 * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload
 *
 */
const xhrWithProgress: ProgressXhr = (url, options, onProgress) => async (dispatch, getState) => {
  await dispatch(userSessionActions.refreshJwtIfExpired())
  return new Promise((resolve, reject) => {
    const fullUrl = resolveServerRoute(url)
    const xhr = new XMLHttpRequest()
    xhr.open(options.method, fullUrl)
    xhr.withCredentials = true
    const headers = getHeaders(getState().user.jwt, options)
    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key])
    })
    xhr.onload = () => {
      const isJsonResponse = xhr.getResponseHeader('Content-Type')?.indexOf('json') > 0
      const res = xhr.response
      if (xhr.status !== 200) {
        const msg = isJsonResponse ? JSON.parse(res).message : res
        reject(new Error(msg))
      } else if (isJsonResponse) {
        resolve(JSON.parse(res))
      } else {
        resolve(res)
      }
    }
    if (onProgress) {
      xhr.upload.onprogress = (p) => {
        if (p?.loaded && p?.total) {
          const percentage = Math.round((p.loaded / p.total) * 100)
          onProgress(percentage)
        }
      }
    }
    xhr.send(options.body)
  })
}

export {
  xhrWithProgress,
}
