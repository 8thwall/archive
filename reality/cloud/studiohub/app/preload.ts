// @rule(js_binary)
// @package(npm-studiohub)
// @attr(esnext = 1)
// @attr(externals = "electron")
import {contextBridge, ipcRenderer} from 'electron'
import {ELECTRON_API_KEY, type ElectronApi} from '@nia/reality/shared/studiohub/electron-api'

import {createFileWatchApi} from './file-watch/api'
import {STUDIO_HUB_PROTOCOL} from './studiohub-protocol'
import type {ConsoleServerUrl} from '../../../shared/studiohub/console-server-url-types'

const electronApi: ElectronApi = {
  consoleServerUrl: process.env.CURRENT_CONSOLE_SERVER_URL as ConsoleServerUrl,
  os: process.platform === 'darwin' ? 'mac' : 'other',
  onExternalNavigate: (callback) => {
    const listener = (_event: any, pathAndQuery: string) => {
      callback(pathAndQuery)
    }
    ipcRenderer.on('navigate-to-path', listener)

    return () => {
      ipcRenderer.removeListener('navigate-to-path', listener)
    }
  },
  fileWatch: createFileWatchApi(),
  studiohubProtocol: STUDIO_HUB_PROTOCOL,
  minimizeWindow: () => { ipcRenderer.send('minimize-window') },
  maximizeWindow: () => { ipcRenderer.send('maximize-window') },
  closeWindow: () => { ipcRenderer.send('close-window') },
}
contextBridge.exposeInMainWorld(ELECTRON_API_KEY, electronApi)
