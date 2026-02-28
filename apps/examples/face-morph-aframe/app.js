// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import './index.css'

import {gltfMorphComponent} from './components/gltf-morph'
AFRAME.registerComponent('gltf-morph', gltfMorphComponent)

import {animateFaceComponent} from './components/animate-face'
AFRAME.registerComponent('animate-face', animateFaceComponent)

import {uiManagerComponent} from './components/ui-manager'
AFRAME.registerComponent('ui-manager', uiManagerComponent)