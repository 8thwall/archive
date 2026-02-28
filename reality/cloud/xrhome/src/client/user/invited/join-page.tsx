import React, {useState, useEffect} from 'react'
import {useTranslation, Trans} from 'react-i18next'
import {Dimmer} from 'semantic-ui-react'
import {useDispatch} from 'react-redux'

import SignUpOk from '../sign-up-ok'
import Page from '../../widgets/page'
import ErrorPage from '../sign-up/error-page'
import {JoinPageForm} from './join-page-form'
import useSignUpStyles from '../sign-up/sign-up-styles'
import LogoWithLocaleSelector from '../logo-with-locale-selector'
import userActions from '../user-actions'
import userNianticActions from '../../user-niantic/user-niantic-actions'
import teamActions from '../../team/team-actions'
import useActions from '../../common/use-actions'
import {useSelector} from '../../hooks'
import {SocialLoginButtons} from '../social-login-buttons'
import {SpaceBetween} from '../../ui/layout/space-between'
import {mobileViewOverride, gray2} from '../../static/styles/settings'
import SpaceBelow from '../../ui/layout/space-below'
import type {SignUpUserNianticRequest} from '../../../shared/users/users-niantic-types'
import {UserErrorMessage} from '../../home/user-error-message'
import {ACTIONS} from '../../user-niantic/user-niantic-errors'
import {useCurrentUser, useUserPending} from '../use-current-user'
import {useRegisterFormInputs} from '../sign-up/register-form/use-register-form-inputs'
import ResponsiveSplit from '../../ui/layout/responsive-split'
import {FloatingLabelInput} from '../../ui/form'
import {PrimaryButton} from '../../ui/components/primary-button'
import {parseJwt} from '../../../shared/users/parse-jwt'
import {StandardLink} from '../../ui/components/standard-link'
import {Loader} from '../../ui/components/loader'
import {ToSAndNewsletterCheckbox} from '../sign-up/tos-and-newsletter-checkbox'
import {INCOMPLETE_SIGNUP} from '../../user-niantic/user-niantic-action-types'
import {TOS_CURRENT_VERSION} from '../../../shared/tos'
import {useSetupNewsletterContact} from '../sign-up/use-setup-newsletter-contact'
import {WelcomeBackground} from '../../widgets/welcome-background'
import {HeroContainer} from '../../widgets/hero-container'
import {createThemedStyles} from '../../ui/theme'
import logoIcon from '../../static/infin8_Purple.svg'

const useStyles = createThemedStyles(theme => ({
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  signup: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    maxWidth: '39em',
    [mobileViewOverride]: {
      margin: '0 auto',
    },
  },
  heading: {
    fontFamily: theme.headingFontFamily,
  },
  subtext: {
    fontFamily: theme.subHeadingFontFamily,
  },
  divider: {
    background: gray2,
    border: 'none',
    width: '100%',
    height: '1px',
    margin: '1rem 0',
    [mobileViewOverride]: {
      margin: '0.5rem 0',
    },
  },
  signupForm: {
    width: '80%',
    [mobileViewOverride]: {
      width: 'auto',
    },
  },
  headerIcon: {
    height: '70px',
    display: 'block',
    objectFit: 'contain',
  },
}))

enum SignUpView {
  BASE_SIGNUP,
  TOS_AND_NEWSLETTER,
  INCOMPLETE_USER_SIGNUP,
}

