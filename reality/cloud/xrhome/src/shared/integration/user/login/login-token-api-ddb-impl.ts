import type {LoginProvider} from '../../../users/users-niantic-types'
import {Environment, getDataRealmForEnvironment} from '../../../data-realm'
import {
  EXCEED_LOGIN_TOKEN_LIMIT,
  INVALID_LOGIN_TOKEN,
  ILoginTokenApi,
  LoginTokenMetadata,
} from './login-token-api'
import {
  LOGIN_TOKEN_DDB_TABLE_NAME,
  LOGIN_TOKEN_DDB_TABLE_USER_UUID_INDEX,
  LOGIN_TOKEN_EXPIRATION,
  MAX_LOGIN_TOKENS_PER_USER,
} from '../../../users/users-niantic-constants'
import {MILLISECONDS_PER_SECOND} from '../../../time-utils'
import {Ddb} from '../../dynamodb/dynamodb'
import {
  generateLoginToken,
  encodeLoginToken,
  decodeLoginToken,
} from './token'
import {AttributesForRaw, fromAttributes, toAttributes} from '../../dynamodb/typed-attributes'

const createDdbLoginTokenApi = (env: Environment): ILoginTokenApi => {
  const dataRealm = getDataRealmForEnvironment(env)
  const ddbTableName = `${LOGIN_TOKEN_DDB_TABLE_NAME}-${dataRealm}`

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const createLoginToken = async (
    userUuid: string,
    authProviderId: LoginProvider,
    thirdPartyUserId: string
  ): Promise<string> => {
    const currentTimeSeconds = Math.floor(Date.now() / MILLISECONDS_PER_SECOND)
    // As DynamoDB does not delete expired items with TTL immediately, we need to exclude them
    const {Count} = await Ddb.use().query({
      TableName: ddbTableName,
      IndexName: LOGIN_TOKEN_DDB_TABLE_USER_UUID_INDEX,
      KeyConditionExpression: 'userUuid = :userUuid',
      FilterExpression: 'expireAt > :currentTimeSeconds',
      ExpressionAttributeValues: toAttributes({
        ':userUuid': userUuid,
        ':currentTimeSeconds': currentTimeSeconds,
      }),
      Select: 'COUNT',
    })
    if (Count >= MAX_LOGIN_TOKENS_PER_USER) {
      throw new Error(EXCEED_LOGIN_TOKEN_LIMIT)
    }

    const loginToken = generateLoginToken()
    const expireAt = currentTimeSeconds + (LOGIN_TOKEN_EXPIRATION / MILLISECONDS_PER_SECOND)
    await Ddb.use().putItem({
      TableName: ddbTableName,
      Item: {
        ...toAttributes({
          loginToken,
          userUuid,
          authProviderId,
          thirdPartyUserId,
          expireAt,
        }),
      },
      ConditionExpression: 'attribute_not_exists(loginToken)',
    })

    return encodeLoginToken(loginToken)
  }

  const validateLoginToken = async (
    token: string
  ): Promise<Omit<LoginTokenMetadata, 'loginToken' | 'expireAt'>> => {
    const decodedToken = decodeLoginToken(token)
    const item = (await Ddb.use().deleteItem({
      TableName: ddbTableName,
      Key: toAttributes({loginToken: decodedToken}),
      ReturnValues: 'ALL_OLD',
    }))?.Attributes as AttributesForRaw<LoginTokenMetadata>
    if (!item) {
      throw new Error(INVALID_LOGIN_TOKEN)
    }

    const {userUuid, authProviderId, thirdPartyUserId, expireAt} = fromAttributes(item)
    if (expireAt < (Date.now() / MILLISECONDS_PER_SECOND)) {
      throw new Error(INVALID_LOGIN_TOKEN)  // Expired tokens are considered invalid
    }

    return {
      userUuid,
      authProviderId,
      thirdPartyUserId,
    }
  }

  return {
    createLoginToken,
    validateLoginToken,
  }
}

export {
  createDdbLoginTokenApi,
}
