// Copyright (c) 2021 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'

import {videoTextureComponent, videoTextureCameraRollComponent} from './js/video-texture-components'
AFRAME.registerComponent('video-texture', videoTextureComponent)
AFRAME.registerComponent('video-texture-camera-roll', videoTextureCameraRollComponent)

import {cubeMapRealtimeComponent} from './js/cubemap-realtime'
AFRAME.registerComponent('cubemap-realtime', cubeMapRealtimeComponent)

import {xrLightComponent, xrLightSystem} from './js/xrlight'
AFRAME.registerComponent('xr-light', xrLightComponent)
AFRAME.registerSystem('xr-light', xrLightSystem)
