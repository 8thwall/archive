// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './main.css'

import {detectMeshComponent} from './components/detect-mesh'
AFRAME.registerComponent('detect-mesh', detectMeshComponent)

import {
  focusedWayspotComponent, customWayspotComponent,
  customWayspotPrimitive, responsiveMapThemeComponent,
  mapLoadingScreenComponent, mapDebugControlsComponent,
} from './components/custom-wayspot'
AFRAME.registerComponent('focused-wayspot', focusedWayspotComponent)
AFRAME.registerComponent('custom-wayspot', customWayspotComponent)
AFRAME.registerPrimitive('custom-wayspot', customWayspotPrimitive)
AFRAME.registerComponent('responsive-map-theme', responsiveMapThemeComponent)
AFRAME.registerComponent('map-loading-screen', mapLoadingScreenComponent)
AFRAME.registerComponent('map-debug-controls', mapDebugControlsComponent)

// Load scene using URL params
// sample URL: https://workspace.8thwall.app/vps-beta/?scene=detect-mesh
const params = new URLSearchParams(document.location.search.substring(1))
const s = params.get('scene') ? params.get('scene') : 'world-map'
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
  swapBody(require('./scenes/world-map.html'))
})

// Check Location Permissions at beginning of session
const errorCallback = (error) => {
  if (error.code === error.PERMISSION_DENIED) {
    alert('LOCATION PERMISSIONS DENIED. PLEASE ALLOW AND TRY AGAIN.')
  }
}
navigator.geolocation.getCurrentPosition((pos) => {}, errorCallback)
