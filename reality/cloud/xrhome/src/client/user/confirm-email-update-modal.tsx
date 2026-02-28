import React from 'react'
import {Modal} from 'semantic-ui-react'
import {Trans, useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {LinkButton} from '../ui/components/link-button'
import changeEmailImage from '../static/confirm_email_change.svg'
import {mobileViewOverride} from '../static/styles/settings'
import type {UserLogin} from '../../shared/users/users-niantic-types'
import {TertiaryButton} from '../ui/components/tertiary-button'

const useStyles = createUseStyles({
  modal: {
    maxWidth: '34em',
    padding: '3em',
    [mobileViewOverride]: {
      padding: '2em',
    },
  },
  modalHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1em',
  },
  modalHeading: {
    margin: 0,
    padding: 0,
  },
  modalDescription: {
    textAlign: 'center',
    lineHeight: '1.5em',
    fontSize: '1.125em',
    margin: '1em 0',
  },
  modalImage: {
    maxWidth: '10em',
  },
  buttonTray: {
    display: 'flex',
    gap: '1em',
    justifyContent: 'center',
  },
})

interface IConfirmEmailUpdateModal {
  newLogin: UserLogin
  handleClose: () => void
  handleConfirm: () => void
}

const ConfirmEmailUpdateModal: React.FC<IConfirmEmailUpdateModal> = ({
  newLogin, handleClose, handleConfirm,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['user-profile-page', 'common'])

  const onClose = () => {
    handleClose()
  }

  const onConfirm = () => {
    handleConfirm()
    handleClose()
  }

  return (
    <Modal
      open
      onClose={onClose}
      closeOnDimmerClick
      size='small'
      className={classes.modal}
    >
      <div className={classes.modalHeader}>
        <img
          className={classes.modalImage}
          alt={t('confirm_update_email.graphic_alt')}
          src={changeEmailImage}
          draggable={false}
        />
        <h2 className={classes.modalHeading}>
          {t('confirm_update_email.heading')}
        </h2>
      </div>
      <div className={classes.modalDescription}>
        <Trans
          ns='user-profile-page'
          i18nKey='confirm_update_email.description'
          components={{1: <b />}}
          values={{email: newLogin.email}}
        />
      </div>
      <div className={classes.buttonTray}>
        <LinkButton onClick={onClose}>
          {t('button.cancel', {ns: 'common'})}
        </LinkButton>
        <TertiaryButton onClick={onConfirm} type='button'>
          {t('button.confirm', {ns: 'common'})}
        </TertiaryButton>
      </div>
    </Modal>
  )
}

export {ConfirmEmailUpdateModal}
