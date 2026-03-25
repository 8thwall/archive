// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import './index.scss'

import {fallComponent} from './fall'
AFRAME.registerComponent('fall', fallComponent)

import {proximityTriggerComponent} from './proximity'
AFRAME.registerComponent('proximity', proximityTriggerComponent)

import {uiComponent} from './ui'
AFRAME.registerComponent('ui', uiComponent)
