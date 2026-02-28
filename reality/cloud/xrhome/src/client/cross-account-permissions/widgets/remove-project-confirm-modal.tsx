import React from 'react'
import {Modal, Button} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation, Trans} from 'react-i18next'

import Icons from '../../apps/icons'
import type {ICrossAccountPermission} from '../../common/types/models'
import {BoldButton} from '../../ui/components/bold-button'
import useActions from '../../common/use-actions'
import crossAccountPermissionActions from '../actions'
import {useSelector} from '../../hooks'

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

interface IRemoveProjectConfirmationModal {
  onClose: () => void
  permission: ICrossAccountPermission
}

const RemoveProjectConfirmationModal: React.FC<IRemoveProjectConfirmationModal> = (
  {onClose, permission}
) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const classes = useStyles()
  const {removePermission} = useActions(crossAccountPermissionActions)
  const removePermissionPending = useSelector(
    state => !!state.crossAccountPermissions.pending.removePermission
  )

  const removeWorkspaceHandler = async () => {
    await removePermission(permission)
    onClose()
  }

  return (
    <Modal open onClose={onClose} size='tiny'>
      <div className={classes.container}>
        <img alt='warning icon' src={Icons.warningBlack} className={classes.warningIcon} />
        <Modal.Header className={classes.header}>
          <Trans
            ns='app-pages'
            i18nKey='project_dashboard_page.remove_project_confirmation_modal.header'
          >
            Are you sure you want to remove <br />
            &lsquo;{{name: permission.ToAccount.name}}&rsquo;?
          </Trans>
        </Modal.Header>
        <Modal.Description
          className={classes.blurb}
        >{t('project_dashboard_page.remove_project_confirmation_modal.description')}
        </Modal.Description>
        <Modal.Actions>
          <BoldButton color='primary' onClick={onClose}>
            {t('button.cancel', {ns: 'common'})}
          </BoldButton>
          <Button
            primary
            onClick={removeWorkspaceHandler}
            disabled={removePermissionPending}
            loading={removePermissionPending}
          >{t('button.remove', {ns: 'common'})}
          </Button>
        </Modal.Actions>
      </div>
    </Modal>

  )
}

export default RemoveProjectConfirmationModal
