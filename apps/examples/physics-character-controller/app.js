// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall web app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './main.css'

import {characterControllerComponent} from './character-joystick'
AFRAME.registerComponent('joystick-controller', characterControllerComponent)

import {jumpComponent} from './character-jump'
AFRAME.registerComponent('jump-controller', jumpComponent)

// GLB models only - use this component when adding physics to .glb models in your scene
import {gltfPhysicsObjectComponent} from './glb-physics-object'
AFRAME.registerComponent('physics-object', gltfPhysicsObjectComponent)

// Handles logic for camera location on desktop 3D
import {responsiveImmersiveComponent} from './responsive-immersive'
AFRAME.registerComponent('responsive-immersive', responsiveImmersiveComponent)

AFRAME.registerComponent('no-cull', {
  init() {
    this.el.addEventListener('model-loaded', () => {
      this.el.object3D.traverse(obj => obj.frustumCulled = false)
    })
  },
})