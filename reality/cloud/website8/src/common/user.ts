import localforage from 'localforage'

import {
  User,
  CACHED_USER_UUID_KEY,
  CACHED_REFRESH_TIME_KEY,
  EXCLUDED_FIELDS,
} from './user-config'
import CognitoStorage from '../auth/cognito-storage'

const cognitoStorage = new CognitoStorage()

const cacheUserNiantic = async (user: User) => {
  const {userUuid, refreshTime} = user
  await Promise.all([
    localforage.setItem(CACHED_USER_UUID_KEY, userUuid),
    localforage.setItem(CACHED_REFRESH_TIME_KEY, refreshTime),
  ])
}

const clearCachedUserNiantic = async () => {
  await Promise.all([
    localforage.removeItem(CACHED_USER_UUID_KEY),
    localforage.removeItem(CACHED_REFRESH_TIME_KEY),
  ])
}

type RequestInit = Parameters<typeof fetch>[1]

const refresh8wJwt = async () => {
  const res = await fetch('/api/public/users/niantic/login/refresh', {method: 'POST'})
  if (!res.ok) {
    throw new Error('Fail to refresh 8w access token')
  }

  // Cache new current user and refresh time
  const newUser: User = await res.json()
  cacheUserNiantic(newUser)
}

const signOutAndClearCognitoCookies = async () => {
  await clearCachedUserNiantic()
  cognitoStorage.clear()
  window.location.reload()
}

const authenticatedFetch =
async (route: string, options: RequestInit, user: User): Promise<any> => {
  if (!user) {
    await signOutAndClearCognitoCookies()
  }

  if (user.refreshTime < Date.now()) {
    await refresh8wJwt()
  }

  const res = await fetch(route, options)
  const contentType = res.headers.get('Content-Type')
  const isJsonResponse = contentType && contentType.indexOf('json') > 0

  if (isJsonResponse) {
    return res.json()
  }
  return res.text()
}

const logOut = async (user) => {
  try {
    await authenticatedFetch(
      '/v1/users/niantic/logout',
      {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      user
    )
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.message) // fail silently
  }
  await signOutAndClearCognitoCookies()
}

const getCurrentUser = async (): Promise<User | null> => {
  const [userUuid, refreshTime] =
    await Promise.all([
      localforage.getItem(CACHED_USER_UUID_KEY),
      localforage.getItem(CACHED_REFRESH_TIME_KEY),
    ])

  if (!userUuid || !refreshTime) {
    return null
  }

  return {userUuid, refreshTime} as User
}

const getAttributes = async (user: User): any => {
  try {
    const res = await authenticatedFetch(
      '/v1/users/niantic',
      {
        credentials: 'same-origin',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      user
    )
    return res
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.message) // fail silently
  }
}

// Update user attributes
const updateAttributes = async (attributes: object, user: User) => {
  const attributesToUpdate = Object.keys(attributes).reduce((acc, key) => {
    if (!EXCLUDED_FIELDS.some((f) => f === key)) {
      acc[key] = attributes[key]
    }
    return acc
  }, {})

  try {
    const res = await authenticatedFetch(
      '/v1/users',
      {
        credentials: 'same-origin',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attributesToUpdate),
      },
      user
    )
    return res
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.message) // fail silently
  }
}

// TODO(kim): Only for patching locale selection. Need to confirm match betw Mailchimp and Postgres
interface NewsletterContact {
  email: string
  status?: string
  firstName?: string
  lastName?: string
  locale?: string
}

const patchNewsletterContact = async (
  contactId: string,
  newsletterContact: Partial<NewsletterContact>,
  user
) => {
  try {
    const res = await authenticatedFetch(
      `/v1/newsletter/contact/${contactId}`,
      {
        credentials: 'same-origin',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsletterContact),
      },
      user
    )

    return res
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.message) // fail silently
  }

  return null
}

const isEligibleForFreeTrial = async (user) => {
  let eligibleForFreeTrial = false

  try {
    const res = await authenticatedFetch(
      '/v1/crm',
      {
        credentials: 'same-origin',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      user
    )

    const ELIGIBLE_TRIAL_STATE = new Set(['NONE', 'ACCOUNT', 'BILLING'])
    eligibleForFreeTrial = ELIGIBLE_TRIAL_STATE.has(res.free_trial_stage)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.message) // fail silently
  }

  return eligibleForFreeTrial
}

export {
  getCurrentUser,
  getAttributes,
  updateAttributes,
  patchNewsletterContact,
  logOut,
  isEligibleForFreeTrial,
}
