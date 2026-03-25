// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall web app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './main.css'

AFRAME.registerComponent('physics-object', {
  schema: {
    model: {default: ''},
    body: {type: 'string', default: 'static'},  // dynamic: A freely-moving object
    shape: {type: 'string', default: 'mesh'},  // hull: Wraps a model in a convex hull, like a shrink-wrap
  },

  init() {
    this.setupPhysicsModel = this.setupPhysicsModel.bind(this)

    // Set up the model and shadow.
    this.el.setAttribute('gltf-model', this.data.model)
    this.el.setAttribute('visible', false)

    // Add listener for 'xrprojectwayspotfound' event.
    this.el.sceneEl.addEventListener('xrprojectwayspotfound', this.setupPhysicsModel)
  },

  setupPhysicsModel() {
    setTimeout(() => {
      this.el.setAttribute('ammo-body', {type: this.data.body})
      this.el.setAttribute('ammo-shape', {type: this.data.shape})
    }, 1000)
  },
})

AFRAME.registerComponent('projectile-shooter', {
  schema: {
    speed: {type: 'number', default: 11},
    lifetime: {type: 'number', default: 25000},  // Lifetime of the projectiles in milliseconds
    interval: {type: 'number', default: 150},  // Interval between shots in milliseconds
  },
  init() {
    const modelIDs = [
      'blue',
      'brown',
      'green',
      'orange',
      'red',
      'yellow',
    ]

    const shootProjectile = () => {
      const entityEl = document.createElement('a-entity')
      const randomModelID = modelIDs[Math.floor(Math.random() * modelIDs.length)]
      entityEl.setAttribute('gltf-model', `#${randomModelID}`)
      entityEl.setAttribute('shadow', '')
      entityEl.setAttribute('animation__fadeout', {
        property: 'scale',
        to: '0 0 0',
        dur: 1000,
        easing: 'easeInQuad',
        startEvents: 'startFadeOut',
      })
      const position = new THREE.Vector3()
      this.el.object3D.getWorldPosition(position)
      entityEl.setAttribute('position', position)
      this.el.sceneEl.appendChild(entityEl)

      entityEl.addEventListener('model-loaded', () => {
        setTimeout(() => {
          entityEl.setAttribute('ammo-body', 'type: dynamic; mass: 60')
          entityEl.setAttribute('ammo-shape', 'type: hull')
        }, 100)

        entityEl.addEventListener('body-loaded', () => {
          const direction = new THREE.Vector3()
          this.el.object3D.getWorldDirection(direction)
          direction.negate()
          direction.multiplyScalar(this.data.speed)
          entityEl.body.setLinearVelocity(new Ammo.btVector3(direction.x, direction.y, direction.z))
          setTimeout(() => {
            entityEl.emit('startFadeOut')
          }, this.data.lifetime - 1000)
        })
      })

      entityEl.addEventListener('animationcomplete__fadeout', () => {
        this.el.sceneEl.removeChild(entityEl)
      })
    }

    let shootingInterval

    window.addEventListener('touchstart', () => {
      shootingInterval = setInterval(shootProjectile, this.data.interval)
    })

    window.addEventListener('touchend', () => {
      clearInterval(shootingInterval)
    })
  },
  remove() {
    window.removeEventListener('touchstart')
    window.removeEventListener('touchend')
  },
})
