import React, {useState, useEffect} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {Redirect, useLocation} from 'react-router-dom'
import {Dimmer} from 'semantic-ui-react'
import {useDispatch} from 'react-redux'

import withTranslationLoaded from '../../i18n/with-translations-loaded'
import Page from '../../widgets/page'
import SignUpOk from '../sign-up-ok'
import {hasUserSession} from '../has-user-session'
import useSignUpStyles from './sign-up-styles'
import {useSelector} from '../../hooks'
import {LoginButton} from '../login-button'
import LogoWithLocaleSelector from '../logo-with-locale-selector'
import {gray2, mobileViewOverride, tinyViewOverride} from '../../static/styles/settings'
import {Icon} from '../../ui/components/icon'
import {StandardLink} from '../../ui/components/standard-link'
import {SpaceBetween} from '../../ui/layout/space-between'
import {combine} from '../../common/styles'
import {SocialLoginButtons} from '../social-login-buttons'
import useActions from '../../common/use-actions'
import nianticUserActions from '../../user-niantic/user-niantic-actions'
import {SignUpPathEnum} from '../../common/paths'
import {UserEmailForm} from './widgets/user-email-form'
import SpaceBelow from '../../ui/layout/space-below'
import {UserErrorMessage} from '../../home/user-error-message'
import {ACTIONS} from '../../user-niantic/user-niantic-errors'
import {useCurrentUser} from '../use-current-user'
import ResponsiveSplit from '../../ui/layout/responsive-split'
import {FloatingLabelInput} from '../../ui/form'
import {useRegisterFormInputs} from './register-form/use-register-form-inputs'
import {PrimaryButton} from '../../ui/components/primary-button'
import {parseJwt} from '../../../shared/users/parse-jwt'
import {Loader} from '../../ui/components/loader'
import {ToSAndNewsletterCheckbox} from './tos-and-newsletter-checkbox'
import type {SignUpUserNianticRequest} from '../../../shared/users/users-niantic-types'
import userActions from '../user-actions'
import {TOS_CURRENT_VERSION} from '../../../shared/tos'
import {useSetupNewsletterContact} from './use-setup-newsletter-contact'
import {INCOMPLETE_SIGNUP} from '../../user-niantic/user-niantic-action-types'
import {HeroContainer} from '../../widgets/hero-container'
import logoIcon from '../../static/infin8_Purple.svg'
import {createThemedStyles} from '../../ui/theme'
import {WelcomeBackground} from '../../widgets/welcome-background'

const useStyles = createThemedStyles(theme => ({
  heading: {
    fontFamily: theme.headingFontFamily,
    fontSize: '2.25em',
    fontWeight: '600',
    margin: 0,
    [mobileViewOverride]: {
      fontSize: '1.5em',
    },
  },
  subheading: {
    fontFamily: theme.subHeadingFontFamily,
    marginTop: 0,
    textAlign: 'center',
    fontSize: '1.125em',
    maxWidth: '30em',
    [mobileViewOverride]: {
      fontSize: '1em',
    },
  },
  contentContainer: {
    'display': 'flex',
    'justifyContent': 'space-around',
  },
  login: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1em',
    width: '35em',
    [tinyViewOverride]: {
      width: 'auto',
    },
  },
  divider: {
    background: gray2,
    border: 'none',
    height: '1px',
    margin: '1rem 0',
    [mobileViewOverride]: {
      margin: '0.5rem 0',
    },
  },
  content: {
    flexGrow: 1,
  },
  loginBlurb: {
    textAlign: 'center',
    padding: '2em 0',
  },
  signupContainer: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '30em',
    [tinyViewOverride]: {
      width: '100%',
      minWidth: 'unset',
    },
  },
  agreeTosContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '2em',
  },
  tosDescription: {
    fontFamily: theme.subHeadingFontFamily,
  },
  enforceNewline: {
    whiteSpace: 'pre-wrap',
  },
  headerIcon: {
    height: '70px',
    display: 'block',
    objectFit: 'contain',
  },
}))

enum SignUpView {
  BASE_SIGNUP,
  EMAIL_FORM,
  TOS_AND_NEWSLETTER,
  INCOMPLETE_USER_SIGNUP,
}

