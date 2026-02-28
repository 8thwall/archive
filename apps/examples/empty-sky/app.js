// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall web app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import './index.css'

import {recenterComponent} from './components/sky-recenter'
AFRAME.registerComponent('sky-recenter', recenterComponent)

import {skyRemoteAuthoringComponent} from './components/sky-remote-authoring'
AFRAME.registerComponent('sky-remote-authoring', skyRemoteAuthoringComponent)

import {deviceOrientationComponent} from './components/device-orientation.js'
AFRAME.registerComponent('device-orientation', deviceOrientationComponent)
