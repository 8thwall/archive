import {useHistory} from 'react-router-dom'
import i18n from 'i18next'

import {
  LOCALE_URL_PARAM_NAME,
  LOCALE_COGNITO_ATTR_NAME,
  LOCALE_COOKIE_NAME,
} from '../../shared/i18n/i18n-constants'
import useQuery from '../common/use-query'
import useActions from '../common/use-actions'
import userActions from './user-actions'
import {setCookie} from '../common/cookie-utils'
import {useCurrentUser, useUserHasSession, useUserLocale} from './use-current-user'

export const useLocaleChange = (): [string, (string) => void] => {
  const history = useHistory()
  const query = useQuery()
  const languageParam = query.get(LOCALE_URL_PARAM_NAME)

  const {updateAttribute, patchNewsletterContact} = useActions(userActions)
  const isLoggedIn = useUserHasSession()
  const languageCognito = useUserLocale()
  const newsletterId = useCurrentUser(user => user?.['custom:newsletterId'])

  const setLanguage = (lng: string) => {
    // Set URL param "lang" as needed
    if (languageParam && lng !== languageParam) {
      query.set(LOCALE_URL_PARAM_NAME, lng)
      history.push({search: query.toString()})
    }
    if (isLoggedIn) {
      // Set Cognito "locale" as needed
      if (lng !== languageCognito) {
        updateAttribute({[LOCALE_COGNITO_ATTR_NAME]: lng})
      }
      // Set MailChimp "locale" as needed
      if (newsletterId) {
        patchNewsletterContact(newsletterId, {locale: lng})
      }
    }
    setCookie(LOCALE_COOKIE_NAME, lng)

    i18n.changeLanguage(lng)
  }

  return [i18n.language, setLanguage]
}
