// Copyright (c) 2019 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import {runNoXr} from './run-no-xr'
import {runWebXr} from './run-webxr'
import {runXr8} from './run-xr8'
import {runXr8Three} from './run-xr8-threejs'
import {runXr8AFrame} from './run-xr8-aframe'

// Start here
const main = () => {
  document.body.insertAdjacentHTML('beforeend', require('./index.html'))
  const canvas = document.querySelector('#glcanvas')
  // runNoXr(canvas)
  // runXr8(canvas)
  runWebXr(canvas)
  // runXr8Three(canvas)
  // runXr8AFrame(canvas)
}

main()
