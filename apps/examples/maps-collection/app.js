// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './main.css'

import {
  focusedWayspotComponent,    // logic handling which wayspot is selected
  customWayspotComponent,     // wayspot visuals & behavior component
  customWayspotPrimitive,     // wayspot visuals & behavior primitive
} from './components/custom-wayspot'
import {
  themeCarouselComponent,     // map theme switcher visuals & behavior
  mapDebugControlsComponent,  // move around the map with WASD controls
  mapLoadingScreenComponent,  // load screen that dismisses after map loads
} from './components/theme-carousel'
import {detectMeshComponent} from './components/detect-mesh'

AFRAME.registerComponent('detect-mesh', detectMeshComponent)
AFRAME.registerComponent('focused-wayspot', focusedWayspotComponent)
AFRAME.registerComponent('custom-wayspot', customWayspotComponent)
AFRAME.registerPrimitive('custom-wayspot', customWayspotPrimitive)
AFRAME.registerComponent('map-loading-screen', mapLoadingScreenComponent)
AFRAME.registerComponent('map-debug-controls', mapDebugControlsComponent)
AFRAME.registerComponent('theme-carousel', themeCarouselComponent)

// Load scene using URL params
// sample URL: https://workspace.8thwall.app/vps-beta/?scene=detect-mesh
const params = new URLSearchParams(document.location.search.substring(1))
const s = params.get('scene') ? params.get('scene') : 'theme-carousel'
document.body.insertAdjacentHTML('beforeend', require(`./scenes/${s}.html`))

// Load scene manually
// document.body.insertAdjacentHTML('beforeend', require('./scenes/detect-mesh.html'))

const swapBody = (newHtml) => {
  const scene = document.body.querySelector('a-scene')
  scene.parentElement.removeChild(scene)
  document.body.insertAdjacentHTML('beforeend', newHtml)
}

window.addEventListener('startar', ({detail}) => {
  swapBody(require('./scenes/detect-mesh.html'))
  window._startAR = detail
})

window.addEventListener('stopar', () => {
  swapBody(require('./scenes/theme-carousel.html'))
})

// Check Location Permissions at beginning of session
const errorCallback = (error) => {
  if (error.code === error.PERMISSION_DENIED) {
    alert('LOCATION PERMISSIONS DENIED. PLEASE ALLOW AND TRY AGAIN.')
  }
}
navigator.geolocation.getCurrentPosition((pos) => {}, errorCallback)
