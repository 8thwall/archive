import type {CognitoIdentityServiceProvider} from 'aws-sdk'

import {entry} from '../../registry'

type ICognitoPrivate = CognitoIdentityServiceProvider & {
  config: CognitoIdentityServiceProvider['config'] & {UserPoolId: string, ClientId: string}
}

const Cognito = entry<ICognitoPrivate>('cognito-private')

export {Cognito}
export type {ICognitoPrivate}
