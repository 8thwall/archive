import {batch} from 'react-redux'
import {push} from 'redux-first-history'
import type {DeepReadonly} from 'ts-essentials'

import {dispatchify} from '../common'
import type {AsyncThunk, DispatchifiedActions} from '../common/types/actions'
import authenticatedFetch from '../common/authenticated-fetch'
import {
  SET_PENDING, SET_LOGGED_IN_USER, UPDATE_ATTRIBUTE, INCOMPLETE_SIGNUP, CLEAR_INCOMPLETE_SIGNUP,
  acknowledgeError, pendingAction, updateAttributeAction,
} from './user-niantic-action-types'
import type {
  LoginProvider, LoginUserNianticRequest, UserNianticAuthResponse, SignUpUserNianticRequest,
  GetUserNianticResponse,
  MigrateNianticRequest,
  SignUpUserNianticResponse,
  DisconnectUserLoginRequest,
  DisconnectUserLoginResponse,
  VerifyEmailRequest,
  ConnectUserLoginResponse,
  ConnectUserLoginRequest,
  VerifyEmailResponse,
  PatchUserNianticRequest,
  PatchUserNianticResponse,
  CreateLoginTokenResponse,
} from '../../shared/users/users-niantic-types'
import {errorAction} from './user-niantic-action-types'
import {authenticateUser, clearAllCognitoUserData} from '../user/cognito-user-manager'
import {COGNITO_AUTH_PROVIDER_ID} from '../../shared/users/users-niantic-constants'
import {ACTIONS, LOGIN_ERRORS, EMAIL_VERIFICATION_ERRORS} from './user-niantic-errors'
import {
  postgresUserToCognitoAttributes,
} from '../../shared/integration/user/cognito-user-api-adapters'
import {publicApiFetch} from '../common/public-api-fetch'
import {EMAIL_PATTERN} from '../../shared/user-constants'
import {
  rawActions as userNianticSessionActions,
} from './user-niantic-session-actions'
import {
  CONNECT_EMAIL_ERRORS, CONNECT_LOGIN_ERRORS, CREATE_LOGIN_TOKEN_ERRORS, DISCONNECT_LOGIN_ERRORS,
  MIGRATE_ERRORS,
  UPDATE_EMAIL_ERRORS,
} from '../../shared/users/errors'
import type {LoggedInUserState} from './user-niantic-types'
import {getMonogram} from '../../shared/profile/user-monogram'
import {TOS_CURRENT_VERSION} from '../../shared/tos'
import {SignUpPathEnum} from '../common/paths'
import {rawActions as teamActions} from '../team/team-actions'

const signupInvitedUser = (params: SignUpUserNianticRequest, callback?: () => Promise<void>):
AsyncThunk<boolean> => async (dispatch) => {
  const {authProviderId, providerToken, email, givenName, familyName, password} = params

  dispatch(pendingAction({signup: true}))

  try {
    dispatch({type: CLEAR_INCOMPLETE_SIGNUP})
    // Google and Apple require a provider token.
    if (authProviderId !== COGNITO_AUTH_PROVIDER_ID && !providerToken) {
      throw new Error('Missing auth provider token')
    }

    if (!authProviderId) {
      throw new Error('Missing auth provider id')
    }

    if (!givenName || !familyName) {
      dispatch({
        type: INCOMPLETE_SIGNUP,
        user: {...params},
      })
      return false
    }

    // Create new user in DB
    const {
      refreshTime, user,
    }: SignUpUserNianticResponse = await dispatch(publicApiFetch('/users/niantic/signup', {
      method: 'POST',
      body: JSON.stringify({
        authProviderId,
        providerToken,
        email,
        givenName,
        familyName,
        password,
      }),
    }))

    await dispatch(userNianticSessionActions.cacheUserNiantic(user.uuid, refreshTime))
    await dispatch(userNianticSessionActions.setJwt(refreshTime))

    // Set Cognito-formatted attributes for backwards compatibility.
    const cognitoAttributes = postgresUserToCognitoAttributes(user)
    const attributes = {
      ...cognitoAttributes,
      confirmed: cognitoAttributes.phone_number_verified === 'true' ||
                 cognitoAttributes.email_verified === 'true',
    }

    batch(() => {
      dispatch({type: 'AUTHENTICATED'})
      dispatch({type: SET_LOGGED_IN_USER, user})
      dispatch({type: 'USER_ATTRIBUTES', attributes})
    })

    if (callback) {
      await callback()
    }

    return true
  } catch (err) {
    dispatch(errorAction({action: ACTIONS.SIGNUP, error: err.message}))
    return false
  } finally {
    dispatch(pendingAction({signup: false}))
  }
}

