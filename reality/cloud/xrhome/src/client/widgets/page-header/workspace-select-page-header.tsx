import React from 'react'
import {useTranslation} from 'react-i18next'
import {Link, useParams} from 'react-router-dom'

import {PrimaryButton} from '../../ui/components/primary-button'
import {useHeaderStyles} from './use-header-styles'
import {AccountPathEnum, getPathForAccount} from '../../common/paths'
import useCurrentAccount from '../../common/use-current-account'
import {withAccountsLoaded} from '../../common/with-state-loaded'
import {useSelector} from '../../hooks'
import {SecondaryButton} from '../../ui/components/secondary-button'
import {Icon} from '../../ui/components/icon'
import {LoggedInWorkspaceSelect} from '../logged-in-workspace-select'
import {combine} from '../../common/styles'
import {LoggedInSideBar} from '../page-sidebar/logged-in-sidebar'

const WorkspaceSelectPageHeader = () => {
  const {t} = useTranslation(['account-pages'])
  const [showSideNav, setShowSideNav] = React.useState(false)
  const headerClasses = useHeaderStyles()
  const currentAccount = useCurrentAccount()
  const {account: fromWorkspace} = useParams<{account: string}>()
  const accounts = useSelector(state => state.accounts.allAccounts)
  const startProjectPath = accounts?.length === 1
    ? getPathForAccount(accounts[0], AccountPathEnum.createProject)
    : '/create-project'

  return (
    <header className={headerClasses.header}>
      <div
        className={combine(
          headerClasses.headerContainer, headerClasses.loggedInHeaderContainer,
          showSideNav && headerClasses.showSideNav
        )}
      >
        <div className={headerClasses.workspaceSelectionGroup}>
          <div
            className={headerClasses.hamburgerButton}
          >
            <SecondaryButton onClick={() => setShowSideNav(!showSideNav)}>
              <Icon stroke='hamburgerMenu' color='white' />
            </SecondaryButton>
          </div>
          <LoggedInWorkspaceSelect />
        </div>
        <div
          className={combine(headerClasses.buttonGroup, headerClasses.loggedInButtonGroup)}
        >
          {currentAccount &&
            <Link
              className={headerClasses.button}
              to={{
                pathname: getPathForAccount(currentAccount, AccountPathEnum.assetLab),
                state: {
                  fromWorkspace,
                },
              }}
              a8='click;xr-home;asset-lab-button'
            >
              <SecondaryButton spacing='full'>
                <Icon stroke='pinwheel' inline />
                {t('account_dashboard_page.link.asset_lab')}
              </SecondaryButton>
            </Link>
          }
          <Link
            className={headerClasses.button}
            to={startProjectPath}
            a8='click;xr-home;start-a-new-project-cta'
          >
            <PrimaryButton spacing='full'>
              <Icon stroke='plus' inline />
              {t('account_dashboard_page.link.new_project')}
            </PrimaryButton>
          </Link>
        </div>
        <LoggedInSideBar showNav={showSideNav} />
      </div>
    </header>
  )
}

export default withAccountsLoaded(WorkspaceSelectPageHeader)
