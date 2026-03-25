// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall web app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './main.css'

import {myHiderMaterialComponent} from './hider-material'
AFRAME.registerComponent('my-hider-material', myHiderMaterialComponent)

AFRAME.registerComponent('physics-object', {
  schema: {
    model: {default: ''},
    body: {type: 'string', default: 'static'},  // dynamic: A freely-moving object
    shape: {type: 'string', default: 'mesh'},  // hull: Wraps a model in a convex hull, like a shrink-wrap
  },
  init() {
    this.el.setAttribute('gltf-model', this.data.model)
    // this.el.setAttribute('scale', '3 3 3')
    this.el.setAttribute('shadow', {receive: true})

    this.el.addEventListener('model-loaded', () => {
      setTimeout(() => {
        this.el.setAttribute('ammo-body', 'type: static')
        this.el.setAttribute('ammo-shape', 'type: mesh')
        // this.el.setAttribute('ammo-shape', 'type: hacd; margin: 0.5')
      }, 600)
    })
  },
})

AFRAME.registerComponent('projectile-shooter', {
  schema: {
    speed: {type: 'number', default: 11},
    lifetime: {type: 'number', default: 25000},  // Lifetime of the projectiles in milliseconds
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
      entityEl.classList.add('projectile')
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
          entityEl.setAttribute('ammo-shape', 'type: hull; margin: 0.06')
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

    window.addEventListener('touchstart', () => {
      shootProjectile()
    })
  },
  remove() {
    window.removeEventListener('touchstart')
  },
})

AFRAME.registerComponent('win-checker', {
  schema: {
    radius: {type: 'number', default: 1.8},
  },
  init() {
    this.targetPosition = new THREE.Vector3(0, -10.63, 0)
    this.winStartTime = null
  },
  tick() {
    const projectiles = document.querySelectorAll('.projectile')
    if (!projectiles) return

    projectiles.forEach((projectile) => {
      const projectilePosition = projectile.object3D.position
      const distance = Math.hypot(projectilePosition.x - this.targetPosition.x, projectilePosition.z - this.targetPosition.z)

      if (distance <= this.data.radius && !projectile.classList.contains('inside')) {
        projectile.classList.add('inside')
        this.winStartTime = Date.now()
      }

      if (distance > this.data.radius && projectile.classList.contains('inside')) {
        projectile.classList.remove('inside')
        this.winStartTime = null
      }

      if (this.winStartTime && Date.now() - this.winStartTime >= 2500) {
        console.log('YOU WIN')
        this.winStartTime = null
        this.showBullseye()
      }
    })
  },

  showBullseye() {
    setTimeout(() => {  // Add a delay of 1 second
      const bullseye = document.getElementById('bullseye')
      bullseye.style.display = 'block'
      bullseye.style.opacity = '1'
      setTimeout(() => {
        bullseye.style.opacity = '0'
        setTimeout(() => {
          bullseye.style.display = 'none'
        }, 1000)
      }, 1000)
    }, 1250)
  },
})
