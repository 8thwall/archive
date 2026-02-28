import {useTranslation} from 'react-i18next'

import {PASSWORD_REQUIREMENTS, MATCH_REQUIREMENT} from './form-inputs'
import {useEmailValidator} from '../../validate-email'
import {useTextInput} from '../../../ui/form'
import {errorIfMissing} from '../../../ui/form'

const useRegisterFormInputs = () => {
  const {t} = useTranslation(['sign-up-pages'])
  const validateEmail = useEmailValidator()
  const validatePassword = (password: string) => {
    if (!PASSWORD_REQUIREMENTS.every(r => r.check(password))) {
      return t('register_sign_up_page.register_form.validate_input_password')
    }
    return null
  }

  const validateRetype = (password: string) => (retype: string) => {
    if (!MATCH_REQUIREMENT.check(password, retype)) {
      return t('register_sign_up_page.register_form.validate_input_retype')
    } else {
      return null
    }
  }

  const firstNameInput = useTextInput(
    t('register_sign_up_page.register_form.input.label.first_name'),
    errorIfMissing(t('register_sign_up_page.register_form.validate_input_first_name'))
  )
  const lastNameInput = useTextInput(
    t('register_sign_up_page.register_form.input.label.last_name'),
    errorIfMissing(t('register_sign_up_page.register_form.validate_input_last_name'))
  )
  const emailInput = useTextInput(
    t('register_sign_up_page.register_form.input.label.email'), validateEmail
  )
  const passwordInput = useTextInput(
    t('register_sign_up_page.register_form.input.label.password'), validatePassword
  )
  const passwordRetypeInput = useTextInput(
    t('register_sign_up_page.register_form.input.label.confirm_password'),
    validateRetype(passwordInput.value)
  )
  const companyNameInput = useTextInput(
    t('register_sign_up_page.register_form.input.label.company_name')
  )
  // TODO(christoph) Confirm missing text
  const roleInput = useTextInput(
    t('register_sign_up_page.register_form.input.label.role'),
    errorIfMissing(t('register_sign_up_page.register_form.validate_input_role'))
  )
  const industryInput = useTextInput(
    t('register_sign_up_page.register_form.input.label.industry'),
    errorIfMissing(t('register_sign_up_page.register_form.validate_input_industry'))
  )

  return {
    firstNameInput,
    lastNameInput,
    emailInput,
    passwordInput,
    passwordRetypeInput,
    companyNameInput,
    roleInput,
    industryInput,
  }
}

export {
  useRegisterFormInputs,
}
