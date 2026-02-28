import type {StripeElementLocale} from '@stripe/stripe-js'

import {
  FALLBACK_LOCALE, getStripeLocaleMap, SupportedLocale8w,
} from './i18n-locales'

const toStripeLocale = (locale: SupportedLocale8w): StripeElementLocale => {
  const stripeLocaleMap = getStripeLocaleMap()
  const stripeLocale = stripeLocaleMap[locale]

  return stripeLocale || stripeLocaleMap[FALLBACK_LOCALE]
}

export {
  toStripeLocale,
}
