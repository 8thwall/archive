import {push} from 'redux-first-history'
import type {CognitoUser} from '@aws-amplify/auth'

import {dispatchify, onError} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import unauthenticatedFetch from '../common/unauthenticated-fetch'
import type {AsyncThunk, DispatchifiedActions} from '../common/types/actions'
import {
  createCognitoUser,
  getUserPool,
  authenticateUser,
  signOutAndClearCookies,
  getRefreshedUserAndSession,
} from './cognito-user-manager'
import {rawActions as cognitoUserSessionActions} from './cognito-user-session-actions'
import {JWT_REFRESH_INTERVAL_MILLIS} from './user-constants'
import {MILLISECONDS_PER_SECOND} from '../../shared/time-utils'
import {TOS_CURRENT_VERSION, type TermsVersion} from '../../shared/tos'
import fetchWithJwt from '../common/fetch-with-jwt'
import {rawActions as userNianticActions} from '../user-niantic/user-niantic-actions'
import {
  rawActions as userNianticSessionActions,
} from '../user-niantic/user-niantic-session-actions'
import {publicApiFetch} from '../common/public-api-fetch'

interface IUser {
  uuid?: string
  email: string
  // eslint-disable-next-line camelcase
  given_name: string
  // eslint-disable-next-line camelcase
  family_name: string
  confirmed: boolean
  jwt: string
  'custom:crmId'?: string
  'custom:newsletterId'?: string
  signUpOk?: boolean
}

// AWSCognito is loaded by index.html
let AuthenticationDetails
let CognitoUserAttribute
if (typeof window !== 'undefined') {
  AuthenticationDetails = window.AmazonCognitoIdentity.AuthenticationDetails
  CognitoUserAttribute = window.AmazonCognitoIdentity.CognitoUserAttribute
} else {
  AuthenticationDetails = () => {}
  CognitoUserAttribute = () => {}
}

const excludedFields = [
  'password', 'pwconf', 'sub', 'uuid', 'email_verified', 'phone_number_verified', 'avatar',
  'message', 'error', 'recaptcha', 'action', 'crmId', 'newsletterId',
]

const attributesToList = (attr, excludes = []) => Object.keys(attr)
  .filter(key => [...excludes, ...excludedFields].indexOf(key) < 0)
  .filter(key => attr[key].length)
  .map(key => new CognitoUserAttribute({Name: key, Value: attr[key]}))

const clearLoginState = () => ({type: 'USER_LOGOUT'})

const onErrorCallback = (
  dispatch, onSuccess?: (result: any) => void, always?: (err: any, result: any) => void
) => (err: any, result: any) => {
  if (always) {
    always(err, result)
  }
  if (err) {
    dispatch(onError(err.message ? err.message : err))
    return err
  }
  if (onSuccess) {
    onSuccess(result)
  }
  return null
}

const prepEmail = (email: string): string => email.trim()

// //////////////////////////////////////////////////////////
// public methods
const linkCurrentUserToCrm = () => async (dispatch) => {
  try {
    const res = await dispatch(authenticatedFetch('/v1/users/crmId', {method: 'PATCH'}))
    return res
  } catch (err) {
    dispatch(onError(err.message))
    return null
  }
}

const getCurrentCognitoUser = async (dispatch): Promise<CognitoUser> => {
  const {user, session} = await dispatch(cognitoUserSessionActions.getValidatedUserAndSession())

  // Update Redux store with new tokens.
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
  return user
}

const loadCachedUserJwt = (): AsyncThunk<void> => async (dispatch, getState) => {
  await dispatch(userNianticSessionActions.loadCachedJwt())

  if (getState().user.jwtSource !== '8w') {
    try {
      await getCurrentCognitoUser(dispatch)
    } catch (e) {
      // No-op. getCurrentCognitoUser throws if no Cognito user is cached.
    }
  }
}

const initialize = (): AsyncThunk<void> => async (dispatch, getState) => {
  await dispatch(loadCachedUserJwt())
  const {jwtSource} = getState().user

  if (!jwtSource) {
    // If no jwt is set, we can't fetch any user data.
    dispatch({type: 'LOADING_USER', loading: false})
    return
  }
  const userAttributes = await dispatch(userNianticActions.getUserAttributes())
  dispatch({type: 'LOADING_USER', loading: false})

  if (jwtSource === 'cognito') {
    // NOTE(johnny): userAttributes is null if the user is migrated but is using a Cognito token.
    if (!userAttributes) {
      await dispatch(userNianticSessionActions.logout())
      return
    }
    dispatch({type: 'SHOW_MIGRATE_USER', showMigrateUser: true})
  }

  if (userAttributes?.user &&
    !JSON.parse(userAttributes.user['custom:tos'] || '{}')[TOS_CURRENT_VERSION]) {
    dispatch({type: 'SHOW_TOS', showToS: true})
  }
}

