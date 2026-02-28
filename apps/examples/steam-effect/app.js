// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall web app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import {chromaKeyShader} from './chroma-key'
AFRAME.registerShader('chromakey', chromaKeyShader)

import {addVideosComponent, playVideoComponent} from './play-video'
AFRAME.registerComponent('play-video', playVideoComponent)
AFRAME.registerComponent('add-videos', addVideosComponent)

import {lookAtComponent} from './look-at'
AFRAME.registerComponent('look-at', lookAtComponent)