import type Stripe from 'stripe'
import {useTranslation} from 'react-i18next'

type Variation = 'noun' | 'adj' | 'adv'

const useFormattedInterval = (interval: Stripe.Plan.Interval, intervalCount: number) => {
  const {t} = useTranslation('billing')

  if (!interval || !intervalCount) {
    return ''
  }

  return t(`billing.description.formatted_interval_${interval}`, {
    count: intervalCount,
  })
}

const useFormattedIntervalBasis = (
  intervalCount: number,
  interval: Stripe.Plan.Interval,
  variation: Variation = 'noun'
) => {
  const {t} = useTranslation('billing')

  if (!intervalCount || !interval) {
    return ''
  }

  return t(`billing.description.formatted_interval_basis_${variation}_${interval}`, {
    count: intervalCount,
  })
}

export {
  useFormattedInterval,
  useFormattedIntervalBasis,
}
