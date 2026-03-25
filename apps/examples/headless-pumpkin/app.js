// Copyright (c) 2020 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.


import {tapPlaceComponent} from './components/tap-component'

import curvedImageTargetComponent from './components/curved-image-target'
import curvedTargetContainerComponent from './components/curved-target-container'
import curvedTargetVideoComponent from './components/curved-target-video'

AFRAME.registerComponent('curved-image-target', curvedImageTargetComponent)
AFRAME.registerComponent('curved-target-container', curvedTargetContainerComponent)
AFRAME.registerComponent('curved-target-video', curvedTargetVideoComponent)

AFRAME.registerComponent('tap', tapPlaceComponent)


