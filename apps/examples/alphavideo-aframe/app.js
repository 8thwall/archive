// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import {targetVideoComponent} from './target-video'
import {chromaKeyShader} from './chroma-key'

AFRAME.registerShader('chromakey', chromaKeyShader)
AFRAME.registerComponent('target-video', targetVideoComponent)
