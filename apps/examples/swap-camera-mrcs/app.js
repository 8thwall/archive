// Copyright (c) 2021 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'

import {hcapComponent, hcapPrimitive} from './hcap'
AFRAME.registerComponent('hcap', hcapComponent())
AFRAME.registerPrimitive('hcap-hologram', hcapPrimitive())

import {swapCamComponent} from './swap-camera'
AFRAME.registerComponent('swap-cam', swapCamComponent())
