import * as React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {brandWhite, gray2} from '../static/styles/settings'
import {useExternalSigninServices} from '../identity/use-external-signin-services'
import {
  COGNITO_AUTH_PROVIDER_ID, GOOGLE_AUTH_PROVIDER_ID, APPLE_AUTH_PROVIDER_ID,
} from '../../shared/users/users-niantic-constants'
import {ConnectEmailRow} from './connect-email-row'
import {useCurrentUser} from './use-current-user'
import {ConnectEmailModal} from './connect-email-modal'
import {DisconnectEmailModal} from './disconnect-email-modal'
import type {OnUserSigninListener} from '../../shared/users/users-niantic-types'
import useActions from '../common/use-actions'
import userNianticActions from '../user-niantic/user-niantic-actions'
import {UserErrorMessage} from '../home/user-error-message'
import {ACTIONS} from '../user-niantic/user-niantic-errors'

const useStyles = createUseStyles({
  table: {
    display: 'flex',
    flexDirection: 'column',
    background: brandWhite,
    border: `1px solid ${gray2}`,
    borderRadius: '4px',
  },
  heading: {
    paddingBottom: '0.5em',
  },
})

const ConnectedAccountsSettings: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['user-profile-page', 'social-logins'])
  const {logins} = useCurrentUser(user => user.loggedInUser)
  const hasCognito = logins?.find(login => login.provider === COGNITO_AUTH_PROVIDER_ID)
  const [connectEmailModalOpen, setConnectEmailModalOpen] = React.useState(false)
  const [providerToDisconnect, setProviderToDisconnect] = React.useState(null)
  const {connectLogin} = useActions(userNianticActions)

  const onSigninCallback: OnUserSigninListener = (params) => {
    connectLogin(params.authProviderId, params.providerToken)
  }
  const {openAppleLoginPopup, openGoogleLoginPopup} = useExternalSigninServices(onSigninCallback)

  return (
    <>
      <UserErrorMessage action={ACTIONS.CONNECT_LOGIN} />
      <div>
        <div className={classes.heading}>
          <b>{t('connected_account_settings.heading')}</b>
        </div>
        <div className={classes.table}>
          <ConnectEmailRow
            provider={GOOGLE_AUTH_PROVIDER_ID}
            onConnectClick={openGoogleLoginPopup}
            onDisconnectClick={() => setProviderToDisconnect(GOOGLE_AUTH_PROVIDER_ID)}
          />
          <ConnectEmailRow
            provider={APPLE_AUTH_PROVIDER_ID}
            onConnectClick={openAppleLoginPopup}
            onDisconnectClick={() => setProviderToDisconnect(APPLE_AUTH_PROVIDER_ID)}
            disabled
          />
          {!hasCognito &&
            <ConnectEmailRow
              provider={COGNITO_AUTH_PROVIDER_ID}
              onConnectClick={() => setConnectEmailModalOpen(true)}
              onDisconnectClick={() => setProviderToDisconnect(COGNITO_AUTH_PROVIDER_ID)}
            />
          }
        </div>
      </div>
      {connectEmailModalOpen &&
        <ConnectEmailModal
          handleClose={() => setConnectEmailModalOpen(false)}
        />
      }
      {providerToDisconnect &&
        <DisconnectEmailModal
          providerToDisconnect={providerToDisconnect}
          handleClose={() => setProviderToDisconnect(null)}
        />
      }
    </>
  )
}

export {ConnectedAccountsSettings}
