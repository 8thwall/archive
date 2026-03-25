// Copyright (c) 2021 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'
import {roverComponent, shaderMaterialComponent, roverSceneComponent, vehicleComponent, vehicleMonitorComponent} from './components'

// Register custom A-Frame components in app.js before the scene in body.html has loaded.
AFRAME.registerComponent('rover', roverComponent)
AFRAME.registerComponent('shadow-material', shaderMaterialComponent)
AFRAME.registerComponent('rover-scene', roverSceneComponent)
AFRAME.registerComponent('vehicle', vehicleComponent)
AFRAME.registerComponent('vehicle-monitor', vehicleMonitorComponent)
