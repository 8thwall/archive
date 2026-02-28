import type * as React from 'react'
import type Stripe from 'stripe'

interface AccountPlan {
  priceId: string
  amount: number
  currency: string
  interval: Stripe.Plan.Interval
  intervalCount: number
  defaultPlan?: boolean
  discountedPercent?: number
}

interface AccountDetail {
  planType: string
  description: string
  details: React.ReactNode[]
}

type UpgradableAccountTypes = 'WebStarter' | 'WebPlus' | 'WebAgency'

type AccountPrices = {[type in UpgradableAccountTypes]?: string[]}

type PromotionalAccountPrices = Record<string, {
  // The time at which the account prices are no longer valid.
  expirationTimeMs: number

  // The prices that are eligible to use this promo code. Stripe only let's you gate promo codes
  // by product. This will allow us to gate promo codes at the price level (e.g. only available
  // for annual plans).
  eligiblePrices: Set<string>
}>

interface IncompleteAccountPlan {
  invoice: Stripe.Invoice
  clientSecret: string
  accountPlan: AccountPlan
  accountType: UpgradableAccountTypes
}

type AccountDetails = {[type in UpgradableAccountTypes]: AccountDetail}

type AvailableAccountPlans = Record<UpgradableAccountTypes, Array<AccountPlan>>
type PreferredAccountPlan = AccountPlan & {accountType: UpgradableAccountTypes}

export type {
  AccountPlan,
  AccountDetail,
  UpgradableAccountTypes,
  AccountPrices,
  IncompleteAccountPlan,
  AccountDetails,
  AvailableAccountPlans,
  PreferredAccountPlan,
  PromotionalAccountPrices,
}
