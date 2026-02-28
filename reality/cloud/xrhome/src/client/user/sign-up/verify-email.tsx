import React, {useState} from 'react'
import {useTranslation, Trans} from 'react-i18next'
import {useDispatch} from 'react-redux'

import logoIcon from '../../static/infin8_Purple.svg'
import {mobileViewOverride} from '../../static/styles/settings'
import {useEmailValidator} from '../validate-email'
import {useTextInput, FloatingLabelInput, errorIfMissing} from '../../ui/form'
import useActions from '../../common/use-actions'
import userActions from '../user-actions'
import SpaceBelow from '../../ui/layout/space-below'
import {PrimaryButton} from '../../ui/components/primary-button'
import {Icon} from '../../ui/components/icon'
import withTranslationLoaded from '../../i18n/with-translations-loaded'
import {useUserEmail, useUserPending} from '../use-current-user'
import userNianticActions from '../../user-niantic/user-niantic-actions'
import {UserErrorMessage} from '../../home/user-error-message'
import {ACTIONS} from '../../user-niantic/user-niantic-errors'
import {acknowledgeError} from '../../user-niantic/user-niantic-action-types'
import {useSelector} from '../../hooks'
import type {VerifyEmailRequest} from '../../../shared/users/users-niantic-types'
import {usePendoDisableGuides} from '../../common/use-pendo'
import {createThemedStyles} from '../../ui/theme'
import {StandardContainer} from '../../ui/components/standard-container'
import {SpaceBetween} from '../../ui/layout/space-between'
import {LinkButton} from '../../ui/components/link-button'

const centered = {
  display: 'flex',
  justifyContent: 'center',
}

const useStyles = createThemedStyles(theme => ({
  sentEmailImage: {
    ...centered,
    marginBottom: '0.5em',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0',
  },
  userEmail: {
    fontWeight: 'bold',
  },
  codeSent: {
    ...centered,
    color: theme.fgMain,
    verticalAlign: 'center',
  },
  iconContainer: {
    width: '40px',
    height: '71px',
    objectFit: 'contain',
  },
  heading: {
    fontFamily: theme.headingFontFamily,
    fontSize: '2.25em',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: '1em',
    marginTop: '0.25em',
    [mobileViewOverride]: {
      fontSize: '1.8em',
    },
  },
  subheading: {
    fontFamily: theme.subHeadingFontFamily,
    textAlign: 'center',
    fontSize: '1em',
    maxWidth: '30em',
    margin: '0',
    [mobileViewOverride]: {
      fontSize: '1.125em',
    },
  },
  headerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: '2em',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    [mobileViewOverride]: {
      paddingBottom: '1em',
    },
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '20rem',
    gap: '1rem',
    textAlign: 'left',
    [mobileViewOverride]: {
      width: '100%',
    },
  },
}))

const VERIFICATION_CODE_LENGTH = 6

interface IVerifyEmail {
  email?: string
  onVerifyEmailSuccess?: () => void
  verificationBehavior: VerifyEmailRequest['verificationBehavior']
  disableEditEmail?: boolean
}

interface IVerifyEmailHeaderContainer {
  text?: string
}

const VerifyEmailHeaderContainer: React.FC<IVerifyEmailHeaderContainer> = ({text}) => {
  const classes = useStyles()
  const {t} = useTranslation(['sign-up-pages'])

  return (
    <div className={classes.headerContainer}>
      <SpaceBetween direction='vertical' centered>
        <img
        // eslint-disable-next-line local-rules/hardcoded-copy
          alt='8thWall logo'
          src={logoIcon}
          className={classes.iconContainer}
        />
        <h1 className={classes.heading}>
          {t('email_verification_sign_up_page.title')}
        </h1>
        <h3 className={classes.subheading}>
          {text}
        </h3>
      </SpaceBetween>
    </div>
  )
}

