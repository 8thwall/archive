import {entry} from '../../../registry'
import type {LoginProvider} from '../../../users/users-niantic-types'

type LoginTokenMetadata = {
  loginToken: string
  userUuid: string
  expireAt: number
  authProviderId: LoginProvider
  thirdPartyUserId: string
}

const EXCEED_LOGIN_TOKEN_LIMIT = 'Exceeded token limit'
const INVALID_LOGIN_TOKEN = 'Invalid token'

interface ILoginTokenApi {
  createLoginToken: (
    userUuid: string,
    authProviderId: LoginProvider,
    thirdPartyUuid: string
  ) => Promise<string>
  validateLoginToken: (
    token: string
  ) => Promise<Omit<LoginTokenMetadata, 'loginToken' | 'expireAt'>>
}

const LoginTokenApi = entry<ILoginTokenApi>('login-token-api')

export {
  LoginTokenApi,
  EXCEED_LOGIN_TOKEN_LIMIT,
  INVALID_LOGIN_TOKEN,
  type ILoginTokenApi,
  type LoginTokenMetadata,
}
