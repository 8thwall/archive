// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import {scaleToHandComponent} from './scale-to-hand'
AFRAME.registerComponent('scale-to-hand', scaleToHandComponent)

import {changeMapComponent} from './change-map'
AFRAME.registerComponent('change-map', changeMapComponent)

import {wristOccluderComponent} from './wrist-occluder'
AFRAME.registerComponent('wrist-occluder', wristOccluderComponent)

import {clockAnimationComponent} from './clock-animation'
AFRAME.registerComponent('clock-animation', clockAnimationComponent)
