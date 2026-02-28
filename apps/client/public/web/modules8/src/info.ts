import type {ModuleRuntimeInfo} from './shared/module/module-runtime'

const locateAppKey = () => {
  const src = document.querySelector('[data-xrweb-src]')?.getAttribute('data-xrweb-src') ||
              document.querySelector('script[src*=".8thwall.com/xrweb"]')?.getAttribute('src')
  if (!src) {
    throw new Error('[Modules8] Missing 8th Wall app key')
  }
  return new URL(src, window.location.href).searchParams.get('appKey')
}

const loadRuntimeInfo = (): ModuleRuntimeInfo => {
  const dependencyMeta = document.querySelector('meta[name="8thwall:dependencies"]')
  if (!dependencyMeta) {
    throw new Error('[Modules8] Missing modules meta tag.')
  }
  dependencyMeta.parentNode.removeChild(dependencyMeta)
  const base64Data = dependencyMeta.getAttribute('content')
  const byteString = atob(base64Data)
  // NOTE(christoph): This is needed to handle non-ascii characters
  const byteArray = Uint8Array.from(byteString, e => e.charCodeAt(0))
  const jsonData = new TextDecoder().decode(byteArray)
  const info: ModuleRuntimeInfo = JSON.parse(jsonData)
  if (info.appKey !== locateAppKey()) {
    throw new Error('[Modules8] App key mismatch.')
  }
  return info
}

export {
  loadRuntimeInfo,
}
