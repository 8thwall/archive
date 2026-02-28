import type {CognitoUser} from '@aws-amplify/auth'
import type {CognitoUserSession} from 'amazon-cognito-identity-js'

import {makeCognitoStorage} from './cognito-storage'
import {getConfig} from '../../shared/cognito-config'

// AWSCognito is loaded by index.html
let userPool
let cognitoStorage
let createCognitoUserFunc
let AuthenticationDetails
if (typeof window !== 'undefined') {
  const {CognitoUser, CognitoUserPool} = window.AmazonCognitoIdentity
  const AWSConfig = getConfig()

  cognitoStorage = makeCognitoStorage()
  userPool = new CognitoUserPool({...AWSConfig, Storage: cognitoStorage})
  createCognitoUserFunc = email => new CognitoUser({
    Username: email,
    Pool: userPool,
    Storage: cognitoStorage,
  })
  AuthenticationDetails = window.AmazonCognitoIdentity.AuthenticationDetails
} else {
  createCognitoUserFunc = () => {}
  AuthenticationDetails = () => {}
}
const getUserPool = () => userPool
const createCognitoUser: (email: string) => CognitoUser = createCognitoUserFunc

/**
 * This method will force a refresh of the user session and access token, if the refresh token
 * is valid.
 */
const refreshCurrentUserSession = async (refreshToken) => {
  const user = userPool.getCurrentUser()
  if (!user) {
    throw new Error('No current user, not logged in')
  }

  return new Promise((resolve, reject) => {
    user.refreshSession(refreshToken, (err, session) => {
      if (err) {
        const errMessage = err.message || JSON.stringify(err)
        console.error(
          `Error refreshing the session for the current user: ${errMessage}`
        )
        reject(err)
        return
      }

      resolve({session, user})
    })
  })
}

const signOutAndClearCookies = (user) => {
  user.signOut()
  cognitoStorage.clear()
}

const clearAllCognitoUserData = () => {
  cognitoStorage.clear()
}

/**
 * Will return the currently logged-in Cognito user, and their user session.
 * If the cached access token has expired, it will be refreshed. Otherwise, this will
 * return the user and session with the existing access token.
 */
const getRefreshedUserAndSession = async () => {
  const user = userPool.getCurrentUser()
  if (!user) {
    throw new Error('No current user, not logged in')
  }

  return new Promise<{session: CognitoUserSession, user: CognitoUser}>((resolve, reject) => {
    user.getSession((err, session) => {
      if (err) {
        const errMessage = `${err.message} (${err.code})`
        console.error(
          `There was an error getting the session for the current user: ${errMessage}`
        )

        if (err.code === 'NotAuthorizedException') {
          signOutAndClearCookies(user)
        }
        reject(err)
        return
      }
      resolve({session, user})
    })
  })
}

const authenticateUser = async (email: string, password: string): Promise<string> => {
  const authenticationDetails = new AuthenticationDetails({Username: email, Password: password})
  const user = createCognitoUser(email)

  return new Promise((resolve, reject) => (
    user.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(result.getAccessToken().getJwtToken())
      },

      onFailure: err => reject(err),

      newPasswordRequired: () => {
        // TODO(wayne): This matches existing exception structure. Find a better error code to use
        /* eslint-disable prefer-promise-reject-errors,local-rules/hardcoded-copy */
        reject({
          code: 'NewPasswordRequiredException',
          name: 'NewPasswordRequiredException',
          message: 'New password required',
        })
        /* eslint-enable prefer-promise-reject-errors,local-rules/hardcoded-copy */
      },
    })
  ))
}

export {
  createCognitoUser,
  getRefreshedUserAndSession,
  refreshCurrentUserSession,
  signOutAndClearCookies,
  clearAllCognitoUserData,
  getUserPool,
  authenticateUser,
}
