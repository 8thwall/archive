import type {AdminGetUserResponse, UserType} from 'aws-sdk/clients/cognitoidentityserviceprovider'

import {Cognito} from './cognito-private-api'

type SignUpCognitoUserAttributes = {
  email: string
  password: string
  givenName: string
  familyName: string
}

const COGNITO_ATTRIBUTE_MAP = {
  email: 'email',
  familyName: 'family_name',
  givenName: 'given_name',
}

const signupCognitoUser = async (userAttributes: SignUpCognitoUserAttributes): Promise<string> => {
  const {ClientId} = Cognito.use().config
  const {email, password} = userAttributes
  const {UserSub: userUuid} = await Cognito.use().signUp({
    ClientId,
    Username: email,
    Password: password,
    UserAttributes: Object.keys(userAttributes)
      .filter(key => key !== 'password')
      .map(key => ({Name: COGNITO_ATTRIBUTE_MAP[key], Value: userAttributes[key]})),
  }).promise()

  return userUuid
}

const getCognitoUser = (
  userUuid: string
): Promise<Partial<AdminGetUserResponse>> => Cognito.use().adminGetUser({
  UserPoolId: Cognito.use().config.UserPoolId,
  Username: userUuid,
}).promise()

const getCognitoAccessToken = async (
  userAttributes: Partial<SignUpCognitoUserAttributes>
): Promise<string> => {
  const {UserPoolId, ClientId} = Cognito.use().config
  const {email, password} = userAttributes
  const {AuthenticationResult} = await Cognito.use().adminInitiateAuth({
    UserPoolId,
    ClientId,
    AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  }).promise()

  return AuthenticationResult.AccessToken
}

const sendCognitoEmailVerificationCode = (
  accessToken: string
) => Cognito.use().getUserAttributeVerificationCode({
  AccessToken: accessToken,
  AttributeName: 'email',
}).promise()

const findCognitoUserByEmail = async (
  email: string,
  AttributesToGet: string[] = null
): Promise<UserType> => {
  const {Users: users} = await Cognito.use().listUsers({
    UserPoolId: Cognito.use().config.UserPoolId,
    AttributesToGet,
    Filter: `email = "${email}"`,
  }).promise()
  return users.find(user => (
    user.Attributes.find(a => a.Name === 'email').Value === email
  )) || null
}

const deleteUserByUsername = async (Username: string): Promise<void> => {
  await Cognito.use().adminDeleteUser({
    UserPoolId: Cognito.use().config.UserPoolId,
    Username,
  }).promise()
}

const isCognitoUserEmailVerified = (user: UserType): boolean => (
  user.Attributes.find(({Name}) => Name === 'email_verified')?.Value === 'true'
)

const isCognitoUserPhoneVerified = (user: UserType): boolean => (
  user.Attributes.find(({Name}) => Name === 'phone_number_verified')?.Value === 'true'
)

export {
  SignUpCognitoUserAttributes,
  signupCognitoUser,
  getCognitoUser,
  getCognitoAccessToken,
  deleteUserByUsername,
  findCognitoUserByEmail,
  isCognitoUserEmailVerified,
  isCognitoUserPhoneVerified,
  sendCognitoEmailVerificationCode,
}
