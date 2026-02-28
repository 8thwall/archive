// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'

import {responsiveImmersiveComponent} from './responsive-immersive'
AFRAME.registerComponent('responsive-immersive', responsiveImmersiveComponent)

import {punchTapComponent, resetButtonComponent} from './game-logic'
AFRAME.registerComponent('punch-tap', punchTapComponent)
AFRAME.registerComponent('reset-button', resetButtonComponent)

import {gltfPhysicsObjectComponent} from './glb-physics-object'
AFRAME.registerComponent('physics-object', gltfPhysicsObjectComponent)
