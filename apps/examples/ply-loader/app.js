// Copyright (c) 2020 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import './index.css'

import {PLYModelComponent, PLYModelPrimitive, sizeSelectComponent} from './ply-component'
AFRAME.registerComponent('ply-model', PLYModelComponent)
AFRAME.registerPrimitive('ply-model', PLYModelPrimitive)
AFRAME.registerComponent('size-select', sizeSelectComponent)
