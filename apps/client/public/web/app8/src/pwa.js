const registerPwaServiceWorker = (swurl) => {
  const registerServiceWorker = () => navigator.serviceWorker.register(swurl)

  // Register the service worker only after the window is loaded.
  const state = document.readyState
  if (state === 'interactive' || state === 'complete') {
    registerServiceWorker()
  } else {
    window.addEventListener('load', () => registerServiceWorker())
  }
}

const unregisterPwaServiceWorker = (swurl) => {
  navigator.serviceWorker.getRegistration(swurl).then((registration) => {
    if (registration) {
      registration.unregister()
    }
  })
}
/**
 * Camera access on web apps with "standalone" display mode are not supported on iOS
 * until version 13.4 and up. This will attempt to estimate the version number on the
 * running device.
 */
const shouldUseStandalonePwaDisplay = () => {
  const MAJOR_VERSION_INDEX = 1
  const MINOR_VERSION_INDEX = 2

  if (navigator.userAgent.includes('Safari') && navigator.vendor.includes('Apple')) {
    // Safari allows for standalone getUserMedia access in versions 13.1 and above.
    // This version of Safari only ships with iOS versions 13.4+.
    // Let's check if we're running that version of Safari.
    const versionResult = navigator.userAgent.match(/Version\/(\d+)\.(\d+)(\.(\d+))?\s+/)
    if (!versionResult || versionResult.length < 2) {
      // Couldn't detect a version number. Don't assume camera access is available.
      return false
    }

    // Correct any potentially undefined values.
    versionResult[MAJOR_VERSION_INDEX] = parseInt(versionResult[MAJOR_VERSION_INDEX], 10) || 0
    versionResult[MINOR_VERSION_INDEX] = parseInt(versionResult[MINOR_VERSION_INDEX], 10) || 0

    if (versionResult[MAJOR_VERSION_INDEX] < 13 ||
    (versionResult[MAJOR_VERSION_INDEX] === 13 && versionResult[MINOR_VERSION_INDEX] < 1)) {
      // This version is less than Safari 13.1.
      return false
    }
  }

  return true
}

const loadPwaResources = (base, hasPwa, distPrefix) => {
  if ('serviceWorker' in navigator) {
    // For connected domains like www.chickenprinces.net, we want the service worker to start at '/'
    // unless the connected domain is using the app suffix (like
    // www.chickenprincess.net/pipeline-tester). This distinctions is important for scoping rules
    // of the service worker which don't apply to other assets like bundle.js or manifest.json.
    //
    // When making changes here, please consider that all of these cases should all function well:
    //
    // ar.jini.com
    // ar.jini.com/jini
    // ar.jini.com/jini/
    // 8w.8thwall.app/jini
    // 8w.8thwall.app/jini/
    const isServedAtBase = window.location.pathname.startsWith(base) ||
      (base.length && window.location.pathname === base.substr(0, base.length - 1))
    // The logic here produces the following mappings:
    //
    // base      | pathname    | swbase
    // ''        | *           | 'xr-service-worker.js'
    // '/'       | *           | '/xr-service-worker.js'
    // '/jini/'  | '/'         | '/xr-service-worker.js'
    // '/jini/'  | '/a/b'      | '/xr-service-worker.js'
    // '/jini/'  | '/jini'     | '/jini/xr-service-worker.js'
    // '/jini/'  | '/jini/'    | '/jini/xr-service-worker.js'
    // '/jini/'  | '/jini/a/b' | '/jini/xr-service-worker.js'
    // '/jini/'  | '/jinicam/' | '/xr-service-worker.js'
    const swbase = isServedAtBase ? base : '/'
    const swurl = `${swbase}${distPrefix}xr-service-worker.js`

    if (hasPwa) {
      registerPwaServiceWorker(swurl)
    } else {
      unregisterPwaServiceWorker(swurl)
    }
  }

  if (hasPwa) {
    if (!shouldUseStandalonePwaDisplay()) {
      const link = document.getElementById('manifest8')
      if (link) {
        link.href = `${base}${distPrefix}manifest8-ios.json`
      } else {
        // eslint-disable-next-line no-console
        console.error('Manifest with id manifest8 not found.')
      }
    }
  }
}

module.exports = {
  registerPwaServiceWorker,
  unregisterPwaServiceWorker,
  shouldUseStandalonePwaDisplay,
  loadPwaResources,
}
