import React from 'react'
import {Modal, Button} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import Icons from '../../apps/icons'
import type {ICrossAccountPermission} from '../../common/types/models'
import {BoldButton} from '../../ui/components/bold-button'
import useActions from '../../common/use-actions'
import crossAccountPermissionActions from '../actions'
import {useSelector} from '../../hooks'
import appsActions from '../../apps/apps-actions'

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    margin: '1.71em',
    gap: '1em',
  },
  warningIcon: {
    height: '3em',
  },
  header: {
    fontSize: '1.71em',
    fontWeight: 700,
    lineHeight: '1.57em',
    wordWrap: 'break-word',
  },
  blurb: {
    lineHeight: '1.71em',
  },
})

interface IRemoveExternalAppConfirmationModal {
  onClose: () => void
  permission: ICrossAccountPermission
  appName: string
}

const RemoveExternalAppConfirmationModal: React.FC<IRemoveExternalAppConfirmationModal> = (
  {onClose, permission, appName}
) => {
  const {t} = useTranslation(['account-pages', 'common'])
  const classes = useStyles()
  const {removePermission} = useActions(crossAccountPermissionActions)
  const {getApps} = useActions(appsActions)
  const removePermissionPending = useSelector(
    state => !!state.crossAccountPermissions.pending.removePermission
  )

  const removeExternalAppHandler = async () => {
    await removePermission(permission)
    await getApps()
    onClose()
  }

  return (
    <Modal open onClose={onClose} size='tiny'>
      <div className={classes.container}>
        <img
          alt={t('account_dashboard_page.app_card.modal.remove_external_project.warning_icon')}
          src={Icons.warningBlack}
          className={classes.warningIcon}
        />
        <Modal.Header className={classes.header}>
          {t(
            'account_dashboard_page.app_card.modal.remove_external_project.header_blurb',
            {appName, accountName: permission.ToAccount.shortName}
          )}
        </Modal.Header>
        <Modal.Description
          className={classes.blurb}
        >
          {t('account_dashboard_page.app_card.modal.remove_external_project.description')}
        </Modal.Description>
        <Modal.Actions>
          <BoldButton color='primary' onClick={onClose}>
            {t('button.cancel', {ns: 'common'})}
          </BoldButton>
          <Button
            primary
            onClick={removeExternalAppHandler}
            disabled={removePermissionPending}
            loading={removePermissionPending}
          >{t('button.remove', {ns: 'common'})}
          </Button>
        </Modal.Actions>
      </div>
    </Modal>
  )
}

export {
  RemoveExternalAppConfirmationModal,
}
