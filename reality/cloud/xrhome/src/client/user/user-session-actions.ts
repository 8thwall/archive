import {dispatchify} from '../common'
import type {AsyncThunk, DispatchifiedActions} from '../common/types/actions'
import {rawActions as cognitoUserSessionAction} from './cognito-user-session-actions'
import {
  rawActions as userNianticSessionActions,
} from '../user-niantic/user-niantic-session-actions'

type RefreshFirebaseJwtOptions = {
  forceRefresh?: boolean
}

const refreshFirebaseJwt = (
  options?: RefreshFirebaseJwtOptions
): AsyncThunk => async (dispatch, getState) => {
  const {getAuth} = await import('../lightship/common/firebase')
  const {currentUser} = getAuth()

  // NOTE(christoph): When forceRefresh is false, getIdToken returns the existing token if it
  // will be valid for at least 5 more minutes. Therefore we won't manage our own timing in
  // redux, instead just make sure to update redux with the latest JWT whenever it changes.
  const jwt = await currentUser.getIdToken(!!options?.forceRefresh)
  const {jwt: existingJwt} = getState().user
  if (existingJwt !== jwt) {
    dispatch({type: 'USER_JWT', jwt, jwtSource: 'firebase'})
  }
}

const refreshJwt = (): AsyncThunk => async (dispatch, getState) => {
  const {jwtSource} = getState().user
  if (jwtSource === 'firebase') {
    await dispatch(refreshFirebaseJwt({forceRefresh: true}))
  } else if (jwtSource === 'cognito') {
    await dispatch(cognitoUserSessionAction.refreshCognitoJwt())
  } else if (jwtSource === '8w') {
    await dispatch(userNianticSessionActions.refresh8wJwt())
  }
}

// An authenticated action requires a logged-in user. When the authenticated user
// has changed or disappeared, record in redux and do nothing else.
const refreshJwtIfExpired = (): AsyncThunk => async (dispatch, getState) => {
  const {jwtSource} = getState().user

  if (jwtSource === 'firebase') {
    await dispatch(refreshFirebaseJwt({forceRefresh: false}))
  } else if (jwtSource === 'cognito') {
    await dispatch(cognitoUserSessionAction.refreshCognitoJwtIfExpired())
  } else if (jwtSource === '8w') {
    await dispatch(userNianticSessionActions.refresh8wJwtIfExpired())
  } else {
    // eslint-disable-next-line no-console
    console.error('Attempted to refresh a token without a source')
  }
}

export const rawActions = {
  refreshJwtIfExpired,
  refreshJwt,
  refreshFirebaseJwt,
}

export type UserSessionActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
