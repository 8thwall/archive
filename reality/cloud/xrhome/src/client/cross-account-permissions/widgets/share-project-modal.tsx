import React, {useEffect, useState} from 'react'
import {Modal, Icon, Divider} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {
  blueberry, bodySanSerif, brandBlack, brandWhite, cherry, eggshell, gray2, gray3, gray4,
  moonlight, tinyViewOverride,
} from '../../static/styles/settings'
import ResponsiveImage from '../../common/responsive-image'
import RemoveProjectConfirmationModal from './remove-project-confirm-modal'
import crossAccountPermissionsActions from '../actions'
import useActions from '../../common/use-actions'
import {useSelector} from '../../hooks'
import {responsiveAccountIcons} from '../../../shared/responsive-account-icons'
import type {ICrossAccountPermission} from '../../common/types/models'
import {bool, combine} from '../../common/styles'
import {getDisplayNameForApp} from '../../../shared/app-utils'
import {PrimaryButton} from '../../ui/components/primary-button'
import {TextButton} from '../../ui/components/text-button'
import {createThemedStyles} from '../../ui/theme'

const useStyles = createThemedStyles({
  container: {
    '&.ui.modal>.content': {
      padding: '0',
    },
    '&.visible.transition': {
      display: 'flex !important',
    },
    'flexDirection': 'column',
    'padding': '2.85em !important',
    'gap': '2em',
    'max-width': '600px',
    [tinyViewOverride]: {
      'gap': '0em',
      'padding': '2rem !important',

      '&.ui.modal>.content': {
        padding: '0.5rem !important',
      },
    },
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    [tinyViewOverride]: {
      padding: '0 !important',
    },
  },
  headerTitle: {
    fontSize: '1.71em',
    lineHeight: '2.57em',
    fontWeight: 700,
  },
  headerBlurb: {
    lineHeight: '1.42em',
  },
  inputContainer: {
    'display': 'flex',
    'gap': '0.5em',
    '* >': {
      height: '2.29em',
    },
  },
  inviteInput: {
    'fontFamily': bodySanSerif,
    'color': brandBlack,
    'border': `1px solid ${gray2}`,
    'borderRadius': '0.28em',
    'flex': '3',
    'paddingLeft': '1em',
    'textOverflow': 'ellipsis',
    '&::placeholder': {
      color: gray3,
      marginLeft: '1em',
    },
    '&:focus-visible': {
      'outline': 'none',
      'border': `1px solid ${blueberry}`,
    },
  },
  workspaces: {
    display: 'flex !important',
    gap: '0.5em',
    flexDirection: 'column',
  },
  workspace: {
    'display': 'flex',
    'alignItems': 'center',
    'gap': '0.5em',
    '& img': {
      borderRadius: '1.5em',
      border: `1px solid ${gray2}`,
    },
    '& > div, button': {
      height: '1.71em',
      lineHeight: '1.71em',
      backgroundColor: moonlight,
      borderRadius: '0.29em',
      color: gray4,
      outline: 'none',
      border: 'none',
      alignItems: 'center',
    },
  },
  workspaceInfo: {
    display: 'flex',
    width: '100%',
    overflow: 'hidden',
  },
  workspaceName: {
    width: '100%',
    fontSize: '0.85rem',
    paddingLeft: '0.714em',
    fontStyle: 'italic',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  removeWorkspace: {
    'display': 'flex',
    'width': '1.71em',
    '&:hover': {
      'cursor': 'pointer',
      'backgroundColor': eggshell,
      '& i.icon': {
        color: brandBlack,
      },
    },
  },
  errorMessage: {
    color: cherry,
    marginTop: '0.5em',
    overflowWrap: 'break-word',
  },
  inputError: {
    backgroundColor: `${cherry}05`,
    border: `1px solid ${cherry}`,
  },
  pending: {
    width: '7em',
    fontSize: '0.714rem',
    color: brandWhite,
    backgroundColor: gray4,
    borderRadius: '0.24em',
    lineHeight: '1.71em',
    textAlign: 'center',
    marginRight: '0.5em',
  },
  appTitle: {
    color: gray4,
    textAlign: 'center',
  },
  trashIcon: {
    background: moonlight,
    display: 'flex !important',
    alignItems: 'center',
  },
  sendToSupportContainer: {
    display: 'flex',
    justifyContent: 'left',
    marginTop: '0.5em',
    marginBottom: '-1em',
  },
})

const ShareProjectModal = ({app, onClose}) => {
  const {t} = useTranslation(['app-pages'])
  const [rawInviteesInput, setRawInviteesInput] = useState(null)
  const [permissionToRemove, setPermissionToRemove] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const {createPermissionsInvite} = useActions(crossAccountPermissionsActions)
  const classes = useStyles()
  const permissions = useSelector(state => state.crossAccountPermissions.entities)
  const createInvitePending = useSelector(
    state => state.crossAccountPermissions.pending.createPermission
  )
  const createPermissionErrorMessage = useSelector(state => (
    state.crossAccountPermissions.error.createPermission))

  const appPermissions = Object.values(permissions).filter((perm: ICrossAccountPermission) => (
    app.uuid === perm.AppUuid
  ))

  // Disable button if there is nothing in the input or invite is pending is true
  const createInviteDisabled = !rawInviteesInput || createInvitePending

  const parseInvitees = (rawInviteesString: string) => {
    let isURL
    try {
      // URL throws an error if string is not in a URL format
      isURL = new URL(rawInviteesString)
    } catch (e) {
      return rawInviteesString
    }

    // Could be extended to include console-dev, staging, etc.
    const VALID_DOMAIN_NAMES = 'www.8thwall.com'
    const isValidURL = VALID_DOMAIN_NAMES === isURL.hostname
    if (!isValidURL) {
      setErrorMessage(t('project_dashboard_page.share_project_modal.error.invalid_url',
        {url: rawInviteesInput}))
      return null
    }

    const [shortName] = isURL.pathname.split('/').filter(path => path)
    return shortName
  }

  useEffect(() => {
    if (createPermissionErrorMessage) {
      setErrorMessage(createPermissionErrorMessage)
    } else {
      setErrorMessage(null)
    }
  }, [createPermissionErrorMessage])

  useEffect(() => {
    setErrorMessage(null)
  }, [rawInviteesInput])

  const sendInviteHandler = async () => {
    const shortName = parseInvitees(rawInviteesInput)
    if (shortName) {
      await createPermissionsInvite(app, shortName)
    }
  }

  const sendToSupportHandler = async () => {
    await createPermissionsInvite(app, 'support')
  }

  if (permissionToRemove) {
    return (
      <RemoveProjectConfirmationModal
        onClose={() => { setPermissionToRemove(null) }}
        permission={permissionToRemove}
      />
    )
  }
  return (
    <Modal open onClose={onClose} size='small' className={classes.container}>
      <Modal.Content className={classes.headerContainer}>
        <Modal.Header className={classes.headerTitle}>
          {t('project_dashboard_page.share_project_modal.header')}
        </Modal.Header>
        <Modal.Description className={classes.headerBlurb}>
          <p>
            {t('project_dashboard_page.share_project_modal.description')}
          </p>

          <p>
            {t('project_dashboard_page.share_project_modal.add_workspace_url')}
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Content className={classes.appTitle}>
        <Icon name='cube' />
        {getDisplayNameForApp(app)}
      </Modal.Content>
      <Modal.Content>
        <Modal.Actions className={classes.inputContainer}>
          <input
            type='text'
            className={combine(classes.inviteInput, bool(errorMessage, classes.inputError))}
            placeholder='https://www.8thwall.com/yourWorkspace'
            value={rawInviteesInput}
            onChange={e => setRawInviteesInput(e.target.value)}
          />
          <PrimaryButton
            onClick={sendInviteHandler}
            height='small'
            disabled={createInviteDisabled}
            loading={createInvitePending}
          >{t('project_dashboard_page.share_project_modal.button.invite_workspace')}
          </PrimaryButton>
        </Modal.Actions>
        {errorMessage &&
          <Modal.Description className={classes.errorMessage}>
            <Icon name='exclamation circle' />
            {errorMessage}
          </Modal.Description>
          }
        <Modal.Actions className={classes.sendToSupportContainer}>
          <TextButton
            type='button'
            height='tiny'
            spacing='short'
            onClick={sendToSupportHandler}
            disabled={createInvitePending}
          >
            {t('project_dashboard_page.share_project_modal.button.send_to_support')}
          </TextButton>
        </Modal.Actions>
      </Modal.Content>
      {!!appPermissions.length &&
        <>
          <Divider />
          <Modal.Content className={classes.workspaces}>
            {appPermissions.map((permission: ICrossAccountPermission) => {
              const {ToAccount, uuid} = permission
              const iconSets = responsiveAccountIcons(ToAccount)
              return (
                <div className={classes.workspace} key={uuid}>
                  <ResponsiveImage
                    alt={`${ToAccount.shortName} Icon`}
                    sizeSet={iconSets}
                    width={32}
                  />
                  <div className={classes.workspaceInfo}>
                    <div className={classes.workspaceName}>{ToAccount.name}</div>
                    {permission.status === 'INVITED' &&
                      <div className={classes.pending}>
                        {t('project_dashboard_page.share_project_modal.badge.pending')}
                      </div>
                    }
                  </div>
                  <button
                    type='button'
                    className={classes.removeWorkspace}
                    onClick={() => setPermissionToRemove(permission)}
                  ><Icon className={classes.trashIcon} name='trash alternate outline' />
                  </button>
                </div>
              )
            })}
          </Modal.Content>
        </>
        }
    </Modal>
  )
}

export default ShareProjectModal
