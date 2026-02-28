import localforage from 'localforage'
import i18next from 'i18next'
import {batch} from 'react-redux'
import {push} from 'redux-first-history'

import {dispatchify} from '../common'
import type {AsyncThunk, DispatchifiedActions, Thunk} from '../common/types/actions'
import {rawActions as cognitoUserSessionActions} from '../user/cognito-user-session-actions'
import {
  clearAllCognitoUserData,
  signOutAndClearCookies,
} from '../user/cognito-user-manager'
import {deleteCookie} from '../common/cookie-utils'
import {LOGOUT} from './user-niantic-action-types'
import {postUserLogoutMessage} from '../user/user-logout-broadcast'
import {LOCALE_COOKIE_NAME} from '../../shared/i18n/i18n-constants'
import {chooseDefaultLanguage} from '../i18n/choose-default-language'
import {publicApiFetch} from '../common/public-api-fetch'
import fetchWithJwt from '../common/fetch-with-jwt'
import {resolveServerRoute} from '../common/paths'

const CACHED_USER_UUID_KEY = 'userUuid'
const CACHED_REFRESH_TIME_KEY = 'refreshTime'

const cacheUserNiantic = (userUuid: string, refreshTime: number): AsyncThunk<void> => async () => {
  await Promise.all([
    localforage.setItem(CACHED_USER_UUID_KEY, userUuid),
    localforage.setItem(CACHED_REFRESH_TIME_KEY, refreshTime),
  ])
}

const clearCachedUserNiantic = (): AsyncThunk<void> => async () => {
  await Promise.all([
    localforage.removeItem(CACHED_USER_UUID_KEY),
    localforage.removeItem(CACHED_REFRESH_TIME_KEY),
  ])
}

const setJwt = (refreshTime: number): Thunk<void> => (dispatch) => {
  dispatch({
    type: 'USER_JWT',
    jwtSource: '8w',
    jwtRefreshTime: refreshTime,
  })
}

const logout = (): AsyncThunk<void> => async (dispatch, getState) => {
  try {
    const res = await dispatch(cognitoUserSessionActions.getValidatedUserAndSession())
    signOutAndClearCookies(res.user)
  } catch {
    // TODO(alvinp): In testing, I've gotten into situations where a Cognito cookie
    // remains even after logout. Let's make sure all Cognito state is cleared.
    // Investigate this more to see if we can just replace the `signOutAndClearCookies` call
    // with a simple `clearCookies`.
    clearAllCognitoUserData()
  }

  await dispatch(clearCachedUserNiantic())

  try {
    const url = resolveServerRoute('/v1/users/niantic/logout')
    // TODO(alvinp): The logout endpoint should probably be public. All it does is clear cookies.
    await fetchWithJwt(url, getState().user.jwt, {method: 'POST'})
  } catch (e) {
    // User didn't have any cookies to clear. Continue with the rest of the logout steps.
  }

  // Remove i18n config
  deleteCookie(LOCALE_COOKIE_NAME)
  i18next.changeLanguage(chooseDefaultLanguage())

  await postUserLogoutMessage()

  batch(() => {
    dispatch(push('/'))
    dispatch({type: 'USER_LOGOUT'})
    dispatch({type: LOGOUT})
  })
}

const loadCachedJwt = (): AsyncThunk => async (dispatch, getState) => {
  try {
    const [userUuid, refreshTime] = await Promise.all<[Promise<string>, Promise<number>]>([
      localforage.getItem(CACHED_USER_UUID_KEY),
      localforage.getItem(CACHED_REFRESH_TIME_KEY),
    ])

    if (!userUuid || !refreshTime) {
      if (getState().user.jwtSource === '8w') {
        // NOTE(johnny): Log out if the jwt is loaded from the cookie in SSR, but
        // user is not cached in localForage.
        await dispatch(logout())
      }
      return
    }

    dispatch(setJwt(refreshTime))
  } catch (e) {
    // Treat errors as a no-op. No cached user exists to load.
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

const refresh8wJwt = (): AsyncThunk => async (dispatch) => {
  let result
  try {
    result = await dispatch(publicApiFetch('/users/niantic/login/refresh', {method: 'POST'}))
  } catch (e) {
    if (e.status === 401) {
      dispatch(logout())
    }
    throw e
  }

  await dispatch(cacheUserNiantic(result.userUuid, result.refreshTime))
  dispatch(setJwt(result.refreshTime))
}

const refresh8wJwtIfExpired = (): AsyncThunk => async (dispatch, getState) => {
  const {jwtRefreshTime} = getState().user

  if (!jwtRefreshTime || jwtRefreshTime < Date.now()) {
    await dispatch(refresh8wJwt())
  }
}

const rawActions = {
  cacheUserNiantic,
  loadCachedJwt,
  setJwt,
  clearCachedUserNiantic,
  logout,
  refresh8wJwt,
  refresh8wJwtIfExpired,
}

type UserNianticSessionActions = DispatchifiedActions<typeof rawActions>

const actions = dispatchify(rawActions)

export {
  actions as default,
  rawActions,
}

export type {
  UserNianticSessionActions,
}
