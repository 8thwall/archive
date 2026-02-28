// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'
import {
  tetaviHologramComponent,
  tetaviHologramPrimitive,
  responsiveImmersiveComponent,
} from './tetavi-hologram'

AFRAME.registerComponent('tetavi', tetaviHologramComponent())
AFRAME.registerPrimitive('tetavi-hologram', tetaviHologramPrimitive())
AFRAME.registerComponent('responsive-immersive', responsiveImmersiveComponent)
