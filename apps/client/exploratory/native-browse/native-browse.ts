// Copyright (c) 2023 Niantic, Inc.
// Original Author: Erik Murphy-Chutorian (mc@nianticlabs.com)
//
// Example Usage:
//   // Run with required ANGLE OpenGL translation.
//   bazel run apps/client/exploratory/native-browse:native-browse \
//     --config=angle -- https://threejs.org/examples/webgl_morphtargets_horse.html

// @inliner-off

/* eslint-disable import/no-unresolved */

import fs from 'fs'
import {homedir} from 'os'
import {join} from 'path'

import {glfw, Document as GlfwWindow} from '@nia/third_party/glfw-raub/glfw-raub'
import {createDom, type HTMLCanvasElement, type NodeList} from '@nia/c8/dom/dom'
import {getStagingCookie} from '@nia/c8/dom/staging-access'
import {getDevCookie} from '@nia/c8/dom/dev-access'
import {installXrApi} from '@nia/c8/xrapi/xrapi-install'
import {createEmulatedXrApi} from '@nia/c8/xrapi/xrapi-emulated'
import {createInputHandler} from './input-handler'

/* eslint-enable import/no-unresolved */

// TODO(lreyna): modify this when we can pass bzl flags.
// The following boolean flags will be true if the env var exists at all, regardless of value.
const USE_EMULATED_XRAPI: boolean = !!process.env.NATIVE_BROWSE_EMULATED_XRAPI
const PROFILE_MODE: boolean = !!process.env.NATIVE_BROWSE_PROFILE

const width = 800
const height = 600
const title = 'THREE-ANGLE from Node.js'
const internalStoragePath = join(homedir(), 'Library', 'Caches', 'Native-Browse')

// Write a metadata.json file to the internal storage path.
// Should match the format used by `c8/html-shell/android/android/android-shell-main.cc`
const metadata = {
  commitId: '',  // TODO(lreyna): parse commit id from url
  naeBuildMode: 'hot-reload',
}
const metadataPath = join(internalStoragePath, 'metadata.json')

const metadataString = JSON.stringify(metadata)
fs.mkdirSync(internalStoragePath, {recursive: true})
fs.writeFileSync(metadataPath, metadataString)

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('[native-browse] Uncaught exception:', err)
})

process.on('unhandledRejection', (reason, promise) => {
  // eslint-disable-next-line no-console
  console.error('[native-browse] Unhandled Rejection at:', promise, 'reason:', reason)
})

// Get arguments from the command line.
const url = process.argv[2]
if (!url) {
  throw new Error('Please provide a URL to load')
}

if (!glfw.init()) {
  throw new Error('Could not initialize GLFW')
}

const w1 = new GlfwWindow({
  width,
  height,
  title,
  vsync: true,
  noApi: true,
})

const {requestAnimationFrame: glfwRequestAnimationFrame} = w1

type FrameRequestCallback = (time: number) => void
const animationFrameCallbacks = new Map<number, FrameRequestCallback>()
let animationFrameId = 0

const customRequestAnimationFrame = (callback: FrameRequestCallback): number => {
  const id = ++animationFrameId
  animationFrameCallbacks.set(id, callback)
  return id
}

const customCancelAnimationFrame = (id: number): void => {
  animationFrameCallbacks.delete(id)
}

let cookie = ''
if (url.includes('.staging.8thwall.')) {
  cookie = await getStagingCookie(process.argv[3], url)
} else if (url.includes('.dev.8thwall.')) {
  cookie = await getDevCookie(process.argv[3], url, internalStoragePath)
}

const currentMonitor = w1.getCurrentMonitor()
if (!currentMonitor) {
  throw new Error('[native-browse] No current monitor found')
}

const dom = await createDom({
  width,
  height,
  title,
  url,
  cookie,
  internalStoragePath,
  context: {
    nativeWindow: w1.getNativeWindow(),
    requestAnimationFrame: customRequestAnimationFrame,
    cancelAnimationFrame: customCancelAnimationFrame,
    __niaScreenWidth: currentMonitor.width,
    __niaScreenHeight: currentMonitor.height,
  },
  onBeforeNavigate: (window) => {
    if (USE_EMULATED_XRAPI) {
      installXrApi(window, createEmulatedXrApi(window))
    }
  },
})

let window = dom.getCurrentWindow()
const inputHandler = createInputHandler()
inputHandler.attach(w1, window)
dom.onWindowChange((newWindow) => {
  window = newWindow
  inputHandler.updateWindow(newWindow)
})

let frameCount = 0
let lastSwapTime = performance.now()
let currentSwapTime = lastSwapTime

const desiredFps = 120
const desiredFrameDuration = 1000 / desiredFps  // ms
let lastFrameTime = performance.now()

const screenFrame = () => {
  if (w1.shouldClose) {
    w1.destroy()
    glfw.terminate()
    return
  }

  glfwRequestAnimationFrame(screenFrame)

  const now = performance.now()
  const deltaTime = now - lastFrameTime

  if (deltaTime < desiredFrameDuration) {
    return
  }

  lastFrameTime = now

  // avoid infinite loop and playthrough all the remaining callbacks for this frame.
  const callbacks = Array.from(animationFrameCallbacks.values())
  animationFrameCallbacks.clear()
  for (const callback of callbacks) {
    callback(now)
  }

  // Get the first canvas, that is can be used for webgl rendering.
  // The app may have already created other canvases with a 2d context.
  const canvases = window.document.querySelectorAll('canvas') as NodeList<HTMLCanvasElement>
  for (const canvas of canvases) {
    const gl = canvas?.getContext('webgl2')
    if (gl) {
      gl.eglSwapBuffers()
      if (PROFILE_MODE) {
        currentSwapTime = performance.now()
      }
      break
    }
  }

  if (PROFILE_MODE) {
    if (frameCount > 0 && frameCount % 100 === 0) {
      // eslint-disable-next-line no-console
      console.log('Frame ', frameCount, ': fps ', 1000 / (currentSwapTime - lastSwapTime))
    }
    lastSwapTime = currentSwapTime
    frameCount++
  }
}

screenFrame()
