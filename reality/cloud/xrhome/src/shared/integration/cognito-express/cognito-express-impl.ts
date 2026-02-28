import CognitoExpress from 'cognito-express'

import {Cognito} from '../cognito-private/cognito-private-api'
import type {ICognitoExpress} from './cognito-express-api'

const createCognitoExpress = (): ICognitoExpress => {
  const {region, UserPoolId} = Cognito.use().config
  return new CognitoExpress({
    region,
    cognitoUserPoolId: UserPoolId,
    tokenUse: 'access',
    tokenExpiration: 3600000,  // Up to default expiration of 1 hour (3600000 ms),
  })
}

export {createCognitoExpress}
