import React from 'react'
import {createUseStyles} from 'react-jss'

import {combine} from '../common/styles'
import {
  brandPurple, brandWhite, gray2, brandBlack, blueberry,
} from '../static/styles/settings'
import {Icon} from '../ui/components/icon'
import {COGNITO_AUTH_PROVIDER_ID} from '../../shared/users/users-niantic-constants'
import {VerifyEmailModal} from './sign-up/verify-email-modal'
import {ConfirmPasswordModal} from './confirm-password-modal'
import useActions from '../common/use-actions'
import userNianticActions from '../user-niantic/user-niantic-actions'

const useStyles = createUseStyles({
  cognitoOption: {
    display: 'flex',
    gap: '0.5em',
    width: '100%',
  },
  inputEmail: {
    'flex': 1,
    'display': 'flex',
    'background': brandWhite,
    'border': `1px solid ${gray2}`,
    'borderRadius': '0.25em',
    'color': brandBlack,
    'position': 'relative',
    'padding': '0.5em 1em',
    'lineHeight': '1.425em',
    '&:focus': {
      outline: `1px solid ${blueberry}`,
    },
  },
  button: {
    padding: '0.5em 0.75em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.25em',
    cursor: 'pointer',
    border: 'none',
  },
  confirmButton: {
    background: brandPurple,
  },
  cancelButton: {
    background: gray2,
  },
  disabled: {
    opacity: '20%',
  },
})

interface IProfilePageCognitoInput {
  email: string
  onClose: () => void
}

const ProfilePageCognitoInput: React.FC<IProfilePageCognitoInput> = ({
  email, onClose,
}) => {
  const classes = useStyles()
  const [newEmail, setNewEmail] = React.useState<string>(email)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [showVerifyModal, setShowVerifyModal] = React.useState(false)
  const emailChanged = newEmail.length > 0 && newEmail !== email
  const {updateEmail} = useActions(userNianticActions)

  const onEmailFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    // Replace newline/return(s) with one single space
    const noNewLineValue = value.replace(/[\r\n]+/g, ' ')
    setNewEmail(noNewLineValue)
  }

  const handleSubmit = () => {
    setShowConfirmPassword(true)
  }

  const handleSubmitPassword = async (password: string) => {
    const success = await updateEmail(email, newEmail, password)
    if (success) {
      setShowConfirmPassword(false)
      setShowVerifyModal(true)
    } else {
      setShowConfirmPassword(false)
    }
  }

  const handleClose = () => {
    setShowConfirmPassword(true)
    setShowVerifyModal(false)
    onClose()
  }

  const handleEmailChangeSuccess = () => {
    handleClose()
  }

  return (
    <div className={classes.cognitoOption}>
      <input
        className={classes.inputEmail}
        id={COGNITO_AUTH_PROVIDER_ID}
        value={newEmail}
        onChange={onEmailFieldChange}
      />
      <button
        type='button'
        className={combine(classes.button, classes.cancelButton)}
        onClick={onClose}
        onKeyDown={onClose}
        tabIndex={0}
      >
        <Icon stroke='cancel' color='black' />
      </button>
      <button
        type='button'
        className={combine(classes.button, classes.confirmButton,
          !emailChanged && classes.disabled)}
        onClick={handleSubmit}
        onKeyDown={handleSubmit}
        tabIndex={0}
        disabled={!emailChanged}
      >
        <Icon stroke='checkmark' color='white' />
      </button>
      {showConfirmPassword &&
        <ConfirmPasswordModal
          email={newEmail}
          handleClose={handleClose}
          handleSubmitPassword={handleSubmitPassword}
        />
      }
      {showVerifyModal &&
        <VerifyEmailModal
          email={newEmail}
          onCloseClick={handleClose}
          onVerifyEmailSuccess={handleEmailChangeSuccess}
          verificationBehavior='update'
          disableEditEmail
        />
      }
    </div>
  )
}

export {ProfilePageCognitoInput}
