import React, {useEffect} from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {useSelector} from '../../hooks'
import LinkOut from '../../uiWidgets/link-out'
import {blueberry, tinyViewOverride} from '../../static/styles/settings'
import learnSVG from '../../static/icons/learn.svg'
import PayoutInfo from './payout-info'
import PayoutNotification from './payout-notification'
import PayoutLinks from './payout-links'
import PayoutNewAccount from './payout-new-account'
import {PaymentApiState} from './payout-types'
import useCurrentAccount from '../../common/use-current-account'
import {useAbandonableEffect} from '../../hooks/abandonable-effect'
import useActions from '../../common/use-actions'
import payoutActions from './payout-actions'
import type {RootState} from '../../reducer'
import {Loader} from '../../ui/components/loader'

const useStyles = createUseStyles({
  description: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1.5em',
    gap: '0.5em',
    flexWrap: 'wrap',
  },
  learnMoreIcon: {
    width: '12px',
    verticalAlign: 'middle',
  },
  learnMoreLinkOut: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    color: blueberry,
    fontSize: '12px',
    [tinyViewOverride]: {
      display: 'inline',
    },
  },
})

const getPaymentApiState = (account, requestError, details) => {
  if (!account?.stripeConnectAccountId) {
    return PaymentApiState.NewAccount
  }

  if (Object.keys(requestError).length > 0) {
    return PaymentApiState.NetworkError
  }

  if (details.connectAccount?.requirements.errors.length > 0) {
    return PaymentApiState.RequirementsError
  }

  if (details.connectAccount?.requirements.pending_verification.length > 0) {
    return PaymentApiState.Pending
  }

  if (details.connectAccount?.requirements.eventually_due.length > 0) {
    return PaymentApiState.Warning
  }

  return PaymentApiState.Normal
}

const PaymentAPISetting = () => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const account = useCurrentAccount()
  const loading = useSelector((state: RootState) => state.payments.pending !== false)
  const requestError = useSelector((state: RootState) => state.payments.error)
  const details = useSelector((state: RootState) => state.payments.payoutDetails)
  const {fetchDetails, clearDetails} = useActions(payoutActions)
  const connectState = getPaymentApiState(account, requestError, details)
  const showFullPayout = [PaymentApiState.Normal, PaymentApiState.Warning].includes(connectState) &&
    details.connectAccount?.externalAccount
  const showNotification = [PaymentApiState.Pending, PaymentApiState.RequirementsError,
    PaymentApiState.Warning, PaymentApiState.NetworkError].includes(connectState)

  useAbandonableEffect(async (executor) => {
    // Clears account payout info from other accounts
    clearDetails()
    if (account && connectState !== PaymentApiState.NewAccount) {
      await executor(fetchDetails(account.uuid))
    }
  }, [account])

  // Cleans up and clears payout info when navigating out of page
  useEffect(() => () => { clearDetails() }, [])

  if (loading) {
    return <Loader inline centered />
  }

  return (
    <>
      <div className={classes.description}>
        {t('plan_billing_page.payment_api_setting.description')}
        <LinkOut
          className={classes.learnMoreLinkOut}
          url='https://8th.io/payments-api-docs'
        >
          <img
            className={classes.learnMoreIcon}
            alt='learn icon'
            src={learnSVG}
            draggable={false}
          />&nbsp;{t('plan_billing_page.payment_api_setting.learn_more')}
        </LinkOut>
      </div>
      {showNotification && <PayoutNotification connectState={connectState} />}
      {connectState === PaymentApiState.NewAccount && <PayoutNewAccount />}
      {showFullPayout &&
        <>
          <PayoutInfo />
          <PayoutLinks />
        </>
      }
    </>
  )
}

export default PaymentAPISetting
