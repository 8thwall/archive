import {dispatchify} from '../common'
import type {AsyncThunk, DispatchifiedActions} from '../common/types/actions'
import {
  getRefreshedUserAndSession,
  refreshCurrentUserSession,
  signOutAndClearCookies,
} from './cognito-user-manager'
import {JWT_REFRESH_INTERVAL_MILLIS} from './user-constants'
import {MILLISECONDS_PER_SECOND} from '../../shared/time-utils'

const logout = () => (dispatch) => {
  dispatch({type: 'USER_LOGOUT'})
  window.location.href = '/'
}

const getValidatedUserAndSession = () => async (dispatch) => {
  try {
    const {session, user} = await getRefreshedUserAndSession()
    if (!session.isValid()) {
      signOutAndClearCookies(user)
      dispatch(logout())
      throw new Error('Current user session is invalid.')
    }
    return {session, user}
  } catch (e) {
    if (e.code === 'NotAuthorizedException') {
      dispatch(logout())
    }
    throw e
  }
}

const refreshCognitoJwt = (): AsyncThunk => async (dispatch, getState) => {
  const {refreshToken} = getState().user
  if (!refreshToken) {
    throw new Error('No refresh token')
  }

  let result
  try {
    result = await refreshCurrentUserSession(refreshToken)
  } catch (e) {
    if (e.code === 'NotAuthorizedException') {
      dispatch(logout())
    }
    throw e
  }

  const {session, user} = result
  if (!session.isValid()) {
    signOutAndClearCookies(user)
    dispatch(logout())
    throw new Error('Current user session is no longer valid.')
  }

  const accessToken = session.getAccessToken()
  const issuedAt = accessToken.getIssuedAt() * MILLISECONDS_PER_SECOND
  const expTime = accessToken.getExpiration() * MILLISECONDS_PER_SECOND
  dispatch({
    type: 'USER_JWT',
    jwt: accessToken.getJwtToken(),
    jwtRefreshTime: Math.min(issuedAt + JWT_REFRESH_INTERVAL_MILLIS, expTime),
    refreshToken: session.getRefreshToken(),
    jwtSource: 'cognito',
  })
}

const refreshCognitoJwtIfExpired = (): AsyncThunk => async (dispatch, getState) => {
  const {jwtRefreshTime} = getState().user

  if (!jwtRefreshTime || jwtRefreshTime < Date.now()) {
    await dispatch(refreshCognitoJwt())
  }
}

export const rawActions = {
  getValidatedUserAndSession,
  refreshCognitoJwt,
  refreshCognitoJwtIfExpired,
}

export type CognitoUserSessionActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
