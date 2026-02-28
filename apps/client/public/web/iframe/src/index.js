/* Copyright (c) 2020 8th Wall, Inc. All Rights Reserved */
// Original Author: Tony Tomarchio (tony@8thwall.com)

import {requestMotionPermissions, showPermissionPrompt} from './permissions'

const createXrIframeSession = (iframeId) => {
  let element = (typeof iframeId === 'string')
    ? document.getElementById(iframeId)
    : iframeId

  const getElement = () => {
    if (!element) {
      element = document.getElementById(iframeId)
    }
    return element
  }

  const deviceOrientationHandler = (event) => {
    const iframeElement = getElement()
    if (!iframeElement) {
      // eslint-disable-next-line no-console
      console.error('iframe not found', iframeId)
      return
    }
    iframeElement.contentWindow.postMessage(
      {
        deviceOrientation8w: {
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma,
        },
      },
      '*'
    )
  }

  const deviceMotionHandler = (event) => {
    const iframeElement = getElement()
    if (!iframeElement) {
      // eslint-disable-next-line no-console
      console.error('iframe not found', iframeId)
      return
    }

    const motionData = {}

    if (event.acceleration) {
      motionData.acceleration = {
        x: event.acceleration.x,
        y: event.acceleration.y,
        z: event.acceleration.z,
      }
    }
    if (event.rotationRate) {
      motionData.rotationRate = {
        alpha: event.rotationRate.alpha,
        beta: event.rotationRate.beta,
        gamma: event.rotationRate.gamma,
      }
    }

    if (event.accelerationIncludingGravity) {
      motionData.accelerationIncludingGravity = {
        x: event.accelerationIncludingGravity.x,
        y: event.accelerationIncludingGravity.y,
        z: event.accelerationIncludingGravity.z,
      }
    }

    iframeElement.contentWindow.postMessage(
      {
        deviceMotion8w: motionData,
      },
      '*'
    )
  }

  const messageHandler = (event) => {
    if (event.data === 'devicemotionrequest8w') {
      const iframeElement = getElement()
      if (!iframeElement) {
        // eslint-disable-next-line no-console
        console.error('iframe not found', iframeId)
        return
      }
      requestMotionPermissions().then((status) => {
        if (status === 'granted') {
          iframeElement.contentWindow.postMessage('devicemotiongranted8w', '*')
        } else {
          showPermissionPrompt().then(() => {
            requestMotionPermissions().then((retryStatus) => {
              if (retryStatus === 'granted') {
                iframeElement.contentWindow.postMessage('devicemotiongranted8w', '*')
              } else {
                iframeElement.contentWindow.postMessage('devicemotiondenied8w', '*')
              }
            })
          }).catch(() => {
            iframeElement.contentWindow.postMessage('promptdenied8w', '*')
          })
        }
      })
    }
  }

  window.addEventListener('deviceorientation', deviceOrientationHandler)
  window.addEventListener('devicemotion', deviceMotionHandler)
  window.addEventListener('message', messageHandler)

  const destroy = () => {
    window.removeEventListener('deviceorientation', deviceOrientationHandler)
    window.removeEventListener('devicemotion', deviceMotionHandler)
    window.removeEventListener('message', messageHandler)
  }

  return {
    destroy,
  }
}

let currentSession

const registerXRIFrame = (iframeId) => {
  const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
  const isFakingDesktopSafari =
    !!(navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /Mac/.test(navigator.platform))
  if (!iOS && !isFakingDesktopSafari) {
    return
  }

  // Exit if no iframe id provided
  if (!iframeId) {
    const msg = 'Missing iframe or ID'
    // eslint-disable-next-line no-console
    console.error(msg, iframeId)
    return
  }

  if (currentSession) {
    currentSession.destroy()
  }

  currentSession = createXrIframeSession(iframeId)
}

const deregisterXRIFrame = () => {
  if (currentSession) {
    currentSession.destroy()
    currentSession = null
  }
}

// Add registerXRIframe to the window
window.XRIFrame = {registerXRIFrame, deregisterXRIFrame}

const getIdFromSrc = (src) => {
  const url = new URL(src)
  return url.searchParams.get('id')
}

const scriptElement = document.currentScript ||
    [].find.call(document.scripts, s => /iframe(\?.*)?$/.test(s.src))
const src = scriptElement && scriptElement.src
const iframeId = src && getIdFromSrc(src)

// If there's a requested dom element, register once page has loaded.
if (iframeId) {
  if (document.getElementById(iframeId)) {
    registerXRIFrame(iframeId)
  } else {
    window.addEventListener('load', () => {
      registerXRIFrame(iframeId)
    })
  }
}
