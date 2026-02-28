// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './main.css'

// IMPORT UTILS COMPONENTS
import './utils/curve-component'
import {alongPathComponent} from './utils/along-path'
AFRAME.registerComponent('along-path', alongPathComponent)

// IMPORT CHARACTER LOGIC COMPONENTS
import {
  attackPatternComponent,
  jumpControllerComponent,
  basicColliderComponent,
  characterAnimatorComponent,
  deathAnimationComponent,
} from './components/character-logic'
AFRAME.registerComponent('attack-pattern', attackPatternComponent)
AFRAME.registerComponent('jump-controller', jumpControllerComponent)
AFRAME.registerComponent('basic-collider', basicColliderComponent)
AFRAME.registerComponent('character-animator', characterAnimatorComponent)
AFRAME.registerComponent('death-animation', deathAnimationComponent)

// IMPORT MULTIPLAYER COMPONENTS
import {
  lobbyHandlerComponent,
  gameStartComponent,
  gameOverComponent,
  playerSpawnerComponent,
  playerInfoComponent,
} from './components/multiplayer'

AFRAME.registerComponent('lobby-handler', lobbyHandlerComponent)
AFRAME.registerComponent('game-starter', gameStartComponent)
AFRAME.registerComponent('gameover-handler', gameOverComponent)
AFRAME.registerComponent('player-spawner', playerSpawnerComponent)
AFRAME.registerComponent('player-info', playerInfoComponent)

// Define NAF Schemas for Networked A-Frame
const addNafSchemas = () => {
  NAF.schemas.getComponentsOriginal = NAF.schemas.getComponents
  NAF.schemas.getComponents = (template) => {
    if (!NAF.schemas.hasTemplate('#avatar-template')) {
      NAF.schemas.add({
        template: '#avatar-template',
        components: [
          'visible',          // syncs visible attribute
          'player-info',      // syncs peerId
          'player-spawner',   // syncs peerId
          'jump-controller',  // syncs jumpStartTimeMs
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