const NianticIdSignUpPage: React.FC = () => {
  const {t} = useTranslation(['social-logins', 'sign-up-pages', 'common'])
  const classes = useStyles()
  const dispatch = useDispatch()
  const signUpStyles = useSignUpStyles()
  const isLoggedIn = useSelector(state => hasUserSession(state))
  const pendingSignup = useSelector(state => state.userNiantic.pending.signup)
  const {signup} = useActions(nianticUserActions)
  const {agreeToS} = useActions(userActions)
  const {setupNewsletterContact} = useSetupNewsletterContact()
  const [signupFormView, setSignupFormView] = useState(SignUpView.BASE_SIGNUP)
  const location = useLocation()

  // TOS and Newsletter state
  const [userParams, setUserParams] = useState({} as SignUpUserNianticRequest)
  const [tosChecked, setToSChecked] = useState(false)
  const [newsLetterChecked, setNewsletterChecked] = useState(false)

  // Incomplete social sign up
  const user = useCurrentUser()
  const userIncompleteSignupInfo = user?.incompleteSignupUser
  const {firstNameInput, lastNameInput} = useRegisterFormInputs()
  const allInputs = [firstNameInput, lastNameInput]
  const allInputsValid = allInputs.every(i => i.isValid)
  const disableContinueIncompleteSignupBtn = !allInputsValid || !tosChecked

  useEffect(() => {
    if (userIncompleteSignupInfo?.authProviderId) {
      setSignupFormView(SignUpView.INCOMPLETE_USER_SIGNUP)
    }
  }, [userIncompleteSignupInfo])
  // if the user is logged in, they are done with this step
  if (isLoggedIn) {
    return <Redirect to={SignUpPathEnum.step2VerifyEmail} />
  }

  const handleSignUpClick = async (
    signupUser: SignUpUserNianticRequest, isNewsLetterChecked: boolean
  ) => {
    await signup(signupUser)
    await agreeToS(TOS_CURRENT_VERSION)
    if (isNewsLetterChecked) {
      await setupNewsletterContact({
        email: signupUser?.email as string,
        given_name: signupUser?.givenName as string,
        family_name: signupUser?.familyName as string,
      })
    }
  }

  const handleSignUpView = (signupParams: SignUpUserNianticRequest) => {
    setUserParams({...signupParams})
    if (!signupParams.givenName || !signupParams.familyName
    ) {
      dispatch({type: INCOMPLETE_SIGNUP, user: signupParams})
      // useEffect above will handle view change to the incomplete signup view.
    } else {
      setSignupFormView(SignUpView.TOS_AND_NEWSLETTER)
    }
  }

  const handleOnSignInCallback = handleSignUpView

  // NOTE(Brandon): Not gating logic in this component because it is already gated in
  // the parent component.
  const agreeToSAndNewsletter = (
    <div className={classes.agreeTosContainer}>
      <SpaceBelow>
        <UserErrorMessage action={ACTIONS.SIGNUP} />
      </SpaceBelow>
      <SpaceBelow>
        <p className={classes.tosDescription}>
          {t('register_sign_up_page.tos_description', {ns: 'sign-up-pages'})}
        </p>
      </SpaceBelow>
      <SpaceBelow>
        <ToSAndNewsletterCheckbox
          tosCheck={tosChecked}
          setToSCheck={() => setToSChecked(!tosChecked)}
          newsletterCheck={newsLetterChecked}
          setNewsletterCheck={() => setNewsletterChecked(!newsLetterChecked)}
        />
      </SpaceBelow>
      <PrimaryButton
        loading={pendingSignup}
        disabled={!tosChecked}
        onClick={() => handleSignUpClick(userParams, newsLetterChecked)}
      >{t('button.finish', {ns: 'common'})}
      </PrimaryButton>
    </div>
  )

  const baseSignUp = (
    <>
      <h2 className={classes.subheading}>
        {t('register_sign_up_page.subheading', {ns: 'sign-up-pages'})}
      </h2>
      <div className={classes.signupContainer}>
        <SpaceBelow>
          <UserErrorMessage action={ACTIONS.SIGNUP} />
        </SpaceBelow>
        <SpaceBetween narrow direction='vertical'>
          <SocialLoginButtons
            onSigninCallback={handleOnSignInCallback}
          />
        </SpaceBetween>
        <hr className={classes.divider} />
        <LoginButton onClick={() => setSignupFormView(SignUpView.EMAIL_FORM)}>
          <Icon stroke='email' color='gray3' />
          <span className={classes.content}>{t('button.login_email')}</span>
        </LoginButton>
        <span className={classes.loginBlurb}>
          <Trans
            ns='sign-up-pages'
            i18nKey='niantic_id_sign_up_page.already_have_niantic_id'
            components={{
              1: <StandardLink bold to={`/login${location.search}`} />,
            }}
          />
        </span>
      </div>
    </>
  )

  const incompleteSignup = (
    <div className={classes.signupContainer}>
      <SpaceBelow>
        <UserErrorMessage action={ACTIONS.SIGNUP} />
      </SpaceBelow>
      <SpaceBelow>
        <div className={classes.enforceNewline}>
          {t('incomplete_apple_sign_up.additional_info_blurb', {ns: 'sign-up-pages'})}
        </div>
      </SpaceBelow>
      <SpaceBelow>
        <ResponsiveSplit>
          <FloatingLabelInput field={firstNameInput} />
          <FloatingLabelInput field={lastNameInput} />
        </ResponsiveSplit>
      </SpaceBelow>
      <SpaceBelow>
        <ToSAndNewsletterCheckbox
          tosCheck={tosChecked}
          setToSCheck={() => setToSChecked(!tosChecked)}
          newsletterCheck={newsLetterChecked}
          setNewsletterCheck={() => setNewsletterChecked(!newsLetterChecked)}
        />
      </SpaceBelow>
      <PrimaryButton
        loading={pendingSignup}
        disabled={disableContinueIncompleteSignupBtn}
        onClick={async () => {
          const {email} = parseJwt(userIncompleteSignupInfo?.providerToken)
          await handleSignUpClick({
            authProviderId: userIncompleteSignupInfo?.authProviderId,
            providerToken: userIncompleteSignupInfo?.providerToken,
            email,
            givenName: firstNameInput.value,
            familyName: lastNameInput.value,
          } as SignUpUserNianticRequest, newsLetterChecked)
        }}
      >{t('button.continue', {ns: 'common'})}
      </PrimaryButton>
    </div>
  )

  const renderFormView = () => {
    switch (signupFormView) {
      case SignUpView.BASE_SIGNUP:
        return baseSignUp
      case SignUpView.TOS_AND_NEWSLETTER:
        return agreeToSAndNewsletter
      case SignUpView.EMAIL_FORM:
        return <UserEmailForm />
      case SignUpView.INCOMPLETE_USER_SIGNUP:
        return incompleteSignup
      default:
        return baseSignUp
    }
  }

  return (
    <>
      <SignUpOk>
        <>
          <WelcomeBackground />
          <Page
            hasHeader={false}
            hasFooter={false}
            title={t('register_sign_up_page.meta.title', {ns: 'sign-up-pages'})}
            description={t('register_sign_up_page.meta.description', {ns: 'sign-up-pages'})}
            commonPrefixed
            className={signUpStyles.page}
          >
            <LogoWithLocaleSelector />
            <div className={combine(signUpStyles.main, classes.contentContainer)}>
              <HeroContainer>
                <SpaceBetween direction='vertical' narrow>
                  <div className={classes.login}>
                    <img
                    // eslint-disable-next-line local-rules/hardcoded-copy
                      alt='8thWall Logo'
                      src={logoIcon}
                      className={classes.headerIcon}
                    />
                    <h1 className={classes.heading}>
                      {t('register_sign_up_page.title', {ns: 'sign-up-pages'})}
                    </h1>
                    {renderFormView()}
                  </div>
                </SpaceBetween>
              </HeroContainer>
            </div>
          </Page>
        </>
      </SignUpOk>
      <Dimmer active={pendingSignup} inverted>
        <Loader />
      </Dimmer>
    </>
  )
}

const TranslatedNianticIdSignUpPage = withTranslationLoaded(NianticIdSignUpPage)

export {
  TranslatedNianticIdSignUpPage as default,
}
