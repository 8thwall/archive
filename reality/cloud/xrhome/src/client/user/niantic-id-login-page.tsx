import React, {useEffect, useState} from 'react'
import {Redirect, useLocation} from 'react-router-dom'
import querystring from 'query-string'
import {useTranslation, Trans} from 'react-i18next'

import SpaceBelow from '../ui/layout/space-below'
import {FloatingLabelInput} from '../ui/components/floating-label-input'
import {setVal, useFormInput} from '../common/form-change-hook'
import Page from '../widgets/page'
import {PrimaryButton} from '../ui/components/primary-button'
import {tinyViewOverride} from '../static/styles/settings'
import {StandardLink} from '../ui/components/standard-link'
import {SocialLoginButtons} from './social-login-buttons'
import {PageFooterIdentity} from '../widgets/page-footer-identity'
import {SpaceBetween} from '../ui/layout/space-between'
import LogoWithLocaleSelector from './logo-with-locale-selector'
import {combine} from '../common/styles'
import {getRootPath, getPathForSignUp, SignUpPathEnum} from '../common/paths'
import useActions from '../common/use-actions'
import userActions from '../user-niantic/user-niantic-actions'
import {COGNITO_AUTH_PROVIDER_ID} from '../../shared/users/users-niantic-constants'
import type {LoginUserNianticRequest} from '../../shared/users/users-niantic-types'
import {UserErrorMessage} from '../home/user-error-message'
import {ACTIONS} from '../user-niantic/user-niantic-errors'
import {useUserHasSession, useUserPending, useUserConfirmed} from './use-current-user'
import {Loader} from '../ui/components/loader'
import {IconButton} from '../ui/components/icon-button'
import {HeroContainer} from '../widgets/hero-container'
import {createThemedStyles} from '../ui/theme'
import logoIcon from '../static/infin8_Purple.svg'
import {WelcomeBackground} from '../widgets/welcome-background'

