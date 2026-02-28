const CD_PROD = 'https://www-cd.8thwall.com'
const CD_QA = 'https://www-cd.qa.8thwall.com'
const LOCAL_CONSOLE = 'https://console.local.8thwall.com:3001'
const RC_PROD = 'https://www-rc.8thwall.com'
const PROD = 'https://www.8thwall.com'

type ConsoleServerUrl = typeof CD_PROD | typeof CD_QA | typeof LOCAL_CONSOLE
  | typeof RC_PROD | typeof PROD

export {
  CD_PROD,
  CD_QA,
  LOCAL_CONSOLE,
  RC_PROD,
  PROD,
}

export type {
  ConsoleServerUrl,
}
