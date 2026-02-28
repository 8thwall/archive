/* globals NAF */
// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import {lobbyHandlerComponent} from './lobby-handler'
AFRAME.registerComponent('lobby-handler', lobbyHandlerComponent)

import {colorChangerComponent} from './color-changer'
AFRAME.registerComponent('color-changer', colorChangerComponent)

// Define NAF Schemas for Networked A-Frame
const addNafSchemas = () => {
  NAF.schemas.getComponentsOriginal = NAF.schemas.getComponents
  NAF.schemas.getComponents = (template) => {
    if (!NAF.schemas.hasTemplate('#avatar-template')) {
      NAF.schemas.add({
        template: '#avatar-template',
        components: [
          'position',
          'rotation',
        ],
      })
    }
    if (!NAF.schemas.hasTemplate('#sphere-template')) {
      NAF.schemas.add({
        template: '#sphere-template',
        components: [
          'position',
          'rotation',
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
