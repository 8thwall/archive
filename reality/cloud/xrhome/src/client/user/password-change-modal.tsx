import React from 'react'
import {Modal, Dimmer} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'

import {Loader} from '../ui/components/loader'
import {PasswordChangeFormView} from './password-change-form-view'

const useStyles = createUseStyles({
  modal: {
    maxWidth: '34em',
    overflow: 'hidden',
  },
})

interface IPasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

interface IPasswordChangeModal {
  email: string
  open: boolean
  handleClose: () => void
  handlePasswordChangeSuccess: () => void
}

const getInitialFormState = (): IPasswordForm => ({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const PasswordChangeModal: React.FC<IPasswordChangeModal> = ({
  email, open, handleClose, handlePasswordChangeSuccess,
}) => {
  const classes = useStyles()
  const [formState, setFormState] = React.useState(getInitialFormState())
  const [loading, setLoading] = React.useState(false)
  const closable = !loading

  const onTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {id, value} = e.target
    // Replace newline/return(s) with one single space
    const noNewLineValue = value.replace(/[\r\n]+/g, ' ')
    const newState = {...formState}
    newState[id] = noNewLineValue
    setFormState(newState)
  }

  const onClose = () => {
    setLoading(false)
    setFormState(getInitialFormState())
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={closable ? onClose : undefined}
      closeOnDimmerClick={closable}
      size='tiny'
      className={classes.modal}
    >
      <PasswordChangeFormView
        email={email}
        formState={formState}
        onPasswordChangeSuccess={handlePasswordChangeSuccess}
        onPasswordChangeSubmit={() => setLoading(true)}
        onPasswordChangeError={() => setLoading(false)}
        onClose={onClose}
        onTextFieldChange={onTextFieldChange}
      />
      <Dimmer active={loading} inverted>
        <Loader />
      </Dimmer>
    </Modal>
  )
}

export {PasswordChangeModal}
