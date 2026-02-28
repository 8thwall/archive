import fetchWithJwt from './fetch-with-jwt'
import {rawActions as userSessionActions} from '../user/user-session-actions'
import type {AsyncThunk} from './types/actions'

import {resolveServerRoute} from './paths'

const authenticatedFetch = <ResponseType>(
  path: string,
  options = {}
): AsyncThunk<ResponseType> => async (dispatch, getState) => {
    await dispatch(userSessionActions.refreshJwtIfExpired())
    const url = resolveServerRoute(path)
    return fetchWithJwt(url, getState().user.jwt, options)
  }

export default authenticatedFetch