const VerifyEmail: React.FC<IVerifyEmail> = ({
  email = null, onVerifyEmailSuccess = null, verificationBehavior,
  disableEditEmail,
}) => {
  const classes = useStyles()
  const {linkCurrentUserToCrm} = useActions(userActions)
  const {verifyEmail, getVerificationCode, changeVerificationEmail} = useActions(userNianticActions)
  const {t} = useTranslation(['email-verification', 'common'])
  const validateEmail = useEmailValidator()
  const verifyEmailPending = useUserPending('verifyEmail')
  const changeVerificationEmailPending = useUserPending('changeVerificationEmail')

  const dispatch = useDispatch()
  const currentEmail = useUserEmail()
  const userEmail = email || currentEmail
  const newEmailInput = useTextInput(t('email_verification.input.label.email'),
    validateEmail, userEmail)
  const emailVerificationError = useSelector(
    state => !!state.userNiantic.error?.['email-verification']
  )
  const verificationCodeInput = useTextInput(
    t('email_verification.input.label.verification_code'),
    errorIfMissing(t('email_verification.input.label.verification_code'))
  )
  usePendoDisableGuides()

  const [codeSent, setCodeSent] = useState<boolean>(false)
  const [showEmailChangeForm, setShowEmailChangeForm] = useState<boolean>(false)

  React.useEffect(() => {
    dispatch(acknowledgeError(ACTIONS.EMAIL_VERIFICATION))
  }, [verificationCodeInput.value, newEmailInput.value])

  const onResend = async (e) => {
    e.preventDefault()
    setCodeSent(false)

    if (newEmailInput.value !== userEmail) {
      await changeVerificationEmail(newEmailInput.value)
    } else {
      await getVerificationCode()
    }

    setShowEmailChangeForm(false)
    setCodeSent(true)
  }

  const onSubmitVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const code = verificationCodeInput.value
    const isEmailVerified = await verifyEmail(code, verificationBehavior)

    if (!isEmailVerified) {
      return
    }

    await linkCurrentUserToCrm()
    verificationCodeInput.onChange('')
    onVerifyEmailSuccess?.()
  }

  const confirmDisabled = !verificationCodeInput.value || (
    verificationCodeInput.value.length !== VERIFICATION_CODE_LENGTH
  )

  return (
    <SpaceBetween direction='vertical' justifyCenter centered>
      {!disableEditEmail &&
        <VerifyEmailHeaderContainer text={
          showEmailChangeForm ? t('email_verification.heading.edit_email_address') : userEmail
          }
        />
      }
      {!showEmailChangeForm &&
        <>
          <StandardContainer padding='small'>
            <p>
              <Trans
                ns='email-verification'
                i18nKey='email_verification.blurb.please_enter_code'
                values={{userEmail}}
                components={{1: <span className={classes.userEmail} />}}
              />
            </p>
          </StandardContainer>
          <div className={classes.inputContainer}>
            <form onSubmit={onSubmitVerification}>
              <SpaceBelow>
                <FloatingLabelInput disabled={verifyEmailPending} field={verificationCodeInput} />
              </SpaceBelow>
              <PrimaryButton
                spacing='full'
                type='submit'
                disabled={confirmDisabled}
                loading={verifyEmailPending}
                a8='click;sign-up-funnel;step-2-verify-click-confirm-email'
              >{t('button.confirm', {ns: 'common'})}
              </PrimaryButton>
            </form>
            <SpaceBetween direction='horizontal' justifyCenter>
              <LinkButton
                onClick={onResend}
                a8='click;sign-up-funnel;step-2-verify-click-resend-code'
              >
                {t('email_verification.button_link.resend_code')}
              </LinkButton>
              {!disableEditEmail &&
                <LinkButton
                  onClick={() => {
                    setCodeSent(false)
                    setShowEmailChangeForm(true)
                  }}
                  a8='click;sign-up-funnel;step-2-verify-click-change-email'
                >
                  {t('email_verification.button.link.edit_email_address')}
                </LinkButton>
              }
            </SpaceBetween>
          </div>
        </>
      }
      {showEmailChangeForm &&
        <div className={classes.inputContainer}>
          <form onSubmit={onResend}>
            <SpaceBelow>
              <FloatingLabelInput field={newEmailInput} />
            </SpaceBelow>
            <PrimaryButton
              spacing='full'
              type='submit'
              loading={changeVerificationEmailPending}
              a8='click;sign-up-funnel;step-2-verify-click-confirm-email'
            >{t('email_verification.button.send_code')}
            </PrimaryButton>
          </form>
          <LinkButton
            onClick={() => setShowEmailChangeForm(false)}
            a8='click;sign-up-funnel;step-2-verify-click-change-email'
          >
            {t('email_verification.button_link.cancel')}
          </LinkButton>
        </div>
      }
      <UserErrorMessage action={ACTIONS.EMAIL_VERIFICATION} />
      {codeSent && !emailVerificationError &&
        <div className={classes.codeSent}>
          <Icon stroke='checkmark' />&nbsp;
          {t('email_verification.sent')}
        </div>
      }
    </SpaceBetween>
  )
}

const TranslatedVerifyEmail = withTranslationLoaded(VerifyEmail)

export {
  TranslatedVerifyEmail as VerifyEmail,
}
