import {useLoadGsiScript} from './google/use-load-gsi-script'
import {useLoadAppleApiScript} from './apple/use-load-apple-api-script'
import type {OnUserSigninListener} from '../../shared/users/users-niantic-types'

const useExternalSigninServices = (onUserSignin: OnUserSigninListener) => {
  const {isGoogleScriptLoaded, openGoogleLoginPopup} = useLoadGsiScript(onUserSignin)
  const {isAppleScriptLoaded, openAppleLoginPopup} = useLoadAppleApiScript(onUserSignin)

  return {
    areScriptsLoaded: isGoogleScriptLoaded && isAppleScriptLoaded,
    openGoogleLoginPopup,
    openAppleLoginPopup,
  }
}

export {
  useExternalSigninServices,
}
