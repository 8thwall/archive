import {CognitoIdentityServiceProvider} from 'aws-sdk'

import type {ICognitoPrivate} from './cognito-private-api'

interface CreateCognitoOptions {
  UserPoolId: string
  ClientId: string
  region?: string
  accessKeyId?: string
  secretAccessKey?: string
}

const createCognito = (
  {UserPoolId, ClientId, ...options}: CreateCognitoOptions
): ICognitoPrivate => {
  const client = new CognitoIdentityServiceProvider(options) as ICognitoPrivate
  client.config.UserPoolId = UserPoolId
  client.config.ClientId = ClientId
  return client
}

export {createCognito}
