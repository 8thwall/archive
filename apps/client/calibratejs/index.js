// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Rami Farran (rami@8thwall.com)
//
// Application that helps calibrate a phone's camera using a checkerboard

/* globals XR8 Calibr8 */
/* eslint-disable no-console */

import 'apps/client/calibratejs/index.css'
import mainHtml from 'apps/client/calibratejs/main.html'

const calibrateDisplayModule = () => {
  const url = document.getElementById('url')
  const fractionOfMinTimeMs = 3
  const toPercentFactor = 100
  const timeUntilNextCheck = document.getElementById('timeUntilNextCheck')
  const timeUntilNextCheckBar = document.getElementById('timeUntilNextCheckBar')
  const frameCount = document.getElementById('frameCount')
  const camResolution = document.getElementById('resolution')
  const reprojectionError = document.getElementById('reprojectionError')
  const focalLength = document.getElementById('focalLength')
  const boardInfo = document.getElementById('boardInfo')
  const cameraFeed = document.getElementById('cameraFeed')
  const overlayView3d = document.getElementById('overlayView3d')
  const deviceInfo = document.getElementById('deviceInfo')

  let prevNumOfFrames = 0
  let isFirstFrame = true

  url.lastSeen = 0
  return {
    name: 'calibratedisplay',
    onUpdate: ({processCpuResult}) => {
      const {calibrateprocess} = processCpuResult
      if (!calibrateprocess) {
        return
      }
      const {
        didCheck, calib, calibrationFinished, currDate, lastCheckTime, minTimeBetweenInMs,
      } = calibrateprocess
      if (!calib) {
        return
      }

      if (didCheck) {
        overlayView3d.style.webkitFilter = 'contrast(130%)'
        if (calib.foundFrames > prevNumOfFrames) {
          overlayView3d.style.webkitFilter += ' hue-rotate(200deg)'
          cameraFeed.style.borderColor = 'green'
          prevNumOfFrames = calib.foundFrames
        } else {
          overlayView3d.style.webkitFilter += ' hue-rotate(65deg)'
          cameraFeed.style.borderColor = 'red'
        }
      }

      if (currDate.getTime() - lastCheckTime >= minTimeBetweenInMs / fractionOfMinTimeMs) {
        overlayView3d.style.webkitFilter = ''
        cameraFeed.style.borderColor = 'white'
      }

      if (!calibrationFinished) {
        const timeSinceCheck = currDate.getTime() - lastCheckTime
        const nextCheckMillis = minTimeBetweenInMs - timeSinceCheck
        const intervalPercent = timeSinceCheck * toPercentFactor / minTimeBetweenInMs
        timeUntilNextCheck.innerHTML = `Checking for board in ${nextCheckMillis} ms`
        timeUntilNextCheckBar.style.width = `${intervalPercent}%`
      } else {
        url.innerHTML = 'Calibration finished. Refresh to calibrate again.'
        timeUntilNextCheck.innerHTML = 'Done checking for board.'
        timeUntilNextCheckBar.style.width = '100%'
      }
      frameCount.innerHTML = `Frames: ${calib.foundFrames}/10`
      if (isFirstFrame) {
        camResolution.innerHTML = `Resolution: ${calib.cameraWidth} x ${calib.cameraHeight}`
        boardInfo.innerHTML = `Board inner corners: ${calib.boardInnerCorners} |
          Square size (mm): ${calib.squareSizeMM}`
        isFirstFrame = false
      }
      if (calibrationFinished) {
        reprojectionError.innerHTML = `Reprojection Error: ${calib.reprojectionError.toFixed(6)}`
        focalLength.innerHTML = `Focal Length: ${calib.cameraFocalLength.toFixed(6)}`
      }

      {
        const height = window.screen.height * window.devicePixelRatio
        const width = window.screen.width * window.devicePixelRatio
        const deviceEstimate = XR8.XrDevice.deviceEstimate()
        deviceInfo.innerHTML = `
detect-iOS height=${height} width=${width}
manufacturer=${deviceEstimate.manufacturer} model=${deviceEstimate.model}
`
      }
    },
    onException: (e) => {
      console.error('XR threw an exception', e)
      XR8.stop()
    },
  }
}


const runXr = () => {
  document.body.insertAdjacentHTML('beforeend', mainHtml)
  XR8.addCameraPipelineModules([
    XR8.GlTextureRenderer.pipelineModule(),
    XR8.CameraPixelArray.pipelineModule({luminance: true, width: 480, height: 640}),
    Calibr8.calibrateProcessModule(),
    calibrateDisplayModule(),
  ])

  // Because we haven't specified a renderer, the overlay is drawn by default.
  // TODO(nb): explicitly specify.
  const canvas = document.getElementById('overlayView3d')
  XR8.run({canvas})
}

// eslint-disable-next-line no-unused-expressions
window.XR8 ? runXr() : window.addEventListener('xrloaded', runXr)