const signup = (params: SignUpUserNianticRequest): AsyncThunk<boolean> => async (dispatch) => {
  const {authProviderId, providerToken, email, givenName, familyName, password} = params
  try {
    dispatch({type: CLEAR_INCOMPLETE_SIGNUP})
    // Google and Apple require a provider token.
    if (authProviderId !== COGNITO_AUTH_PROVIDER_ID && !providerToken) {
      throw new Error('Missing auth provider token')
    }

    if (!authProviderId) {
      throw new Error('Missing auth provider id')
    }

    if (!givenName || !familyName) {
      dispatch({
        type: INCOMPLETE_SIGNUP,
        user: {...params},
      })
      return false
    }

    dispatch({type: SET_PENDING, pending: {signup: true}})

    // Create new user in DB
    const {
      refreshTime, user,
    }: SignUpUserNianticResponse = await dispatch(publicApiFetch('/users/niantic/signup', {
      method: 'POST',
      body: JSON.stringify({
        authProviderId,
        providerToken,
        email,
        givenName,
        familyName,
        password,
      }),
    }))

    const crmData = {
      email: user.primaryContactEmail,
      given_name: user.givenName,
      family_name: user.familyName,
      locale: user.locale,
    }

    await dispatch(userNianticSessionActions.cacheUserNiantic(user.uuid, refreshTime))
    await dispatch(userNianticSessionActions.setJwt(refreshTime))

    // Create new account in db.
    const createAccountPath = '/v1/accounts/signup'
    const account = await dispatch(authenticatedFetch(createAccountPath, {
      method: 'POST',
      body: JSON.stringify(crmData),
    }))

    // Set Cognito-formatted attributes for backwards compatibility.
    const cognitoAttributes = postgresUserToCognitoAttributes(user)
    const attributes = {
      ...cognitoAttributes,
      confirmed: cognitoAttributes.phone_number_verified === 'true' ||
      cognitoAttributes.email_verified === 'true',
    }

    // NOTE(johnny): We probably don't need to set user attributes here because of AUTHENTICATED.
    batch(() => {
      dispatch({type: 'AUTHENTICATED'})
      dispatch({type: 'ACCOUNTS_SET_ONE', account})
      dispatch({type: SET_LOGGED_IN_USER, user})
      dispatch({type: 'USER_ATTRIBUTES', attributes})
    })
    return true
  } catch (err) {
    dispatch(errorAction({action: ACTIONS.SIGNUP, error: err.message}))
    return false
  } finally {
    dispatch({type: SET_PENDING, pending: {signup: false}})
  }
}

type AuthenticationRedirect = {
  path: string
  forceRefresh?: boolean
}

type Credentials = {
  email: string
  password: string
} | string

const getUser = () => async (dispatch) => {
  dispatch({type: SET_PENDING, pending: {getUser: true}})
  // TODO(brandon): Set error for get user to false.
  try {
    const {user, niantic}: GetUserNianticResponse = (
      await dispatch(authenticatedFetch('/v1/users/niantic'))
    )
    const flattenedUserResponse = {...user, ...niantic}
    dispatch({type: SET_LOGGED_IN_USER, user: flattenedUserResponse})
    return flattenedUserResponse
  } catch (error) {
    // TODO(brandon): Set error for get user to true/ error message.
    return null
  } finally {
    dispatch({type: SET_PENDING, pending: {getUser: false}})
  }
}

const getUserAttributes = () => async (dispatch) => {
  try {
    const user = await dispatch(getUser())
    const cognitoAttributes = postgresUserToCognitoAttributes(user)

    const attributes = {
      ...cognitoAttributes,
      confirmed: cognitoAttributes.phone_number_verified === 'true' ||
                 cognitoAttributes.email_verified === 'true',
    }
    dispatch({type: 'USER_ATTRIBUTES', attributes})
    // Enable Google Analytics User-ID feature using Cognito sub
    window.dataLayer.push({userId: user.uuid})
    return {user: attributes}
  } catch {
    return null
  }
}

