import {getDocumentCookies} from '../common/cookie-utils'

declare global {
  interface Window {
    AmazonCognitoIdentity: any
  }
}

const isCookieKey = (key: string): boolean => (
  key.startsWith('Cognito') && key.endsWith('.accessToken')
)

// This intercepts the default behavior of setting all the cognito tokens
// as cookies and only allows the accessToken to be stored as a cookie and
// all other tokens live in localStorage.
const makeCognitoStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const cookieStorage = new window.AmazonCognitoIdentity.CookieStorage({
    domain: Build8.PLATFORM_TARGET === 'desktop'
      ? 'desktop.8thwall.com'
      : window.location.hostname,
    expires: 3650,  // in days, so 10 years
    secure: true,
  })

  const getKeyStorage = (key: string): Storage => (
    isCookieKey(key) ? cookieStorage : window.localStorage
  )

  const setItem = (key: string, value: string) => (
    getKeyStorage(key).setItem(key, value)
  )

  const getItem = (key: string): string => (
    getKeyStorage(key).getItem(key)
  )

  const removeItem = (key: string) => {
    window.localStorage.removeItem(key)
    cookieStorage.removeItem(key)
  }

  const clear = () => {
    Object.keys(window.localStorage)
      .filter(key => key.startsWith('CognitoIdentityServiceProvider'))
      .forEach(key => window.localStorage.removeItem(key))

    const cookies = getDocumentCookies()
    Object.keys(cookies).forEach((cookieKey) => {
      if (cookieKey.startsWith('CognitoIdentityServiceProvider')) {
        cookieStorage.removeItem(cookieKey)
      }
    })
  }

  return {
    setItem,
    getItem,
    removeItem,
    clear,
  }
}

export {
  makeCognitoStorage,
}
