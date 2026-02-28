/* eslint-disable local-rules/hardcoded-copy */
import React, {useEffect} from 'react'
import {createUseStyles} from 'react-jss'
import {Redirect} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {Loader} from '../ui/components/loader'
import Page from '../widgets/page'
import {useUserHasSession, useUserPending} from './use-current-user'
import {combine} from '../common/styles'
import useActions from '../common/use-actions'
import userNianticActions from '../user-niantic/user-niantic-actions'
import {useSelector} from '../hooks'
import userActions from './user-actions'
import {useStringConsumedUrlParamEffect} from '../hooks/use-consumed-url-param-effect'
import {useOnboardingStyles} from '../accounts/onboarding/account-onboarding-styles'
import brandLogo from '../static/infin8_Purple.svg'
import {BASE_STUDIO_HUB_PROTOCOL} from '../../shared/studiohub/studiohub-protocol-types'
import NavLogo from '../widgets/nav-logo'
import {WelcomeBackground} from '../widgets/welcome-background'

const useStyles = createUseStyles({
  loginPage: {
    backgroundSize: '60rem 45rem',
    backgroundPosition: 'right top',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden',
  },
  navLogo: {
    position: 'fixed',
    top: 0,
    left: 0,
    padding: '1.5rem',
    zIndex: 5,
  },
  loginContainer: {
    zIndex: 4,
    position: 'relative',
    margin: '2em auto',
    transform: 'translateY(50%)',
  },
  loginContent: {
    fontFamily: 'Mozilla Headline, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5em',
    alignItems: 'center',
  },
  hidden: {
    display: 'none',
  },
  loaderContainer: {
    position: 'relative',
    height: '2em',
  },
})

interface IDesktopLoginModal {
  isLoggedIn: boolean
  desktopLoginReturnUrl: string
  isVerifyingLoginToken: boolean
}

const DesktopLoginModal: React.FC<IDesktopLoginModal> = ({
  isLoggedIn, desktopLoginReturnUrl, isVerifyingLoginToken,
}) => {
  const {t} = useTranslation(['login-pages'])
  const classes = useStyles()
  const onboardingClasses = useOnboardingStyles()

  return (
    <div className={combine(classes.loginContainer, onboardingClasses.formWrapper)}>
      <div className={onboardingClasses.formContent}>
        <img
          className={onboardingClasses.logo}
          src={brandLogo}
          // eslint-disable-next-line local-rules/hardcoded-copy
          alt='logo'
          draggable='false'
        />
        {isLoggedIn && desktopLoginReturnUrl && (
          <div className={classes.loginContent}>
            <div className={onboardingClasses.heading}>
              {t('desktop_login_page.sign_in.heading')}
            </div>
            {isVerifyingLoginToken &&
              <div className={classes.loaderContainer}>
                <Loader />
              </div>
            }
            <div className={onboardingClasses.subheading}>
              {t('desktop_login_page.sign_in.subheading')}
            </div>
          </div>
        )}
        {isLoggedIn && !desktopLoginReturnUrl && (
          <div className={classes.loginContent}>
            <div className={onboardingClasses.heading}>
              {t('desktop_login_page.login_error.heading')}
            </div>
            <div className={onboardingClasses.subheading}>
              {t('desktop_login_page.login_error.subheading')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const DesktopLoginPage: React.FC = () => {
  const {t} = useTranslation(['login-pages'])
  const classes = useStyles()
  const isLoggedIn = useUserHasSession()
  const isVerifyingLoginToken = useUserPending('verifyLoginToken')
  const {createLoginToken} = useActions(userNianticActions)
  const {setDesktopLoginReturnUrl} = useActions(userActions)

  useStringConsumedUrlParamEffect('desktopRedirect', (value) => {
    setDesktopLoginReturnUrl(value)
  })
  const desktopLoginReturnUrl = useSelector(state => state.common.desktopLoginReturnUrl)

  const pageClasses = combine(
    classes.loginPage,
    isVerifyingLoginToken && classes.hidden
  )

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }

    const handleLoginRedirect = async () => {
      if (!desktopLoginReturnUrl) {
        return
      }
      const loginUrl = new URL(desktopLoginReturnUrl)
      if (!loginUrl.protocol.startsWith(BASE_STUDIO_HUB_PROTOCOL)) {
        return
      }

      const loginToken = await createLoginToken()
      loginUrl.searchParams.append('token', loginToken)

      window.location.href = loginUrl.toString()
    }
    handleLoginRedirect()
  }, [desktopLoginReturnUrl, isLoggedIn])

  // Auto-redirect to login page if not logged in
  if (!isLoggedIn && !isVerifyingLoginToken) {
    const searchParams = new URLSearchParams()
    searchParams.append('redirectTo', window.location.pathname)
    searchParams.append('hideHeader', 'true')
    return <Redirect to={`/login?${searchParams.toString()}`} />
  }

  return (
    <Page
      title={t('desktop_login_page.title')}
      commonPrefixed
      description={t('desktop_login_page.description')}
      hasHeader={false}
      hasFooter={false}
      className={pageClasses}
      centered
    >
      <WelcomeBackground />
      <NavLogo size='wide' color='white' className={classes.navLogo} />
      <DesktopLoginModal
        isLoggedIn={isLoggedIn}
        desktopLoginReturnUrl={desktopLoginReturnUrl}
        isVerifyingLoginToken={isVerifyingLoginToken}
      />
    </Page>
  )
}

export default DesktopLoginPage
