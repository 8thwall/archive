// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import './index.css'

import {earringChainComponent} from './components/earring-chain'
AFRAME.registerComponent('earring-chain', earringChainComponent)

import {uiManagerComponent} from './components/ui-manager'
AFRAME.registerComponent('ui-manager', uiManagerComponent)

import {hideEarringsComponent} from './components/hide-earrings'
AFRAME.registerComponent('hide-earrings', hideEarringsComponent)