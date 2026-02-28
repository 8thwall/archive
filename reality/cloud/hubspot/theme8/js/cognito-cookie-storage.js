/* eslint-disable */
/**
 * Copied from  website8/src/auth/cognito-storage.ts
 *
 * TODO(alvin): Remove this when we migrate to Niantic identity.
 */
(function() {
  console.log('cognito-cookie-storage.js')
  const {CookieStorage} = window.AmazonCognitoIdentity

  const isCookieKey = (key) => (
    key.startsWith('Cognito') && key.endsWith('.accessToken')
  )

  class CognitoStorage {
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

    getKeyStorage(key) {
      return isCookieKey(key) ? this.cookieStorage : window.localStorage
    }

    setItem(key, value) {
      return this.getKeyStorage(key).setItem(key, value)
    }

    getItem(key) {
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

    removeItem(key) {
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

      this.cookieStorage.clear()
      if (this.legacyCookieStorage) {
        this.legacyCookieStorage.clear()
      }
    }
  }

  window.CognitoStorage = CognitoStorage
})();
