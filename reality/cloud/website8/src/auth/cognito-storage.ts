import {CookieStorage} from 'amazon-cognito-identity-js'

import {getDocumentCookies} from '../common/cookie-utils'

const isCookieKey = (key: string): boolean => (
  key.startsWith('Cognito') && key.endsWith('.accessToken')
)

export default class CognitoStorage {
  cookieStorage: CookieStorage

  legacyCookieStorage: CookieStorage

  constructor() {
    if (typeof window === 'undefined') {
      return
    }

    const {hostname} = window.location
    this.cookieStorage = new CookieStorage({
      domain: hostname,
      expires: 3650, // in days, so 10 years
      secure: true,
    })

    if (hostname.endsWith('.8thwall.com')) {
      // legacyCookieStorage is required to remove cookies set on the .8thwall.com domain
      this.legacyCookieStorage = new CookieStorage({
        domain: '.8thwall.com',
        expires: 3650, // in days, so 10 years
        secure: true,
      })
    }
  }

  getKeyStorage(key: string): Storage {
    return isCookieKey(key) ? this.cookieStorage : window.localStorage
  }

  setItem(key: string, value: string): string {
    return this.getKeyStorage(key).setItem(key, value)
  }

  getItem(key: string): string {
    if (typeof window === 'undefined') {
      return
    }

    if (isCookieKey(key)) {
      return this.cookieStorage.getItem(key)
    }

    const localValue = window.localStorage.getItem(key)
    if (localValue) {
      return localValue
    }

    // Migrate from old cookie to localstorage for required keys
    // TODO(christoph): Remove and refactor after migration to localstorage complete
    const cookieValue = this.cookieStorage.getItem(key)
    if (cookieValue) {
      this.cookieStorage.removeItem(key)
      if (this.legacyCookieStorage) {
        this.legacyCookieStorage.removeItem(key)
      }
      window.localStorage.setItem(key, cookieValue)
    }
    return cookieValue
  }

  removeItem(key: string) {
    window.localStorage.removeItem(key)
    this.cookieStorage.removeItem(key)
    if (this.legacyCookieStorage) {
      this.legacyCookieStorage.removeItem(key)
    }
  }

  clear() {
    if (typeof window === 'undefined') {
      return
    }
    for (const key in window.localStorage) {
      if (key.startsWith('CognitoIdentityServiceProvider')) {
        window.localStorage.removeItem(key)
      }
    }

    const cookies = getDocumentCookies()
    Object.keys(cookies).forEach((cookieKey) => {
      if (cookieKey.startsWith('CognitoIdentityServiceProvider')) {
        this.cookieStorage.removeItem(cookieKey)
      }
    })
    if (this.legacyCookieStorage) {
      this.legacyCookieStorage.clear()
    }
  }
}
