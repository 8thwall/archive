import {LOCALE_URL_PARAM_NAME, LOCALE_COOKIE_NAME} from '../../shared/i18n/i18n-constants'
import {
  FALLBACK_LOCALE,
  getSupportedLocales8w,
  validLocaleOrNull,
} from '../../shared/i18n/i18n-locales'
import {getCookie} from '../common/cookie-utils'

const getLocaleFromUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)
  return validLocaleOrNull(urlParams.get(LOCALE_URL_PARAM_NAME))
}

const getLocaleFromCookie = () => validLocaleOrNull(getCookie(LOCALE_COOKIE_NAME))

const getLocaleFromPreferredLang = () => {
  const preferredLanguages = window.navigator.languages

  // Find the first prefix match if it's a locale code without country, e.g. "ja"
  if (preferredLanguages) {
    for (let i = 0; i < preferredLanguages.length; i++) {
      const foundSupportedLocale = getSupportedLocales8w().find(
        supportedLocale => supportedLocale.startsWith(preferredLanguages[i])
      )
      if (foundSupportedLocale) {
        return foundSupportedLocale
      }
    }
  }

  return null
}

const chooseDefaultLanguage = () => {
  if (typeof window === 'undefined') {
    return FALLBACK_LOCALE
  }

  return getLocaleFromUrlParams() ||
    getLocaleFromCookie() ||
    getLocaleFromPreferredLang() ||
    FALLBACK_LOCALE
}

export {
  chooseDefaultLanguage,
}
