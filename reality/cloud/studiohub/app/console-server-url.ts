import {
  CD_PROD, CD_QA, ConsoleServerUrl, LOCAL_CONSOLE, PROD, RC_PROD,
} from '@nia/reality/shared/studiohub/console-server-url-types'

import {BrowserWindow} from 'electron'

import {getPreference, setPreference} from '../local-preferences'

const CONSOLE_SERVER_URL_OPTIONS: ConsoleServerUrl[] = (() => {
  switch (process.env.DEPLOY_STAGE) {
    case 'prod':
      return [PROD]
    case 'rc-prod':
      return [RC_PROD, RC_PROD, CD_PROD]
    case 'cd-prod':
      return [CD_PROD, PROD, RC_PROD]
    case 'cd-qa':
      return [CD_QA]
    case 'dev':
      return [LOCAL_CONSOLE, CD_QA]
    default:
      throw new Error(`Unknown DEPLOY_STAGE: ${process.env.DEPLOY_STAGE}`)
  }
})()

const getConsoleServerUrl = (): ConsoleServerUrl => {
  if (CONSOLE_SERVER_URL_OPTIONS.length === 1) {
    return CONSOLE_SERVER_URL_OPTIONS[0]
  }
  if (process.env.CURRENT_CONSOLE_SERVER_URL) {
    return process.env.CURRENT_CONSOLE_SERVER_URL as ConsoleServerUrl
  }
  const localUrl = getPreference('consoleServerUrl') as ConsoleServerUrl
  if (localUrl && CONSOLE_SERVER_URL_OPTIONS.includes(localUrl)) {
    process.env.CURRENT_CONSOLE_SERVER_URL = localUrl
    return localUrl
  }
  const [defaultUrl] = CONSOLE_SERVER_URL_OPTIONS
  process.env.CURRENT_CONSOLE_SERVER_URL = defaultUrl
  return defaultUrl
}

const setConsoleServerUrl = (url: ConsoleServerUrl) => {
  setPreference('consoleServerUrl', url)
  process.env.CURRENT_CONSOLE_SERVER_URL = url

  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.reload()
  })
}

export {
  CONSOLE_SERVER_URL_OPTIONS,
  getConsoleServerUrl,
  setConsoleServerUrl,
}
