import {session} from 'electron'
import type {Cookie} from 'electron/main'

import {getConsoleServerUrl} from '../console-server-url'

let devCookieToInject_: string | null = null

const isComCookie = (cookie: Cookie) => cookie.domain?.endsWith('.8thwall.com') ||
    cookie.domain?.endsWith('.8thwallcom.test')
const isAppCookie = (cookie: Cookie) => cookie.domain?.endsWith('.8thwall.app') ||
    cookie.domain?.endsWith('.8thwallapp.test')
// When running locally, https://apps.8thwall.com/xrweb?appKey= accepts a .com dev cookie
// When running in production, it accepts a .app dev cookie
// TODO(dat): verify with a prod build that we need to switch this by environment type
const USE_DEV_COOKIE_FROM_COM = true
const isTargetedCookieDomain = USE_DEV_COOKIE_FROM_COM ? isComCookie : isAppCookie

const replaceCookieValue = (
  cookies?: string, cookieKey?: string, updatedValue?: string | null
): string => {
  if (!cookieKey) {
    return cookies || ''
  }
  if (!cookies) {
    return `${cookieKey}=${updatedValue}`
  }

  const parsedCookie: Record<string, string> = {}
  cookies.split(';').forEach((cookie) => {
    if (!cookie) {
      return
    }
    const parts = cookie.split('=')
    parsedCookie[parts[0].trim()] = parts[1].trim()
  })
  if (updatedValue) {
    parsedCookie[cookieKey] = updatedValue
  } else if (cookieKey in parsedCookie) {
    delete parsedCookie[cookieKey]
  }
  return Object.entries(parsedCookie).map(([key, value]) => `${key}=${value}`).join(';')
}

const maybeInterceptAndReapplyDevCookie = () => {
  // Grab existing dev token from cookies for later injection
  session.defaultSession.cookies.get({}).then((cookies) => {
    // We only grab the dev cookie for com. Not the dev cookie for app.
    const devCookie = cookies.find(cookie => cookie.name === 'dev' &&
      isTargetedCookieDomain(cookie))
    if (devCookie) {
      devCookieToInject_ = devCookie.value
    }
  })

  // Intercept dev cookie changes, and update our stored values
  session.defaultSession.cookies.on('changed', (event, cookie, cause) => {
    if (cause !== 'explicit') {
      return
    }
    if (cookie.name !== 'dev') {
      return
    }
    if (isTargetedCookieDomain(cookie)) {
      devCookieToInject_ = cookie.value
    }
  })

  /* eslint-disable max-len */
  // NOTE(dat): I previously tried to use a custom scheme called `local-build`. When I call
  // cookies.set, it gets an error Reason::EXCLUDE_NONCOOKIEABLE_SCHEME.
  session.defaultSession.webRequest.onBeforeSendHeaders({
    urls: [
      // On QA, this can be <REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>.8thwall.com:<REMOVED_BEFORE_OPEN_SOURCING>/xrweb*
      // On Prod, it's apps.8thwall.com/xrweb*
      'https://*.<REMOVED_BEFORE_OPEN_SOURCING>.com:*/xrweb*',
      'https://<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>.com/v/*',
      // Need origin and referer to these 3rd party api calls
      'https://*.mapbox.com/*',
      'https://<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>.com/*',
      'https://<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>.com/*',
      'https://<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>.com/*',
    ],
  }, (details, callback) => {
    if (details.url.startsWith('https://apps.8thwall.com/v/') ||
      details.url.startsWith('https://apps.8thwall.com/xrweb') ||
      details.url.startsWith('https://<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>.8thwall.com:<REMOVED_BEFORE_OPEN_SOURCING>/xrweb')
    ) {
      // Inject the cookie into our xrweb request to avoid the complaint popup.
      const existingCookie = details.requestHeaders.Cookie || ''
      details.requestHeaders.Cookie = replaceCookieValue(existingCookie, 'dev',
        devCookieToInject_)
      callback({requestHeaders: details.requestHeaders})
    }

    if (details.url.startsWith('https://api.mapbox.com') ||
      details.url.startsWith('https://<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>.com') ||
      details.url.startsWith('https://<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>.com') ||
      details.url.startsWith('https://<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>.com')
    ) {
      // NOTE(dat): We need both Origin and Referer override for Mapbox.
      details.requestHeaders.Origin = getConsoleServerUrl()
      details.requestHeaders.Referer = getConsoleServerUrl()
      callback({cancel: false, requestHeaders: details.requestHeaders})
    }
  })
  /* eslint-enable max-len */

  // For these publicly available cdn urls, inject CORS allowed headers on response.
  // We need to inject on the http version so http://localhost can load them and be redirected
  // to the https version. The https version already has these CORS headers via CloudFront.

  // TODO(dat): Remove this once we have updated xr engine load-models for face and hands to force
  // https instead of //cdn.8thwall.com/...
  session.defaultSession.webRequest.onHeadersReceived({
    urls: [
      'http://cdn.8thwall.com/web/resources/*',
    ],
  }, (details, callback) => {
    if (!details?.responseHeaders) {
      return
    }
    details.responseHeaders['access-control-allow-origin'] = ['*']
    details.responseHeaders['access-control-allow-methods'] = ['GET', 'HEAD']
    details.responseHeaders['access-control-allow-headers'] = ['Content-Type', 'Authorization']
    callback({responseHeaders: details.responseHeaders})
  })
}

export {
  maybeInterceptAndReapplyDevCookie,
}
