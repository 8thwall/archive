// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

// import './index.css'

// import {toonShaderComponent} from './toon-shader'
// AFRAME.registerComponent('toon-shader', toonShaderComponent)

// import {clockAnimationComponent} from './components/clock-animation'
// AFRAME.registerComponent('clock-animation', clockAnimationComponent)

// import {wristOccluderComponent} from './components/wrist-occluder'
// AFRAME.registerComponent('wrist-occluder', wristOccluderComponent)

// import {uiManagerComponent} from './components/ui-manager'
// AFRAME.registerComponent('ui-manager', uiManagerComponent)

// import {rotateWatchComponent} from './components/rotate-watch'
// AFRAME.registerComponent('rotate-watch', rotateWatchComponent)

// import {polygonOffsetComponent} from './components/polygon-offset'
// AFRAME.registerComponent('polygon-offset', polygonOffsetComponent)

AFRAME.registerComponent('gravity', {
  schema: {
    target: {type: 'selector'},
    strength: {default: 0},
  },

  tick() {
  // Check if the body is loaded.
    if (!this.el.body) {
      return
    }

    // Calculate the direction from the object to the target.
    const direction = this.el.object3D.position
      .clone()
      .sub(this.data.target.object3D.position)
      .normalize()

    // Calculate the force.
    const force = direction.multiplyScalar(this.data.strength)

    // Apply the force.
    this.el.body.applyCentralForce(new Ammo.btVector3(force.x, force.y, force.z))
  },
})

AFRAME.registerComponent('delayed-dynamic-body', {
  init() {
    // Start as kinematic
    this.el.setAttribute('ammo-body', 'type: kinematic')

    const {el} = this

    // Change to dynamic after 10 seconds (10000 milliseconds)
    setTimeout(() => {
      el.setAttribute('ammo-body', {type: 'dynamic', mass: 1})
    }, 10000)
  },
})

AFRAME.registerComponent('debug-ball', {
  tick(time, timeDelta) {
    if (time % 1000 < timeDelta) {
      console.log('Current position:', this.el.getAttribute('position'))
    }
  },
})

AFRAME.registerComponent('ball-generator', {
  schema: {
    count: {default: 10},
  },

  init() {
    // Create an array of model IDs
    const modelIDs = [
      'blue',
      'brown',
      'green',
      'orange',
      'red',
      'yellow',
    ]

    // Check if scene has already loaded.
    if (this.el.sceneEl.hasLoaded) {
      this.generateBalls(modelIDs)
    } else {
      this.el.sceneEl.addEventListener('loaded', () => this.generateBalls(modelIDs))
    }
  },
  generateBalls(modelIDs) {
    for (let i = 0; i < this.data.count; i++) {
      // Create new entity
      const el = document.createElement('a-entity')

      // Randomly select a model ID
      const randomModelID = modelIDs[Math.floor(Math.random() * modelIDs.length)]

      // Set the gltf-model attribute to the selected 3D model
      el.setAttribute('gltf-model', `#${randomModelID}`)

      // Set attributes
      // el.setAttribute('position', `${Math.random() * 5} 0 0`)
      el.setAttribute('gravity', 'target: #red-sphere; strength: -12')
      el.setAttribute('shadow', '')

      // Append the entity to the scene
      this.el.sceneEl.appendChild(el)

      // Wait for the model to be loaded
      el.addEventListener('model-loaded', () => {
        // Set ammo-body and ammo-shape after the model is loaded
        setTimeout(() => {
          el.setAttribute('ammo-body', 'type: dynamic; linearDamping: 0.8')
          el.setAttribute('ammo-shape', 'type: hull; margin: 0.001')
        }, 100)
      })
    }
  },
})