interface AuthenticationRedirect {
  path: string
  forceRefresh?: boolean
}

type Credentials = {
  email: string
  password: string
}

const authenticationPromise = (
  {email, password}: Credentials,
  redirect: AuthenticationRedirect | null,
  callback?: () => void
) => (dispatch) => {
  // TODO(alvinp): Migrate this over to call authenticateUser from cognito-user-manager.ts
  // once we've confirmed `mfaRequired` is never called.
  const authenticationDetails = new AuthenticationDetails({Username: email, Password: password})
  const user = createCognitoUser(email)
  return new Promise((resolve, reject) => (
    user.authenticateUser(authenticationDetails, {
      onSuccess: () => {
        dispatch({type: 'ACKNOWLEDGE_ERROR'})
        dispatch({type: 'AUTHENTICATED'})
        dispatch(userNianticActions.getUserAttributes()).then(() => {
          if (callback) {
            callback()
          }

          if (redirect?.forceRefresh) {
            window.location.href = redirect.path
          } else if (redirect?.path) {
            dispatch(push(redirect.path))
          }
        }).then(resolve)
      },

      onFailure: err => reject(err),

      mfaRequired: () => {
        const mfaCode = prompt('Please input verification code', '')
        user.sendMFACode(mfaCode, this)
      },
    })
  ))
}

const authenticate = (
  {email: rawEmail, password}: Credentials, redirect?: AuthenticationRedirect, callback?: () => void
) => async (dispatch) => {
  if (!password || !rawEmail) {
    dispatch(onError('Must supply both password and email'))
    throw new Error('Must supply both password and email')
  }

  const email = prepEmail(rawEmail)
  let res: any

  try {
    res = await dispatch(authenticationPromise({email, password}, redirect, callback))
    return res
  } catch (err) {
    const lowerCaseEmail = email.toLowerCase()
    const errCode = err?.code
    if ((errCode === 'UserNotFoundException' || errCode === 'NotAuthorizedException') &&
      lowerCaseEmail !== email) {
      // Retry with all lower case email
      try {
        res = await dispatch(authenticationPromise(
          {email: lowerCaseEmail, password}, redirect, callback
        ))
        return res
      } catch {
        // Fall through to onErrorCallback
      }
    }
    onErrorCallback(dispatch, null, callback)(err, res)
    throw err
  }
}

// only add the attribute needed to be changed in attributes
const updateAttribute = (
  attributes, onSuccess?: () => void, onFailure?: (err: any) => void
) => async (dispatch) => {
  if (attributes.email && typeof attributes.email === 'string') {
    attributes.email = attributes.email.trim()
  }

  try {
    await dispatch(authenticatedFetch('/v1/users', {
      method: 'PATCH',
      body: JSON.stringify(attributes),
    }))

    // call onSuccess after update redux store
    await dispatch(userNianticActions.getUserAttributes())
    if (onSuccess) {
      onSuccess()
    }
  } catch (e) {
    if (onFailure) {
      onFailure(e)
    }
  }
}

const attributeVerification = (
  attributeName: string, verificationCode: string
) => async (dispatch) => {
  const cognitoUser = await getCurrentCognitoUser(dispatch)

  return new Promise<void>((resolve, reject) => (
    cognitoUser.verifyAttribute(attributeName, verificationCode, {
      onSuccess: () => {
        dispatch({type: 'ACKNOWLEDGE_ERROR'})
        if (attributeName === 'email') {
          const attributeUpdate = {
            'email_verified': 'true',  // excluded by attributesToList(). Use string as Cognito
            'custom:emailVerifyTime': Date.now().toString(),
          }
          dispatch(updateAttribute(attributeUpdate))
        }
        dispatch({type: 'AUTHENTICATED'})
        dispatch(userNianticActions.getUserAttributes())
        resolve()
      },
      onFailure: (err) => {
        dispatch(onError(err.message))
        reject()
      },
    })
  ))
}

// used on users-reducer initialization
const checkSignUpOk = () => async (dispatch): Promise<boolean> => {
  const res = await dispatch(unauthenticatedFetch('/signUpOk'))
  dispatch({type: 'USER_SIGNUP_OK_SET', signUpOk: res})
  return res
}

