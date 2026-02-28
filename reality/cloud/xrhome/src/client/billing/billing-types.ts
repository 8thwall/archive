import type {DeepReadonly} from 'ts-essentials'
import type {Stripe} from 'stripe'

import type {AvailableAccountPlans} from '../../shared/account/account-types'
import type {IScheduledSubscription} from '../common/types/models'
import type {InvoiceInfo} from '../../shared/billing/billing-types'

interface BilledUsage {
  cycleStart: number
  cycleEnd: number
  views: number
}

/* eslint-disable camelcase */
type DeprecatedStripeCustomerFields = {
  tax_info: {
    tax_id: string
    type: string
  }
}
/* eslint-enable camelcase */

type CustomerBillingInfo = Partial<Pick<Stripe.Customer,
  'currency' | 'delinquent' | 'invoice_settings' | 'description' | 'discount' | 'email' |
  'metadata' | 'address' | 'phone' | 'shipping' | 'sources' | 'default_source' | 'tax' |
  'subscriptions' | 'name'>
& DeprecatedStripeCustomerFields>

type Subscription = Stripe.Subscription & {plan: Stripe.Plan}

// Customer billing information
type GetBillingResult = CustomerBillingInfo & {
  subscription: Subscription
  scheduledSubscriptions: IScheduledSubscription[]
  paymentMethods: Stripe.PaymentMethod[]
  accountSubscriptionSchedule: Stripe.SubscriptionSchedule
}

type BillingReduxState = DeepReadonly<GetBillingResult & {
  // Pending action state section
  billingUpdating: boolean
  upgradePending: boolean
  downgradePending: boolean
  getAccountPlansPending: boolean
  updateAccountPlanPending: boolean
  deleteScheduledPlanPending: boolean
  cancelPendingPlanPending: boolean
  reactivatePending: boolean
  pending: boolean

  billedUsageByAccount: Record<string, BilledUsage>
  subscriptionsByApp: Record<string, Stripe.Subscription>
  latestInvoiceInfo: InvoiceInfo
  upcomingAppLicenseInvoiceInfo: InvoiceInfo
  accountPlans: Partial<AvailableAccountPlans>
  latestPaymentMethod: string
}>

export type {
  BillingReduxState,
  BilledUsage,
}
