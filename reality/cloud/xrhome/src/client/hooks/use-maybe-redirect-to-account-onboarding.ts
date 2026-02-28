import React from 'react'

import {useHistory} from 'react-router-dom'

import useActions from '../common/use-actions'
import useCurrentAccount from '../common/use-current-account'
import crmActions from '../crm/crm-actions'
import {getCurrentUserCrmCustomer} from '../crm/crm-state'
import type {CrmState} from '../crm/types'
import {useSelector} from '../hooks'
import {useUserUuid} from '../user/use-current-user'
import {isOnboardingRequired} from '../../shared/account-utils'
import {isWebAccount} from '../../shared/account-utils'
import {getPathForAccountOnboarding} from '../common/paths'
import accountActions from '../accounts/account-actions'
import type {AccountWithApps} from '../common/types/models'

const useMaybeRedirectToAccountOnboarding = () => {
  const currentAccount = useCurrentAccount() as AccountWithApps
  const crmCustomer = useSelector(s => getCurrentUserCrmCustomer(s.crm as CrmState))
  const hasNoApps = currentAccount.Apps.length === 0
  const currentUserUuid = useUserUuid()
  const {getCurrentUserCrm} = useActions(crmActions)
  const history = useHistory()
  const {setActivatingAccount} = useActions(accountActions)

  const accountNeedOnboarding = isOnboardingRequired(currentAccount)

  React.useEffect(() => {
    if (!crmCustomer && currentUserUuid) {
      getCurrentUserCrm()
    }
  }, [currentUserUuid])

  if (isWebAccount(currentAccount) &&
    (accountNeedOnboarding || hasNoApps)
  ) {
    setActivatingAccount(currentAccount.uuid)
    history.push(getPathForAccountOnboarding())
  }
}

export {
  useMaybeRedirectToAccountOnboarding,
}
