import {createBrowserUrl} from '../../../shared/studiohub/create-browser-url'
import {createSessionId} from '../debug-session-info'

const SIMULATOR_WINDOW_NAME = 'simulator-window'
const PREVIEW_TAB_NAME = 'preview-tab'

const openInWindow = (path: string, size?: { width: number, height: number }, name = '') => {
  const w = size?.width || 800
  const h = size?.height || 800
  const top = window.screenY + (window.innerHeight - h) / 2
  const left = window.screenX + (window.innerWidth - w) / 2
  const windowParams = `top=${top},left=${left},width=${w},height=${h}`
  return window.open(new URL(path, window.location.href), name, windowParams)
}

const openSimulatorWindow = (path: string, size?: { width: number, height: number }) => (
  openInWindow(path, size, SIMULATOR_WINDOW_NAME)
)

const openPreviewTab = (path: string) => {
  const consoleServerUrl = window.electron?.consoleServerUrl
  const previewUrl = Build8.PLATFORM_TARGET === 'desktop' && path.startsWith(consoleServerUrl)
    ? createBrowserUrl(path.replace(consoleServerUrl, ''))
    : path

  return window.open(previewUrl, PREVIEW_TAB_NAME)
}

const getPreviouslyOpenedSimulatorWindow = (): Window | undefined => window.open(
  '',
  SIMULATOR_WINDOW_NAME,
  ''
)

const getPreviouslyOpenedPreviewTab = (): Window | undefined => window.open(
  '',
  PREVIEW_TAB_NAME,
  ''
)

const getPathWithSession = (path: string) => `${path}?sessionId=${createSessionId()}`

export {
  openInWindow,
  openSimulatorWindow,
  openPreviewTab,
  getPreviouslyOpenedSimulatorWindow,
  getPreviouslyOpenedPreviewTab,
  getPathWithSession,
}
