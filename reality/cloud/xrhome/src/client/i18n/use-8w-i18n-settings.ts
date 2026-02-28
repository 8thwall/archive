import {useEffect} from 'react'
import i18n from 'i18next'
import {useSSR} from 'react-i18next'

import {setCookie} from '../common/cookie-utils'
import {LOCALE_URL_PARAM_NAME, LOCALE_COOKIE_NAME} from '../../shared/i18n/i18n-constants'
import useQuery from '../common/use-query'
import {useCurrentLanguage} from './use-current-language'
import {getSupportedLocales8w, SupportedLocale8w} from '../../shared/i18n/i18n-locales'
import {decode} from '../../shared/base64'
import {useUserHasSession, useUserLocale} from '../user/use-current-user'

const use8wI18nSettings = () => {
  const query = useQuery()
  const languageParam = query.get(LOCALE_URL_PARAM_NAME) as SupportedLocale8w
  const currentLanguage = useCurrentLanguage()
  const initiali18nStore = window?.initialI18nStore && decode(window?.initialI18nStore)
  useSSR(initiali18nStore, window?.initialLanguage)

  const isLoggedIn = useUserHasSession()
  const languageCognito = useUserLocale()
  const supportedLocales = getSupportedLocales8w()

  useEffect(() => {
    document.documentElement.lang = currentLanguage
  }, [currentLanguage])

  useEffect(() => {
    if (languageParam && supportedLocales.includes(languageParam)) {
      i18n.changeLanguage(languageParam)
    }
  }, [languageParam])

  useEffect(() => {
    if (isLoggedIn && languageCognito && supportedLocales.includes(languageCognito)) {
      setCookie(LOCALE_COOKIE_NAME, languageCognito)

      // If locale is not set in url params or not supported
      if (!languageParam || !supportedLocales.includes(languageParam)) {
        i18n.changeLanguage(languageCognito)
      }
    }
  }, [languageCognito])
}

export {
  use8wI18nSettings,
}
