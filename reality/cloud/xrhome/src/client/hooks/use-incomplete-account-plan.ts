import type Stripe from 'stripe'
import type {DeepReadonly} from 'ts-essentials'

import type {
  AccountPlan, IncompleteAccountPlan, UpgradableAccountTypes,
} from '../../shared/account/account-types'
import {products} from '../../shared/stripe-client-config'
import {useSelector} from '../hooks'

const getAccountPlanForPrice = (price: DeepReadonly<Stripe.Price>): AccountPlan => ({
  priceId: price.id,
  amount: price.unit_amount,
  interval: price.recurring.interval,
  intervalCount: price.recurring.interval_count,
  currency: price.currency,
})

const getPendingSubscriptionItem = (subscription: DeepReadonly<Stripe.Subscription>) => {
  // The user attempted to create a new subscription.
  if (subscription.status === 'incomplete') {
    return subscription.items.data[0]
  }

  // The user tried to immediately start the plan they were already trialing on.
  if (subscription.status === 'trialing' && !subscription.pending_update.subscription_items) {
    return subscription.items.data[0]
  }

  // All other plan-to-plan upgrades.
  return subscription.pending_update.subscription_items[0]
}

const useIncompleteAccountPlan = (): IncompleteAccountPlan | null => {
  const subscription = useSelector(state => state.billing.subscription)

  if (subscription?.status !== 'incomplete' && !subscription?.pending_update) {
    return null
  }

  const invoice = subscription.latest_invoice as Stripe.Invoice
  const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent
  const clientSecret = paymentIntent.client_secret
  const pendingSubItem = getPendingSubscriptionItem(subscription)

  const accountPlan = getAccountPlanForPrice(pendingSubItem.price)
  const accountTypeForProduct = Object.keys(products).find(
    accountType => products[accountType].has(pendingSubItem.price.product)
  ) as UpgradableAccountTypes

  return {invoice, clientSecret, accountPlan, accountType: accountTypeForProduct}
}

export {
  useIncompleteAccountPlan,
}
