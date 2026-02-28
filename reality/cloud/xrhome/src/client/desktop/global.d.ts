import type {
  ELECTRON_API_KEY, ElectronApi,
} from '../../shared/studiohub/electron-api'

declare global {
  interface Window {
    [ELECTRON_API_KEY]: ElectronApi
  }
}
