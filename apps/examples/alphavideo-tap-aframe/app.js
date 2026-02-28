// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import {targetComponent, playVideoComponent} from './target-video'
AFRAME.registerComponent('play-video', playVideoComponent)
