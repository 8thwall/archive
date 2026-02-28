// We do NOT have CD_PROD
const CD_QA = 'https://apps-cd.qa.8thwall.com'
// eslint-disable-next-line max-len
const LOCAL_APP = 'https://<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>.8thwall.com:<REMOVED_BEFORE_OPEN_SOURCING>'
const RC_PROD = 'https://apps-rc.8thwall.com'
const PROD = 'https://apps.8thwall.com'

type AppServerUrl = typeof CD_QA | typeof LOCAL_APP
  | typeof RC_PROD | typeof PROD

export {
  CD_QA,
  LOCAL_APP,
  RC_PROD,
  PROD,
}

export type {
  AppServerUrl,
}
