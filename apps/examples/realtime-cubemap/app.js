// Copyright (c) 2020 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import {cubeMapRealtimeComponent} from './cubemap-realtime'
AFRAME.registerComponent('cubemap-realtime', cubeMapRealtimeComponent)

import {xrLightComponent, xrLightSystem, tapRecenterComponent} from './components'
AFRAME.registerComponent('xr-light', xrLightComponent)
AFRAME.registerComponent('tap-recenter', tapRecenterComponent)
AFRAME.registerSystem('xr-light', xrLightSystem)
