// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'

import {changeSceneComponent} from './components/change-scene'
AFRAME.registerComponent('change-view', changeSceneComponent)

import {changeColorComponent} from './components/color-change'
AFRAME.registerComponent('change-color', changeColorComponent)
