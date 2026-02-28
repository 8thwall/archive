import React from 'react'
import {Dimmer, Modal} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'

import {Loader} from '../../ui/components/loader'
import {MigrateExistingUsersStartView} from './migrate-existing-users-start-view'
import {Icon} from '../../ui/components/icon'
import withTranslationLoaded from '../../i18n/with-translations-loaded'
import {MigrateExistingUsersSelectAccountView} from './migrate-existing-users-select-account-view'
import {MigrateExistingUsersEmailView} from './migrate-existing-users-email-view'
import {MigrateExistingUsersCompleteView} from './migrate-existing-users-complete-view'
import {useCurrentUser} from '../../user/use-current-user'
import useActions from '../../common/use-actions'
import userActions from '../../user-niantic/user-niantic-actions'
import {tinyViewOverride} from '../../static/styles/settings'

enum MigrateModalState {
  START_MIGRATION = 2,
  SELECT_ACCOUNT = 3,
  CONNECT_EMAIL = 4,
  ERROR = 5,
  COMPLETE_MIGRATION = 6,
}

const useStyles = createUseStyles({
  modal: {
    padding: '3em',
    width: '42em',
    overflow: 'hidden',
    [tinyViewOverride]: {
      padding: '2em',
    },
  },
  loaderContainer: {
    height: '5em',
  },
})

const MigrateExistingUsersModal: React.FC = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const {t} = useTranslation(['migrate-existing-users', 'common'])
  const [modalViewState, setModalViewState] = React.useState(MigrateModalState.START_MIGRATION)
  const closable = modalViewState === MigrateModalState.COMPLETE_MIGRATION
  const [open, setOpen] = React.useState(true)
  const isLoading = useCurrentUser(user => user.pending.migrateUser)
  const {migrateUser} = useActions(userActions)

  const renderModalState = () => {
    switch (modalViewState) {
      case MigrateModalState.START_MIGRATION:
        return (
          <MigrateExistingUsersStartView
            onNextStep={() => setModalViewState(MigrateModalState.SELECT_ACCOUNT)}
          />
        )
      case MigrateModalState.SELECT_ACCOUNT:
        return (
          <MigrateExistingUsersSelectAccountView
            onConnectSocial={async (params) => {
              try {
                const userMigrated = await migrateUser(params.authProviderId, params.providerToken)
                return !!userMigrated
              } catch {
                return false
              }
            }}
            onConnectSocialSuccess={() => {
              setModalViewState(MigrateModalState.COMPLETE_MIGRATION)
            }}
            onConnectEmail={() => setModalViewState(MigrateModalState.CONNECT_EMAIL)}
          />
        )
      case MigrateModalState.CONNECT_EMAIL:
        return (
          <MigrateExistingUsersEmailView
            onConfirmConnectEmail={async () => {
              try {
                const userMigrated = await migrateUser()
                return !!userMigrated
              } catch {
                return false
              }
            }}
            onConnectEmailSuccess={() => {
              setModalViewState(MigrateModalState.COMPLETE_MIGRATION)
            }}
            onClickBack={() => setModalViewState(MigrateModalState.SELECT_ACCOUNT)}
          />
        )
      case MigrateModalState.COMPLETE_MIGRATION:
        return (
          <MigrateExistingUsersCompleteView onClose={() => {
            dispatch({type: 'AUTHENTICATED'})
            setOpen(false)
          }}
          />
        )
      case MigrateModalState.ERROR:
      default:
        return (
          <div>
            <Icon stroke='danger' color='danger' />&nbsp;
            {t('migrate_existing_users_modal.error')}
          </div>
        )
    }
  }

  return (
    <Modal
      open={open}
      onClose={closable
        ? () => {
          dispatch({type: 'AUTHENTICATED'})
          setOpen(false)
        }
        : undefined}
      closeOnDimmerClick={closable}
      size='tiny'
      className={classes.modal}
    >
      {renderModalState()}
      <Dimmer active={isLoading} inverted>
        <Loader />
      </Dimmer>
    </Modal>
  )
}

const TranslatedMigrateExistingUsersModal = withTranslationLoaded(MigrateExistingUsersModal)

export {
  TranslatedMigrateExistingUsersModal as MigrateExistingUsersModal,
}
