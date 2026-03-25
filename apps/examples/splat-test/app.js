// Copyright (c) 2021 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './main.css'

import {Model, Model2} from './model-min'
import {characterMoveComponent, characterRecenterComponent} from './character-components'
import {splatSwitcherComponent} from './splat-switcher-components'
AFRAME.registerComponent('character-move', characterMoveComponent)
AFRAME.registerComponent('character-recenter', characterRecenterComponent)
AFRAME.registerComponent('splat-switcher', splatSwitcherComponent)

AFRAME.registerComponent('no-cull', {
  init() {
    this.el.addEventListener('model-loaded', () => {
      this.el.object3D.traverse(obj => obj.frustumCulled = false)
    })
  },
})

const workerUrl =
  `${new URL(window.location.href).origin}${require('./assets/model-manager-worker.min')}`

Model.setInternalConfig({workerUrl})
Model.AFrameModelManager.registerAFrameComponents()
