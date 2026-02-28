const {createGatewayProvider} = require('./gateway')
const {localStorageRemoveItem, localStorageGetItem, localStorageSetItem} = require('./localstorage')
const {loadPwaResources} = require('./pwa')
const {showSplashScreen} = require('./splash-screen')
const {showNaeLoadScreen} = require('./nae-load-screen')

const loadJsPromise = url => new Promise((resolve, reject) => {
  const script = document.createElement('script')
  script.async = true
  script.crossOrigin = 'use-credentials'
  script.onload = resolve
  script.onError = reject
  script.src = url
  document.head.appendChild(script)
})

const addDeferredEventListeners = (events) => {
  const deferredEvents = []
  const deferEvent = (e) => {
    e.preventDefault()
    deferredEvents.push(e)
  }
  events.forEach(event => window.addEventListener(event, deferEvent))

  const dispatchDeferredEvents = () => {
    // Remove event listeners before dispatching to prevent deferring each event twice.
    events.forEach(event => window.removeEventListener(event, deferEvent))

    deferredEvents.forEach(event => window.dispatchEvent(event))
  }

  return dispatchDeferredEvents
}

const app8 = (
  bodyHtml, splashType, commitId = null, hasPwa = false, base = '', distPrefix = ''
) => {
  // Remove this script from the window. Its work here is done.
  window.app8 = undefined

  const useQuickSplashScreen = commitId && localStorageGetItem('8w-build-id') === commitId
  // Clear localstorage so it can only be used once for the hot reload refresh
  localStorageRemoveItem('8w-build-id')

  loadPwaResources(base, hasPwa, distPrefix)

  const bundleUrl = `${base}${distPrefix}bundle.js`
  const isNae = !!window.__nia

  // If splashType is 'none', immediately load the user's app code and then their html.
  if (splashType === 'none') {
    const loadingSpinner = isNae ? showNaeLoadScreen(false) : null
    loadJsPromise(bundleUrl).then(() => {
      loadingSpinner?.cleanup()
      document.body.insertAdjacentHTML('beforeend', bodyHtml)
    })
    return
  }

  // Certain events that applications can listen to may be triggered during the splash screen,
  // rendering applicaiton-level listeners useless. Let's defer these events until the applicaiton
  // code has fully loaded.
  const dispatchDeferredEvents = addDeferredEventListeners(['beforeinstallprompt'])

  if (useQuickSplashScreen) {
    setTimeout(() => {
      loadJsPromise(bundleUrl).then(() => {
        document.body.insertAdjacentHTML('beforeend', bodyHtml)
        dispatchDeferredEvents()
      })
    }, 30)
    return
  }

  const splashScreen = isNae ? showNaeLoadScreen(true) : showSplashScreen()

  // Wait for two seconds, and then load the users's bundle.js. After the bundle has loaded,
  // add their body elements and clean up this script.
  setTimeout(() => loadJsPromise(bundleUrl).then(() => {
    Object.values(document.body.getElementsByTagName('script')).forEach(e => e.remove())

    splashScreen.fadeOut()

    // Add the user's body dom to html.
    document.body.insertAdjacentHTML('beforeend', bodyHtml)
    dispatchDeferredEvents()
  }), 2000)
}

window.app8 = app8

const FEATURED_PARAM = 'f'
const SIGNED_PARAM = 'signed'

const SIGNED_KEY_PREFIX = '8w.signed-token/'
const FEATURED_KEY_PREFIX = '8w.featured-flag/'

const xrweb8 = (xrwebUrlString) => {
  // NOTE(lreyna): xrwebUrlString may be a relative path, we need to convert it to an absolute URL
  // If it's already an absolute URL, the URL constructor will leave it as is.
  const finalXrwebUrl = new URL(xrwebUrlString, window.location.href)

  const appKey = finalXrwebUrl.searchParams.get('appKey')

  // Scope local storage keys by appkey
  const signedKey = SIGNED_KEY_PREFIX + appKey
  const featuredKey = FEATURED_KEY_PREFIX + appKey

  const params = new URLSearchParams(window.location.search)

  // This is present as ?f=1 if the view is from a featured "try it out" link.
  const featuredFlagFromUrl = params.get(FEATURED_PARAM)

  let featuredFlag
  if (featuredFlagFromUrl) {
    featuredFlag = featuredFlagFromUrl
    localStorageSetItem(featuredKey, featuredFlag)
  } else {
    featuredFlag = localStorageGetItem(featuredKey)
  }

  // This is present if the app has a completed license and needs an authorization token
  // to load xrweb.
  const tokenFromUrl = params.get(SIGNED_PARAM)

  let signedToken
  if (tokenFromUrl) {
    signedToken = tokenFromUrl
    // We store the last used key in local storage to handle refreshing the page
    localStorageSetItem(signedKey, signedToken)
  } else {
    signedToken = localStorageGetItem(signedKey)
  }

  // Clear the parameters so that users don't see it in their url
  const paramsToClear = [FEATURED_PARAM, SIGNED_PARAM]
  if (paramsToClear.some(p => params.has(p))) {
    const replacedUrl = new URL(window.location.href)
    paramsToClear.forEach(p => replacedUrl.searchParams.delete(p))
    window.history.replaceState(null, null, replacedUrl.toString())
  }

  if (featuredFlag) {
    finalXrwebUrl.searchParams.set('f', featuredFlag)
  }

  if (signedToken) {
    finalXrwebUrl.searchParams.set('signed', signedToken)
  }

  loadJsPromise(finalXrwebUrl.toString())
}

const xrwebSrc = document.currentScript.getAttribute('data-xrweb-src')
const loadXr = () => {
  xrweb8(xrwebSrc)

  // Remove loadXr from window so it can't be called again.
  window.loadXr8 = null
}

window._app8 = {
  gateway: createGatewayProvider(),
}

window.loadXr8 = loadXr

// Don't load xrweb immediately if xrweb is set to deferred.
if (!document.currentScript.getAttribute('data-xrweb-defer')) {
  loadXr()
}
