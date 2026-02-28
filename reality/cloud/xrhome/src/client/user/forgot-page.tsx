import React from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'

import actions from './user-actions'
import ErrorMessage from '../home/error-message'
import {useFormInput} from '../common/form-change-hook'
import useActions from '../common/use-actions'
import {StandardTextField} from '../ui/components/standard-text-field'
import {PrimaryButton} from '../ui/components/primary-button'
import {useCurrentUser} from './use-current-user'
import NarrowPage from './sign-up/narrow-page'
import {createThemedStyles} from '../ui/theme'
import {SpaceBetween} from '../ui/layout/space-between'

const useStyles = createThemedStyles(theme => ({
  heading: {
    fontFamily: theme.headingFontFamily,
    fontSize: '3em',
    fontWeight: 500,
  },
}))

const ForgotPassword: React.FC = () => {
  const {t} = useTranslation(['login-pages'])
  const dispatch = useDispatch()
  const [email, onFormEmail] = useFormInput('')
  const [submitting, setSubmitting] = React.useState(false)
  const {forgotPassword} = useActions(actions)
  const classes = useStyles()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) {
      return
    }
    setSubmitting(true)
    forgotPassword(email, (errorKey: string) => {
      if (errorKey) {
        const errorMsg = t(errorKey)
        dispatch({type: 'ERROR', msg: errorMsg})
      }
      setSubmitting(false)
    })
  }

  return (
    <NarrowPage
      title={t('forgot_page.forgot_password.heading.forgotten_password')}
      hasHeader
    >
      <h1 className={classes.heading}>
        {t('forgot_page.forgot_password.heading.forgotten_password')}
      </h1>
      <form onSubmit={handleSubmit}>
        <SpaceBetween direction='vertical'>
          <ErrorMessage />
          <StandardTextField
            required
            starredLabel
            label={t('login_page.label.email')}
            onChange={onFormEmail}
          />
          <PrimaryButton
            spacing='full'
            type='submit'
            disabled={submitting}
            loading={submitting}
          >
            {t('forgot_page.forgot_password.button.send_verification_code')}
          </PrimaryButton>
        </SpaceBetween>
      </form>
    </NarrowPage>
  )
}

interface INewPassword {
  email: string
}

const NewPassword: React.FC<INewPassword> = ({
  email,
}) => {
  const {t} = useTranslation(['login-pages'])
  const [password, onFormPassword] = useFormInput('')
  const [pwconf, onFormPwconf] = useFormInput('')
  const [code, onFormCode] = useFormInput('')
  const {confirmPassword, error} = useActions(actions)
  const classes = useStyles()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== pwconf) {
      error(t('forgot_page.new_password.error.passwords_must_match'))
      return
    }
    confirmPassword({
      email,
      code,
      password,
    }, {path: '/'})
  }

  return (
    <NarrowPage title={t('forgot_page.new_password.heading.password_reset')} hasHeader>
      <h1 className={classes.heading}>
        {t('forgot_page.new_password.heading.password_reset')}
      </h1>
      <p>{t('forgot_page.new_password.verification_code_sent')}</p>
      <form onSubmit={handleSubmit}>
        <SpaceBetween direction='vertical'>
          <ErrorMessage />
          <StandardTextField
            required
            starredLabel
            label={t('forgot_page.new_password.label.verification_code')}
            placeholder='123456'
            onChange={onFormCode}
          />
          <StandardTextField
            required
            starredLabel
            label={t('forgot_page.new_password.label.password')}
            placeholder={t('forgot_page.new_password.placeholder.password')}
            type='password'
            onChange={onFormPassword}
          />
          <StandardTextField
            required
            starredLabel
            label={t('forgot_page.new_password.label.password_confirmation')}
            type='password'
            onChange={onFormPwconf}
          />
          <PrimaryButton
            type='submit'
            onClick={handleSubmit}
          >
            {t('forgot_page.new_password.button.reset_password')}
          </PrimaryButton>
        </SpaceBetween>
      </form>
    </NarrowPage>
  )
}

const ForgotPage = () => {
  const userState = useCurrentUser()

  return (!userState.code_sent
    ? <ForgotPassword />
    : <NewPassword email={userState.email} />
  )
}

export default ForgotPage
