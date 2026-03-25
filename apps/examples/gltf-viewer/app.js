// Copyright (c) 2020 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall web app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'

import {objectImportComponent, modelUiComponent} from './components'
AFRAME.registerComponent('object-import', objectImportComponent)
AFRAME.registerComponent('model-ui', modelUiComponent)
