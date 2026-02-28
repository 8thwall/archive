const characterControllerComponent = {
  schema: {
    forceMagnitude: {default: 8},  // Speed of character (magnitude of the force during movement)
    decelerationFactor: {default: 0.75},  // Factor to decrease velocity when not moving.
  },

  // Initialize component setup.
  init() {
    this.setupVariables()
    this.setupEventListeners()
    this.initializeState()
    this.el.characterController = this
    this.cameraEl = document.getElementById('camera')
  },

  // Set initial variables.
  setupVariables() {
    this.joystickOrigin = document.getElementById('joystickOrigin')
    this.joystickPosition = document.getElementById('joystickPosition')
    this.direction = new THREE.Vector3()
    this.raycaster = this.el.querySelector('[raycaster]')
    this.forceMagnitude = this.data.forceMagnitude
    this.decelerationFactor = this.data.decelerationFactor
  },

  // Register event listeners for character control.
  setupEventListeners() {
    this.joystickOrigin.addEventListener('mousedown', this.onStartDrag.bind(this))
    this.joystickOrigin.addEventListener('touchstart', this.onStartDrag.bind(this))
    window.addEventListener('mousemove', this.onDrag.bind(this))
    window.addEventListener('mouseup', this.onEndDrag.bind(this))
    window.addEventListener('touchmove', this.onDrag.bind(this))
    window.addEventListener('touchend', this.onEndDrag.bind(this))

    this.raycaster.addEventListener('raycaster-intersection', this.onGrounded.bind(this))
    this.raycaster.addEventListener('raycaster-intersection-cleared', this.offGrounded.bind(this))
  },

  // Handle character's animation based on state.
  handleAnimation() {
    const childModel = document.getElementById('characterModel')
    if (childModel) {
      if (this.isGrounded) {
        if (this.dragging) {
          childModel.setAttribute('animation-mixer', {
            clip: 'RUN',
            loop: 'repeat',
            crossFadeDuration: 0.3,
            timeScale: 0.8,
          })
        } else if (!this.isJumping) {
          childModel.setAttribute('animation-mixer', {
            clip: 'IDLE',
            loop: 'repeat',
            crossFadeDuration: 0.3,
          })
        }
      } else if (this.isJumping) {
        childModel.setAttribute('animation-mixer', {
          clip: 'FALL',
          loop: 'repeat',
          crossFadeDuration: 0.1,
        })
      } else if (this.shouldBeFalling) {  // Check for shouldBeFalling flag here
        childModel.setAttribute('animation-mixer', {
          clip: 'FALL',
          loop: 'repeat',
          crossFadeDuration: 0.1,
        })
      }

      if (this.isJumping && this.isGrounded) {
        childModel.setAttribute('animation-mixer', {
          clip: 'LAND',
          loop: 'once',
          crossFadeDuration: 0.1,
        })
        setTimeout(() => {
          this.isJumping = false
        }, 1000)
      }
    }
  },

  initializeState() {
    this.dragging = false
    this.isGrounded = true
    this.fallTimeout = null
    this.shouldBeFalling = false
    this.groundIntersectCount = 0
  },

  // Handles character physics and animations on each frame.
  tick() {
    if (this.el.body) {
      this.handlePhysics()
      this.handleAnimation()
    }
  },

  // Handles character physics and movement.
  handlePhysics() {
    this.el.body.activate()

    const currentVelocity = this.el.body.getLinearVelocity()

    if (this.dragging) {
      const velocity = new Ammo.btVector3(this.direction.x * this.forceMagnitude, currentVelocity.y(), this.direction.z * this.forceMagnitude)
      this.el.body.setLinearVelocity(velocity)
    } else {
      currentVelocity.setX(currentVelocity.x() * this.decelerationFactor)
      currentVelocity.setZ(currentVelocity.z() * this.decelerationFactor)
      this.el.body.setLinearVelocity(currentVelocity)
    }

    if (this.direction.length() > 0) {
      const rotationAngle = Math.atan2(this.direction.x, this.direction.z)
      const childModel = document.getElementById('characterModel')
      if (childModel) {
        childModel.object3D.rotation.y = rotationAngle
      }
    }
  },

  // Triggered on start of joystick drag.
  onStartDrag(e) {
    e.preventDefault()

    if (e.isHandled) return

    let clientX

    if (e.touches) {
      clientX = e.touches[0].clientX
      if (clientX <= window.innerWidth / 2) return
      this.joystickTouchIdentifier = e.touches[0].identifier
    } else {
      clientX = e.clientX
      if (clientX <= window.innerWidth / 2) return
    }

    const originRect = this.joystickOrigin.getBoundingClientRect()
    this.joystickCenter = {
      x: originRect.left + originRect.width / 2,
      y: originRect.top + originRect.height / 2,
    }
    this.dragging = true
  },

  // Update character direction while dragging joystick.
  onDrag(e) {
    let clientX; let
      clientY
    if (e.touches) {
      let touch = null
      for (let i = 0; i < e.touches.length; i++) {
        if (e.touches[i].identifier === this.joystickTouchIdentifier) {
          touch = e.touches[i]
          break
        }
      }
      if (!touch) return
      clientX = touch.clientX
      clientY = touch.clientY
    } else {
      if (e.clientX <= window.innerWidth / 2) return
      clientX = e.clientX
      clientY = e.clientY
    }

    if (!this.dragging) return

    const deltaX = clientX - this.joystickCenter.x
    const deltaY = clientY - this.joystickCenter.y
    const angle = Math.atan2(deltaY, deltaX)
    const distance = Math.min(this.joystickOrigin.offsetWidth / 2, Math.sqrt(deltaX * deltaX + deltaY * deltaY))

    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance

    this.joystickPosition.style.transform = `translate(${x - 50}%, ${y - 50}%)`

    // Convert the 2D joystick direction to a 3D direction relative to the camera
    const cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(this.cameraEl.object3D.quaternion)
    const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(this.cameraEl.object3D.quaternion)
    const worldDirection = new THREE.Vector3()
    worldDirection.addVectors(cameraRight.multiplyScalar(x), cameraDirection.multiplyScalar(-y)).normalize()

    this.direction.copy(worldDirection)
  },

  // Reset after joystick interaction ends.
  onEndDrag(e) {
    let found = false
    if (e.changedTouches && this.joystickTouchIdentifier !== undefined) {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this.joystickTouchIdentifier) {
          found = true
          break
        }
      }
      if (!found) return
    }

    this.dragging = false
    this.joystickPosition.style.transform = 'translate(-50%, -50%)'
    this.direction.set(0, 0, 0)
  },

  // Cleanup registered event listeners.
  remove() {
    this.joystickOrigin.removeEventListener('mousedown', this.onStartDrag)
    window.removeEventListener('mousemove', this.onDrag)
    window.removeEventListener('mouseup', this.onEndDrag)

    this.joystickOrigin.removeEventListener('touchstart', this.onStartDrag)
    window.removeEventListener('touchmove', this.onDrag)
    window.removeEventListener('touchend', this.onEndDrag)

    this.raycaster.removeEventListener('raycaster-intersection', this.onGrounded)
    this.raycaster.removeEventListener('raycaster-intersection-cleared', this.offGrounded)
  },

  // Handle character's grounded state.
  onGrounded() {
    this.groundIntersectCount++
    this.isGrounded = true
    // console.log('Character is grounded.')

    if (this.isJumping) {
      setTimeout(() => {
        const childModel = document.getElementById('characterModel')
        if (childModel) {
          childModel.setAttribute('animation-mixer', {
            clip: 'IDLE',
            loop: 'repeat',
            crossFadeDuration: 0.4,
          })
        }
      }, 1000)
    }
    if (this.fallTimeout) {
      clearTimeout(this.fallTimeout)
      this.fallTimeout = null
      this.shouldBeFalling = false
    }
  },

  // Handle when character is no longer grounded (jumping).
  offGrounded() {
    this.groundIntersectCount--

    if (this.groundIntersectCount <= 0) {
      this.groundIntersectCount = 0
      this.isGrounded = false
      // console.log('Character is NOT grounded.')

      if (!this.fallTimeout) {
        this.fallTimeout = setTimeout(() => {
          if (!this.isGrounded) {
            this.shouldBeFalling = true
            this.handleAnimation()
          }
        }, 200)
      }
    }
  },
}

export {characterControllerComponent}
