import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {brandBlack, gray1, gray3} from '../../static/styles/settings'
import {SocialLoginButtons} from '../../user/social-login-buttons'
import {Icon} from '../../ui/components/icon'
import type {LoginUserNianticRequest} from '../../../shared/users/users-niantic-types'
import {UserErrorMessage} from '../../home/user-error-message'
import {ACTIONS} from '../../user-niantic/user-niantic-errors'

const useStyles = createUseStyles({
  modalContainer: {
    display: 'flex',
    gap: '1.5em',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    margin: 0,
    textAlign: 'center',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
  },
  description: {
    margin: 0,
    fontSize: '1.125em',
    textAlign: 'center',
  },
  bullets: {
    fontSize: '1.125em',
    paddingInlineStart: '1em',
    lineHeight: '1.5em',
    margin: 0,
    width: '100%',
  },
  buttonTray: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em',
  },
  connectBtn: {
    'width': '20em',
    'padding': '0.625em 1.125em',
    'border': `1px solid ${gray3}`,
    'background': 'transparent',
    'borderRadius': '6px',
    'display': 'flex',
    'alignItems': 'center',
    'cursor': 'pointer',
    '&:hover': {
      'border': `1px solid ${brandBlack}`,
      'background': gray1,
    },
  },
  connectLabel: {
    flex: 1,
    textAlign: 'center',
  },
})

interface IMigrateExistingUsersSelectAccountView {
  onConnectSocial: (params: LoginUserNianticRequest) => Promise<boolean>
  onConnectSocialSuccess: () => void
  onConnectEmail: () => void
}

const MigrateExistingUsersSelectAccountView: React.FC<IMigrateExistingUsersSelectAccountView> = ({
  onConnectSocial, onConnectSocialSuccess, onConnectEmail,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['migrate-existing-users', 'common'])

  const onSigninCallback = async (params: LoginUserNianticRequest) => {
    const success = await onConnectSocial(params)
    if (success) {
      onConnectSocialSuccess()
    } else {
      // TODO(johnny): Show error message
    }
  }

  return (
    <div className={classes.modalContainer}>
      <div className={classes.textContainer}>
        <UserErrorMessage action={ACTIONS.MIGRATE} />
        <h2 className={classes.heading}>
          {t('migrate_existing_users_select_account_view.heading')}
        </h2>
        <p className={classes.description}>
          {t('migrate_existing_users_select_account_view.description')}
        </p>
      </div>
      <div className={classes.buttonTray}>
        <SocialLoginButtons onSigninCallback={onSigninCallback} />
        <button
          className={classes.connectBtn}
          type='button'
          onClick={onConnectEmail}
        >
          <Icon stroke='email' color='gray4' />
          <div className={classes.connectLabel}>
            {t('migrate_existing_users_select_account_view.button.connect_email')}
          </div>
        </button>
      </div>
    </div>
  )
}

export {MigrateExistingUsersSelectAccountView}
