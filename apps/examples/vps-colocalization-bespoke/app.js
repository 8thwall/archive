/* globals NAF */
// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import './index.css'

import {lobbyHandlerComponent} from './lobby-handler'
AFRAME.registerComponent('lobby-handler', lobbyHandlerComponent)

import {namedWayspotComponent} from './named-wayspot'
AFRAME.registerComponent('named-wayspot', namedWayspotComponent)

import {colorChangerComponent} from './color-changer'
AFRAME.registerComponent('color-changer', colorChangerComponent)

// Check Location Permissions at beginning of session
const errorCallback = (error) => {
  if (error.code === error.PERMISSION_DENIED) {
    alert('LOCATION PERMISSIONS DENIED. PLEASE ALLOW AND TRY AGAIN.')
  }
}
navigator.geolocation.getCurrentPosition((pos) => {}, errorCallback)

// Define NAF Schemas for Networked A-Frame
const addNafSchemas = () => {
  NAF.schemas.getComponentsOriginal = NAF.schemas.getComponents
  NAF.schemas.getComponents = (template) => {
    if (!NAF.schemas.hasTemplate('#sphere-template')) {
      NAF.schemas.add({
        template: '#sphere-template',
        components: [
          'position',
          'rotation',
          'scale',
          {
            component: 'material',
            property: 'color',
          },
        ],
      })
    }
    const components = NAF.schemas.getComponentsOriginal(template)
    return components
  }
}

// Wait on DOM ready
setTimeout(() => {
  addNafSchemas()
})
