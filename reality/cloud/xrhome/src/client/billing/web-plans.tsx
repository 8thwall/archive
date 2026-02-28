import React from 'react'

import {isEnterprise, isBusiness} from '../../shared/account-utils'
import useCurrentAccount from '../common/use-current-account'

import BusinessPlan from './business-plan'
import EnterprisePlan from './enterprise-plan'
import SpaceBelow from '../ui/layout/space-below'
import {SpaceBetween} from '../ui/layout/space-between'

const ManagePlan = () => {
  const account = useCurrentAccount()

  const isEnterpriseAccount = isEnterprise(account)
  const isBusinessAccount = isBusiness(account)

  // TODO(wayne): Change to free trial plan only except proPlan for cancellation
  return (
    <SpaceBelow>
      <SpaceBetween direction='vertical'>
        {isBusinessAccount && <BusinessPlan />}
        {isEnterpriseAccount && <EnterprisePlan />}
      </SpaceBetween>
    </SpaceBelow>
  )
}

export default ManagePlan
