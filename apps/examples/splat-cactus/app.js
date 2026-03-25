// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './main.css'

import {Model} from './model-min'
import {splatSwitcherComponent} from './splat-switcher-component'

AFRAME.registerComponent('splat-switcher', splatSwitcherComponent)

const workerUrl =
  `${new URL(window.location.href).origin}${require('./assets/model-manager-worker.min')}`

Model.setInternalConfig({workerUrl})
Model.AFrameModelManager.registerAFrameComponents()
