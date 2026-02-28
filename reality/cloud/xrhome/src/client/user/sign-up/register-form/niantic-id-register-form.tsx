import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import SpaceBelow from '../../../ui/layout/space-below'
import ResponsiveSplit from '../../../ui/layout/responsive-split'
import {FloatingLabelInput, type TextInput} from '../../../ui/form'
import {
  FloatingLabelInput as BaseFloatingLabelInput,
} from '../../../ui/components/floating-label-input'
import {cherry} from '../../../static/styles/settings'
import PasswordRequirementsBox from '../password-requirements-box'
import {getAllPasswordRequirements} from './form-inputs'
import {useUserPending} from '../../use-current-user'
import {IconButton} from '../../../ui/components/icon-button'

const useStyles = createUseStyles({
  passwordWrapper: {
    position: 'relative',
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

interface INianticIdRegisterForm {
  firstNameInput: TextInput
  lastNameInput: TextInput
  emailInput?: TextInput
  email?: string
  passwordInput: TextInput
  passwordRetypeInput: TextInput
  showPasswordRequirements?: boolean
}

const NianticIdRegisterForm: React.FC<INianticIdRegisterForm> = ({
  firstNameInput, lastNameInput, emailInput, email, passwordInput, passwordRetypeInput,
  showPasswordRequirements = true,
}) => {
  const {t} = useTranslation(['common'])
  const classes = useStyles()
  const disableInputs = useUserPending('signup')
  const [passwordInputType, setPasswordInputType] = React.useState('password')
  const [passwordIconOpen, setPasswordIconOpen] = React.useState(false)
  const [retypeInputType, setRetypeInputType] = React.useState('password')
  const [retypeIconOpen, setRetypeIconOpen] = React.useState(false)

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
        <SpaceBelow>
          {emailInput && <FloatingLabelInput disabled={disableInputs} field={emailInput} />}
          {email &&
            <BaseFloatingLabelInput
              // eslint-disable-next-line local-rules/hardcoded-copy
              label='Email'
              value={email}
              disabled={disableInputs}
            />}
        </SpaceBelow>
        <ResponsiveSplit>
          <FloatingLabelInput disabled={disableInputs} field={firstNameInput} />
          <FloatingLabelInput disabled={disableInputs} field={lastNameInput} />
        </ResponsiveSplit>
      </SpaceBelow>
      <div className={classes.passwordWrapper}>
        <SpaceBelow>
          <ResponsiveSplit>
            <div className={classes.passwordContainer}>
              <FloatingLabelInput
                disabled={disableInputs}
                field={passwordInput}
                type={passwordInputType}
              />
              <div
                className={classes.passwordIcon}
              >
                <IconButton
                  text={passwordIconOpen
                    ? t('button.password_visible')
                    : t('button.password_hidden')}
                  stroke={passwordIconOpen ? 'visible' : 'hidden'}
                  color='muted'
                  onClick={setShowPassword}
                  tabIndex={-1}
                />
              </div>
            </div>
            <div className={classes.passwordContainer}>
              <FloatingLabelInput
                disabled={disableInputs}
                field={passwordRetypeInput}
                type={retypeInputType}
              />
              <div
                className={classes.passwordIcon}
              >
                <IconButton
                  text={retypeIconOpen
                    ? t('button.password_visible')
                    : t('button.password_hidden')}
                  stroke={retypeIconOpen ? 'visible' : 'hidden'}
                  color='muted'
                  onClick={setRetypePassword}
                  tabIndex={-1}
                />
              </div>
            </div>
          </ResponsiveSplit>
        </SpaceBelow>
        {/* TODO(alvin): This doesn't match the design. Update this afterwards. */}
        {showPasswordRequirements && <PasswordRequirementsBox
          requirements={getAllPasswordRequirements()}
          password={passwordInput.value}
          passwordRetype={passwordRetypeInput.value}
        />}
      </div>
    </>
  )
}

export {
  NianticIdRegisterForm,
}
