// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './main.css'

AFRAME.registerComponent('custom-capture-btn', {
  init() {
    const btn = document.getElementById('recorder-button')
    btn.innerHTML = `<img id="icon" src=${require('./assets/camera.svg')}> Capture`
  }
})