const handleSuccessfulLogin = (
  userUuid: string, refreshTime: number, redirect?: AuthenticationRedirect
) => async (dispatch) => {
  await dispatch(userNianticSessionActions.cacheUserNiantic(userUuid, refreshTime))
  await dispatch(userNianticSessionActions.setJwt(refreshTime))

  dispatch({type: 'AUTHENTICATED'})
  const userAttributes = await dispatch(getUserAttributes())

  // NOTE(wayne): Update ToS agreement Redux store states
  // to check if a user is eligible for sso login in /sso page after logging in
  if (userAttributes?.user &&
    !JSON.parse(userAttributes.user['custom:tos'] || '{}')[TOS_CURRENT_VERSION]) {
    dispatch({type: 'SHOW_TOS', showToS: true})
  }

  if (userAttributes?.user.confirmed === false) {
    window.location.href = SignUpPathEnum.step2VerifyEmail
    return
  } else {
    // TODO(alvinp): Remove this once we move the Cognito authentication to the server.
    clearAllCognitoUserData()
  }

  if (redirect) {
    if (redirect?.forceRefresh) {
      window.location.href = redirect.path
    } else {
      dispatch(push(redirect.path))
    }
  }
}

const loginWithToken = (token: string, redirect?: AuthenticationRedirect) => async (dispatch) => {
  try {
    dispatch(acknowledgeError(ACTIONS.LOGIN))
    dispatch(pendingAction({verifyLoginToken: true}))

    const {userUuid, refreshTime}: UserNianticAuthResponse = await dispatch(
      publicApiFetch('/users/niantic/login/verifyToken', {
        method: 'POST',
        body: JSON.stringify({token}),
      })
    )

    await dispatch(handleSuccessfulLogin(userUuid, refreshTime, redirect))
  } catch (e) {
    dispatch(errorAction({
      action: ACTIONS.LOGIN,
      error: LOGIN_ERRORS.INVALID_LOGIN_TOKEN,
    }))
  } finally {
    dispatch(pendingAction({verifyLoginToken: false}))
  }
}

const createLoginToken = () => async (dispatch) => {
  try {
    dispatch(acknowledgeError(ACTIONS.CREATE_LOGIN_TOKEN))
    dispatch(pendingAction({createLoginToken: true}))

    const {token}: CreateLoginTokenResponse = await dispatch(
      authenticatedFetch('/v1/users/niantic/login/token', {
        method: 'POST',
      })
    )

    return token
  } catch (err) {
    dispatch(errorAction({
      action: ACTIONS.CREATE_LOGIN_TOKEN,
      error: err.message || CREATE_LOGIN_TOKEN_ERRORS.UNEXPECTED,
    }))

    return null
  } finally {
    dispatch(pendingAction({createLoginToken: false}))
  }
}

// TODO(johnny): Create an system so we can translate the error messages.
const login = (
  authProviderId: LoginProvider, credentials: Credentials, redirect?: AuthenticationRedirect
) => async (dispatch) => {
  try {
    dispatch(acknowledgeError(ACTIONS.LOGIN))
    dispatch(pendingAction({login: true}))
    if (!authProviderId || !credentials) {
    // eslint-disable-next-line local-rules/hardcoded-copy
      dispatch(errorAction({action: ACTIONS.LOGIN, error: LOGIN_ERRORS.MISSING_ACCOUNT}))
      return
    }

    let providerToken: string
    if (typeof credentials === 'string') {
      providerToken = credentials
    } else {
      const {email, password} = credentials
      try {
        providerToken = await authenticateUser(email, password)
      } catch (err) {
        const lowerCaseEmail = email.toLowerCase()
        const errCode = err?.code

        if (errCode === 'NewPasswordRequiredException') {
          dispatch(push('/set-new-password'))
          return
        }

        const shouldRetryLogin = lowerCaseEmail !== email &&
          (errCode === 'UserNotFoundException' || errCode === 'NotAuthorizedException')

        if (!shouldRetryLogin) {
          dispatch(errorAction({action: ACTIONS.LOGIN, error: LOGIN_ERRORS.INCORRECT_LOGIN}))
          return
        }

        try {
          providerToken = await authenticateUser(lowerCaseEmail, password)
        } catch {
          dispatch(errorAction({action: ACTIONS.LOGIN, error: LOGIN_ERRORS.INCORRECT_LOGIN}))
          return
        }
      }
    }

    try {
      const body: LoginUserNianticRequest = {authProviderId, providerToken}

      const {userUuid, refreshTime}: UserNianticAuthResponse = await dispatch(
        publicApiFetch('users/niantic/login', {
          method: 'POST',
          body: JSON.stringify(body),
        })
      )

      await dispatch(handleSuccessfulLogin(userUuid, refreshTime, redirect))
    } catch (err) {
      if (authProviderId === COGNITO_AUTH_PROVIDER_ID && err?.status === 401) {
      // NOTE(johnny): User has a Cognito account but no Niantic Id.
        batch(() => {
          dispatch(push('/'))
          dispatch({type: 'SHOW_MIGRATE_USER', showMigrateUser: true})
        })
        return
      }
      dispatch(errorAction({action: ACTIONS.LOGIN, error: LOGIN_ERRORS.MISSING_ACCOUNT}))
    }
  } catch (err) {
    dispatch(errorAction({
      action: ACTIONS.LOGIN,
      error: err.message || LOGIN_ERRORS.MISSING_ACCOUNT,
    }))
  } finally {
    dispatch(pendingAction({login: false}))
  }
}

