import * as ecs from '@8thwall/ecs'

const isMobile = (): boolean => {
  const ua = navigator.userAgent
  return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(ua)
}

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent)

const isNAE = () => !!(window as any).__nia

const setStatusBarColor = (statusBarColor: string): void => {
  // 1) For Android Chrome & modern iOS Safari:
  let meta = document.getElementById('theme-color-meta') as HTMLMetaElement
  if (!meta) {
    meta = document.createElement('meta') as HTMLMetaElement
    meta.name = 'theme-color'
    meta.id = 'theme-color-meta'
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', statusBarColor)

  // NOTE(paris): This helps fix the issue on Tauri where we are not fullscren. But needs more
  // investigation.
  // 2) Set viewport meta tag for iOS full screen support
  let viewportMeta = document.getElementById('viewport-meta') as HTMLMetaElement
  if (!viewportMeta) {
    viewportMeta = document.createElement('meta') as HTMLMetaElement
    viewportMeta.name = 'viewport'
    viewportMeta.id = 'viewport-meta'
    document.head.appendChild(viewportMeta)
  }
  viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover')

  // 2) Prevent scrolling
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'
}

const promptForMobilePermissions = async (): Promise<boolean> => {
  try {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      const state = await (DeviceOrientationEvent as any).requestPermission()
      if (state === 'granted') {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[utils@promptForMobilePermissions] Error', error)
    return false
  }
}

const getHorizontalLimitsAtZ =
// @ts-ignore
  (camera, cameraZ: number, itemZ: number): {minX: number, maxX: number } => {
    if (!camera || camera.type !== 'PerspectiveCamera') {
      return {minX: -4, maxX: 4}
    }

    // Ensure z is a positive distance from the camera
    const distance = Math.abs(itemZ - cameraZ)

    // Convert FOV from degrees to radians
    // Vertical FOV in radians
    const vFOV = (window as any).THREE.MathUtils.degToRad(camera.fov)

    // Calculate height of view at the given depth
    const height = 2 * Math.tan(vFOV / 2) * distance

    // Width is just height * aspect ratio
    const width = height * camera.aspect

    // Return min/max X values (centered around the camera)
    const minX = -width / 2
    const maxX = width / 2

    return {minX, maxX}
  }

const vibrate = (pattern: VibratePattern) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}

const HIGH_SCORE_KEY = 'catch-the-stack-high-score'

const getHighScore = () => Number(localStorage.getItem(HIGH_SCORE_KEY) || 0)

const saveHighScore = (score: number) => {
  const prevHighScore = getHighScore()
  if (score > prevHighScore) {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString())
  }
}

const getSafeAreaInsets = () => {
  const div = document.createElement('div')
  div.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    z-index: -1;
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  `
  document.body.appendChild(div)
  const style = getComputedStyle(div)
  const insets = {
    top: parseFloat(style.paddingTop) || 0,
    bottom: parseFloat(style.paddingBottom) || 0,
    left: parseFloat(style.paddingLeft) || 0,
    right: parseFloat(style.paddingRight) || 0,
  }
  document.body.removeChild(div)
  return insets
}

export {
  isMobile,
  isNAE,
  isIOS,
  setStatusBarColor,
  promptForMobilePermissions,
  getHorizontalLimitsAtZ,
  getSafeAreaInsets,
  vibrate,
  getHighScore,
  saveHighScore,
}
