// Copyright (c) 2020 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'
import {swapDofComponent, swapCameraComponent} from './swap-components'

AFRAME.registerComponent('swap-dof', swapDofComponent)
AFRAME.registerComponent('swap-camera', swapCameraComponent)

const onxrloaded = () => {
  window.XR8.addCameraPipelineModule({
    name: 'request-gyro',
    requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
  })
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
