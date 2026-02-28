import {useEffect, useLayoutEffect} from 'react'
import {useLocation} from 'react-router-dom'
import i18n from 'i18next'

import {setCookie} from '../common/cookie-utils'

import {
  LOCALE_COOKIE_NAME, SupportedLocaleLightship, SUPPORTED_LOCALES_LIGHTSHIP,
} from '../../shared/i18n/i18n-constants'
import {useCurrentLanguage} from './use-current-language'

const useLightshipI18nSettings = () => {
  const {search} = useLocation()
  const currentLanguage = useCurrentLanguage()
  const languageParam = new URLSearchParams(search).get('lang') as SupportedLocaleLightship

  useLayoutEffect(() => {
    document.documentElement.lang = currentLanguage
    setCookie(LOCALE_COOKIE_NAME, currentLanguage)
  }, [currentLanguage])

  useEffect(() => {
    if (languageParam && SUPPORTED_LOCALES_LIGHTSHIP.includes(languageParam)) {
      i18n.changeLanguage(languageParam)
    }
  }, [languageParam])
}

export default useLightshipI18nSettings