const patchUser = (
  attributes: PatchUserNianticRequest
): AsyncThunk<boolean> => async (dispatch, getState) => {
  dispatch(pendingAction({patchUser: true}))

  const formData = new FormData()
  Object.keys(attributes).forEach(key => formData.append(key, attributes[key]))

  try {
    const {user}: PatchUserNianticResponse = (
      await dispatch(authenticatedFetch('/v1/users/niantic/patch', {
        method: 'PATCH',
        body: formData,
        json: false,
      }))
    )
    const flattedUser: DeepReadonly<LoggedInUserState> = {
      ...getState().userNiantic.loggedInUser,
      ...user,
      profilePhotoMonogram: getMonogram(user.givenName),
    }

    dispatch({type: SET_LOGGED_IN_USER, user: flattedUser})

    // Refresh team data with the newly patched user.
    await dispatch(teamActions.getRoles())

    return true
  } catch (err) {
    // TODO(alvinp): Set error in redux for patching user.
    return false
  } finally {
    dispatch(pendingAction({patchUser: false}))
  }
}

const verifyEmail = (
  verificationCode: number,
  verificationBehavior: VerifyEmailRequest['verificationBehavior']
): AsyncThunk<boolean> => async (dispatch, getState): Promise<boolean> => {
  dispatch(pendingAction({verifyEmail: true}))

  try {
    const {login: newLogin, user}: VerifyEmailResponse = await dispatch(
      authenticatedFetch('/v1/users/niantic/verify', {
        method: 'POST',
        body: JSON.stringify({verificationCode, verificationBehavior}),
      })
    )

    const logins = getState().userNiantic.loggedInUser.logins || []
    const newLogins = logins.filter(loginType => loginType.provider !== newLogin.provider)
    newLogins.push(newLogin)

    dispatch({
      type: UPDATE_ATTRIBUTE,
      attribute: {
        logins: newLogins,
        ...(user || {}),
      },
    })
    return true
  } catch (err) {
    dispatch(errorAction({
      action: ACTIONS.EMAIL_VERIFICATION, error: EMAIL_VERIFICATION_ERRORS.INVALID,
    }))
    return false
  } finally {
    await dispatch(getUserAttributes())
    dispatch(pendingAction({verifyEmail: false}))
  }
}

const getVerificationCode = (): AsyncThunk => async (dispatch) => {
  dispatch(acknowledgeError(ACTIONS.EMAIL_VERIFICATION))
  try {
    await dispatch(authenticatedFetch('/v1/users/niantic/getVerificationCode'))
  } catch (err) {
    if (err.status === 400 && err.message === EMAIL_VERIFICATION_ERRORS.LIMIT_EXCEEDED_EXCEPTION) {
      dispatch(errorAction({
        action: ACTIONS.EMAIL_VERIFICATION,
        error: EMAIL_VERIFICATION_ERRORS.LIMIT_EXCEEDED_EXCEPTION,
      }))
    } else {
      dispatch(errorAction({
        action: ACTIONS.EMAIL_VERIFICATION,
        error: EMAIL_VERIFICATION_ERRORS.CODE_SENT_FAILED,
      }))
    }
  }
}

