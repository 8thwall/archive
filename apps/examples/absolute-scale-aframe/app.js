// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'

import {recenterButtonComponent} from './recenter.js'
AFRAME.registerComponent('recenter-button', recenterButtonComponent)

import {responsiveImmersiveComponent} from './responsive-immersive'
AFRAME.registerComponent('responsive-immersive', responsiveImmersiveComponent)
