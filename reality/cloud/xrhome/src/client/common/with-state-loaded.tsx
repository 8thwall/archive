import * as React from 'react'

import {useSelector} from '../hooks'
import type {RootState} from '../reducer'
import {useCurrentMemberAccount} from './use-current-member-account'
import {Loader} from '../ui/components/loader'
import {LoadState} from '../crm/types'

const withStateLoaded = (isReadyState: (state: RootState) => boolean) => <T extends object>(
  Component: React.ComponentType<T>
): React.ComponentType<T> => (props: T) => {
    const isReady = useSelector(isReadyState)
    if (!isReady) {
      return <Loader />
    }
    return <Component {...props} />
  }

const withAppsLoaded = <T extends object>(
  Component: React.ComponentType<T>
): React.ComponentType<T> => (props: T) => {
    const isAppsLoading = useSelector(state => state.apps.loading)
    const selectedAccountUuid = useSelector(state => state.accounts.selectedAccount)
    const routeAccountUuid = useCurrentMemberAccount()?.uuid
    if (isAppsLoading || selectedAccountUuid !== routeAccountUuid) {
      return <Loader />
    }
    return <Component {...props} />
  }

const accountsLoaded = (state: RootState) => !!state.accounts.allAccounts.length
const teamLoaded = (state: RootState) => !!state.team.roles.length
const userLoaded = (state: RootState) => (!state.user.loading && !!state.user.email)
const loginLoaded = (state: RootState) => !state.user.loading
const checkoutOrderLoaded = (state: RootState) => !!state.checkout.order
const lightshipLoaded = (state: RootState) => accountsLoaded(state) && !state.apps.loading
const crmUserLoaded = (state: RootState) => (
  !!state.crm.currentUser && state.crm.currentUserLoading !== LoadState.Loading
)

const withAccountsLoaded = withStateLoaded(accountsLoaded)
const withTeamLoaded = withStateLoaded(teamLoaded)
const withUserLoaded = withStateLoaded(userLoaded)
const withLoginLoaded = withStateLoaded(loginLoaded)
const withCheckoutOrderLoaded = withStateLoaded(checkoutOrderLoaded)
const withLightshipLoaded = withStateLoaded(lightshipLoaded)
const withCrmUserLoaded = withStateLoaded(crmUserLoaded)

export {
  withAccountsLoaded,
  withAppsLoaded,
  withTeamLoaded,
  withUserLoaded,
  withLoginLoaded,
  withCheckoutOrderLoaded,
  withLightshipLoaded,
  withCrmUserLoaded,
}
