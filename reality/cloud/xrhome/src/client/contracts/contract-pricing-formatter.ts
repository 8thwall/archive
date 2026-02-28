import {useTranslation} from 'react-i18next'

import {formatToCurrency} from '../../shared/billing/currency-formatter'

const numIncludedFormatter = new Intl.NumberFormat('en-US', {maximumFractionDigits: 3})

const sortTiersByUpTo = (tiers) => {
  const sortedTiers = [...tiers]
  sortedTiers.sort((tier1, tier2) => {
    // Always sort the tiers without an up_to last.
    if (!tier1.up_to) {
      return 1
    } else if (!tier2.up_to) {
      return -1
    }
    return tier1.up_to - tier2.up_to
  })
  return sortedTiers
}

const getIncludedViews = (license) => {
  if (!license.tiers ||
    license.tiers.length === 0) {
    return 0
  }

  const sortedTiers = sortTiersByUpTo(license.tiers)
  if (sortedTiers[0].unit_amount !== 0) {
    // No views are included in this pricing plan.
    return 0
  }

  return sortedTiers[0].up_to * 100
}

const getStartingCpvPaymentText = (license, t) => {
  const numIncludedViews = getIncludedViews(license)
  if (numIncludedViews || !license.tiers || license.tiers.length === 0) {
    return ''
  }

  const sortedTiers = sortTiersByUpTo(license.tiers)
  const startingTier = sortedTiers[0]
  const cpv = startingTier.unit_amount / 100
  return t('billing.contract_pricing_formatter.get_starting_cpv_payment',
    {price: formatToCurrency(cpv, {decimalPlaces: 4})})
}

const usePerViewMetadata = (license) => {
  const {t} = useTranslation(['billing'])
  if (!license?.tiers) {
    return {viewsIncluded: '', perViewPrice: ''}
  }

  let viewsIncluded = '0'
  let cpv = 0.00

  if (Array.isArray(license.tiers) && license.tiers.length) {
    // TODO(alvin): This logic will display incorrect information if we have 2 tiers
    // where neither is free.
    if (license.tiers.length > 2) {
      return {
        viewsIncluded: '',
        perViewPrice: `${getStartingCpvPaymentText(license, t)}`,
      }
    }
    // Contract Templates come back out-of-order
    const ONE_MILLION = 1.0e+6
    license.tiers.forEach((l) => {
      const upTo = l.up_to * 100
      if (upTo) {
        if (upTo % ONE_MILLION === 0) {
          // viewsIncluded = `${upTo / ONE_MILLION} MILLION`
          viewsIncluded = t('billing.contract_pricing_formatter.views_included_million',
            {number: upTo / ONE_MILLION})
        } else {
          viewsIncluded = numIncludedFormatter.format(upTo)
        }
      } else {
        cpv = l.unit_amount / 100
      }
    })
  }
  const priceString = formatToCurrency(cpv, {decimalPlaces: 4})
  return {
    viewsIncluded,
    perViewPrice: (viewsIncluded !== '0')
      ? t('billing.contract_pricing_formatter.per_view_price_additional', {priceString})
      : t('billing.contract_pricing_formatter.per_view_price', {priceString}),
  }
}

const getInvoicePaymentPrice = (license) => {
  if (!license.invoiceLicense) {
    return ''
  }
  const {amount} = license.invoiceLicense
  return formatToCurrency(amount)
}

const useInvoicePaymentInterval = (license) => {
  const {t} = useTranslation(['billing'])
  if (!license?.invoiceLicense) {
    return ''
  }
  const {intervalCount, interval} = license.invoiceLicense

  return t(`billing.contract_pricing_formatter.invoice_pay_text_${interval.toLowerCase()}`,
    {count: intervalCount})
}

const getSubscriptionPaymentPrice = (license) => {
  if (!license.subLicense) {
    return ''
  }
  const {amount} = license.subLicense
  return formatToCurrency(amount)
}

const useSubscriptionPaymentInterval = (license) => {
  const {t} = useTranslation(['billing'])
  if (!license?.subLicense) {
    return ''
  }
  const {intervalCount, interval} = license.subLicense
  if (license?.invoiceLicense) {
    return t(
      `billing.contract_pricing_formatter.subscription_pay_text_add_${interval.toLowerCase()}`,
      {ns: 'billing'}
    )
  }

  return t(
    `billing.contract_pricing_formatter.subscription_pay_text_${interval.toLowerCase()}`,
    {count: intervalCount}
  )
}

const getFormattedAmountDue = (license) => {
  if (license.invoiceLicense) {
    return formatToCurrency(license.invoiceLicense.amount)
  } else if (license.subLicense) {
    return formatToCurrency(license.subLicense.amount)
  } else if (license.amount) {
    return formatToCurrency(license.amount)
  } else {
    throw new Error('Cannot format amount due for provided license.')
  }
}

const useLicenseMetadata = (license) => {
  const {viewsIncluded, perViewPrice} = usePerViewMetadata(license)
  const invoiceIntervalText = useInvoicePaymentInterval(license)
  const subscriptionIntervalText = useSubscriptionPaymentInterval(license)

  return {
    invoicePrice: getInvoicePaymentPrice(license),
    invoiceIntervalText,
    subscriptionPrice: getSubscriptionPaymentPrice(license),
    subscriptionIntervalText,
    viewsIncluded,
    perViewPrice,
  }
}

export {
  getFormattedAmountDue,
  usePerViewMetadata,
  getInvoicePaymentPrice,
  useInvoicePaymentInterval,
  getSubscriptionPaymentPrice,
  useSubscriptionPaymentInterval,
  useLicenseMetadata,
}
