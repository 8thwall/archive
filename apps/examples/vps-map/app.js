// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './main.css'

import {detectMeshComponent} from './components/detect-mesh'
AFRAME.registerComponent('detect-mesh', detectMeshComponent)

import {customWayspotComponent, customWayspotPrimitive} from './components/custom-wayspot'
AFRAME.registerComponent('custom-wayspot', customWayspotComponent)
AFRAME.registerPrimitive('custom-wayspot', customWayspotPrimitive)

// Load scene using URL params
// sample URL: https://workspace.8thwall.app/vps-beta/?scene=detect-mesh
const params = new URLSearchParams(document.location.search.substring(1))
const s = params.get('scene') ? params.get('scene') : 'world-map'
document.body.insertAdjacentHTML('beforeend', require(`./scenes/${s}.html`))

// Load scene manually
// document.body.insertAdjacentHTML('beforeend', require('./scenes/detect-mesh.html'))