// Note: This action changes this user's email and sends a new verification code to that email.
const changeVerificationEmail = (newEmail: string): AsyncThunk => async (dispatch, getState) => {
  dispatch(acknowledgeError(ACTIONS.EMAIL_VERIFICATION))
  dispatch(pendingAction({changeVerificationEmail: true}))
  try {
    if (!newEmail) {
      throw new Error(EMAIL_VERIFICATION_ERRORS.EMPTY_EMAIL)
    }

    const EMAIL_REGEX = new RegExp(EMAIL_PATTERN)
    if (!EMAIL_REGEX.test(newEmail.toLowerCase())) {
      throw new Error(EMAIL_VERIFICATION_ERRORS.INVALID_EMAIL)
    }

    if (!EMAIL_REGEX.test(newEmail)) {
      throw new Error(EMAIL_VERIFICATION_ERRORS.LOWER_CASE_EMAIL)
    }

    await dispatch(authenticatedFetch('/v1/users/niantic/email',
      {
        method: 'PATCH',
        body: JSON.stringify({email: newEmail}),
      }))

    const {loggedInUser} = getState().userNiantic
    const {logins = []} = loggedInUser
    const updatedLogins = [
      ...logins.filter(loginType => loginType.provider !== COGNITO_AUTH_PROVIDER_ID),
      {provider: COGNITO_AUTH_PROVIDER_ID, email: newEmail},
    ]

    dispatch({
      type: UPDATE_ATTRIBUTE,
      attribute: {
        primaryContactEmail: newEmail,
        logins: updatedLogins,
      },
    })
  } catch (err) {
    dispatch(errorAction({
      action: ACTIONS.EMAIL_VERIFICATION,
      error: err.message || EMAIL_VERIFICATION_ERRORS.CHANGE_EMAIL_FAILED,
    }))
  } finally {
    dispatch(pendingAction({changeVerificationEmail: false}))
  }
}

const migrateUser = (
  authProviderId?: LoginProvider, providerToken?: string
): AsyncThunk<boolean> => async (dispatch) => {
  dispatch({type: SET_PENDING, pending: {migrateUser: true}})

  const req: MigrateNianticRequest = {authProviderId, providerToken}

  try {
    const {userUuid, refreshTime}: UserNianticAuthResponse = await dispatch(
      publicApiFetch('/users/niantic/link', {
        method: 'POST',
        body: JSON.stringify(req),
      })
    )
    await dispatch(userNianticSessionActions.cacheUserNiantic(userUuid, refreshTime))
    return true
  } catch (err) {
    const error = Object.values(MIGRATE_ERRORS).includes(err.message)
      ? err.message
      : MIGRATE_ERRORS.FAILED_TO_MIGRATE
    dispatch(errorAction({action: ACTIONS.MIGRATE, error}))
    return false
  } finally {
    dispatch({type: SET_PENDING, pending: {migrateUser: false}})
  }
}

const disconnectLogin = (
  authProviderId: LoginProvider
): AsyncThunk<boolean> => async (dispatch) => {
  dispatch(acknowledgeError(ACTIONS.DISCONNECT_LOGIN))
  dispatch({type: SET_PENDING, pending: {disconnectLogin: true}})

  const req: DisconnectUserLoginRequest = {authProviderId}

  try {
    const {logins}: DisconnectUserLoginResponse = await dispatch(
      authenticatedFetch('/v1/users/niantic/unlink', {
        method: 'POST',
        body: JSON.stringify(req),
      })
    )

    dispatch({type: UPDATE_ATTRIBUTE, attribute: {logins}})

    return true
  } catch (err) {
    dispatch(errorAction({
      action: ACTIONS.DISCONNECT_LOGIN,
      error: err.message || DISCONNECT_LOGIN_ERRORS.FAILED_TO_DISCONNECT,
    }))

    return false
  } finally {
    dispatch({type: SET_PENDING, pending: {disconnectLogin: false}})
  }
}

