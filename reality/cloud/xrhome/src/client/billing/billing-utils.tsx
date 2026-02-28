import parseISO from 'date-fns/parseISO'
import addMonths from 'date-fns/addMonths'
import * as React from 'react'
import {Icon} from 'semantic-ui-react'

import {getSelectedAccount} from '../accounts'
import {titleCase} from '../common/strings'

const getCurrentBillingEndDate = (state) => {
  if (state.billing.subscription) {
    return new Date(state.billing.subscription.current_period_end * 1000)
  } else if (getSelectedAccount(state)?.lastBillingClose) {
    const anchor = parseISO(getSelectedAccount(state).lastBillingClose)
    return addMonths(anchor, 1)
  } else {
    return undefined
  }
}

const getLatestPaymentMethod = state => state?.billing?.latestPaymentMethod

const getPaymentMethods = state => state?.billing?.paymentMethods

const getDefaultPaymentMethod = (state) => {
  const {billing} = state
  let defaultId = billing?.invoice_settings?.default_payment_method

  if (!defaultId) {
    defaultId = billing?.default_source
  }

  const paymentMethods = getPaymentMethods(state)
  const result = paymentMethods?.find(pm => pm.id === defaultId)
  return result
}

const getAccountSubscriptionPaymentMethod = (state) => {
  const {subscription} = state.billing
  if (!subscription) {
    return null
  }

  const paymentMethodId = subscription.default_payment_method || subscription.default_source
  if (!paymentMethodId) {
    return getDefaultPaymentMethod(state)
  }

  const paymentMethods = getPaymentMethods(state)
  return paymentMethods?.find(pm => pm.id === paymentMethodId)
}

const isCardPaymentMethod = paymentMethod => (
  paymentMethod?.object === 'card' ||
  (paymentMethod?.object === 'source' && !!paymentMethod?.card) ||
  (paymentMethod?.object === 'payment_method' && !!paymentMethod?.card)
)

const isBankPaymentMethod = paymentMethod => (
  paymentMethod?.object === 'bank_account'
)

export interface IStandardizedStripSource {
  name: string
  last4?: string
  expires?: string
  description?: string
  object: 'card' | 'ach_credit_transfer' | 'bank_account' | 'payment_method'
}

const standardizeStripeSource = (source): IStandardizedStripSource => {
  const getCardInfo = (card): IStandardizedStripSource => {
    const {brand, last4, exp_month, exp_year} = card
    return {
      name: titleCase(brand),
      last4,
      expires: `${exp_month}/${exp_year}`,
      object: 'card',
    }
  }
  if (source.object === 'card') {
    return getCardInfo(source)
  } else if (source.type === 'ach_credit_transfer') {
    const {bank_name} = source.ach_credit_transfer
    return {
      name: bank_name,
      description: 'ACH Credit Transfer',
      object: 'ach_credit_transfer',
    }
  } else if (source.object === 'bank_account') {
    const {bank_name, last4} = source
    return {
      name: bank_name,
      last4,
      object: 'bank_account',
    }
  } else if (source.object === 'source' || source.object === 'payment_method') {
    if (source.card) {
      return getCardInfo(source.card)
    }
  } else {
    console.warn('Using default card on source object', source)
    if (source.card) {
      return getCardInfo(source.card)
    } else {
      throw new Error(`Unexpected source type ${JSON.stringify(source)}`)
    }
  }
}

const isInvoiceSource = source => source.type === 'ach_credit_transfer'

const describeOpts = {
  mask: '****',
  icons: false,
  before: null,
  after: null,
  className: undefined,
  expiresParen: false,
}

const describeSource = (source, opts = {}) => {
  const stdSrc = standardizeStripeSource(source)
  if (!stdSrc) {
    return (<span>Unsupported source {source.id}</span>)
  }
  const {mask, icons, before, after, className, expiresParen} = {...describeOpts, ...opts}
  const {name} = stdSrc
  const last4 = stdSrc.last4 && ` ${mask} ${stdSrc.last4} ` || ' '
  const desc = stdSrc.description && ` [${stdSrc.description}] ` || ' '
  let exp = ''
  if (stdSrc.expires) {
    exp = expiresParen ? ` (Expires on ${stdSrc.expires}) ` : ` expiring on ${stdSrc.expires} `
  }

  const iconName = source.object === 'card' || source.type === 'card'
    ? 'credit card outline'
    : 'currency'
  const text = `${name}${last4}${desc}${exp}`

  return (
    <span className={className}>
      {before}
      {icons && <Icon name={iconName} />}
      {text}
      {after}
    </span>
  )
}

const trimBillingInfo = billingInfo => Object.keys(billingInfo).reduce((o, k) => {
  o[k] = typeof billingInfo[k] === 'string' ? billingInfo[k].trim() : billingInfo[k]
  return o
}, {})

const isUnrecognizedLocation = (automaticTax: string) => automaticTax === 'unrecognized_location'

/* eslint-disable camelcase */
const isAddressPopulated = (address) => {
  if (!address) {
    return false
  }
  const {line1, city, country, state, postal_code} = address

  return line1 && city && country && state && (country !== 'US' || postal_code)
}
/* eslint-enable camelcase */

export {
  getAccountSubscriptionPaymentMethod,
  getCurrentBillingEndDate,
  getPaymentMethods,
  getDefaultPaymentMethod,
  getLatestPaymentMethod,
  isCardPaymentMethod,
  isBankPaymentMethod,
  standardizeStripeSource,
  isInvoiceSource,
  describeSource,
  trimBillingInfo,
  isUnrecognizedLocation,
  isAddressPopulated,
}
