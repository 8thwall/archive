// Copyright (c) 2019 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import * as AppView from './views/app'

const onxrloaded = () => {
  document.body.insertAdjacentHTML('beforeend', '<div id="root"></div>')
  AppView.render()
}

// Wait for xr to load before running.
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
