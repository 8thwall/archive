import React from 'react'
import {Modal, Dimmer} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {Loader} from '../ui/components/loader'
import {LinkButton} from '../ui/components/link-button'
import {PrimaryButton} from '../ui/components/primary-button'
import {StandardTextField} from '../ui/components/standard-text-field'
import passwordLockImage from '../static/password_lock.svg'
import {mobileViewOverride} from '../static/styles/settings'
import {useUserPending} from './use-current-user'

const useStyles = createUseStyles({
  modal: {
    maxWidth: '34em',
    overflow: 'hidden',
    padding: '3em',
    [mobileViewOverride]: {
      padding: '2em',
    },
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
  lockImage: {
    maxWidth: '10em',
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
  email: {
    display: 'none',
  },
})

interface IConfirmPasswordModal {
  email: string
  handleClose: () => void
  handleSubmitPassword: (password: string) => void
}

const ConfirmPasswordModal: React.FC<IConfirmPasswordModal> = ({
  email, handleClose, handleSubmitPassword,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['user-profile-page', 'common'])
  const [password, setPassword] = React.useState('')
  const loading = useUserPending('updateEmail')
  const [error, setError] = React.useState<string>(null)
  const closable = !loading

  const onTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    // Replace newline/return(s) with one single space
    const noNewLineValue = value.replace(/[\r\n]+/g, ' ')
    setPassword(noNewLineValue)
  }

  const onClose = () => {
    setPassword('')
    setError(null)
    handleClose()
  }

  const handleSubmit = () => {
    if (password.length < 1) {
      setError(t('confirm_password_modal.error'))
      return
    }
    handleSubmitPassword(password)
  }

  return (
    <Modal
      open
      onClose={closable ? onClose : undefined}
      closeOnDimmerClick={closable}
      size='tiny'
      className={classes.modal}
    >
      <div className={classes.modalHeader}>
        <img
          className={classes.lockImage}
          alt={t('password_change_modal.lock_graphic_alt')}
          src={passwordLockImage}
          draggable={false}
        />
        <h2 className={classes.modalHeading}>
          {t('confirm_password_modal.heading')}
        </h2>
      </div>
      <form className={classes.formContainer}>
        <input
          className={classes.email}
          type='text'
          autoComplete='email'
          value={email}
          readOnly
        />
        <StandardTextField
          id='confirmPassword'
          type='password'
          label={<b>{t('confirm_password_modal.heading')}</b>}
          placeholder={t('confirm_password_modal.placeholder')}
          value={password}
          onChange={onTextFieldChange}
          autoComplete='current-password'
          errorMessage={error}
        />
      </form>
      <div className={classes.buttonTray}>
        <LinkButton onClick={onClose}>
          {t('button.cancel', {ns: 'common'})}
        </LinkButton>
        <PrimaryButton
          onClick={handleSubmit}
          type='submit'
        >
          {t('password_change_modal.button.change')}
        </PrimaryButton>
      </div>
      <Dimmer active={loading} inverted>
        <Loader />
      </Dimmer>
    </Modal>
  )
}

export {ConfirmPasswordModal}
