import React, {useState} from 'react'
import {createUseStyles} from 'react-jss'
import {Modal} from 'semantic-ui-react'

import type {IApp} from '../../common/types/models'
import useActions from '../../common/use-actions'
import {
  bodySanSerif, brandBlack, brandPurple, brandWhite, gray2, gray5,
} from '../../static/styles/settings'
import ButtonLink from '../../uiWidgets/button-link'
import appsActions from '../apps-actions'

interface IUnpublishProjectModal {
  app: IApp
  onClose: () => void
  onConfirm: Function
}

const useStyles = createUseStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  cancel: {
    color: brandPurple,
    padding: '.78571429em 1.5em',  // copy from semantic
  },
  submit: {
    'marginLeft': '1em',
    'padding': '.78571429em 1.5em',  // copy from semantic
    'fontFamily': bodySanSerif,
    'color': brandWhite,
    'backgroundColor': brandPurple,
    'boxShadow': `-10px 10px 21px 0 ${gray5}37`,
    'fontWeight': '700',
    'border': 'none',
    'borderRadius': '7px',
    '&:disabled': {
      'backgroundColor': `${brandPurple}54`,
      'boxShadow': 'none',
    },
  },
  instruction: {
    fontWeight: '700',
  },
  textbox: {
    'border': `${gray2} solid 1px`,
    'borderRadius': '4px',
    'textAlign': 'center',
    'padding': '0.5em 0',
    'fontWeight': '400',
    'fontFamily': bodySanSerif,
    'color': brandBlack,
    '&:focus': {
      outline: 'none !important',
    },
  },
  actions: {
    marginTop: '1em',
  },
})

const UnpublishProjectModal: React.FC<IUnpublishProjectModal> = ({
  app, onConfirm, onClose,
}) => {
  const [confirmText, setConfirmText] = useState('')
  const classes = useStyles()
  const {unpublishFeaturedApp} = useActions(appsActions)

  const onSubmit = () => {
    unpublishFeaturedApp(app.uuid, false)
    setConfirmText('')
    onConfirm()
  }
  const handleClose = () => {
    setConfirmText('')
    onClose()
  }

  return (
    <Modal onClose={handleClose} open size='tiny'>
      <Modal.Content>
        <form className={classes.content} onSubmit={onSubmit}>
          <h3>
            Are you sure you want to unpublish this Featured Project?
          </h3>
          <p>
            This project will no longer be publicly visible.
          </p>
          <p className={classes.instruction}>
            Type “UNPUBLISH” to confirm:
          </p>
          <input
            className={classes.textbox}
            type='text'
            value={confirmText}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onChange={e => setConfirmText(e.target.value)}
          />
          <div className={classes.actions}>
            <ButtonLink
              className={classes.cancel}
              type='button'
              onClick={handleClose}
            >
              Cancel
            </ButtonLink>
            <button
              className={classes.submit}
              type='submit'
              disabled={confirmText !== 'UNPUBLISH'}
              onSubmit={onSubmit}
            >
              Confirm
            </button>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  )
}

export default UnpublishProjectModal