const connectLogin = (
  authProviderId: Omit<LoginProvider, 'cognito'>,
  providerToken: string
): AsyncThunk => async (dispatch, getState) => {
  dispatch(acknowledgeError(ACTIONS.CONNECT_LOGIN))
  dispatch(pendingAction({connectLogin: true}))

  const req: ConnectUserLoginRequest = {
    authProviderId,
    providerToken,
  }

  try {
    const {login: newLogin}: ConnectUserLoginResponse = await dispatch(
      authenticatedFetch('/v1/users/niantic/link', {
        method: 'POST',
        body: JSON.stringify(req),
      })
    )

    const filteredCurrentLogins = getState().userNiantic.loggedInUser.logins.filter(
      l => l.provider !== newLogin.provider
    )

    dispatch(updateAttributeAction({
      logins: [...filteredCurrentLogins, newLogin],
    }))
  } catch (err) {
    dispatch(errorAction({
      action: ACTIONS.CONNECT_LOGIN,
      error: err.message || CONNECT_LOGIN_ERRORS.FAILED_TO_LINK,
    }))
  } finally {
    dispatch(pendingAction({connectLogin: false}))
  }
}

type ConnectEmailParams = {
  email: string
  password: string
  confirmPassword: string
}

const connectEmail = ({
  email, password, confirmPassword,
}: ConnectEmailParams): AsyncThunk<boolean> => async (dispatch) => {
  dispatch(acknowledgeError(ACTIONS.CONNECT_EMAIL))
  dispatch(pendingAction({connectEmail: true}))

  const req = {
    email,
    password,
    pwconf: confirmPassword,
  }

  try {
    await dispatch(
      authenticatedFetch('/v1/users/niantic/link/email', {
        method: 'POST',
        body: JSON.stringify(req),
      })
    )
    return true
  } catch (err) {
    dispatch(errorAction({
      action: ACTIONS.CONNECT_EMAIL,
      error: err.message || CONNECT_EMAIL_ERRORS.FAILED_TO_LINK,
    }))
    return false
  } finally {
    dispatch(pendingAction({connectEmail: false}))
  }
}

const updateEmail = (
  email: string, newEmail: string, password: string
): AsyncThunk<boolean> => async (dispatch) => {
  dispatch(acknowledgeError(ACTIONS.UPDATE_EMAIL))
  dispatch(pendingAction({updateEmail: true}))
  try {
    if (!newEmail) {
      throw new Error(UPDATE_EMAIL_ERRORS.EMPTY_EMAIL)
    }

    const EMAIL_REGEX = new RegExp(EMAIL_PATTERN)
    if (!EMAIL_REGEX.test(newEmail.toLowerCase())) {
      throw new Error(UPDATE_EMAIL_ERRORS.INVALID_EMAIL)
    }

    if (!EMAIL_REGEX.test(newEmail)) {
      throw new Error(UPDATE_EMAIL_ERRORS.LOWER_CASE_EMAIL)
    }

    await dispatch(authenticatedFetch('/v1/users/niantic/link/email',
      {
        method: 'PATCH',
        body: JSON.stringify({email, newEmail, password}),
      }))
    return true
  } catch (err) {
    dispatch(errorAction({
      action: ACTIONS.UPDATE_EMAIL,
      error: err.message || UPDATE_EMAIL_ERRORS.UPDATE_EMAIL_FAILED,
    }))
    return false
  } finally {
    dispatch(pendingAction({updateEmail: false}))
  }
}

const loginDiscourse = (sso: string, sig: string) => async (dispatch) => {
  try {
    const res =
      await dispatch(authenticatedFetch(`/v1/users/niantic/discourse?sso=${sso}&sig=${sig}`))
    window.location.href = res.link
  } catch (error) {
    window.location.href = 'https://forum.8thwall.com/session/sso_login?sso=error&sig=error'
  }
}

const rawActions = {
  signup,
  login,
  loginWithToken,
  getUser,
  patchUser,
  signupInvitedUser,
  verifyEmail,
  migrateUser,
  getVerificationCode,
  changeVerificationEmail,
  disconnectLogin,
  connectLogin,
  connectEmail,
  getUserAttributes,
  updateEmail,
  loginDiscourse,
  createLoginToken,
}

type UserActions = DispatchifiedActions<typeof rawActions>

const actions = dispatchify(rawActions)

export {
  actions as default,
  rawActions,
}

export type {
  UserActions,
}
