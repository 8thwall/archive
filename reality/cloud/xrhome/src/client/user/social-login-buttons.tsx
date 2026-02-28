import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import AppleIcon from '../static/icons/apple.svg'
import GoogleIcon from '../static/icons/google.svg'
import {LoginButton} from './login-button'
import {useExternalSigninServices} from '../identity/use-external-signin-services'
import type {LoginProvider} from '../../shared/users/users-niantic-types'
import {GOOGLE_AUTH_PROVIDER_ID} from '../../shared/users/users-niantic-constants'
import type {OnUserSigninListener} from '../../shared/users/users-niantic-types'

const useStyles = createUseStyles({
  socialLoginButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em',
    width: '100%',
  },
  content: {
    flexGrow: 1,
  },
})

interface ISocialLoginButton {
  social: LoginProvider
  onSigninClick?: () => void
}

const SocialLoginButton: React.FC<ISocialLoginButton> = ({social, onSigninClick}) => {
  const classes = useStyles()
  const {t} = useTranslation(['social-logins'])
  const isGoogle = social === GOOGLE_AUTH_PROVIDER_ID
  const buttonContent = isGoogle ? t('button.login_google') : t('button.login_apple')
  const socialIcon = isGoogle ? GoogleIcon : AppleIcon
  const iconAlt = isGoogle ? 'Google' : 'Apple'

  return (
    <LoginButton onClick={onSigninClick}>
      <img src={socialIcon} alt={iconAlt} />
      <span className={classes.content}>{buttonContent}</span>
    </LoginButton>
  )
}

interface ISocialLoginButtons {
  onSigninCallback?: OnUserSigninListener
}

const SocialLoginButtons: React.FC<ISocialLoginButtons> = ({onSigninCallback}) => {
  const classes = useStyles()

  const {openGoogleLoginPopup} = useExternalSigninServices(onSigninCallback)

  return (
    <div className={classes.socialLoginButtons}>
      <SocialLoginButton
        onSigninClick={openGoogleLoginPopup}
        social={GOOGLE_AUTH_PROVIDER_ID}
      />
    </div>
  )
}

export {
  SocialLoginButtons,
}
