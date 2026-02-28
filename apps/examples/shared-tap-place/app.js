/* globals NAF */
// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import {lobbyHandlerComponent} from './lobby-handler'
AFRAME.registerComponent('lobby-handler', lobbyHandlerComponent)

import {spawnerComponent} from './spawner'
AFRAME.registerComponent('spawner', spawnerComponent)

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
    const components = NAF.schemas.getComponentsOriginal(template)
    return components
  }
}

// Wait on DOM ready
setTimeout(() => {
  addNafSchemas()
})
