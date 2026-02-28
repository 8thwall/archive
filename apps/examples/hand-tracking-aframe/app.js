// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'

import {clockAnimationComponent} from './components/clock-animation'
AFRAME.registerComponent('clock-animation', clockAnimationComponent)

import {wristOccluderComponent} from './components/wrist-occluder'
AFRAME.registerComponent('wrist-occluder', wristOccluderComponent)

import {uiManagerComponent} from './components/ui-manager'
AFRAME.registerComponent('ui-manager', uiManagerComponent)

import {rotateWatchComponent} from './components/rotate-watch'
AFRAME.registerComponent('rotate-watch', rotateWatchComponent)

import {handSwitchedComponent} from './components/hand-switched'
AFRAME.registerComponent('hand-switched', handSwitchedComponent)

import {mirrorXComponent} from './components/mirror-x'
AFRAME.registerComponent('mirror-x', mirrorXComponent)

import {polygonOffsetComponent} from './components/polygon-offset'
AFRAME.registerComponent('polygon-offset', polygonOffsetComponent)
