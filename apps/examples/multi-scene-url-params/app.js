// Copyright (c) 2021 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

// sample URL: https://playground.8thwall.app/multi-scene-url-params/?color=COLOR
const params = new URLSearchParams(document.location.search.substring(1))
const pColor = params.get('color') ? params.get('color') : '#5ac8fa'
let scene

switch (pColor) {
  case 'blue':
    scene = 'blue-cube'
    break
  case 'red':
    scene = 'red-cube'
    break
  case 'green':
  default:
    scene = 'green-cube'
}

document.body.insertAdjacentHTML('beforeend', require(`./scenes/${scene}.html`))
