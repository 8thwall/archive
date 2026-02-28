const COMMON_PREFIX = '8th Wall | '
const COMMON_SUFFIX = ' | 8th Wall'

const getPageTitleForAccountBrowse = account => (
  account.shortName === '8thwall'
    ? 'Project Library - Clone WebAR, AR, WebVR Sample Projects'
    : account.name
)

export {
  COMMON_PREFIX,
  COMMON_SUFFIX,
  getPageTitleForAccountBrowse,
}
