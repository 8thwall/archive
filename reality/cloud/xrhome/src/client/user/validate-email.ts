/* eslint-disable quote-props */
import {useTranslation} from 'react-i18next'

import {EMAIL_PATTERN} from '../../shared/user-constants'

const EMAIL_REGEX = new RegExp(EMAIL_PATTERN)

const useEmailValidator = () => {
  const {t} = useTranslation('sign-up-pages')

  return (email) => {
    if (!email) {
      return t('register_sign_up_page.validate_input_email.enter_email')
    }

    if (!EMAIL_REGEX.test(email.toLowerCase())) {
      return t('register_sign_up_page.validate_input_email.enter_valid_email')
    }

    if (!EMAIL_REGEX.test(email)) {
      return t('register_sign_up_page.validate_input_email.enter_lowercase_email')
    }

    return null
  }
}

export {useEmailValidator}
