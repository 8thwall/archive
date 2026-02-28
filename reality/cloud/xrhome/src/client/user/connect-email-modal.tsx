import * as React from 'react'
import {Modal, Dimmer} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {LinkButton} from '../ui/components/link-button'
import {PrimaryButton} from '../ui/components/primary-button'
import {gray4} from '../static/styles/settings'
import fileImage from '../static/icons/email.svg'
import {StandardTextField} from '../ui/components/standard-text-field'
import {Loader} from '../ui/components/loader'
import {useEmailValidator} from './validate-email'
import {VerifyEmailModal} from './sign-up/verify-email-modal'
import userNianticActions from '../user-niantic/user-niantic-actions'
import useActions from '../common/use-actions'
import {ACTIONS} from '../user-niantic/user-niantic-errors'
import {UserErrorMessage} from '../home/user-error-message'
import {useUserPending} from './use-current-user'

const useStyles = createUseStyles({
  modal: {
    maxWidth: '34em',
    overflow: 'hidden',
  },
  modalContainer: {
    padding: '3em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  modalHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1em',
  },
  modalHeading: {
    margin: 0,
    padding: 0,
  },
  description: {
    textAlign: 'center',
    lineHeight: '1.5em',
  },
  graphic: {
    maxWidth: '10em',
  },
  email: {
    'color': gray4,
    'fontSize': '1.125em',
    'border': 'none',
    'textAlign': 'center',
    'marginBottom': '1.5em',
    'outline': 'none',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    textAlign: 'left',
    lineHeight: '1.75em',
    marginTop: '1em',
    marginBottom: '2.5em',
  },
  buttonTray: {
    display: 'flex',
    gap: '1em',
    justifyContent: 'center',
  },
})

interface IPasswordForm {
  email: string
  password: string
  confirmPassword: string
}

interface IConnectEmailModal {
  handleClose: () => void
}

const getInitialFormState = (): IPasswordForm => ({
  email: '',
  password: '',
  confirmPassword: '',
})

const ConnectEmailModal: React.FC<IConnectEmailModal> = ({
  handleClose,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['user-profile-page', 'common'])
  const [formState, setFormState] = React.useState(getInitialFormState())
  const [emailError, setEmailError] = React.useState<React.ReactNode>(null)
  const [confirmError, setConfirmError] = React.useState<boolean>(false)
  const [displayVerifyModal, setDisplayVerifyModal] = React.useState<boolean>(false)
  const validateEmail = useEmailValidator()
  const {connectEmail} = useActions(userNianticActions)
  const loading = useUserPending('connectEmail')
  const closable = !loading
  const disabled = !formState.email || !formState.password || !formState.confirmPassword

  const onTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {id, value} = e.target
    // Replace newline/return(s) with one single space
    const noNewLineValue = value.replace(/[\r\n]+/g, ' ')
    const newState = {...formState}
    newState[id] = noNewLineValue
    setFormState(newState)
  }

  const onClose = () => {
    setEmailError(null)
    setConfirmError(null)
    setFormState(getInitialFormState())
    setDisplayVerifyModal(false)
    handleClose()
  }

  const submitForm: React.FormEventHandler = async (e) => {
    e.preventDefault()
    const isEmailValid = validateEmail(formState.email)
    if (isEmailValid !== null) {
      setEmailError(isEmailValid)
    }
    const isPasswordMatching = formState.password === formState.confirmPassword
    setConfirmError(!isPasswordMatching)
    if (!!isEmailValid || !isPasswordMatching) {
      return
    }
    const success = await connectEmail(formState)
    // TODO: verify the email is being sent to the correct address
    setDisplayVerifyModal(success)
  }

  if (displayVerifyModal) {
    return (
      <VerifyEmailModal
        email={formState.email}
        onCloseClick={onClose}
        onVerifyEmailSuccess={onClose}
        verificationBehavior='link'
        disableEditEmail
      />
    )
  }

  return (
    <Modal
      open
      onClose={closable ? onClose : undefined}
      closeOnDimmerClick={closable}
      size='tiny'
      className={classes.modal}
    >
      <div className={classes.modalContainer}>
        <div className={classes.modalHeader}>
          <img
            className={classes.graphic}
            alt={t('connect_email_modal.alt')}
            src={fileImage}
          />
          <h2 className={classes.modalHeading}>
            {t('connect_email_modal.heading')}
          </h2>
          <div className={classes.description}>
            {t('connect_email_modal.description')}
          </div>
        </div>
        <form onSubmit={submitForm}>
          <div className={classes.formContainer}>
            <StandardTextField
              id='email'
              label={<b>{t('user_profile_page.label.email')}</b>}
              placeholder={t('user_profile_page.label.email')}
              value={formState.email}
              onChange={onTextFieldChange}
              autoComplete='email'
              errorMessage={emailError}
            />
            <StandardTextField
              id='password'
              type='password'
              label={<b>{t('connect_email_modal.label.password')}</b>}
              placeholder={t('connect_email_modal.label.password')}
              value={formState.password}
              onChange={onTextFieldChange}
              autoComplete='current-password'
              errorMessage={confirmError && ' '}
            />
            <StandardTextField
              id='confirmPassword'
              type='password'
              label={<b>{t('password_change_modal.label.password_confirmation')}</b>}
              placeholder={t('password_change_modal.label.password_confirmation')}
              value={formState.confirmPassword}
              onChange={onTextFieldChange}
              autoComplete='current-password'
              errorMessage={confirmError && t('connect_email_modal.error.password_not_matching')}
            />
            <UserErrorMessage action={ACTIONS.CONNECT_EMAIL} />
          </div>
          <div className={classes.buttonTray}>
            <LinkButton
              onClick={onClose}
              type='button'
            >
              {t('button.cancel', {ns: 'common'})}
            </LinkButton>
            <PrimaryButton
              disabled={disabled}
              type='submit'
            >
              {t('connected_account_settings.button.connect')}
            </PrimaryButton>
          </div>
        </form>
      </div>
      <Dimmer active={loading} inverted>
        <Loader />
      </Dimmer>
    </Modal>
  )
}

export {ConnectEmailModal}
