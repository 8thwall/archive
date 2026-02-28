/* eslint-disable quote-props */
import React, {useState} from 'react'
import {createUseStyles} from 'react-jss'
import {Trans, useTranslation} from 'react-i18next'

import {FloatingLabelInput, FloatingLabelDropdown, type TextInput} from '../../../ui/form'
import {
  FloatingLabelInput as BaseFloatingLabelInput,
} from '../../../ui/components/floating-label-input'
import PasswordRequirementsBox from '../password-requirements-box'
import SpaceBelow from '../../../ui/layout/space-below'
import ResponsiveSplit from '../../../ui/layout/responsive-split'
import {StandardCheckboxField} from '../../../ui/components/standard-checkbox-field'
import {cherry} from '../../../static/styles/settings'
import LinkOut from '../../../uiWidgets/link-out'
import {useCrmFormOptions} from '../user-crm-form-options'
import {
  PASSWORD_REQUIREMENTS, MATCH_REQUIREMENT,
} from '../register-form/form-inputs'
import {useUserPending} from '../../use-current-user'
import {IconButton} from '../../../ui/components/icon-button'

const useStyles = createUseStyles({
  passwordWrapper: {
    position: 'relative',  // TODO(christoph): Switch to common layout classes
  },
  asterisk: {
    color: cherry,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordIcon: {
    cursor: 'pointer',
    position: 'absolute',
    right: '0.5em',
    top: '0.75em',
    zIndex: 10,
  },
})

interface IRegisterForm {
  firstNameInput: TextInput
  lastNameInput: TextInput
  emailInput?: TextInput
  email?: string
  passwordInput: TextInput
  passwordRetypeInput: TextInput
  companyNameInput?: TextInput
  roleInput?: TextInput
  industryInput?: TextInput
  showTOSandNewsletter: boolean
  showPasswordRequirements?: boolean
  newsletterCheck?: boolean
  setNewsletterCheck?: () => void
  tosCheck?: boolean
  setToSCheck?: () => void
}

const RegisterForm: React.FunctionComponent<IRegisterForm> = ({
  firstNameInput, lastNameInput, emailInput, email, passwordInput, passwordRetypeInput,
  companyNameInput, roleInput, showPasswordRequirements = true, industryInput,
  showTOSandNewsletter = false, newsletterCheck, setNewsletterCheck, tosCheck, setToSCheck,
}) => {
  const {t} = useTranslation(['sign-up-pages', 'common'])
  const classes = useStyles()
  const {bestDescribedRoleDropdownOptions, industryDropdownOptions} = useCrmFormOptions()
  const [showNewsletter, setShowNewsletter] = useState(true)
  const signupPending = useUserPending('signup')
  const [passwordInputType, setPasswordInputType] = React.useState('password')
  const [passwordIconOpen, setPasswordIconOpen] = React.useState(false)
  const [retypeInputType, setRetypeInputType] = React.useState('password')
  const [retypeIconOpen, setRetypeIconOpen] = React.useState(false)

  const allPasswordRequirements = () => [...PASSWORD_REQUIREMENTS, MATCH_REQUIREMENT]

  // Get data from SessionStorage
  React.useEffect(() => {
    const sessionDataEmail = sessionStorage.getItem('free-trial.email')
    const sessionNewsletter = sessionStorage.getItem('free-trial.newsletter-contact-id')
    if (sessionDataEmail && emailInput) {
      emailInput.onChange(null, {value: sessionDataEmail})
    }
    if (sessionNewsletter) {
      setShowNewsletter(false)
    }
  }, [])

  const checkboxTOS = (
    <Trans
      ns='sign-up-pages'
      i18nKey='register_sign_up_page.register_form.tos'
      asterisk={classes.asterisk}
    >
      I agree to the <LinkOut url='https://www.8thwall.com/terms'>Terms and Services</LinkOut>
      &nbsp;and confirm I have read the&nbsp;
      <LinkOut url='https://www.8thwall.com/privacy'>Privacy Policy</LinkOut>.&nbsp;
      <span className={classes.asterisk}>*</span>
    </Trans>
  )

  const setShowPassword = () => {
    if (passwordInputType === 'password') {
      setPasswordInputType('text')
      setPasswordIconOpen(true)
    } else {
      setPasswordInputType('password')
      setPasswordIconOpen(false)
    }
  }
  const setRetypePassword = () => {
    if (retypeInputType === 'password') {
      setRetypeInputType('text')
      setRetypeIconOpen(true)
    } else {
      setRetypeInputType('password')
      setRetypeIconOpen(false)
    }
  }

  return (
    <>
      <SpaceBelow>
        <ResponsiveSplit>
          <FloatingLabelInput disabled={signupPending} field={firstNameInput} />
          <FloatingLabelInput disabled={signupPending} field={lastNameInput} />
        </ResponsiveSplit>
      </SpaceBelow>
      <SpaceBelow>
        {emailInput && <FloatingLabelInput disabled={signupPending} field={emailInput} />}
        {email && <BaseFloatingLabelInput label='Email' value={email} disabled />}
      </SpaceBelow>
      <div className={classes.passwordWrapper}>
        <SpaceBelow>
          <ResponsiveSplit>
            <div className={classes.passwordContainer}>
              <FloatingLabelInput
                disabled={signupPending}
                field={passwordInput}
                type={passwordInputType}
              />
              <div
                className={classes.passwordIcon}
              >
                <IconButton
                  text={passwordIconOpen
                    ? t('button.password_visible', {ns: 'common'})
                    : t('button.password_hidden', {ns: 'common'})}
                  stroke={passwordIconOpen ? 'visible' : 'hidden'}
                  color='muted'
                  onClick={setShowPassword}
                  tabIndex={-1}
                />
              </div>
            </div>
            <div className={classes.passwordContainer}>
              <FloatingLabelInput
                disabled={signupPending}
                field={passwordRetypeInput}
                type={retypeInputType}
              />
              <div
                className={classes.passwordIcon}
              >
                <IconButton
                  text={retypeIconOpen
                    ? t('button.password_visible', {ns: 'common'})
                    : t('button.password_hidden', {ns: 'common'})}
                  stroke={retypeIconOpen ? 'visible' : 'hidden'}
                  color='muted'
                  onClick={setRetypePassword}
                  tabIndex={-1}
                />
              </div>
            </div>
          </ResponsiveSplit>
        </SpaceBelow>
        {showPasswordRequirements && <PasswordRequirementsBox
          requirements={allPasswordRequirements()}
          password={passwordInput.value}
          passwordRetype={passwordRetypeInput.value}
        />}
      </div>
      {companyNameInput &&
        <SpaceBelow>
          <FloatingLabelInput disabled={signupPending} field={companyNameInput} />
        </SpaceBelow>
      }
      {roleInput &&
        <SpaceBelow>
          <FloatingLabelDropdown
            disabled={signupPending}
            field={roleInput}
            options={bestDescribedRoleDropdownOptions}
            selectOnBlur={false}
          />
        </SpaceBelow>
      }
      {industryInput &&
        <SpaceBelow>
          <FloatingLabelDropdown
            disabled={signupPending}
            field={industryInput}
            options={industryDropdownOptions}
            selectOnBlur={false}
          />
        </SpaceBelow>
      }
      {showTOSandNewsletter &&
        <SpaceBelow>
          <StandardCheckboxField
            id='checkbox-tos'
            checked={tosCheck}
            onChange={setToSCheck}
            label={checkboxTOS}
            nowrap
          />
          {showNewsletter &&
            <StandardCheckboxField
              id='checkbox-newsletter'
              checked={newsletterCheck}
              onChange={setNewsletterCheck}
              label={t('register_sign_up_page.register_form.checkbox.label.newsletter')}
              nowrap
            />
              }
        </SpaceBelow>
      }
    </>
  )
}

export {
  RegisterForm,
}
