import {
  CD_QA, AppServerUrl, LOCAL_APP, PROD, RC_PROD,
} from '@nia/reality/shared/studiohub/app-server-url-types'

import * as ConsoleUrls from '@nia/reality/shared/studiohub/console-server-url-types'

import {getConsoleServerUrl} from './console-server-url'

// Notably: no cd-prod for apps server. So we use rc-prod instead.
const getAppServerUrl = (): AppServerUrl => {
  const consoleServerUrl = getConsoleServerUrl()
  switch (consoleServerUrl) {
    case ConsoleUrls.PROD:
      return PROD
    case ConsoleUrls.RC_PROD:
    case ConsoleUrls.CD_PROD:
      return RC_PROD
    case ConsoleUrls.CD_QA:
      return CD_QA
    case ConsoleUrls.LOCAL_CONSOLE:
      return LOCAL_APP
    default:
      throw new Error(`Unknown console server URL for apps server mapping: ${consoleServerUrl}`)
  }
}

export {
  getAppServerUrl,
}
