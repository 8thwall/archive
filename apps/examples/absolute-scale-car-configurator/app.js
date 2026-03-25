// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'

import {changeColorComponent, absPinchScaleComponent, annotationComponent, proximityComponent, gltfMorphComponent} from './js/components'
AFRAME.registerComponent('change-color', changeColorComponent)
AFRAME.registerComponent('annotation', annotationComponent)
AFRAME.registerComponent('absolute-pinch-scale', absPinchScaleComponent)
AFRAME.registerComponent('proximity', proximityComponent)
AFRAME.registerComponent('gltf-morph', gltfMorphComponent)

import {cubeMapRealtimeComponent} from './js/cubemap-realtime'
AFRAME.registerComponent('cubemap-realtime', cubeMapRealtimeComponent)

import {cubeEnvMapComponent} from './js/cubemap-static'
AFRAME.registerComponent('cubemap-static', cubeEnvMapComponent)

import {responsiveImmersiveComponent} from './js/responsive-immersive'
AFRAME.registerComponent('responsive-immersive', responsiveImmersiveComponent)

import {xrLightComponent, xrLightSystem} from './js/xrlight'
AFRAME.registerComponent('xr-light', xrLightComponent)
AFRAME.registerSystem('xr-light', xrLightSystem)

// bitmaps cause texture issues on iOS this workaround prevents black textures and crashes
const IS_IOS =
  /^(iPad|iPhone|iPod)/.test(window.navigator.platform) ||
  (/^Mac/.test(window.navigator.platform) && window.navigator.maxTouchPoints > 1)
if (IS_IOS) {
  window.createImageBitmap = undefined
}
