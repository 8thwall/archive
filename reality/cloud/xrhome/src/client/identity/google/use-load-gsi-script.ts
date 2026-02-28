import {useEffect, useState, useMemo} from 'react'

import type {OnUserSigninListener} from '../../../shared/users/users-niantic-types'
import {getExternalSignInIds} from '../external-sign-in-ids'
import {GOOGLE_AUTH_PROVIDER_ID} from '../../../shared/users/users-niantic-constants'
import {parseJwt} from '../../../shared/users/parse-jwt'

const useLoadGsiScript = (onUserSignin: OnUserSigninListener) => {
  const {CLIENT_ID_GOOGLE} = getExternalSignInIds()
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(!!window.google?.accounts)

  useEffect(() => {
    if (window.google?.accounts) {
      // NOTE(johnny): Update callback to use the onUserSignin of the most recent rendered button.
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID_GOOGLE,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        callback: (credentialResponse) => {
          const {credential} = credentialResponse
          // eslint-disable-next-line camelcase
          const {email, family_name, given_name} = parseJwt(credential)
          onUserSignin({
            providerToken: credential,
            authProviderId: GOOGLE_AUTH_PROVIDER_ID,
            familyName: family_name,
            givenName: given_name,
            email,
          })
        },
      })
      return
    }
    const googleInitScript = document.createElement('script')
    googleInitScript.src = 'https://accounts.google.com/gsi/client'
    googleInitScript.async = true
    googleInitScript.defer = true
    googleInitScript.onload = () => {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID_GOOGLE,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        callback: (credentialResponse) => {
          const {credential} = credentialResponse
          // eslint-disable-next-line camelcase
          const {email, family_name, given_name} = parseJwt(credential)
          onUserSignin({
            providerToken: credential,
            authProviderId: GOOGLE_AUTH_PROVIDER_ID,
            familyName: family_name,
            givenName: given_name,
            email,
          })
        },
      })
      setIsScriptLoaded(true)
    }
    googleInitScript.onerror = () => {
      setIsScriptLoaded(false)
      // eslint-disable-next-line no-console
      console.error('An error occurred when initiating the google api.')
    }
    document.body.appendChild(googleInitScript)
  }, [])

  const googleLoginButton: HTMLButtonElement = useMemo(() => {
    const googleLoginWrapper = document.createElement('div')
    window.google?.accounts?.id.renderButton(googleLoginWrapper, {
      type: 'standard',
    })
    return googleLoginWrapper.querySelector('div[role=button]')
  }, [isScriptLoaded, onUserSignin])

  return {
    isGoogleScriptLoaded: isScriptLoaded,
    openGoogleLoginPopup: () => googleLoginButton.click(),
  }
}

export {
  useLoadGsiScript,
}
