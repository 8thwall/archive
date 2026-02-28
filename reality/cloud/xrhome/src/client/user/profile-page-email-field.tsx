import React from 'react'
import {useTranslation} from 'react-i18next'

import type {UserLogin} from '../../shared/users/users-niantic-types'
import {
  APPLE_AUTH_PROVIDER_ID, COGNITO_AUTH_PROVIDER_ID,
} from '../../shared/users/users-niantic-constants'
import {ProfilePageEmailOption} from './profile-page-email-option'
import {useCurrentUser} from './use-current-user'
import {ConfirmEmailUpdateModal} from './confirm-email-update-modal'
import useActions from '../common/use-actions'
import userNianticActions from '../user-niantic/user-niantic-actions'
import {UserErrorMessage} from '../home/user-error-message'
import {ACTIONS} from '../user-niantic/user-niantic-errors'
import {createThemedStyles} from '../ui/theme'
import {SpaceBetween} from '../ui/layout/space-between'

const useStyles = createThemedStyles(theme => ({
  instruction: {
    color: theme.fgMuted,
    margin: 0,
  },
}))

const ProfilePageEmailField: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['user-profile-page'])
  const {patchUser} = useActions(userNianticActions)
  const [showConfirmModal, setShowConfirmModal] = React.useState(false)

  const {logins, primaryContactEmail} = useCurrentUser(user => user.loggedInUser)

  const getDefaultLogin = () => {
    const matchingLogins = logins?.filter(acct => acct.email === primaryContactEmail)
    // sort to prioritize Cognito first
    const cognitoLogin = matchingLogins?.find(acct => acct.provider === COGNITO_AUTH_PROVIDER_ID)
    const firstLogin = matchingLogins?.[0]
    return cognitoLogin || firstLogin || {provider: null, email: primaryContactEmail}
  }

  const [selectedLogin, setSelectedLogin] = React.useState<UserLogin>(getDefaultLogin())
  const [pendingLogin, setPendingLogin] = React.useState<UserLogin>(null)
  // Remove default option from other logins
  const sortedLogins = logins?.filter(login => login !== selectedLogin)
  const isSingleLogin = !logins || logins?.length < 2

  React.useEffect(() => {
    setSelectedLogin(getDefaultLogin())
  }, [primaryContactEmail])

  const onEmailSelectionChange = (login: UserLogin) => {
    setPendingLogin(login)
    setShowConfirmModal(true)
  }

  const onConfirmEmailSelection = async () => {
    const success = await patchUser({primaryContactEmail: pendingLogin.email})
    if (success) {
      setSelectedLogin(pendingLogin)
    }
  }

  return (
    <SpaceBetween direction='vertical' narrow>
      <UserErrorMessage action={ACTIONS.UPDATE_EMAIL} />
      <div><b>{t('user_profile_page.label.email')}</b></div>
      <p className={classes.instruction}>{t('profile_page_email_field.description')}</p>
      <SpaceBetween direction='vertical' narrow>
        <ProfilePageEmailOption
          login={selectedLogin}
          isSelected
          onChange={() => onEmailSelectionChange(selectedLogin)}
          disabled={false}
          isSingleOption={isSingleLogin}
        />
        {!isSingleLogin && sortedLogins?.map((login) => {
          if (login.provider !== selectedLogin.provider && login.email !== selectedLogin.email) {
            return (
              <ProfilePageEmailOption
                key={login.provider}
                login={login}
                isSelected={selectedLogin === login}
                onChange={() => onEmailSelectionChange(login)}
                disabled={(
                login.provider === APPLE_AUTH_PROVIDER_ID ||
                login.email === selectedLogin.email
                )}
                isSingleOption={false}
              />
            )
          } else {
            return null
          }
        })
        }
      </SpaceBetween>
      {showConfirmModal &&
        <ConfirmEmailUpdateModal
          newLogin={pendingLogin}
          handleClose={() => {
            setShowConfirmModal(false)
            setPendingLogin(null)
          }}
          handleConfirm={onConfirmEmailSelection}
        />
      }
    </SpaceBetween>
  )
}

export {ProfilePageEmailField}
