import {dispatchify} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import {
  InstalledDevCookie,
  INSTALLED_DEV_COOKIE,
  DevTokenInviteRequest,
  DEV_TOKEN_INVITE_REQUEST,
  DevTokenInviteResponse,
  DEV_TOKEN_INVITE_RESPONSE,
  CLEAR_DEV_TOKEN_RESPONSE,
} from './token-types'
import type {DispatchifiedActions} from '../common/types/actions'

const installedDevCookieUpdate = (cookie: InstalledDevCookie) => <const>{
  type: INSTALLED_DEV_COOKIE,
  cookie,
}

const devInvitationRequestUpdate = (devInviteReq: DevTokenInviteRequest) => <const>{
  type: DEV_TOKEN_INVITE_REQUEST,
  devInviteReq,
}

const devInvitationResponseUpdate = (devInviteRes: DevTokenInviteResponse) => <const>{
  type: DEV_TOKEN_INVITE_RESPONSE,
  devInviteRes,
}

// Since the dev cookie is HTTP only, we need to echo it back
const getCurrentDevCookie = () => dispatch => dispatch(authenticatedFetch('/public/token', {
  headers: {
    'Accept': 'application/json',
  },
})).then(cookie => dispatch(installedDevCookieUpdate({
  version: cookie.version,
  engineUrl: cookie.engineUrl,
}))).catch(() => dispatch(installedDevCookieUpdate({
  version: '',
})))

let inviteRefreshTimeout: ReturnType<typeof setTimeout>
let refreshListenerCount = 0

const refreshDevTokenInvitation = (forceNew = false) => (dispatch, getState) => {
  clearTimeout(inviteRefreshTimeout)
  const {devInviteReq, devInviteRes} = getState().tokens

  // token invite requests must contain both of these fields
  // if they are missing the component might not have set the invite yet.
  // TODO make sure request params are set before refresh loop beings in higher components
  const isRequestEmpty = !devInviteReq.AccountUuid || !devInviteReq.uuid

  const body = {
    ...devInviteReq,
    token: forceNew ? '' : devInviteRes.token,
  }
  const baseUrl = Build8.PLATFORM_TARGET === 'desktop'
    ? window.electron.consoleServerUrl
    : window.location.origin
  const refresh = () => dispatch(authenticatedFetch('/v1/apps/devtoken', {
    method: 'PUT',
    body: JSON.stringify(body),
  })).then(({token, tokenWasUsed}) => {
    dispatch(devInvitationResponseUpdate({
      token,
      url: `${baseUrl}/public/token/${token}`,
      used: tokenWasUsed,
    }))
  })

  const refreshPromise = isRequestEmpty ? Promise.resolve() : refresh()

  return refreshPromise.then(() => {
    dispatch(getCurrentDevCookie())
    inviteRefreshTimeout = setTimeout(() => {
      if (refreshListenerCount > 0) {
        dispatch(refreshDevTokenInvitation())
      }
    }, 3 * 1000)
  })
}

const beginDevTokenInviteRefresh = () => (dispatch) => {
  refreshListenerCount++
  return dispatch(refreshDevTokenInvitation())
}

const endDevTokenInviteRefresh = () => () => {
  clearTimeout(inviteRefreshTimeout)
  refreshListenerCount--
}

const devInviteRequestEquals = (req1: DevTokenInviteRequest, req2: DevTokenInviteRequest) => (
  req1?.AccountUuid === req2?.AccountUuid &&
  req1?.uuid === req2?.uuid &&
  req1?.version === req2?.version &&
  req1?.engineUrl === req2?.engineUrl &&
  req1?.shortName === req2?.shortName
)

const updateDevInviteRequest = (devInviteReq: DevTokenInviteRequest) => (dispatch, getState) => {
  const prevReq = getState().tokens?.devInviteReq
  if (devInviteRequestEquals(prevReq, devInviteReq)) {
    // Request is the same as the previous.
    return
  }

  // There are new request params. Let's update and refresh the dev token.
  clearTimeout(inviteRefreshTimeout)
  dispatch(devInvitationRequestUpdate(devInviteReq))
  dispatch({type: CLEAR_DEV_TOKEN_RESPONSE})
  if (refreshListenerCount > 0) {
    dispatch(refreshDevTokenInvitation(true))
  }
}

// ---
export type TokenActionType =
  {type: typeof CLEAR_DEV_TOKEN_RESPONSE} |
  ReturnType<typeof installedDevCookieUpdate> |
  ReturnType<typeof devInvitationRequestUpdate> |
  ReturnType<typeof devInvitationResponseUpdate>

export const rawActions = {
  beginDevTokenInviteRefresh,
  endDevTokenInviteRefresh,
  updateDevInviteRequest,
}

export type TokenActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
