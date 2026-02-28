import * as React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {StandardTextField} from '../ui/components/standard-text-field'
import {LinkButton} from '../ui/components/link-button'
import {PrimaryButton} from '../ui/components/primary-button'
import passwordLockImage from '../static/password_lock.svg'
import {gray4} from '../static/styles/settings'
import {combine} from '../common/styles'
import {StaticBanner} from '../ui/components/banner'
import useActions from '../common/use-actions'
import userActions from './user-actions'

const useStyles = createUseStyles({
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
  lockImage: {
    maxWidth: '10em',
  },
  email: {
    color: gray4,
    fontSize: '1.125em',
    border: 'none',
    textAlign: 'center',
    outline: 'none',
  },
  marginBottom: {
    marginBottom: '1.5em',
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

interface IChangePasswordFormView {
  email: string
  onPasswordChangeSubmit: () => void
  onPasswordChangeSuccess: () => void
  onPasswordChangeError: () => void
  onClose: () => void
  onTextFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  formState: {
    oldPassword: string
    newPassword: string
    confirmPassword: string
  }
}

const PasswordChangeFormView: React.FC<IChangePasswordFormView> = ({
  email, onPasswordChangeSubmit, onPasswordChangeSuccess, onPasswordChangeError,
  onClose, onTextFieldChange, formState,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['user-profile-page', 'common'])
  const [error, setError] = React.useState<string>(null)
  const {changePassword} = useActions(userActions)

  const submitPassword = async () => {
    setError(null)
    onPasswordChangeSubmit()
    if (formState.oldPassword === formState.newPassword) {
      onPasswordChangeError()
      setError(t('password_change_modal.error.password_new_current_must_be_different'))
      return
    }
    if (formState.newPassword !== formState.confirmPassword) {
      onPasswordChangeError()
      setError(t('password_change_modal.error.new_password_confirmation_dont_match'))
      return
    }
    if (!formState.oldPassword) {
      onPasswordChangeError()
      setError(t('password_change_modal.error.must_supply_current_password'))
      return
    }
    if (!formState.newPassword) {
      onPasswordChangeError()
      setError(t('password_change_modal.error.must_supply_new_password'))
      return
    }

    try {
      await changePassword(
        {oldPassword: formState.oldPassword, newPassword: formState.newPassword, email},
        () => onPasswordChangeSuccess()
      )
    } catch (e) {
      onPasswordChangeError()
      if (e.name === 'NotAuthorizedException') {
        setError(t('password_change_modal.error.wrong_current_password'))
        return
      }

      // eslint-disable-next-line no-console
      console.error(e)
      setError(t('password_change_modal.error.password_change_failed'))
      return
    }
    onClose()
  }

  return (
    <div className={classes.modalContainer}>
      <div className={classes.modalHeader}>
        <img
          className={classes.lockImage}
          alt={t('password_change_modal.lock_graphic_alt')}
          src={passwordLockImage}
          draggable={false}
        />
        <h2 className={classes.modalHeading}>
          {t('password_change_modal.heading')}
        </h2>
      </div>
      <form className={classes.formContainer}>
        <input
          className={combine(classes.email, !error && classes.marginBottom)}
          type='text'
          name='email'
          autoComplete='email'
          value={email}
          readOnly
        />
        {error && <StaticBanner type='danger'>{t(error)}</StaticBanner>}
        <StandardTextField
          id='oldPassword'
          type='password'
          label={<b>{t('password_change_modal.label.current_password')}</b>}
          placeholder={t('password_change_modal.placeholder.current_password')}
          value={formState.oldPassword}
          onChange={onTextFieldChange}
          autoComplete='current-password'
        />
        <StandardTextField
          id='newPassword'
          type='password'
          label={<b>{t('password_change_modal.label.new_password')}</b>}
          placeholder={t('password_change_modal.placeholder.new_password')}
          value={formState.newPassword}
          onChange={onTextFieldChange}
          autoComplete='new-password'
        />
        <StandardTextField
          id='confirmPassword'
          type='password'
          label={<b>{t('password_change_modal.label.password_confirmation')}</b>}
          placeholder={t('password_change_modal.placeholder.password_confirmation')}
          value={formState.confirmPassword}
          onChange={onTextFieldChange}
          autoComplete='new-password'
        />
      </form>
      <div className={classes.buttonTray}>
        <LinkButton onClick={onClose}>
          {t('button.cancel', {ns: 'common'})}
        </LinkButton>
        <PrimaryButton
          onClick={submitPassword}
          type='submit'
        >
          {t('password_change_modal.button.change')}
        </PrimaryButton>
      </div>
    </div>
  )
}

export {PasswordChangeFormView}
