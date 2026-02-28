import * as React from 'react'
import {createUseStyles} from 'react-jss'
import {Modal, Label, Input, Button, Form} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {
  brandPurple, brandBlack, buttonBoxShadow, tinyViewOverride,
} from '../../static/styles/settings'
import ButtonLink from '../../uiWidgets/button-link'

const useStyles = createUseStyles({
  deactivateModal: {
    '&.ui.modal > *:not(:first-child)': {
      [tinyViewOverride]: {
        padding: '0 1rem !important',
      },
    },
  },
  modalTitleBar: {
    'textAlign': 'right',
    'margin': '0.5em',
    '& > input': {
      height: '1.5em',
    },
  },
  modalHeader: {
    textAlign: 'center',
  },
  modalContent: {
    textAlign: 'center',
  },
  modalDescription: {
    margin: '0 5rem',
  },
  modalActions: {
    'marginTop': '1rem',
    '& .ui.button': {
      margin: '0 !important',
    },
  },
  confirmText: {
    '&.ui.label': {
      backgroundColor: 'transparent',
      fontSize: '1em',
      color: brandBlack,
      marginBottom: '0.5em',
      padding: '0',
    },
  },
  confirmButton: {
    boxShadow: `${buttonBoxShadow} !important`,
  },
  cancelButton: {
    padding: '.78571429em 1.5em',  // copy from semantic
    color: brandPurple,
  },
})

const AccountDeactivateConfirmModal = ({
  onConfirm, onClose, isUpdating,
}) => {
  const [isMatched, setIsMatched] = React.useState(false)
  const classes = useStyles()
  const {t} = useTranslation(['account-pages', 'common'])
  const confirmationText = t('profile_page.deactivate_profile.modal.confirmation_text')

  return (
    <Modal className={classes.deactivateModal} onClose={onClose} open size='tiny'>
      <Modal.Content className={classes.modalContent}>
        <h3 className={classes.modalHeader}>
          {t('profile_page.deactivate_profile.modal.header')}
        </h3>
        <Form onSubmit={onConfirm} className={classes.modalDescription}>
          <p>{t('profile_page.deactivate_profile.modal.description')}</p>
          <Label className={classes.confirmText}>
            <strong>
              {t('profile_page.deactivate_profile.modal.confirmation_msg',
                {confirmation_text: confirmationText})}
            </strong>
          </Label>
          <Input
            onChange={e => setIsMatched(e?.target?.value === confirmationText)}
          />
          <div className={classes.modalActions}>
            <ButtonLink
              className={classes.cancelButton}
              onClick={onClose}
            >{t('button.cancel', {ns: 'common'})}
            </ButtonLink>
            <Button
              primary
              type='submit'
              className={classes.confirmButton}
              disabled={!isMatched}
              loading={isUpdating}
            >{t('button.confirm', {ns: 'common'})}
            </Button>
          </div>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default AccountDeactivateConfirmModal
