const devSiteKey = '<REMOVED_BEFORE_OPEN_SOURCING>'
const prodSiteKey = '<REMOVED_BEFORE_OPEN_SOURCING>'

const GOOGLE_MAPS_API_KEY = BuildIf.ALL_QA
  ? '<REMOVED_BEFORE_OPEN_SOURCING>'
  : '<REMOVED_BEFORE_OPEN_SOURCING>'

module.exports = {
  siteKey: BuildIf.ALL_QA ? devSiteKey : prodSiteKey,
  GOOGLE_MAPS_API_KEY,
}
