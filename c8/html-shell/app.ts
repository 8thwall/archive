// @rule(js_binary)
// @attr(target = "node")
// @attr(esnext = 1)
// @package(npm-rendering)
// @visibility(//c8/html-shell:__subpackages__)

// Copyright (c) 2023 Niantic, Inc.
// Original Author: Erik Murphy-Chutorian (mc@nianticlabs.com)

import {createDom, type HTMLCanvasElement} from '@nia/c8/dom/dom'
import {getStagingCookie} from '@nia/c8/dom/staging-access'
import {getDevCookie, decrypt} from '@nia/c8/dom/dev-access'
import {verifyCookieDomain} from '@nia/c8/html-shell/verify-cookie-domain'

const global = globalThis as any

const {internalStoragePath, naeBuildMode} = global
const width = global.nativeWindowWidth || 800
const height = global.nativeWindowHeight || 600

const title = 'Native Browse from Node.js'

const niaInputEventTargetSymbol = Symbol.for('niaInputEventTarget')
const niaSensorEventTargetSymbol = Symbol.for('niaSensorEventTarget')

// naeOpt is defined in node-binding.cc, and is set for production builds.
if (!global.naeOpt) {
  console.log('NAE running in Development Mode')  // eslint-disable-line no-console

  // Disable certificate validation for local development.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

// TODO(divya): uncomment this when we can pass bzl flags.
// const profile: boolean = !!process.env.PROFILE
const profile = false

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('[native-browse] Uncaught exception:', err)
})

process.on('unhandledRejection', (reason, promise) => {
  // eslint-disable-next-line no-console
  console.error('[native-browse] Unhandled Rejection at:', promise, 'reason:', reason)
})

// Get arguments from the command line.
const url = new URL(global.urlToFetch)
if (!url) {
  throw new Error('Please provide a URL to load')
}

let cookie = ''
const {environmentAccessCode, encryptedDevCookie} = global
if (encryptedDevCookie) {
  cookie = decrypt(encryptedDevCookie)
  cookie.split('; ').forEach((option) => {
    const [key, value] = option.split('=')
    if ((key && value) && key.toLowerCase() === 'domain') {
      verifyCookieDomain(value, url.hostname)
    }
  })
} else if (url.origin.endsWith('.staging.8thwall.app')) {
  cookie = await getStagingCookie(environmentAccessCode, url.href)
} else if (url.origin.endsWith('.dev.8thwall.app')) {
  cookie = await getDevCookie(environmentAccessCode, url.href, internalStoragePath)
}

// Map to track the number of event listeners.
// This is useful for enabling/disabling certain Native Android features.
const trackedEvents = new Map<string, number>()
trackedEvents.set('deviceorientation', 0)
trackedEvents.set('devicemotion', 0)

const createEventTargetProxy = (target: EventTarget): EventTarget => {
  if (!global.eventListenerUpdate) {
    // eslint-disable-next-line no-console
    console.warn('[app] No eventListenerUpdate function found on global object. ' +
      'Event listener tracking will not work.')
    return target
  }

  const originalAddEventListener = target.addEventListener
  const originalRemoveEventListener = target.removeEventListener
  const trackedEventKeys = Array.from(trackedEvents.keys())

  // eslint-disable-next-line func-names
  target.addEventListener = function (type: string, listener: any, options?: any) {
    if (trackedEventKeys.includes(type)) {
      const newEventCount = trackedEvents.get(type)! + 1
      trackedEvents.set(type, newEventCount)

      // If this is the first listener for this event type, notify the native side.
      if (newEventCount === 1) {
        global.eventListenerUpdate(type, true)
      }
    }
    return originalAddEventListener.call(this, type, listener, options)
  }

  // eslint-disable-next-line func-names
  target.removeEventListener = function (type: string, listener: any, options?: any) {
    if (trackedEventKeys.includes(type)) {
      const newEventCount = trackedEvents.get(type)! - 1
      trackedEvents.set(type, newEventCount)

      // If there are no more listeners for this event type, notify the native side.
      if (newEventCount === 0) {
        global.eventListenerUpdate(type, false)
      }
    }
    return originalRemoveEventListener.call(this, type, listener, options)
  }

  return target
}

// Apply the proxy to the global EventTarget prototype
createEventTargetProxy(EventTarget.prototype)

