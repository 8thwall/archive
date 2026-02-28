const LOCALE_URL_PARAM_NAME = 'lang'
const LOCALE_COOKIE_NAME = '_locale'

// Locales supported by prod builds.
const SUPPORTED_PROD_LOCALE_OPTIONS = [
  {value: 'en-US', name: 'English'},
  {value: 'ja-JP', name: '日本語'},
  {value: 'fr-FR', name: 'Français'},
  {value: 'de-DE', name: 'Deutsch'},
  {value: 'es-MX', name: 'Español'},
]
// Locales supported by 8th Wall dev builds.
const SUPPORTED_DEV_LOCALE_OPTIONS = [
  ...SUPPORTED_PROD_LOCALE_OPTIONS,
]
const SUPPORTED_LOCALE_OPTIONS = process.env.NODE_ENV === 'production'
  ? SUPPORTED_PROD_LOCALE_OPTIONS : SUPPORTED_DEV_LOCALE_OPTIONS
type SupportedLocale = typeof SUPPORTED_LOCALE_OPTIONS[number]['value']

export {
  LOCALE_URL_PARAM_NAME,
  LOCALE_COOKIE_NAME,
  SUPPORTED_LOCALE_OPTIONS,
}

export type {
  SupportedLocale,
}
