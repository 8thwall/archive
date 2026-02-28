import React from 'react'
import {useTranslation} from 'react-i18next'

import useCurrentAccount from '../../common/use-current-account'
import usePayoutStyles from './payout-styles'
import {generateConnectDashboardLink} from './payout-utils'

const PayoutLinks = () => {
  const {t} = useTranslation(['account-pages'])
  const payoutStyles = usePayoutStyles()
  const account = useCurrentAccount()

  return (
    <div className={payoutStyles.bottom}>
      <a
        className='ui button'
        target='_blank'
        rel='noopener noreferrer'
        href={`${generateConnectDashboardLink(account.uuid)}#settings`}
      >
        {t('plan_billing_page.payout_links.update_info')}
      </a>
      <a
        className='ui button'
        target='_blank'
        rel='noopener noreferrer'
        href={generateConnectDashboardLink(account.uuid)}
      >
        {t('plan_billing_page.payout_links.view_history')}
      </a>
    </div>
  )
}

export default PayoutLinks