const useStyles = createThemedStyles(theme => ({
  loginPageContent: {
    flexDirection: 'column',
    padding: '5rem 0',
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  hidden: {
    display: 'none',
  },
  heading: {
    fontFamily: theme.headingFontFamily,
    textAlign: 'center',
    fontSize: '32px',
    fontWeight: 700,
    marginTop: '1rem !important',
    marginBottom: '2rem !important',
  },
  pageWithoutHeader: {
    '& .page-content.centered': {
      marginTop: '3em',
      [tinyViewOverride]: {
        marginTop: '2em',
      },
    },
  },
  divider: {
    'display': 'flex',
    'alignItems': 'center',
    '&::before, &::after': {
      content: '""',
      flex: 1,
      height: '1px',
      background: theme.mainDivider,
    },
  },
  dividerText: {
    color: theme.fgMuted,
    padding: '0 1rem',
  },
  forgotPassword: {
    marginTop: '1rem',
    fontWeight: '700',
    textAlign: 'center',
  },
  newAccountContainer: {
    color: theme.fgMuted,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordIcon: {
    cursor: 'pointer',
    position: 'absolute',
    right: '1em',
    top: '0.75em',
    zIndex: 10,
  },
  headerIcon: {
    height: '70px',
    display: 'block',
    objectFit: 'contain',
  },
  heroContent: {
    width: '30rem',
    padding: '0 3rem',
    [tinyViewOverride]: {
      width: '25rem',
      padding: '0 1rem',
    },
    justifySelf: 'center',
  },
}))

const NianticIdLoginPage: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['login-pages', 'niantic-id-login-page', 'common'])
  const [email, onChangeEmail] = useFormInput('')
  const [password, onChangePassword] = useFormInput('')
  const [passwordInputType, setPasswordInputType] = useState('password')
  const [passwordIconOpen, setPasswordIconOpen] = useState(false)
  const location = useLocation()
  const {login, loginWithToken} = useActions(userActions)
  const parsedQueryString: Record<string, string> = querystring.parse(location.search)
  const {
    hideHeader, hideForgotPassword, hideThirdPartyLogins,
    redirectTo, forceRefresh, preserveQuery, ssoTarget,
    token,
  } = parsedQueryString
  const isLoading = useUserPending(ACTIONS.LOGIN)
  const isHeaderHidden = hideHeader === 'true'
  const isForgotPasswordHidden = hideForgotPassword === 'true'
  const enablePreserveQuery = preserveQuery === 'true'
  const redirectPath = (redirectTo || getRootPath()) + (enablePreserveQuery ? location.search : '')
  const isLoggedIn = useUserHasSession()
  const isUserConfirmed = useUserConfirmed()
  const hideThirdPartyLoginBtns = hideThirdPartyLogins === 'true'
  const isVerifyingLoginToken = useUserPending('verifyLoginToken')
  const pageClasses = combine(
    classes.pageWithoutHeader,
    isVerifyingLoginToken && classes.hidden
  )

  const handleLoginWithToken = async (tokenParam: string) => {
    await loginWithToken(tokenParam)
  }

  useEffect(() => {
    if (token && !isLoggedIn) {
      handleLoginWithToken(token)
    }
  }, [token])

  if (isLoggedIn) {
    // NOTE(wayne): Only allow redirect to same origin, otherwise redirect to root
    if (new URL(redirectTo, window.location.toString()).origin !== window.location.origin) {
      return <Redirect to={getRootPath()} />
    }

    if (forceRefresh) {
      window.location.href = redirectPath
      return <Loader />
    } else if (isUserConfirmed && ssoTarget) {
      return <Redirect to={{...location, pathname: '/sso'}} />
    } else {
      return <Redirect to={redirectPath} />
    }
  }

  const onSubmit = (params: LoginUserNianticRequest) => {
    const {authProviderId, providerToken: authToken} = params
    if (authProviderId === COGNITO_AUTH_PROVIDER_ID) {
      setVal(onChangeEmail, email.trimEnd())
    }
    const credentials = authToken || {email: email.trimEnd(), password}
    login(authProviderId, credentials)
  }

  const setShowPassword = () => {
    if (passwordInputType === 'password') {
      setPasswordInputType('text')
      setPasswordIconOpen(true)
    } else {
      setPasswordInputType('password')
      setPasswordIconOpen(false)
    }
  }

  return (
    <>
      {isVerifyingLoginToken && <Loader />}
      <WelcomeBackground />
      <Page
        title={t('heading', {ns: 'niantic-id-login-page'})}
        commonPrefixed
        description={t('login_page.description')}
        hasHeader={false}
        className={pageClasses}
        centered
        customFooter={isHeaderHidden && <PageFooterIdentity />}
      >
        <LogoWithLocaleSelector />
        <div className={classes.loginPageContent}>
          <div className={classes.loginContainer}>
            <HeroContainer>
              <div className={classes.heroContent}>
                <SpaceBetween direction='vertical' narrow grow>
                  <SpaceBelow>
                    <SpaceBetween direction='vertical' centered>
                      <img
                        // eslint-disable-next-line local-rules/hardcoded-copy
                        alt='8thWall Logo'
                        src={logoIcon}
                        className={classes.headerIcon}
                      />
                      <h1 className={classes.heading}>{
                        t('heading', {ns: 'niantic-id-login-page'})}
                      </h1>
                    </SpaceBetween>
                    <UserErrorMessage action={ACTIONS.LOGIN} />
                  </SpaceBelow>
                  {!hideThirdPartyLoginBtns && (
                    <>
                      <SocialLoginButtons onSigninCallback={onSubmit} />
                      <div className={classes.divider}>
                        <span className={classes.dividerText}>{
                          t('login_options.divider_text', {ns: 'niantic-id-login-page'})}
                        </span>
                      </div>
                    </>
                  )}
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit({authProviderId: COGNITO_AUTH_PROVIDER_ID})
                  }}
                  >
                    <SpaceBelow>
                      <SpaceBetween direction='vertical' narrow>
                        <FloatingLabelInput
                          label={t('label.email', {ns: 'niantic-id-login-page'})}
                          value={email}
                          onChange={onChangeEmail}
                          autoComplete='username'
                        />
                        <div className={classes.passwordContainer}>
                          <FloatingLabelInput
                            label={t('login_page.label.password')}
                            type={passwordInputType}
                            value={password}
                            onChange={onChangePassword}
                            autoComplete='current-password'
                          />
                          <div
                            className={classes.passwordIcon}
                          >
                            <IconButton
                              text={passwordIconOpen
                                ? t('button.password_visible', {ns: 'common'})
                                : t('button.password_hidden', {ns: 'common'})}
                              stroke={passwordIconOpen ? 'visible' : 'hidden'}
                              color='muted'
                              onClick={setShowPassword}
                              tabIndex={-1}
                            />
                          </div>
                        </div>
                      </SpaceBetween>
                    </SpaceBelow>
                    <PrimaryButton
                      type='submit'
                      spacing='full'
                      loading={isLoading}
                      disabled={!email.trimEnd().length || !password || isLoading}
                    >{t('button.login_email', {ns: 'niantic-id-login-page'})}
                    </PrimaryButton>
                  </form>
                  {!isForgotPasswordHidden &&
                    <div className={classes.forgotPassword}>
                      <StandardLink to='/forgot'>{t('login_page.forgot_password')}</StandardLink>
                    </div>
                    }
                </SpaceBetween>
              </div>
            </HeroContainer>
          </div>
          {!isForgotPasswordHidden &&
            <div className={classes.newAccountContainer}>
              <Trans
                ns='niantic-id-login-page'
                i18nKey='sign_up'
                components={{
                  newAccountLink: (
                    <StandardLink
                      bold
                      to={getPathForSignUp(SignUpPathEnum.step1Register) + location.search}
                    />
                  ),
                }}
              />
            </div>
          }
        </div>
      </Page>
    </>
  )
}

export default NianticIdLoginPage
