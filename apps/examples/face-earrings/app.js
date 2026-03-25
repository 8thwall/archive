// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import {animateFaceComponent} from './components/animate-face'
AFRAME.registerComponent('animate-face', animateFaceComponent)

import {testAnchorComponent} from './components/test-anchor'
AFRAME.registerComponent('test-anchor', testAnchorComponent)

import {earringChainComponent} from './components/earring-chain'
AFRAME.registerComponent('earring-chain', earringChainComponent)
