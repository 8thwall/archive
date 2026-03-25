// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import {cubeMapRealtimeComponent} from './cubemap-realtime'
import {cubeEnvMapComponent} from './cubemap-static'
import {swapCamComponent} from './swap-camera'
import {bobComponent} from './bob'
import {balloonManager} from './balloonManager'
import './index.css'
import {tapPlaceComponent} from './tap-place'

AFRAME.registerComponent('cubemap-static', cubeEnvMapComponent)
AFRAME.registerComponent('cubemap-realtime', cubeMapRealtimeComponent)
AFRAME.registerComponent('swap-cam', swapCamComponent)
AFRAME.registerComponent('bob', bobComponent)
AFRAME.registerComponent('balloon-manager', balloonManager)
AFRAME.registerComponent('tap-place', tapPlaceComponent)

const onxrloaded = () => {
  XR8.addCameraPipelineModule({
    name: 'request-gyro',
    requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
  })
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
