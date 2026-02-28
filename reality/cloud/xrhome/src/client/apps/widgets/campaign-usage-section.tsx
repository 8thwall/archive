import React from 'react'
import {Link, useParams} from 'react-router-dom'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'

import {getPathForAccount, AccountPathEnum} from '../../common/paths'
import type {BilledUsage} from '../../billing/billing-types'

interface ICampaignUsageSection {
  usage: BilledUsage
  isWorkspace?: boolean
}

const CampaignUsageSection: React.FC<ICampaignUsageSection> = ({usage, isWorkspace}) => {
  const params = useParams<{account: string}>()
  const accountBillingPath = getPathForAccount(params.account, AccountPathEnum.account)

  const accountLink = (
    <Link className='style-reset inline-link' to={accountBillingPath}>
      Account
    </Link>
  )

  const daysUntilEnd = differenceInCalendarDays(usage.cycleEnd * 1000, new Date())

  return (
    <>
      <p>
        This {isWorkspace
        ? 'workspace'
        : 'project'} has accumulated {usage.views.toLocaleString('en-US')} views during the
        billing cycle that ends in {daysUntilEnd} days.
      </p>
      <small className='usage-disclaimer'>
        Usage is measured in 100 view increments. Usage from previous months can be found within
        your invoices on the {accountLink} page.
      </small>
    </>
  )
}

export default CampaignUsageSection
