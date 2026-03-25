// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './main.css'

import {bobComponent} from './components/bob'
import {
  customWayspotComponent,
  customWayspotPrimitive,
  focusedWayspotComponent,
  mapDebugControlsComponent,
  mapLoadingScreenComponent,
} from './components/custom-wayspot'
import {detectMeshComponent} from './components/detect-mesh'
import {mapThemeSwitcherComponent} from './components/map-theme-switcher'
import {
  toonOceanComponent,
  toonOceanShader,
  toonOceanPrimitive,
  gradientShader2,
  gradientShader3,
  gradientShader4,
} from './components/toon-ocean'

import {colorChangerComponent} from './components/color-changer'
AFRAME.registerComponent('color-changer', colorChangerComponent)

AFRAME.registerComponent('detect-mesh', detectMeshComponent)
AFRAME.registerComponent('focused-wayspot', focusedWayspotComponent)
AFRAME.registerComponent('custom-wayspot', customWayspotComponent)
AFRAME.registerPrimitive('custom-wayspot', customWayspotPrimitive)
AFRAME.registerComponent('map-loading-screen', mapLoadingScreenComponent)
AFRAME.registerComponent('map-debug-controls', mapDebugControlsComponent)
AFRAME.registerComponent('map-theme-switcher', mapThemeSwitcherComponent)
AFRAME.registerComponent('bob', bobComponent)
AFRAME.registerComponent('toon-ocean', toonOceanComponent)
AFRAME.registerPrimitive('a-toon-ocean', toonOceanPrimitive)
AFRAME.registerShader('toon-ocean', toonOceanShader)
AFRAME.registerShader('gradient2', gradientShader2)
AFRAME.registerShader('gradient3', gradientShader3)
AFRAME.registerShader('gradient4', gradientShader4)

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
