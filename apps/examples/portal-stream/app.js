// Copyright (c) 2020 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import {portalComponent, bobComponent, livestreamComponent}
  from './portal-components'
import './index.css'

AFRAME.registerComponent('portal', portalComponent)
AFRAME.registerComponent('bob', bobComponent)

const height = window.screen.height * window.devicePixelRatio
const width = window.screen.width * window.devicePixelRatio
// iPhone 12 Pro Max: 1284 x 2778
// iPhone 12 Pro: 1170 x 2532
// iPhone 12: 1170 x 2532
// iPhone 12 Mini: 1080 x 2430
const hlsResolutions = [1284, 2778, 1170, 2532, 2430]
const iOS14Check = () => {
  const {os, osVersion, browser} = XR8.XrDevice.deviceEstimate()
  const errorText = ''
  if (os === 'iOS') {
    switch (osVersion) {
      case '14.0':
      case '14.0.1':
      case '14.1':
      case '14.2.1':
        // HLS not supported on these iOS versions
        document.body.insertAdjacentHTML('beforeend', `
        <div class="message">
          Update to iOS 14.3<br>for HLS Support
        </div>`)
        break
      case '14.3':
      case '14.4':
      case '14.5':
        if (hlsResolutions.includes(height) || hlsResolutions.includes(width)) {
          // HLS not supported on iPhone 12 devices; update message is displayed
          document.body.insertAdjacentHTML('beforeend', `
          <div class="message">
            Update to iOS 14.6 or later<br>for HLS Support
          </div>`)
        } else {
        // HLS works on all other iOS devices on these versions
          AFRAME.registerComponent('livestream', livestreamComponent)
        }
        break
      default:
        // HLS works on all other iOS versions
        AFRAME.registerComponent('livestream', livestreamComponent)
        break
    }
  } else {
    AFRAME.registerComponent('livestream', livestreamComponent)
  }
}

window.XR8 ? iOS14Check() : window.addEventListener('xrloaded', iOS14Check)
