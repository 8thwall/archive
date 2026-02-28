import * as React from 'react'
import {Redirect, useHistory} from 'react-router-dom'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {withAccountsLoaded} from '../common/with-state-loaded'
import Page from '../widgets/page'
import appsActions from '../apps/apps-actions'
import AppCardGroup from '../apps/widgets/app-card-group'
import ErrorMessage from './error-message'
import {getPathForAccount, AccountPathEnum, SignUpPathEnum} from '../common/paths'
import topBarActions from '../messages/top-bar/top-bar-actions'
import {mergeActions} from '../common'
import AccountSidebar from '../widgets/account-sidebar'
import {RecommendedContent} from './recommended-content'
import {Loader} from '../ui/components/loader'
import {connect} from '../common/connect'
import {FirstTimeUserModal} from './first-time-user-experience/first-time-user-modal'
import {isOnboardingRequired} from '../../shared/account-utils'
import {FirstTimeUserRetrievable} from './first-time-user-experience/first-time-user-retrievable'
import {PrimaryButton} from '../ui/components/primary-button'
import {usePrivateNavigationEnabled} from '../brand8/brand8-gating'

const useStyles = createUseStyles({
  startNewButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '1rem',
    marginTop: '3rem',
  },
  recentsProjectsRow: {
    marginBottom: '1rem',
    marginTop: '2rem',
  },
})

interface IRecentApps {
  recentApps: any[]
  setFirstTimeUserModalOpen?: (isOpen: boolean) => void
}

const RecentApps: React.FC<IRecentApps> = ({recentApps, setFirstTimeUserModalOpen}) => {
  if (!recentApps) {
    return <Loader inline />
  } else if (recentApps.length > 0) {
    return <AppCardGroup apps={recentApps} accountFooters />
  } else {
    return <FirstTimeUserRetrievable open={setFirstTimeUserModalOpen} />
  }
}

const renderRecentApps = (recentApps, setFirstTimeUserModalOpen) => (
  <RecentApps
    recentApps={recentApps}
    setFirstTimeUserModalOpen={setFirstTimeUserModalOpen}
  />
)

const MyProjectsPage = ({accounts, getRecentApps, setShowTopBar}) => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const [recentApps, setRecentApps] = React.useState(null)
  const [firstTimeUserModalOpen, setFirstTimeUserModalOpen] = React.useState(false)
  const history = useHistory()
  const brand8NavigationEnabled = usePrivateNavigationEnabled()

  React.useEffect(() => {
    getRecentApps().then(setRecentApps)
    // clear top bar
    setShowTopBar(false)
  }, [])

  React.useEffect(() => {
    setFirstTimeUserModalOpen(accounts.length === 1 && !isOnboardingRequired(accounts[0]) &&
    recentApps?.length === 0)
  }, [recentApps])

  if (accounts.find(a => a.status === 'ACTIVATING') && accounts.length === 1) {
    return <Redirect to={SignUpPathEnum.step1Register} />
  }

  const startProjectPath = accounts.length === 1
    ? getPathForAccount(accounts[0], AccountPathEnum.createProject)
    : '/create-project'

  const getContent = () => (!recentApps
    ? <Loader />
    : (
      <>
        <ErrorMessage />
        <div className={classes.startNewButton}>
          <PrimaryButton
            a8='click;xr-home;start-a-new-project-cta'
            onClick={() => {
              history.push(startProjectPath)
            }}
          >
            {t('account_dashboard_page.link.new_project')}
          </PrimaryButton>
        </div>
        <div className={classes.recentsProjectsRow}>
          <h2>{t('my_projects_page.heading.recent_projects')}</h2>
          {renderRecentApps(recentApps, setFirstTimeUserModalOpen)}
        </div>
        <RecommendedContent />
        {firstTimeUserModalOpen &&
          <FirstTimeUserModal
            open={firstTimeUserModalOpen}
            closable
            onClose={() => setFirstTimeUserModalOpen(false)}
          />
        }
      </>
    )
  )

  return (
    <div className='with-sidebar'>
      {!brand8NavigationEnabled && <AccountSidebar />}
      <Page headerVariant='workspace'>
        {getContent()}
      </Page>
    </div>
  )
}

export default withAccountsLoaded(connect(state => ({
  accounts: state.accounts.allAccounts,
}), mergeActions(appsActions, topBarActions))(MyProjectsPage))
