type User = {
  userUuid: string
  refreshTime: number
}

type UserAttributes = {
  uuid: string
  primaryContactEmail: string
  givenName: string
  familyName: string
  locale: string
  newsletterId: string
  profilePhotoUrl: string
}

const CACHED_USER_UUID_KEY = 'userUuid'
const CACHED_REFRESH_TIME_KEY = 'refreshTime'

const EXCLUDED_FIELDS = [
  'password', 'pwconf', 'sub', 'uuid', 'emailVerified', 'phoneNumberVerified', 'avatar',
  'message', 'error', 'recaptcha', 'action', 'crmId',
]

export type {
  User,
  UserAttributes,
}

export {
  CACHED_USER_UUID_KEY,
  CACHED_REFRESH_TIME_KEY,
  EXCLUDED_FIELDS,
}
