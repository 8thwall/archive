/* globals NAF */
// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import './index.css'

import {connectComponent} from './connect'
AFRAME.registerComponent('connect', connectComponent)

import {colorChangerComponent} from './color-changer'
AFRAME.registerComponent('color-changer', colorChangerComponent)

import {inviteOverlayComponent} from './invite-overlay'
AFRAME.registerComponent('invite-overlay', inviteOverlayComponent)

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
