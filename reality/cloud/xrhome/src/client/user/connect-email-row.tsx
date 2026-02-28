import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import AppleIcon from '../static/icons/apple.svg'
import GoogleIcon from '../static/icons/google.svg'
import {Icon} from '../ui/components/icon'
import {combine} from '../common/styles'
import {
  mobileViewOverride, brandPurple, cherry, gray3, gray2,
} from '../static/styles/settings'
import type {LoginProvider} from '../../shared/users/users-niantic-types'
import {
  GOOGLE_AUTH_PROVIDER_ID, APPLE_AUTH_PROVIDER_ID, COGNITO_AUTH_PROVIDER_ID,
} from '../../shared/users/users-niantic-constants'
import {useCurrentUser} from './use-current-user'
import {Popup} from '../ui/components/popup'
import {useSelector} from '../hooks'

const useStyles = createUseStyles({
  tableCell: {
    'display': 'flex',
    'justifyContent': 'space-between',
    'padding': '0.75em',
    'align-items': 'center',
    'gap': '0.75em',
    '&:not(:first-child)': {
      borderTop: `1px solid ${gray2}`,
    },
  },
  providerContainer: {
    display: 'flex',
    gap: '1em',
    flex: 1,
    overflow: 'hidden',
    [mobileViewOverride]: {
      flexDirection: 'column',
      gap: '0',
    },
  },
  providerIcon: {
    alignSelf: 'flex-start',
    display: 'flex',
  },
  provider: {
    flex: 1,
  },
  button: {
    'fontWeight': 600,
    'cursor': 'pointer',
    'textAlign': 'right',
    'position': 'relative',
    'background': 'transparent',
    'border': 'none',
  },
  connectBtn: {
    color: brandPurple,
  },
  disconnectBtn: {
    color: cherry,
  },
  disabledBtn: {
    color: gray3,
  },
  socialIcon: {
    height: '0.9em',
  },
  email: {
    color: gray3,
    flex: 4,
    display: 'flex',
    overflow: 'hidden',
  },
  emailHandle: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  emailDomain: {
    whiteSpace: 'nowrap',
  },
})

interface IConnectEmailRow {
  provider: LoginProvider
  onConnectClick: () => void
  onDisconnectClick: () => void
  disabled?: boolean
}

const ConnectEmailRow: React.FC<IConnectEmailRow> = ({
  provider, onConnectClick, onDisconnectClick, disabled,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['user-profile-page'])
  const {logins} = useCurrentUser(user => user.loggedInUser)
  const loginAccount = logins?.find(login => login.provider === provider)
  const isConnected = !!(loginAccount?.email)
  const isDisabled = disabled || (isConnected && logins?.length < 2)
  const isSmallScreen = useSelector(state => state.common.isSmallScreen)

  const PROVIDER_CONTENT = {
    [GOOGLE_AUTH_PROVIDER_ID]: {
      providerIcon: <img
        src={GoogleIcon}
        alt={t('button.login_google', {ns: 'social-logins'})}
      />,
      providerName: t('connected_account_settings.account.google'),
    },
    [APPLE_AUTH_PROVIDER_ID]: {
      providerIcon: <img
        src={AppleIcon}
        alt={t('button.login_apple', {ns: 'social-logins'})}
      />,
      providerName: t('connected_account_settings.account.apple'),
    },
    [COGNITO_AUTH_PROVIDER_ID]: {
      providerIcon: <Icon stroke='email' color='gray4' />,
      providerName: t('connected_account_settings.account.email'),
    },
  }

  const {providerIcon, providerName} = PROVIDER_CONTENT[provider]
  const emailHandleIndex = loginAccount?.email.indexOf('@')

  return (
    <div className={classes.tableCell}>
      <div className={classes.providerIcon}>{providerIcon}</div>
      <div className={classes.providerContainer}>
        <span className={classes.provider}>{providerName}</span>
        {isConnected &&
          <span className={classes.email}>
            <span className={classes.emailHandle}>
              {loginAccount.email.slice(0, emailHandleIndex)}
            </span>
            <span className={classes.emailDomain}>
              {loginAccount.email.slice(emailHandleIndex)}
            </span>
          </span>
        }
      </div>
      <div>
        {provider !== APPLE_AUTH_PROVIDER_ID &&
          <div
            role='button'
            className={combine(classes.button, classes.connectBtn)}
            onClick={onConnectClick}
            onKeyDown={onConnectClick}
            tabIndex={0}
          >{isConnected
            ? t('password_change_modal.button.change')
            : t('connected_account_settings.button.connect')
        }
          </div>
      }
        {!isConnected && provider === APPLE_AUTH_PROVIDER_ID &&
          <Popup
            content={t('connected_account_settings.popover.disabled_apple_login')}
            alignment={isSmallScreen ? 'right' : 'left'}
          >
            <div
              role='button'
              className={combine(classes.button, classes.connectBtn, classes.disabledBtn)}
              onClick={() => {}}
              onKeyDown={() => {}}
              tabIndex={0}
            >
              {t('connected_account_settings.button.connect')}
            </div>
          </Popup>
      }
        {isConnected &&
          <Popup
            content={provider === APPLE_AUTH_PROVIDER_ID
              ? t('connected_account_settings.popover.disabled_apple_login')
              : t('connected_account_settings.popover.cannot_disconnect')
          }
            popupDisabled={!isDisabled}
            alignment={isSmallScreen ? 'right' : 'left'}
          >
            <div
              role='button'
              className={combine(classes.button, classes.disconnectBtn,
                isDisabled && classes.disabledBtn)}
              onClick={isDisabled ? undefined : onDisconnectClick}
              onKeyDown={isDisabled ? undefined : onDisconnectClick}
              tabIndex={0}
            >
              {t('connected_account_settings.button.disconnect')}
            </div>
          </Popup>
      }
      </div>
    </div>
  )
}

export {ConnectEmailRow}
