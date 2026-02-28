// Copyright (c) 2021 8th Wall, Inc.
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import {tapPlaySound} from './tap-to-play-sound'
AFRAME.registerComponent('tap-play-sound', tapPlaySound)

import {cubeMapRealtimeComponent} from './cubemap-realtime'
AFRAME.registerComponent('cubemap-realtime', cubeMapRealtimeComponent)