const dom = await createDom({
  width,
  height,
  title,
  url: url.href,
  cookie,
  internalStoragePath,
  naeBuildMode,
  devicePixelRatio: global.nativeDevicePixelRatio,
  context: {
    nativeWindow: global.nativeWindow,
    requestAnimationFrame: global.requestAnimationFrame,
    cancelAnimationFrame: global.cancelAnimationFrame,
    __niaNaeOpt: global.naeOpt,
    __niaSystemLocale: global.nativeSystemLocale,
    __niaScreenWidth: global.nativeScreenWidth,
    __niaScreenHeight: global.nativeScreenHeight,
    __niaUserAgent: global.nativeUserAgent,
    __niaVibrate: global.nativeVibrate,
  },
})
let window = dom.getCurrentWindow()
dom.onWindowChange((newWindow) => {
  window = newWindow
})

const installRequestPermissions = (target: typeof window) => {
  // These are considered "normal" permissions for Native Apps, so we don't need to ask for them.
  // https://developer.android.com/guide/topics/permissions/overview#normal
  Object.defineProperty(target.DeviceOrientationEvent, 'requestPermission', {
    value: async (absolute: boolean = false) => {
      // eslint-disable-next-line no-console
      console.log(`Requesting permission for DeviceOrientationEvent: {absolute: ${absolute}}`)
      return 'granted'
    },
  })

  Object.defineProperty(target.DeviceMotionEvent, 'requestPermission', {
    value: async () => {
      // eslint-disable-next-line no-console
      console.log('Requesting permission for DeviceMotionEvent')
      return 'granted'
    },
  })
}

installRequestPermissions(window)

let frameCount = 0
let lastSwapTime = performance.now()
let currentSwapTime = lastSwapTime

let eventTarget: EventTarget = null

let prevWindowWidth = window.innerWidth
let prevWindowHeight = window.innerHeight

// NOTE: On iOS, we're seeing weird Pink flashes and areas on the screen where data is not rendered.
// This is usually caused by having a UIView that is not fully covering the screen.
// To avoid this, we will clear the canvas when the window size changes.
// We're not using the 'resize' event because it won't be triggered between frames.
const checkIfNeedToClear = () => {
  if (prevWindowWidth !== window.innerWidth || prevWindowHeight !== window.innerHeight) {
    prevWindowWidth = window.innerWidth
    prevWindowHeight = window.innerHeight

    const canvas = window.document.querySelector(
      'canvas:not([data-splash-screen])'
    ) as HTMLCanvasElement

    if (canvas) {
      const gl = canvas.getContext('webgl2')
      if (gl) {
        const prevClearColor = gl.getParameter(gl.COLOR_CLEAR_VALUE)

        // Force the entire canvas to be cleared
        gl.viewport(0, 0, global.nativeScreenWidth, global.nativeScreenHeight)
        gl.clearColor(0, 0, 0, 0)

        // eslint-disable-next-line no-bitwise
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        // Restore the viewport and clear color to the original 'user app' values.
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.clearColor(...prevClearColor)
      }
    }
  }
}

const screenFrame = () => {
  // NOTE(akashmahesh): The data-splash-screen attribute is used to identify the canvas element
  // that is added by app8 to render the splash. This needs to be differentiated from the
  // canvas element created by the studio bundle for app rendering.
  const canvas =
    window.document.querySelector('canvas:not([data-splash-screen])') as HTMLCanvasElement
  if (canvas && canvas !== eventTarget) {
    // Set the input event target on the global object so that it can be accessed in the node
    // binding.
    eventTarget = canvas
    global[niaInputEventTargetSymbol] = eventTarget
    global[niaSensorEventTargetSymbol] = eventTarget
  }
  const gl = canvas?.getContext('webgl2')
  if (gl) {
    gl.eglSwapBuffers()

    checkIfNeedToClear()

    if (profile) currentSwapTime = performance.now()
  }

  window.requestAnimationFrame(screenFrame)

  if (profile) {
    if (frameCount > 0 && frameCount % 100 === 0) {
      // eslint-disable-next-line no-console
      console.log('Frame ', frameCount, ': fps ', 1000 / (currentSwapTime - lastSwapTime))
    }
    lastSwapTime = currentSwapTime
    frameCount++
  }
}

screenFrame()
