import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'
import {useHistory} from 'react-router-dom'

import {useOnboardingAccount, useRegisterFormNavigation} from '../account-onboarding-context'
import {SpaceBetween} from '../../../ui/layout/space-between'
import {useCurrentUser} from '../../../user/use-current-user'
import {StaticBanner} from '../../../ui/components/banner'
import {PrimaryButton} from '../../../ui/components/primary-button'
import {SecondaryButton} from '../../../ui/components/secondary-button'
import {cherryLight, headerSanSerif, mobileViewOverride} from '../../../static/styles/settings'
import useActions from '../../../common/use-actions'
import accountActions from '../../account-actions'
import {useSelector} from '../../../hooks'
import type {RootState} from '../../../reducer'
import {isWebAccount} from '../../../../shared/account-utils'
import {getPathForMyProjectsPage} from '../../../common/paths'
import {useOnboardingStyles} from '../account-onboarding-styles-old'

const useStyles = createUseStyles({
  heading: {
    fontFamily: headerSanSerif,
    fontSize: '1.5rem',
    fontWeight: '600',
  },
  container: {
    zIndex: 2,
    textAlign: 'center',
    maxWidth: '640px',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: '2rem',
  },
  description: {
    fontSize: '1.25rem',
  },
  navigation: {
    'zIndex': 2,
    'marginTop': 'auto',
    'display': 'flex',
    'gap': '1.5em',
    'justifyContent': 'center',
    [mobileViewOverride]: {
      paddingBottom: '1em',
      flexDirection: 'column',
    },
    '& button': {
      borderRadius: '2em',
    },
  },
  hidden: {
    visibility: 'hidden',
  },
  errorContainer: {
    height: '5em',
    width: '100%',
  },
  error: {
    color: cherryLight,
    textAlign: 'center',
  },
})

// A user can create a new workspace if they are not the owner of an existing web workspace.
const canCreateNewWorkspace = (state: RootState) => {
  const userUuid = state.userNiantic.loggedInUser.uuid
  const {allAccounts} = state.accounts

  return allAccounts.filter(isWebAccount).every((account) => {
    const role = account.Users.find(u => u.UserUuid === userUuid)?.role
    return role !== 'OWNER'
  })
}

const AccountOnboardingInsufficientPermissions = () => {
  const user = useCurrentUser()
  const account = useOnboardingAccount()
  const isNewWorkspaceAllowed = useSelector(canCreateNewWorkspace)
  const newWorkspaceError = useSelector(state => state.common.error)
  const {addAccount, setActivatingAccount} = useActions(accountActions)
  const {t} = useTranslation(['account-onboarding-pages'])
  const classes = useStyles()
  const onboardingClasses = useOnboardingStyles()
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const history = useHistory()

  useRegisterFormNavigation({progressBarHidden: true}, [])

  const onPrimaryButtonClick = async () => {
    setIsCreatingAccount(true)
    const newAccount = await addAccount({accountType: 'WebDeveloper'})
    setIsCreatingAccount(false)

    if (!newAccount) {
      return
    }

    // Begin onboarding the new workspace.
    setActivatingAccount(newAccount.uuid)
  }

  const onSecondaryButtonClick = () => {
    history.push(getPathForMyProjectsPage())
  }

  return (
    <div className={onboardingClasses.formWrapper}>
      <div className={onboardingClasses.formContent}>
        <div className={classes.container}>
          <SpaceBetween direction='vertical' justifyCenter>
            <div className={classes.heading}>
              {t(
                'insufficient_permissions_step.heading.title',
                {name: user.given_name || user.family_name}
              )}
            </div>
            <StaticBanner type='info'>
              {t('insufficient_permissions_step.notification', {workspaceName: account.name})}
            </StaticBanner>
            <p className={classes.description}>{t('insufficient_permissions_step.description')}</p>
          </SpaceBetween>
        </div>
        {newWorkspaceError &&
          <div className={classes.errorContainer}>
            <p className={classes.error}>{newWorkspaceError}</p>
          </div>
      }
        <div className={classes.navigation}>
          {isNewWorkspaceAllowed &&
            <PrimaryButton
              onClick={onPrimaryButtonClick}
              disabled={isCreatingAccount}
              loading={isCreatingAccount}
              spacing='wide'
              a8='click;onboarding-non-owner;create-account-button'
            >
              {t('insufficient_permissions_step.button.primary_cta')}
            </PrimaryButton>
        }
          <SecondaryButton
            onClick={onSecondaryButtonClick}
            disabled={isCreatingAccount}
            spacing='wide'
            a8='click;onboarding-non-owner;go-to-my-projects-button'
          >
            {t('insufficient_permissions_step.button.secondary_cta')}
          </SecondaryButton>
        </div>
      </div>
    </div>
  )
}

export {
  AccountOnboardingInsufficientPermissions,
}
