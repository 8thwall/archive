// NOTE (Brandon): Maybe place the list of ISO codes in a constants folder under /billing?
// (Brandon): Currency ISO codes below are currencies currently being supported by Stripe per:
// https://stripe.com/docs/currencies?presentment-currency=US

const ZERO_DECIMAL_CURRENCY_ISO_CODES =
  [
    'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga',
    'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf',
  ] as const
const DECIMAL_CURRENCY_ISO_CODES =
  [
    'aed', 'afn', 'all', 'amd', 'ang', 'aoa', 'ars', 'aud', 'awg', 'azn', 'bam', 'bbd',
    'bdt', 'bgn', 'bmd', 'bnd', 'bob', 'brl', 'bsd', 'bwp', 'byn', 'bzd', 'cad', 'cdf',
    'chf', 'cny', 'cop', 'crc', 'cve', 'czk', 'dkk', 'dop', 'dzd', 'egp', 'etb', 'eur',
    'fjd', 'fkp', 'gbp', 'gel', 'gip', 'gmd', 'gtq', 'gyd', 'hkd', 'hnl', 'hrk', 'htg',
    'huf', 'idr', 'ils', 'inr', 'isk', 'jmd', 'kes', 'kgs', 'khr', 'kyd', 'kzt', 'lak',
    'lbp', 'lkr', 'lrd', 'lsl', 'mad', 'mdl', 'mkd', 'mmk', 'mnt', 'mop', 'mro', 'mur',
    'mvr', 'mwk', 'mxn', 'myr', 'mzn', 'nad', 'ngn', 'nio', 'nok', 'npr', 'nzd', 'pab',
    'pen', 'pgk', 'php', 'pkr', 'pln', 'qar', 'ron', 'rsd', 'rub', 'sar', 'sbd', 'scr',
    'sek', 'sgd', 'shp', 'sll', 'sos', 'srd', 'std', 'szl', 'thb', 'tjs', 'top', 'try',
    'ttd', 'twd', 'tzs', 'uah', 'usd', 'uyu', 'uzs', 'wst', 'xcd', 'yer', 'zar', 'zmw',
  ] as const

const ALL_CURRENCY_ISO_CODES = [...ZERO_DECIMAL_CURRENCY_ISO_CODES, ...DECIMAL_CURRENCY_ISO_CODES]
type CurrencyCode = typeof ALL_CURRENCY_ISO_CODES[number]

const INPUT_OUTPUT_RATIO = {'month:year': 12 / 1, 'year:month': 1 / 12}

const VALID_BILLING_INTERVALS = ['month', 'year'] as const

const correctAmount = (amount: number, currencyType: CurrencyCode) => {
  // special case for ugandan shilling ('ugx')
  if (currencyType === 'ugx') {
    return (amount / 100)
  }
  if (ZERO_DECIMAL_CURRENCY_ISO_CODES.some(code => code === currencyType)) {
    return amount
  } else {
    return (amount / 100)
  }
}

type FormatToCurrencyOptions = {
  currency?: string
  decimalPlaces?: number
}

const isCurrencyCode = (currency: any): currency is CurrencyCode => (
  ALL_CURRENCY_ISO_CODES.includes(currency)
)

// TODO(wayne): Check again to see if we want to allow num to be a whole number only
const formatToCurrency = (num: number, options: FormatToCurrencyOptions = {}) => {
  const {currency = 'usd', decimalPlaces = 2} = options

  // eslint-disable-next-line
  if (isNaN(num)) {
    throw new Error(`Input:${num} must be a number.`)
  }

  if (!isCurrencyCode(currency)) {
    throw new Error(`Currency: ${currency} is not supported.`)
  }

  const formatter = new Intl.NumberFormat(
    'en-US',
    {
      style: 'currency',
      currencyDisplay: 'narrowSymbol',
      currency,
      minimumFractionDigits:
        ZERO_DECIMAL_CURRENCY_ISO_CODES.some(code => code === currency) ? 0 : decimalPlaces,
      maximumFractionDigits:
        ZERO_DECIMAL_CURRENCY_ISO_CODES.some(code => code === currency) ? 0 : decimalPlaces,
    }
  )
  return formatter.format(correctAmount(num, currency))
}

const formatByInterval = (
  amount: number,
  inputInterval: 'month' | 'year',
  outputInterval: 'month' | 'year',
  currency: CurrencyCode,
  decimalPlaces?: number
) => {
  // eslint-disable-next-line
  if (isNaN(amount)) {
    throw new Error(`Input:${amount} must be a number.`)
  }
  if (!ALL_CURRENCY_ISO_CODES.includes(currency)) {
    throw new Error(`Currency: ${currency} is not supported.`)
  }
  if (!VALID_BILLING_INTERVALS.includes(inputInterval)) {
    throw new Error(`Intervals: ${inputInterval} not supported`)
  }
  if (!VALID_BILLING_INTERVALS.includes(outputInterval)) {
    throw new Error(`Intervals: ${outputInterval} not supported`)
  }

  const ratio = INPUT_OUTPUT_RATIO[`${inputInterval}:${outputInterval}`] ?? 1

  return formatToCurrency(
    Math.round(amount * ratio), {currency, decimalPlaces}
  )
}

export {
  correctAmount,
  formatToCurrency,
  formatByInterval,
  ZERO_DECIMAL_CURRENCY_ISO_CODES,
  DECIMAL_CURRENCY_ISO_CODES,
  ALL_CURRENCY_ISO_CODES,
  VALID_BILLING_INTERVALS,
}

export type {
  CurrencyCode,
}
