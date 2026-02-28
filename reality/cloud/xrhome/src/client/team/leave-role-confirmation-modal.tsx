import React from 'react'
import {Modal} from 'semantic-ui-react'
import {useTranslation, Trans} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {TertiaryButton} from '../ui/components/tertiary-button'
import ButtonLink from '../uiWidgets/button-link'
import type {IAccount} from '../common/types/models'

const useStyles = createUseStyles({
  leavingDescription: {
    padding: '1em',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1em',
  },
})

interface ILeaveRoleConfirmationModal {
  account: IAccount
  leaveButtonLoading?: boolean
  onLeaveButtonClick: () => void
  onCloseClick: () => void
}

const LeaveRoleConfirmationModal = ({
  account, onLeaveButtonClick, onCloseClick, leaveButtonLoading = false,
}: ILeaveRoleConfirmationModal) => {
  const {t} = useTranslation(['account-pages', 'common'])
  const classes = useStyles()
  return (
    <Modal open size='tiny' onClose={onCloseClick}>
      <Modal.Header>
        {t('team_page.leave_team_modal.header')}
      </Modal.Header>
      <Modal.Description className={classes.leavingDescription}>
        <Trans
          i18nKey='team_page.leave_team_modal.description'
          ns='account-pages'
          values={{accountName: account.name}}
          components={{bold: <strong />}}
        />
      </Modal.Description>
      <Modal.Actions className={classes.buttonContainer}>
        <ButtonLink onClick={onCloseClick}>
          {t('team_page.leave_team_modal.button.nevermind')}
        </ButtonLink>
        <TertiaryButton
          loading={leaveButtonLoading}
          onClick={onLeaveButtonClick}
        >
          {t('button.confirm', {ns: 'common'})}
        </TertiaryButton>
      </Modal.Actions>
    </Modal>
  )
}

export {
  LeaveRoleConfirmationModal,
}
