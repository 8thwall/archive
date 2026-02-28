import React from 'react'
import {useTranslation} from 'react-i18next'

import {useSelector} from '../../hooks'
import {formatToCurrency} from '../../../shared/billing/currency-formatter'
import {brandHighlight, tinyViewOverride} from '../../static/styles/settings'
import type {RootState} from '../../reducer'
import PayoutScheduleText from './payout-schedule-text'
import {createThemedStyles} from '../../ui/theme'

const useStyles = createThemedStyles(theme => ({
  tableContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: '1em 0',
    [tinyViewOverride]: {
      flexDirection: 'column',
      gap: '2em',
    },
  },
  tableCell: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: '0.5em',
    padding: '0 1em',
    borderLeft: `2px solid ${brandHighlight}`,
    [tinyViewOverride]: {
      flexBasis: '0',
    },
  },
  tableLabel: {
    color: theme.fgMuted,
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  tableValue: {
    color: theme.fgMain,
    fontWeight: '700',
    whiteSpace: 'nowrap',
  },
}))

const PayoutInfo = () => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const {payouts, connectAccount} = useSelector((state: RootState) => state.payments.payoutDetails)

  return (
    <div className={classes.tableContainer}>
      <div className={classes.tableCell}>
        <span className={classes.tableLabel}>
          {connectAccount.externalAccount.object === 'card'
            ? t('plan_billing_page.payout_info.debit_card')
            : t('plan_billing_page.payout_info.bank_account')}
        </span>
        <span className={classes.tableValue}>
          ****&nbsp;****&nbsp;****&nbsp;{connectAccount.externalAccount.last4}
        </span>
      </div>
      <div className={classes.tableCell}>
        <span className={classes.tableLabel}>
          {t('plan_billing_page.payout_info.label.total_amount')}
        </span>
        <span className={classes.tableValue}>
          {formatToCurrency(payouts.lifetimeEarnings, {currency: connectAccount.defaultCurrency})}
        </span>
      </div>
      <div className={classes.tableCell}>
        <span className={classes.tableLabel}>
          {t('plan_billing_page.payout_info.label.payout_date')}
        </span>
        <span className={classes.tableValue}>
          <PayoutScheduleText />
        </span>
      </div>
      <div className={classes.tableCell}>
        <span className={classes.tableLabel}>
          {t('plan_billing_page.payout_info.label.next_payout_amount')}
        </span>
        <span className={classes.tableValue}>
          {formatToCurrency(payouts.available, {currency: connectAccount.defaultCurrency})}
        </span>
      </div>
      <div className={classes.tableCell}>
        <span className={classes.tableLabel}>
          {t('plan_billing_page.payout_info.label.pending_amount')}
        </span>
        <span className={classes.tableValue}>
          {formatToCurrency(payouts.pending, {currency: connectAccount.defaultCurrency})}
        </span>
      </div>
    </div>
  )
}

export default PayoutInfo
