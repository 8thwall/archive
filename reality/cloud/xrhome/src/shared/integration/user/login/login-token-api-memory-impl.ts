import {
  EXCEED_LOGIN_TOKEN_LIMIT,
  INVALID_LOGIN_TOKEN,
  type ILoginTokenApi,
  type LoginTokenMetadata,
} from './login-token-api'
import {
  LOGIN_TOKEN_EXPIRATION,
  MAX_LOGIN_TOKENS_PER_USER,
} from '../../../users/users-niantic-constants'
import type {LoginProvider} from '../../../users/users-niantic-types'
import {generateLoginToken} from './token'

const createMemoryLoginTokenApi = (): ILoginTokenApi => {
  const inMemoryStorage: Record<string, LoginTokenMetadata> = {}

  const getTokenCountForUser = (userUuid: string): number => {
    const values = Object.values(inMemoryStorage)
    return values.filter(token => token.userUuid === userUuid).length
  }

  const createLoginToken = async (
    userUuid: string,
    authProviderId: LoginProvider,
    thirdPartyUserId: string
  ): Promise<string> => {
    const tokenCount = getTokenCountForUser(userUuid)

    if (tokenCount >= MAX_LOGIN_TOKENS_PER_USER) {
      throw new Error(EXCEED_LOGIN_TOKEN_LIMIT)
    }

    const loginToken = generateLoginToken()
    const expireAt = Date.now() + LOGIN_TOKEN_EXPIRATION
    inMemoryStorage[loginToken] = {
      loginToken,
      userUuid,
      expireAt,
      authProviderId,
      thirdPartyUserId,
    }

    return loginToken
  }

  const validateLoginToken = async (token: string): Promise<LoginTokenMetadata> => {
    if (!inMemoryStorage[token]) {
      throw new Error(INVALID_LOGIN_TOKEN)
    }

    const tokenMetadata = inMemoryStorage[token]
    delete inMemoryStorage[token]

    return tokenMetadata
  }

  return {
    createLoginToken,
    validateLoginToken,
  }
}

export {
  createMemoryLoginTokenApi,
}