const signUp = (attributes, crmAttributes = null) => (dispatch): Promise<void> => (
  new Promise((resolve, reject) => (
    getUserPool().signUp(
      attributes.email,
      attributes.password,
      attributesToList(attributes, ['email', 'accountType']),
      null /* validationData */,
      async (err, result) => {
        if (err) {
          dispatch(onError(err.message ? err.message : err))
          reject(err)
          return
        }

        // TODO(dat): We can authenticate before talking to our server
        // which would allow us to update and link up crmId in one go
        // instead. To be done once we launch free trial and deprecate
        // the old sign up flow
        attributes.userUuid = result.userSub
        crmAttributes.userUuid = result.userSub
        const accessToken = await authenticateUser(attributes.email, attributes.password)
        dispatch({type: 'ACKNOWLEDGE_ERROR'})
        dispatch({type: 'ACCOUNT_NEW_TYPE', accountType: attributes.accountType})
        fetchWithJwt('/users/signup', accessToken, {
          method: 'POST',
          body: JSON.stringify(crmAttributes || attributes),
        })
          .then(() => {
            dispatch({type: 'ACKNOWLEDGE_ERROR'})
            dispatch({type: 'ACCOUNT_NEW_TYPE', accountType: attributes.accountType})
            dispatch(authenticate(attributes)).then(resolve)
          })
          .catch((error) => {
            dispatch({type: 'ERROR', msg: error.message})
            reject(error)
          })
      }
    )
  ))
)

const signOut = () => async (dispatch) => {
  await dispatch(userNianticSessionActions.logout())
}

const authenticateForgottenPasswordUser = (email: string): Promise<void> => {
  const user = createCognitoUser(email)
  return new Promise((resolve, reject) => (
    user.forgotPassword({
      onSuccess: () => { /* should not get here */ },
      onFailure: reject,
      inputVerificationCode: resolve,
    })
  ))
}

const forgotPassword = (
  rawEmail: string, callback: (errorKey?: string) => void
) => async (dispatch) => {
  const email = prepEmail(rawEmail)
  try {
    try {
      await authenticateForgottenPasswordUser(email)
    } catch (err) {
      const lowerCaseEmail = email.toLowerCase()
      const shouldRetry = (err?.code === 'UserNotFoundException') && lowerCaseEmail !== email
      // Retry with lowercase email
      if (shouldRetry) {
        await authenticateForgottenPasswordUser(lowerCaseEmail)
      } else {
        throw err
      }
    }
    dispatch({type: 'USER_ATTRIBUTES', attributes: {code_sent: true, email}})
    if (callback) {
      callback()
    }
  } catch (err) {
    callback('forgot_page.new_password.error.generic.message')
  }
}

type ConfirmPassword = {
  email: string
  code: string
  password: string
}

const confirmPassword = (
  {email, code, password}: ConfirmPassword, redirectTo: AuthenticationRedirect
) => (dispatch) => {
  createCognitoUser(email).confirmPassword(code, password, {
    onSuccess: () => {
      // TODO(scott) inform user password was updated
      if (redirectTo) {
        dispatch(authenticate({email, password}, redirectTo))
      }
    },
    onFailure: err => onErrorCallback(dispatch)(err, null),
  })
}

type SetNewPassword = {
  rawEmail: string
  tempPassword: string
  newPassword: string
}

const setNewPassword = (
  {rawEmail, tempPassword, newPassword}: SetNewPassword, redirectTo: AuthenticationRedirect
) => async (dispatch) => {
  const email = prepEmail(rawEmail)
  const authenticationDetails = new AuthenticationDetails({Username: email, Password: tempPassword})
  const user = createCognitoUser(email)
  user.authenticateUser(authenticationDetails, {
    onSuccess: () => {
      // Do nothing
    },

    onFailure: (err) => {
      onErrorCallback(dispatch)(err, null)
    },

    newPasswordRequired: () => {
      if (!newPassword) {
        // eslint-disable-next-line local-rules/hardcoded-copy
        onErrorCallback(dispatch)('A new password is required', null)
        return
      }

      user.completeNewPasswordChallenge(newPassword, {}, {
        onSuccess: () => {
          if (redirectTo) {
            dispatch(authenticate({email, password: newPassword}, redirectTo))
          }
        },

        onFailure: (err) => {
          onErrorCallback(dispatch)(err, null)
        },
      })
    },
  })
}

type ChangePassword = {
  oldPassword: string
  newPassword: string
  email: string
}

const changePassword = (
  {oldPassword, newPassword, email}: ChangePassword, callback: () => void
) => async (dispatch) => {
  await authenticateUser(email.toLowerCase(), oldPassword)
  const {user} = await getRefreshedUserAndSession()

  return user.changePassword(oldPassword, newPassword, onErrorCallback(dispatch, () => {
    if (callback) {
      callback()
    }
    // Note(Brandon): Clearing cognito cookies since they are no longer being used primarily for
    // interacting w/ user data.
  }, () => signOutAndClearCookies(user)))
}

