import React, {useEffect, useState} from 'react'
import {createUseStyles} from 'react-jss'
import {format} from 'date-fns/esm'
import {Trans, useTranslation} from 'react-i18next'
import type Stripe from 'stripe'
import type {DeepReadonly} from 'ts-essentials'

import useCurrentAccount from '../../common/use-current-account'
import {gray4, tinyViewOverride} from '../../static/styles/settings'
import {getDescriptionForAccountType} from '../../../shared/account-utils'
import {formatToCurrency} from '../../../shared/billing/currency-formatter'
import useActions from '../../common/use-actions'
import invoicesActions from '../../invoices/actions'
import {useSelector} from '../../hooks'
import {dateToStripeTime, stripeTimeToDate} from '../../../shared/time-utils'
import {Loader} from '../../ui/components/loader'
import {TextNotification} from '../../ui/components/text-notification'
import {useFormattedInterval} from '../../../shared/billing/interval-formatter'
import AutoHeading from '../../widgets/auto-heading'
import {getCurrentBillingEndDate} from '../billing-utils'
import type {IAccount} from '../../common/types/models'
import CancelSubscriptionButton from '../cancel-subscription-button'
import {getUpcomingPhase} from '../../../shared/billing/subscription-schedule-phases'
import {createThemedStyles} from '../../ui/theme'

const useStyles = createThemedStyles(theme => ({
  floatRight: {
    display: 'flex',
    flexDirection: 'row-reverse',
    marginTop: '2em',
  },
  manageActiveAccountPlan: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em',
  },
  largerText: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  planType: {
    color: theme.fgMuted,
    margin: '0',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    margin: '0',
  },
  rowElementsSpacedBetween: {
    'extend': 'row',
    'justifyContent': 'space-between',
    '& button': {
      fontSize: '16px',
    },

    [tinyViewOverride]: {
      'flexDirection': 'column',
      '& button': {
        margin: '2em 0',
      },
    },
  },
}))

interface ActiveSubscriptionProps {
  upcomingInvoice: DeepReadonly<Stripe.Invoice> | null
  onDowngradeClick: () => void
}

const ActiveSubscription: React.FC<ActiveSubscriptionProps> = ({
  upcomingInvoice,
  onDowngradeClick,
}) => {
  const classes = useStyles()
  const amountDue = upcomingInvoice && formatToCurrency(
    upcomingInvoice.amount_due, {currency: upcomingInvoice.currency}
  )
  const nextChargeDate = (
    upcomingInvoice && format(stripeTimeToDate(upcomingInvoice.created), 'MM/dd/yy')
  )
  const scheduledPriceId = useSelector((state) => {
    const price = getUpcomingPhase(
      state.billing.accountSubscriptionSchedule
    )?.items[0]?.price as Stripe.Price
    return price?.id
  })

  return (
    <div className={classes.rowElementsSpacedBetween}>
      <TextNotification type='info'>
        <Trans
          i18nKey='plan_billing_page.manage_active.notification.next_charge'
          ns='account-pages'
        >
          Next charge of {{amountDue}} on <strong>{{nextChargeDate}}</strong>
        </Trans>
      </TextNotification>
      <div className={classes.floatRight}>
        <CancelSubscriptionButton
          onCancelClick={onDowngradeClick}
          disabled={!!scheduledPriceId}
        />
      </div>
    </div>
  )
}
interface PastDueOrUnpaidSubscriptionProps {
  account: IAccount
  subscription: DeepReadonly<Stripe.Subscription>
}

const PastDueOrUnpaidSubscription: React.FC<PastDueOrUnpaidSubscriptionProps> = (
  {account, subscription}
) => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const {getOpenSubscriptionInvoices} = useActions(invoicesActions)
  const latestInvoice = subscription.latest_invoice as Stripe.Invoice
  const [outstandingInvoice, setOutstandingInvoice] = useState<Stripe.Invoice | null>(
    latestInvoice.status === 'open' ? latestInvoice : null
  )
  const [oustandingInvoiceLoaded, setOutstandingInvoiceLoaded] = useState<boolean>(
    latestInvoice.status === 'open'
  )

  const loadOutstandingInvoice = async () => {
    try {
      const [invoice] = await getOpenSubscriptionInvoices(account)
      setOutstandingInvoice(invoice)
    } catch (e) {
      setOutstandingInvoice(null)
    } finally {
      setOutstandingInvoiceLoaded(true)
    }
  }

  useEffect(() => {
    if (!oustandingInvoiceLoaded) {
      loadOutstandingInvoice()
    }
  }, [])

  if (!oustandingInvoiceLoaded) {
    return (
      <div className={classes.rowElementsSpacedBetween}>
        <Loader inline centered size='small' />
      </div>
    )
  }

  const getWarningMessage = () => {
    if (subscription.status === 'past_due') {
      return t('plan_billing_page.manage_active.notification.past_due')
    }

    if (!outstandingInvoice) {
      return t('plan_billing_page.manage_active.notification.unpaid.contact_support')
    }

    if (outstandingInvoice.period_end > dateToStripeTime(new Date())) {
      return t('plan_billing_page.manage_active.notification.unpaid.pay_oustanding')
    }

    return t('plan_billing_page.manage_active.notification.unpaid.pay_oustanding_and_upcoming')
  }

  return (
    <div className={classes.rowElementsSpacedBetween}>
      <TextNotification type='danger'>
        {getWarningMessage()}
      </TextNotification>
    </div>
  )
}

