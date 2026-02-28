// Copyright (c) 2020 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import {playVideoComponent} from './play-video'
AFRAME.registerComponent('play-video', playVideoComponent)

import {holdDragComponent} from './custom-hold-drag'
AFRAME.registerComponent('custom-hold-drag', holdDragComponent)

import {lookAtComponent} from './look-at'
AFRAME.registerComponent('look-at', lookAtComponent)
