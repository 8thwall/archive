import React, {useEffect} from 'react'
import {Redirect} from 'react-router-dom'

import Page from '../../widgets/page'
import {AccountOnboardingStateProvider} from './account-onboarding-context'
import {AccountOnboardingForm} from './account-onboarding-form'
import {useSelector} from '../../hooks'
import {withAccountsLoaded, withUserLoaded} from '../../common/with-state-loaded'
import type {AccountWithApps} from '../../common/types/models'
import useActions from '../../common/use-actions'
import crmActions from '../../crm/crm-actions'
import {useUserUuid} from '../../user/use-current-user'
import {getCurrentUserCrmCustomer} from '../../crm/crm-state'
import type {CrmState} from '../../crm/types'
import type {RootState} from '../../reducer'
import {getPathForMyProjectsPage} from '../../common/paths'
import {isOnboardingRequired} from '../../../shared/account-utils'
import {usePendoDisableGuides} from '../../common/use-pendo'
import {
  AppLoadingScreenContextProvider,
} from '../../apps/widgets/loading-screen/app-loading-screen-context'
import {useOnboardingStyles} from './account-onboarding-styles'
import {WelcomeBackground} from '../../widgets/welcome-background'

const AccountOnboardingFormContainer: React.FC<{account: AccountWithApps}> = ({account}) => (
  <AccountOnboardingStateProvider account={account}>
    <AccountOnboardingForm />
  </AccountOnboardingStateProvider>
)

const selectOnboardingAccount = (state: RootState) => {
  const activatingAccountUuid = state.accounts.activatingAccount
  let activatingAccount = state.accounts.allAccounts?.find(a => a.uuid === activatingAccountUuid)

  if (!activatingAccount && state.accounts.allAccounts?.length === 1) {
    activatingAccount = state.accounts.allAccounts?.find(isOnboardingRequired)
  }

  return activatingAccount
}

const AccountOnboardingPage = () => {
  const classes = useOnboardingStyles()
  const account = useSelector(selectOnboardingAccount)
  const {getCurrentUserCrm} = useActions(crmActions)
  const crmCustomer = useSelector(s => getCurrentUserCrmCustomer(s.crm as CrmState))
  const currentUserUuid = useUserUuid()
  usePendoDisableGuides()

  useEffect(() => {
    if (!crmCustomer && currentUserUuid) {
      getCurrentUserCrm()
    }
  }, [currentUserUuid])

  if (!account) {
    return <Redirect to={getPathForMyProjectsPage()} />
  }

  return (
    <Page
      className={classes.page}
      hasHeader={false}
      hasFooter={false}
      centered={false}
    >
      <WelcomeBackground />
      <AccountOnboardingFormContainer account={account} />
    </Page>
  )
}

const AccountOnboardingPageWithContexts = () => (
  <AppLoadingScreenContextProvider>
    <AccountOnboardingPage />
  </AppLoadingScreenContextProvider>
)

export default withUserLoaded(withAccountsLoaded(AccountOnboardingPageWithContexts))
