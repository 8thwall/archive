import type {User} from './integration/db/models'
import type {CognitoUserAttributes} from '../server/cognito-postgres-types'

const MAX_HANDLE_LENGTH = 20

const sanitizeHandle = (userHandle: string): string => (
  userHandle.toLocaleLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)
)

// NOTE(wayne): This is compatible to both old Cognito attributes and new db Users table columns
const userPreferredHandle = (user: Partial<User> & Partial<CognitoUserAttributes>): string => {
  if (user) {
    // If the user has set an existing preference, set the handle from the valid portions of that
    // preference if there are any.
    const handle = user.handle || user['custom:handle']
    const existingPreference = handle && sanitizeHandle(handle)
    if (existingPreference && existingPreference.length) {
      return existingPreference
    }

    // Set the handle from the valid portions of the user's email address before the @ sign if there
    // are any.
    const email = user.primaryContactEmail || user.email
    const emailPreference = email && sanitizeHandle(email.split('@')[0])
    if (emailPreference && emailPreference.length) {
      return emailPreference
    }

    // Set the handle from the valid portions of the user's given name if there are any.
    const givenName = user.givenName || user.given_name
    const givenNamePreference = givenName && sanitizeHandle(givenName)
    if (givenNamePreference && givenNamePreference.length) {
      return givenNamePreference
    }
  }

  // Return a predetermined string if all else fails.
  return 'user'
}

const generateUniqueUserHandle = (user, handles): string => {
  const preferredHandle = userPreferredHandle(user)
  let baseHandle = preferredHandle
  let handle = preferredHandle
  let duplicateHandleNum = 0
  while (handles.includes(handle)) {
    duplicateHandleNum++
    const newHandle = `${baseHandle}${duplicateHandleNum}`
    if (newHandle.length <= MAX_HANDLE_LENGTH) {
      handle = newHandle
    } else {
      baseHandle = baseHandle.slice(0, -1)
      duplicateHandleNum = 0
    }
  }
  return handle
}

export {
  MAX_HANDLE_LENGTH,
  userPreferredHandle,
  generateUniqueUserHandle,
}
