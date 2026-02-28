// Copyright (c) 2023 Niantic, Inc.
// Original Author: Erik Murphy-Chutorian (mc@nianticlabs.com)
//
// Example Usage:
//   // Run with required ANGLE OpenGL translation.
//   bazel run apps/client/exploratory/native-browse:native-browse \
//     --config=angle -- https://threejs.org/examples/webgl_morphtargets_horse.html
import {URL} from 'url'

import {createDom} from '@nia/c8/dom/dom'
import {getStagingCookie} from '@nia/c8/dom/staging-access'
import {getDevCookie} from '@nia/c8/dom/dev-access'
import {installXrBindings} from '@nia/c8/xrapi/xrapi-bindings'

const global = globalThis as any

const {internalStoragePath} = global
const width = global.nativeWindowWidth || 800
const height = global.nativeWindowHeight || 600

// naeOpt is set in node-binding.cc, and is set for production builds.
if (!global.naeOpt) {
  console.log('NAE Quest running in Development Mode')  // eslint-disable-line no-console

  // Disable certificate validation for local development.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

const title = 'Native Browse from Node.js'

const naePublicApi = {
  openWindow: global.niaStartWebTask,
}

try {
// Get arguments from the command line.
  const url = global.urlToFetch
  if (!url) {
    throw new Error('Please provide a URL to load')
  }
  let cookie = ''
  const {environmentAccessCode} = global
  if (url.includes('.staging.8thwall.')) {
    if (!environmentAccessCode) {
      throw new Error('Please provide a passcode to load the 8th Wall staging URL')
    }
    cookie = await getStagingCookie(environmentAccessCode, url)
  } else if (url.includes('.dev.8thwall.')) {
    cookie = await getDevCookie(environmentAccessCode, url, internalStoragePath)
  }

  await createDom({
    width,
    height,
    title,
    url,
    cookie,
    internalStoragePath,
    context: {
      nativeWindow: global.nativeWindow,
      requestAnimationFrame: global.requestAnimationFrame,
      cancelAnimationFrame: global.cancelAnimationFrame,
      nae: naePublicApi,
      __naeOpt: global.naeOpt,
      __niaSystemLocale: global.nativeSystemLocale,
    },
    onBeforeNavigate: (window) => {
      installXrBindings(window)
    },
  })
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Failed to load:', err)

  const runfiles = process.env.RUNFILES_DIR

  const fallbackUrl = new URL(
    `file://${runfiles}/_main/c8/html-shell/quest/fallback-scene/index.html`
  )

  // TODO(christoph): Customize error message based on the error.

  await createDom({
    width,
    height,
    title,
    url: fallbackUrl.href,
    internalStoragePath,
    context: {
      nativeWindow: global.nativeWindow,
      requestAnimationFrame: global.requestAnimationFrame,
      cancelAnimationFrame: global.cancelAnimationFrame,
      nae: naePublicApi,
      __naeOpt: global.naeOpt,
    },
    onBeforeNavigate: (window) => {
      installXrBindings(window)
    },
  })
}

// NOTE(cindy): After this point we ignore unhandled errors, preventing the app from
// crashing on one-off issues.
process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('[native-browse] Uncaught exception:', err)
})

process.on('unhandledRejection', (reason, promise) => {
  // eslint-disable-next-line no-console
  console.error('[native-browse] Unhandled Rejection at:', promise, 'reason:', reason)
})
