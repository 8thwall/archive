import {entry} from '../../registry'

type DecodedCognitoToken = {
  username: string
  iat: number
  exp: number
}

interface ICognitoExpress {
  validate: (token: string, callback: (err: Error, result: DecodedCognitoToken) => void) => void
}

const CognitoExpress = entry<ICognitoExpress>('cognito-express')

export {CognitoExpress}
export type {ICognitoExpress, DecodedCognitoToken}
