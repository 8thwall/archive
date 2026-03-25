// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import './index.css'

import {clockAnimationComponent} from './components/clock-animation'
AFRAME.registerComponent('clock-animation', clockAnimationComponent)

import {uiManagerComponent} from './components/ui-manager'
AFRAME.registerComponent('ui-manager', uiManagerComponent)

import {scaleToHandComponent} from './components/scale-to-hand'
AFRAME.registerComponent('scale-to-hand', scaleToHandComponent)

import {wristOccluderComponent} from './components/wrist-occluder'
AFRAME.registerComponent('wrist-occluder', wristOccluderComponent)