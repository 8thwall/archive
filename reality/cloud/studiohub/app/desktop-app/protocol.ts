import {protocol, CustomScheme, net, session, BrowserWindow, shell} from 'electron'
import fs from 'fs'
import mime from 'mime-types'
import path from 'path'
import {BROWSER_PROTOCOL} from '@nia/reality/shared/studiohub/create-browser-url'
import {ELECTRON_PROTOCOL} from '@nia/reality/shared/studiohub/create-electron-url'

import {withErrorHandlingResponse} from '../../errors'
import {getConsoleServerUrl} from '../console-server-url'

// NOTE(cindyhu): /v1/repos is called in g8 worker to clone repo. libgit2 does not support
// custom protocol, so we need to modify headers to support fake https server redirect
const FAKE_HTTPS_SERVER_FILTER = {
  urls: ['https://desktop-server/*'],
}

const DESKTOP_SCHEME: CustomScheme = {
  scheme: 'desktop',
  privileges: {
    secure: true,
    standard: true,
    supportFetchAPI: true,
  },
}

const registerDesktopAppHandler = (distRoot: string) => {
  protocol.handle('desktop', withErrorHandlingResponse(async (request) => {
    const {host, pathname, search} = new URL(request.url)
    if (host === 'dist') {
      const filePath = path.join(distRoot, pathname)
      const data = fs.createReadStream(filePath)
      const mimeType = mime.lookup(filePath) || 'application/octet-stream'
      return new Response(data, {
        headers: {'Content-Type': mimeType},
      })
    } else if (host === 'server') {
      return net.fetch(`${getConsoleServerUrl()}${pathname}${search}`, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        duplex: 'half',
      })
    }
    return new Response('Not found', {status: 404})
  }))
}

const maybeUpdateOnBeforeRequest = () => {
  session.defaultSession.webRequest.onBeforeRequest(FAKE_HTTPS_SERVER_FILTER, (
    details, callback
  ) => {
    const url = new URL(details.url)
    const {pathname, search} = url
    callback({
      redirectURL: `desktop://server${pathname}${search}`,
    })
  })
}

const registerWindowOpenHandler = (win: BrowserWindow) => {
  win.webContents.setWindowOpenHandler(({url}) => {
    const parsed = new URL(url)
    if (parsed.protocol === BROWSER_PROTOCOL) {
      const redirectUrl = new URL(url.replace(`${BROWSER_PROTOCOL}//`, getConsoleServerUrl()))
      shell.openExternal(redirectUrl.toString())
      return {action: 'deny'}
    }
    if (parsed.protocol === ELECTRON_PROTOCOL) {
      const redirectUrl = new URL(url.replace(`${ELECTRON_PROTOCOL}//`, 'https://'))
      // Create a new BrowserWindow
      const newWindow = new BrowserWindow({
        width: 1200,
        height: 800,
      })

      newWindow.loadURL(redirectUrl.toString())
      return {action: 'deny'}
    }

    // NOTE(johnny): Open all 'https://' urls in external browser
    if (parsed.protocol === 'https:') {
      shell.openExternal(url)
      return {action: 'deny'}
    }

    return {action: 'allow'}
  })
}

export {
  DESKTOP_SCHEME,
  registerDesktopAppHandler,
  maybeUpdateOnBeforeRequest,
  registerWindowOpenHandler,
}
