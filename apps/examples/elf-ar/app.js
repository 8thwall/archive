// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import './vendor/xrextras'
import './index.css'


import {changeColorComponent} from './components/change-color'
AFRAME.registerComponent('change-color', changeColorComponent)

import {uiManagerComponent, loadingScreenComponent, soundManager} from './components/ui-manager'
AFRAME.registerComponent('ui-manager', uiManagerComponent)
AFRAME.registerComponent('load-screen', loadingScreenComponent)
AFRAME.registerComponent('sound-manager', soundManager)