const sendCode = (field: 'phone_number' | 'email') => async (dispatch) => {
  const cognitoUser = await getCurrentCognitoUser(dispatch)

  return cognitoUser.getAttributeVerificationCode(field, {
    onSuccess: () => {
      // should not get here
    },
    onFailure: err => onErrorCallback(dispatch)(err, null),
    inputVerificationCode: () => {
      dispatch({type: 'ACKNOWLEDGE_ERROR'})
      dispatch({type: 'USER_ATTRIBUTES', attributes: {code_sent: true}})
    },
  })
}

// TODO(dat): This needs to be done on the backend
const agreeToS = (version: TermsVersion) => (dispatch, getState) => {
  const tos = {...JSON.parse(getState().user['custom:tos'] || '{}'), [version]: Date.now()}
  return dispatch(updateAttribute({'custom:tos': JSON.stringify(tos)}, () => {
    dispatch({type: 'SHOW_TOS', showToS: false})
  }))
}

const toggleSidebarAccountExpanded = (accountUuid: string) => dispatch => dispatch({
  type: 'SIDEBAR/TOGGLE_ACCOUNT_EXPANDED',
  accountUuid,
})

const expandSidebarAccount = (accountUuid: string) => dispatch => dispatch({
  type: 'SIDEBAR/EXPAND_ACCOUNT',
  accountUuid,
})

const setShowNav = (toShow: boolean) => dispatch => dispatch(
  {type: 'SHOW_NAV', showNav: toShow}
)

const setShowBadges = (toShow: boolean) => dispatch => dispatch(
  {type: 'SHOW_BADGES', showBadges: toShow}
)

const listenWindowResize = (width: number) => dispatch => dispatch(
  {type: 'LISTEN_WINDOW_RESIZE', width}
)

const getWayfarerSessionToken = (
  clientId: string, redirectUri: string, scope: string, state: string, codeChallenge: string
) => async (dispatch) => {
  try {
    const res = await dispatch(authenticatedFetch('/v1/users/wfa-token',
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: clientId,
          redirect_uri: redirectUri,
          scope,
          state,
          code_challenge: codeChallenge,
        }),
      }))
    return res
  } catch (error) {
    dispatch({type: 'ERROR', msg: error.message})
    throw new Error('Could not get session token')
  }
}

const getScaniverseInternalAccessToken = (accountUuid: string) => async (dispatch) => {
  try {
    const {token} = await dispatch(authenticatedFetch('/v1/users/scaniverse-internal-token', {
      method: 'POST',
      body: JSON.stringify({accountUuid}),
    }))
    return token
  } catch (error) {
    dispatch({type: 'ERROR', msg: error.message})
    throw new Error('Could not get internal access token')
  }
}

interface NewsletterContact {
  email: string
  status?: string
  firstName?: string
  lastName?: string
  locale?: string
}

const createNewsletterContact = (newsletterContact: NewsletterContact) => async (dispatch) => {
  try {
    const res = await dispatch(publicApiFetch('/newsletter/contact', {
      method: 'POST',
      body: JSON.stringify(newsletterContact),
    }))

    return res
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.message)  // fail silently
  }

  return null
}

const patchNewsletterContact = (
  contactId: string, newsletterContact: Partial<NewsletterContact>
) => async (dispatch) => {
  try {
    const res = await dispatch(authenticatedFetch(`/v1/newsletter/contact/${contactId}`, {
      method: 'PATCH',
      body: JSON.stringify(newsletterContact),
    }))

    return res
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.message)  // fail silently
  }

  return null
}

const setDesktopLoginReturnUrl = (url: string) => (dispatch) => {
  dispatch({
    type: 'DESKTOP_LOGIN_RETURN_URL',
    url,
  })
}

const setDesktopDuplicateProjectReturnUrl = (url: string) => (dispatch) => {
  dispatch({
    type: 'DESKTOP_DUPLICATE_PROJECT_RETURN_URL',
    url,
  })
}

const rawActions = {
  agreeToS,
  attributeVerification,
  authenticate,
  changePassword,
  confirmPassword,
  setNewPassword,
  error: onError,
  forgotPassword,
  getWayfarerSessionToken,
  getScaniverseInternalAccessToken,
  linkCurrentUserToCrm,
  listenWindowResize,
  sendCode,
  setShowNav,
  toggleSidebarAccountExpanded,
  expandSidebarAccount,
  signOut,
  checkSignUpOk,
  signUp,
  updateAttribute,
  initialize,
  setShowBadges,
  clearLoginState,
  createNewsletterContact,
  patchNewsletterContact,
  setDesktopLoginReturnUrl,
  setDesktopDuplicateProjectReturnUrl,
}

type UserActions = DispatchifiedActions<typeof rawActions>

const actions = dispatchify(rawActions)

export {
  rawActions,
  actions as default,
}

export type {
  IUser,
  UserActions,
}