const CancelledSubscription = () => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const cycleEndDate = useSelector(state => getCurrentBillingEndDate(state))
  const endDate = cycleEndDate && format(cycleEndDate, 'MM/dd/yyyy')

  return (
    <div className={classes.rowElementsSpacedBetween}>
      <TextNotification type='danger'>
        {t('plan_billing_page.manage_active.notification.end_date', {endDate})}
      </TextNotification>
    </div>
  )
}

interface ManageActiveAccountPlanProps {
  onDowngradeClick: () => void
}

// For ADMIN, BILLING MANAGER, and OWNER users.
const AuthorizedManageActiveAccountPlan: React.FC<ManageActiveAccountPlanProps> = ({
  onDowngradeClick,
}) => {
  const account = useCurrentAccount()
  const classes = useStyles()
  const pendingCancellation = account.pendingCancellation === 'EndOfCycle'
  const {getUpcomingPlanInvoice} = useActions(invoicesActions)
  const upcomingInvoice = useSelector(state => state.invoices.upcomingPlanInvoice)
  const loadingUpcomingInvoice = useSelector(
    state => !pendingCancellation && state.invoices.pending.upcomingPlanInvoice !== false
  )
  const loadingBilling = useSelector(state => (
    account.accountSubscriptionId &&
    state.billing?.subscription?.id !== account.accountSubscriptionId
  ))
  const subscription = useSelector(state => state.billing?.subscription)
  const currentPlan = useSelector(state => state.billing?.subscription?.plan)

  const formattedInterval =
    useFormattedInterval(currentPlan?.interval, currentPlan?.interval_count)

  useEffect(() => {
    if (!pendingCancellation) {
      getUpcomingPlanInvoice(account)
    }
  }, [
    account.uuid,
    account.accountSubscriptionId,
    account.accountLicenseSubscriptionItemId,
    account.accountSubscriptionScheduleId,
  ])

  // Note: Anything that needs to use upcomingInvoice should sit below this.
  if (loadingUpcomingInvoice || loadingBilling) {
    return (
      <div className={classes.manageActiveAccountPlan}>
        <Loader inline centered size='small' />
      </div>
    )
  }
  const formattedAmountDue = formatToCurrency(
    currentPlan.amount, {currency: currentPlan.currency}
  )

  const renderSubscriptionView = () => {
    if (pendingCancellation) {
      return <CancelledSubscription />
    }

    const unpaidStatuses: Stripe.Subscription.Status[] = ['past_due', 'unpaid']
    if (unpaidStatuses.includes(subscription.status)) {
      return <PastDueOrUnpaidSubscription account={account} subscription={subscription} />
    }

    return (
      <ActiveSubscription
        upcomingInvoice={upcomingInvoice}
        onDowngradeClick={onDowngradeClick}
      />
    )
  }

  return (
    <div className={classes.manageActiveAccountPlan}>
      <AutoHeading className={classes.planType}>
        {getDescriptionForAccountType(account.accountType)}
      </AutoHeading>
      <p className={classes.row}>
        <span className={classes.largerText}>{formattedAmountDue}/</span>&nbsp;{formattedInterval}
      </p>
      {renderSubscriptionView()}
    </div>
  )
}

/**
 * For accounts that have been manually upgraded, with no Stripe subscriptions.
 * A few of these exist on production for accounts that belong to 8th Wall team members.
 */
const EmptyAccountPlan = () => {
  const account = useCurrentAccount()
  const classes = useStyles()

  return (
    <div className={classes.rowElementsSpacedBetween}>
      <AutoHeading className={classes.planType}>
        {getDescriptionForAccountType(account.accountType)}
      </AutoHeading>
    </div>
  )
}

const ManageActiveAccountPlan: React.FC<ManageActiveAccountPlanProps> = ({onDowngradeClick}) => {
  const account = useCurrentAccount()

  if (!account.accountSubscriptionId) {
    return <EmptyAccountPlan />
  }

  return <AuthorizedManageActiveAccountPlan onDowngradeClick={onDowngradeClick} />
}

export {
  ManageActiveAccountPlan,
}
