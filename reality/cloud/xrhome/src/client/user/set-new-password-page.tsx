import * as React from 'react'
import {useTranslation} from 'react-i18next'

import userActions from './user-actions'
import ErrorMessage from '../home/error-message'
import {useFormInput} from '../common/form-change-hook'
import useActions from '../common/use-actions'
import {StandardTextField} from '../ui/components/standard-text-field'
import {PrimaryButton} from '../ui/components/primary-button'
import {createThemedStyles} from '../ui/theme'
import {SpaceBetween} from '../ui/layout/space-between'
import NarrowPage from './sign-up/narrow-page'

const useStyles = createThemedStyles(theme => ({
  heading: {
    fontFamily: theme.headingFontFamily,
    fontSize: '3em',
    fontWeight: 500,
  },
}))

const SetNewPasswordPage: React.FunctionComponent = () => {
  const {t} = useTranslation(['login-pages'])
  const [email, onFormEmail] = useFormInput('')
  const [tempPassword, onFormTempPassword] = useFormInput('')
  const [newPassword, onFormNewPassword] = useFormInput('')
  const [newPwconf, onFormNewPwconf] = useFormInput('')
  const {setNewPassword, error} = useActions(userActions)
  const classes = useStyles()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newPassword !== newPwconf) {
      error(t('set_new_password_page.error.passwords_must_match'))
      return
    }
    setNewPassword({
      rawEmail: email,
      tempPassword,
      newPassword,
    }, {path: '/'})
  }

  return (
    <NarrowPage
      hasHeader
      title={t('set_new_password_page.heading.temp_password_reset')}
    >
      <h1 className={classes.heading}>
        {t('set_new_password_page.heading.temp_password_reset')}
      </h1>
      <form onSubmit={handleSubmit}>
        <SpaceBetween direction='vertical'>
          <ErrorMessage />
          <p>{t('set_new_password_page.temp_password_sent')}</p>
          <StandardTextField
            required
            starredLabel
            label={t('login_page.label.email')}
            type='email'
            onChange={onFormEmail}
          />
          <StandardTextField
            required
            starredLabel
            label={t('set_new_password_page.label.temp_password')}
            type='password'
            onChange={onFormTempPassword}
          />
          <StandardTextField
            required
            starredLabel
            label={t('set_new_password_page.label.new_password')}
            placeholder={t('set_new_password_page.placeholder.new_password')}
            type='password'
            onChange={onFormNewPassword}
          />
          <StandardTextField
            required
            starredLabel
            label={t('set_new_password_page.label.new_password_confirmation')}
            type='password'
            onChange={onFormNewPwconf}
          />
          <PrimaryButton type='submit'>
            {t('set_new_password_page.new_password.button.set_new_password')}
          </PrimaryButton>
        </SpaceBetween>
      </form>
    </NarrowPage>
  )
}

export default SetNewPasswordPage
