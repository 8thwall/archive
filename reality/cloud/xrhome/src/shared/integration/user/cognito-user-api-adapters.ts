import type {User} from '../db/models'
import type {User as ClientUser} from '../../../client/common/types/db'
import type {CognitoUserAttributes, CognitoUserModel} from '../../../server/cognito-postgres-types'
import type {ClientSideUser} from '../../users/users-niantic-types'

const COGNITO_KEY_TO_POSTGRES = {
  'uuid': 'uuid',
  'given_name': 'givenName',
  'family_name': 'familyName',
  'email': 'primaryContactEmail',
  'email_verified': 'emailVerified',
  'locale': 'locale',
  'phone_number': 'phoneNumber',
  'phone_number_verified': 'phoneNumberVerified',
  'custom:tos': 'tosAgreements',
  'custom:crmId': 'crmId',
  'custom:themeSettings': 'themeSettings',
  'custom:handle': 'handle',
  'custom:emailVerifyTime': 'emailVerifyTime',
  'custom:newsletterId': 'newsletterId',
  'custom:profileIcon': 'profileIcon',
} as Record<keyof CognitoUserAttributes, keyof User>

const DATE_COLUMNS = ['emailVerifyTime'] as const
const JSONB_COLUMNS = ['themeSettings', 'tosAgreements'] as const
const BOOLEAN_COLUMNS = ['emailVerified', 'phoneNumberVerified'] as const
const STRING_COLUMNS = [
  'uuid', 'givenName', 'primaryContactEmail', 'familyName', 'locale',
  'phoneNumber', 'handle', 'newsletterId', 'crmId', 'profileIcon',
]

const cognitoUserToPostgresFields = (user: Partial<CognitoUserModel>): Partial<User> => {
  const postgresUserFields: Partial<User> = {
    uuid: user.Username,
    ...(user.UserCreateDate ? {createdAt: user.UserCreateDate} : {}),
    ...(user.UserLastModifiedDate ? {updatedAt: user.UserCreateDate} : {}),
  }

  user.Attributes.forEach(({Name, Value}) => {
    const postgresKey = COGNITO_KEY_TO_POSTGRES[Name]

    if (!postgresKey) {
      return
    }

    if (DATE_COLUMNS.includes(postgresKey as any)) {
      postgresUserFields[
        postgresKey as typeof DATE_COLUMNS[number]
      ] = new Date(parseInt(Value, 10))
    } else if (JSONB_COLUMNS.includes(postgresKey as any)) {
      postgresUserFields[
        postgresKey as typeof JSONB_COLUMNS[number]
      ] = JSON.parse(Value)
    } else if (BOOLEAN_COLUMNS.includes(postgresKey as any)) {
      postgresUserFields[
        postgresKey as typeof BOOLEAN_COLUMNS[number]
      ] = Value === 'true'
    } else if (STRING_COLUMNS.includes(postgresKey as any)) {
      postgresUserFields[
        postgresKey as typeof STRING_COLUMNS[number]
      ] = Value
    } else {
      throw new Error(`Column ${postgresKey} does not have a defined type`)
    }
  })

  return postgresUserFields
}

const createCognitoAttribute = (name: keyof CognitoUserAttributes, value: string) => ({
  Name: name,
  Value: value,
})

const postgresUserToCognitoUser = (user: User | ClientUser | ClientSideUser): CognitoUserModel => {
  const attributes = Object.entries(COGNITO_KEY_TO_POSTGRES).map(([cognitoKey, postgresKey]) => {
    let value = user[postgresKey] || null
    if (['email_verified', 'phone_number_verified'].includes(cognitoKey)) {
      value = JSON.stringify(!!value)
    } else if (cognitoKey === 'custom:emailVerifyTime') {
      value = `${new Date(value as string).getTime()}`
    } else if (value && (typeof value === 'object' || typeof value === 'number')) {
      value = JSON.stringify(value)
    }
    return createCognitoAttribute(cognitoKey as keyof CognitoUserAttributes, value as string)
  })
  return {
    Username: user.uuid,
    email: user.primaryContactEmail,
    Attributes: attributes,
  }
}

// NOTE(johnny): The 'sign in' and 'get' endpoints return different client user types.
const postgresUserToCognitoAttributes = (
  user: User | ClientUser | ClientSideUser
): CognitoUserAttributes => {
  const cognitoModel = postgresUserToCognitoUser(user)
  return cognitoModel.Attributes.reduce((prev, current) => {
    prev[current.Name] = current.Value
    return prev
  }, {}) as CognitoUserAttributes
}

export {
  cognitoUserToPostgresFields,
  postgresUserToCognitoUser,
  postgresUserToCognitoAttributes,
}
