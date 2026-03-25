// Copyright (c) 2020 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import {spinComponent} from './components/components'
AFRAME.registerComponent('spin', spinComponent)

import curvedTargetComponent from './components/curved-target'
import curvedTargetContainerComponent from './components/curved-target-container'
import curvedTargetVideoSoundComponent from './components/curved-target-video-sound'
import curvedTargetVideoFadeComponent from './components/curved-target-video-fade'

AFRAME.registerComponent('curved-target', curvedTargetComponent)
AFRAME.registerComponent('curved-target-container', curvedTargetContainerComponent)
AFRAME.registerComponent('curved-target-video-sound', curvedTargetVideoSoundComponent)
AFRAME.registerComponent('curved-target-video-fade', curvedTargetVideoFadeComponent)
