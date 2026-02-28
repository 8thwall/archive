import React from 'react'

import {useCurrentLanguage} from '../../i18n/use-current-language'
import {getExternalSignInIds} from '../external-sign-in-ids'
import {APPLE_AUTH_PROVIDER_ID} from '../../../shared/users/users-niantic-constants'
import type {OnUserSigninListener} from '../../../shared/users/users-niantic-types'

enum AppleSignInErrors {
  ERROR_UNKNOWN,
  ERROR_PROVIDER_DECLINED,
  ERROR_USER_DECLINED,
  ERROR_API_UNAVAILABLE,
}

const APPLE_SCRIPT_ID_PREFIX = 'apple-script-'

const getAppleScriptId = (lang: string) => `${APPLE_SCRIPT_ID_PREFIX}${lang}`

const loadAppleScript = (language: string, onLoad = () => {}) => {
  // TODO(johnny): Also return if user has a valid NianticID token.
  if (!!document.getElementById(getAppleScriptId(language)) && !!window?.AppleID) {
    onLoad()
    return
  }

  const ids = getExternalSignInIds()
  document.querySelectorAll(`[id^="${APPLE_SCRIPT_ID_PREFIX}"]`).forEach(el => el.remove())
  const appleApiScript = document.createElement('script')
  appleApiScript.id = getAppleScriptId(language)
  appleApiScript.src =
`https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/${language}/appleid.auth.js`
  appleApiScript.addEventListener('load', () => {
    const {AppleID} = window
    AppleID.auth.init({
      clientId: ids.CLIENT_ID_APPLE,
      // eslint-disable-next-line local-rules/hardcoded-copy
      scope: 'name email',
      redirectURI: ids.REDIRECT_URI_APPLE,
      usePopup: true,
    })
    onLoad()
  })
  document.body.append(appleApiScript)
}

const usePreloadAppleScript = () => {
  const language = useCurrentLanguage().replace('-', '_')

  React.useEffect(() => {
    loadAppleScript(language)
  }, [language])
}

const useLoadAppleApiScript = (onUserSignin: OnUserSigninListener) => {
  // NOTE(johnny): Go to `Locale IDs` header
  // eslint-disable-next-line max-len
  // https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPInternational/LanguageandLocaleIDs/LanguageandLocaleIDs.html
  const language = useCurrentLanguage().replace('-', '_')
  const [isAppleScriptLoaded, setIsScriptLoaded] = React.useState(
    !!document.getElementById(getAppleScriptId(language)) && !!window?.AppleID
  )

  React.useEffect(() => {
    setIsScriptLoaded(false)
    loadAppleScript(language, () => setIsScriptLoaded(true))
  }, [language])

  const openAppleLoginPopup = async () => {
    try {
      const {AppleID} = window

      if (!AppleID) {
        throw AppleSignInErrors.ERROR_API_UNAVAILABLE
      }

      const res = await AppleID.auth.signIn()

      // eslint-disable-next-line no-console
      console.log({appleAuthResponse: res})

      if (!res.authorization?.id_token) {
        throw AppleSignInErrors.ERROR_UNKNOWN
      }

      onUserSignin({
        providerToken: res.authorization.id_token,
        authProviderId: APPLE_AUTH_PROVIDER_ID,
        email: res.user?.email,
        givenName: res.user?.name?.firstName,
        familyName: res.user?.name?.lastName,
      })
    } catch (error) {
      if (!error) {
        throw AppleSignInErrors.ERROR_UNKNOWN
      }
      switch (error.error) {
        case 'popup_closed_by_user':
          throw AppleSignInErrors.ERROR_USER_DECLINED
        case 'access_denied':
          throw AppleSignInErrors.ERROR_PROVIDER_DECLINED
        default:
          throw AppleSignInErrors.ERROR_UNKNOWN
      }
    }
  }

  return {isAppleScriptLoaded, openAppleLoginPopup}
}

export {
  usePreloadAppleScript,
  useLoadAppleApiScript,
}