const JoinPage: React.FC = () => {
  const pageClasses = useSignUpStyles()
  const classes = useStyles()
  const {t} = useTranslation(['sign-up-pages', 'common'])

  const invitation = useSelector(s => s.team.invitation)
  const invitationError = useSelector(s => s.team.invitationError)
  const pendingSignup = useUserPending('signup')

  const {signupInvitedUser} = useActions(userNianticActions)
  const {agreeToS} = useActions(userActions)
  const {wasInvited} = useActions(teamActions)
  const dispatch = useDispatch()
  const {setupNewsletterContact} = useSetupNewsletterContact()

  // TOS and Newsletter state
  const [userParams, setUserParams] = useState({} as SignUpUserNianticRequest)
  const [tosChecked, setToSChecked] = useState(false)
  const [newsLetterChecked, setNewsletterChecked] = useState(false)

  // Incomplete social signups
  const [signupFormView, setSignupFormView] = useState(SignUpView.BASE_SIGNUP)
  const user = useCurrentUser()
  const userIncompleteSignupInfo = user?.incompleteSignupUser
  const {firstNameInput, lastNameInput} = useRegisterFormInputs()
  const allInputs = [firstNameInput, lastNameInput]
  const allInputsValid = allInputs.every(i => i.isValid)
  const disableContinueWithIncompleteSignup = !allInputsValid || !tosChecked

  useEffect(() => {
    if (userIncompleteSignupInfo?.authProviderId) {
      setSignupFormView(SignUpView.INCOMPLETE_USER_SIGNUP)
    }
  }, [userIncompleteSignupInfo])

  if (invitationError) {
    return <ErrorPage msg={invitationError} />
  }

  if (!invitation) {
    return <Loader />
  }

  const handleSignUpView = (signupParams: SignUpUserNianticRequest) => {
    setUserParams({...signupParams})
    if (!signupParams.givenName || !signupParams.familyName) {
      dispatch({type: INCOMPLETE_SIGNUP, user: signupParams})
      // useEffect above will handle view change to the incomplete signup view.
    } else {
      setSignupFormView(SignUpView.TOS_AND_NEWSLETTER)
    }
  }

  const handleSignUpClick = async (
    signupUser: SignUpUserNianticRequest, isNewsLetterChecked: boolean
  ) => {
    await signupInvitedUser(signupUser)
    await agreeToS(TOS_CURRENT_VERSION)
    if (isNewsLetterChecked) {
      await setupNewsletterContact({
        email: signupUser?.email as string,
        given_name: signupUser?.givenName as string,
        family_name: signupUser?.familyName as string,
      })
    }
  }

  const handleOnSignInCallback = handleSignUpView

  const agreeToSAndNewsletter = (
    <div className={classes.signup}>
      <img
        // eslint-disable-next-line local-rules/hardcoded-copy
        alt='8thWall Logo'
        src={logoIcon}
      />
      <h1 className={classes.heading}>{t('register_sign_up_page.title')}</h1>
      <SpaceBetween justifyCenter direction='vertical'>
        <UserErrorMessage action={ACTIONS.SIGNUP} />
        <div className={classes.subtext}>
          {t('register_sign_up_page.tos_description', {ns: 'sign-up-pages'})}
        </div>
        <ToSAndNewsletterCheckbox
          tosCheck={tosChecked}
          setToSCheck={() => setToSChecked(!tosChecked)}
          newsletterCheck={newsLetterChecked}
          setNewsletterCheck={() => setNewsletterChecked(!newsLetterChecked)}
        />
        <PrimaryButton
          loading={pendingSignup}
          disabled={!tosChecked}
          onClick={() => handleSignUpClick(userParams, newsLetterChecked)}
        >{t('button.continue', {ns: 'common'})}
        </PrimaryButton>
      </SpaceBetween>
    </div>
  )

  const baseSignUp = (
    <div className={classes.signup}>
      <img
        // eslint-disable-next-line local-rules/hardcoded-copy
        alt='8thWall Logo'
        src={logoIcon}
        className={classes.headerIcon}
      />
      <h1 className={classes.heading}>{t('register_sign_up_page.title')}</h1>
      <SpaceBelow>
        <div className={classes.subtext}>
          {invitation?.accountName &&
            <Trans
              ns='sign-up-pages'
              i18nKey='join_page.invited_by_workspace'
              values={{workspace: invitation.accountName}}
              components={{
                1: <b />,
              }}
            />
        }
          {!invitation?.accountName && t('join_page.invited_by_us')}
        </div>
      </SpaceBelow>
      <div className={classes.signupForm}>
        <SpaceBelow>
          <UserErrorMessage action={ACTIONS.SIGNUP} />
        </SpaceBelow>
        <SpaceBetween narrow justifyCenter>
          <SocialLoginButtons onSigninCallback={handleOnSignInCallback} />
          <hr className={classes.divider} />
          <JoinPageForm
            invitation={invitation}
            agreeToS={agreeToS}
            wasInvited={wasInvited}
          />
        </SpaceBetween>
      </div>
    </div>
  )

  const incompleteSignup = (
    <div className={classes.signup}>
      <img
        // eslint-disable-next-line local-rules/hardcoded-copy
        alt='8thWall Logo'
        src={logoIcon}
      />
      <h1 className={classes.heading}>{t('register_sign_up_page.title')}</h1>
      <SpaceBetween justifyCenter direction='vertical'>
        <UserErrorMessage action={ACTIONS.SIGNUP} />
        <div className={classes.subtext}>
          {t('incomplete_apple_sign_up.additional_info_blurb', {ns: 'sign-up-pages'})}
        </div>
        <ResponsiveSplit>
          <FloatingLabelInput field={firstNameInput} />
          <FloatingLabelInput field={lastNameInput} />
        </ResponsiveSplit>
        <ToSAndNewsletterCheckbox
          tosCheck={tosChecked}
          setToSCheck={() => setToSChecked(!tosChecked)}
          newsletterCheck={newsLetterChecked}
          setNewsletterCheck={() => setNewsletterChecked(!newsLetterChecked)}
        />
        <PrimaryButton
          loading={pendingSignup}
          disabled={disableContinueWithIncompleteSignup}
          onClick={() => {
            const {email} = parseJwt(userIncompleteSignupInfo?.providerToken)
            handleSignUpClick({
              authProviderId: userIncompleteSignupInfo?.authProviderId,
              providerToken: userIncompleteSignupInfo?.providerToken,
              email,
              givenName: firstNameInput.value,
              familyName: lastNameInput.value,
            } as SignUpUserNianticRequest, newsLetterChecked)
          }}
        >{t('button.continue', {ns: 'common'})}
        </PrimaryButton>
      </SpaceBetween>
    </div>
  )

  const renderFormView = () => {
    switch (signupFormView) {
      case SignUpView.BASE_SIGNUP:
        return baseSignUp
      case SignUpView.TOS_AND_NEWSLETTER:
        return agreeToSAndNewsletter
      case SignUpView.INCOMPLETE_USER_SIGNUP:
        return incompleteSignup
      default:
        throw new Error(`Unexpected form type: ${signupFormView}`)
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
            title={t('join_page.title')}
            className={pageClasses.page}
          >
            <LogoWithLocaleSelector />
            <div className={classes.main}>
              <SpaceBelow>
                <HeroContainer>
                  {renderFormView()}
                </HeroContainer>
              </SpaceBelow>
              <div>
                <Trans
                  ns='sign-up-pages'
                  i18nKey='niantic_id_sign_up_page.already_have_niantic_id'
                  components={{
                    1: <StandardLink to='/login' />,
                  }}
                />
              </div>
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

export {
  JoinPage as default,
}
