const characterInputComponent = {
  schema: {
    speed: {type: 'number', default: 0.0008},  // base movement speed
  },
  init() {
    this.camera = document.getElementById('camera')
    this.avatar = this.el.object3D
    this.usedJoystick = false
    /// ////////////////////////////// TOUCHSCREEN SETUP //////////////////////////////////////////
    this.handleTouch = (e) => {
      this.positionRaw = e.detail.positionRaw
      this.startPositionRaw = this.startPositionRaw || this.positionRaw
    }
    this.clearTouch = (e) => {
      this.startPositionRaw = null
      window.isMoving = false
    }
    window.addEventListener('onefingerstart', this.handleTouch)
    window.addEventListener('onefingermove', this.handleTouch)
    window.addEventListener('onefingerend', this.clearTouch)
    const overlay = document.getElementById('overlay')
    window.joystickParent = document.createElement('div')
    window.joystickParent.classList.add('joystick-container', 'absolute-fill', 'shadowed')
    this.joystickPosition = document.createElement('div')
    this.joystickPosition.classList.add('joystick', 'position')
    window.joystickParent.appendChild(this.joystickPosition)
    this.joystickOrigin = document.createElement('div')
    this.joystickOrigin.classList.add('joystick', 'origin')
    window.joystickParent.appendChild(this.joystickOrigin)
    overlay.appendChild(window.joystickParent)
    /// ////////////////////////////// CONTROLLER SETUP //////////////////////////////////////////
    this.hasGamepad = false
    // traditional gamepad setup
    window.addEventListener('gamepadconnected', (e) => {
      const gp = navigator.getGamepads()[e.gamepad.index]
      this.hasGamepad = true
      // instructText.innerText = 'MOVE LEFT JOYSTICK TO WALK'
    })
    // xr controller setup
    this.el.sceneEl.addEventListener('enter-vr', () => {
      this.el.sceneEl.xrSession.addEventListener('inputsourceschange', (e) => {
        if (e.added.length !== 0) {
          if (e.added[0].gamepad.axes.length === 0) {
            this.vrType = 'hands'
            // instructText.innerText = 'PINCH AND DRAG TO WALK'
          } else if (e.added[0].gamepad.axes.length === 4) {
            this.vrType = 'controllers'
            // instructText.innerText = 'MOVE LEFT JOYSTICK TO WALK'
          }
        }
        this.hasGamepad = true
        this.isInHeadset = true
      })
    })
    /// ////////////////////////////// KEYBOARD SETUP //////////////////////////////////////////
    this.usingKeyboard = false
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        this.fwd = true
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        this.back = true
      }
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        this.left = true
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        this.right = true
      }
      if (!this.usingKeyboard) {
        this.usingKeyboard = true
      }
      // instructText.innerText = 'WASD OR ARROWS TO WALK'
    }
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        this.fwd = false
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        this.back = false
      }
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        this.left = false
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        this.right = false
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
  },
  update() {
    window.speed = this.data.speed
  },
  tick(time, timeDelta) {
    const sensitivity = 0.3
    /// ////////////////////////////// INPUT SELECTION //////////////////////////////////
    const inputCheck = (input) => {
      switch (input) {
        case 'xrGamepad':
          // VR controller (i.e. Oculus Quest)
          if (this.vrType === 'controllers' && this.el.sceneEl.xrSession.inputSources.length > 0) {
            const controllers = Array.from(this.el.sceneEl.xrSession.inputSources)
            let vrLeftVert; let
              vrLeftHoriz
            // left thumbstick controls character
            for (let i = 0; i < controllers.length; i++) {
              if (controllers[i].handedness === 'left') {
                vrLeftVert = this.el.sceneEl.xrSession.inputSources[i].gamepad.axes[3]
                vrLeftHoriz = this.el.sceneEl.xrSession.inputSources[i].gamepad.axes[2]
              }
            }
            if (vrLeftVert > sensitivity || vrLeftVert < -sensitivity || vrLeftHoriz < -sensitivity || vrLeftHoriz > sensitivity) {
              window.forward = -Math.min(Math.max(-1, vrLeftVert), 1)
              window.side = -Math.min(Math.max(-1, vrLeftHoriz), 1)
              window.isMoving = true
            } else {
              window.isMoving = false
            }
          }
          break
        case 'gamepad':
          // traditional gamepad (i.e. Xbox, Playstation, etc)
          if (this.gamepads[0]) {
            const gamepadLeftVert = this.gamepads[0].axes[1]
            const gamepadLeftHoriz = this.gamepads[0].axes[0]
            if (gamepadLeftVert > sensitivity || gamepadLeftVert < -sensitivity || gamepadLeftHoriz < -sensitivity || gamepadLeftHoriz > sensitivity) {
              window.forward = -Math.min(Math.max(-1, gamepadLeftVert), 1)
              window.side = -Math.min(Math.max(-1, gamepadLeftHoriz), 1)
              window.isMoving = true
            } else {
              window.isMoving = false
            }
          }
          break
        case 'keyboard':
          if (!this.fwd && !this.back && !this.left && !this.right) {
            this.usingKeyboard = false
            window.isMoving = false
            return
          }
          // diagonal controls
          if (this.fwd && this.left) {
            window.forward = -Math.min(Math.max(-1, -1), 1)
            window.side = -Math.min(Math.max(-1, -1), 1)
          }
          if (this.fwd && this.right) {
            window.forward = -Math.min(Math.max(-1, -1), 1)
            window.side = -Math.min(Math.max(-1, 1), 1)
          }
          if (this.back && this.left) {
            window.forward = -Math.min(Math.max(-1, 1), 1)
            window.side = -Math.min(Math.max(-1, -1), 1)
          }
          if (this.back && this.right) {
            window.forward = -Math.min(Math.max(-1, 1), 1)
            window.side = -Math.min(Math.max(-1, 1), 1)
          }
          // cardinal controls
          if (this.fwd && !this.left && !this.right) {
            window.forward = -Math.min(Math.max(-1, -1), 1)
            window.side = 0
          }
          if (this.back && !this.left && !this.right) {
            window.forward = -Math.min(Math.max(-1, 1), 1)
            window.side = 0
          }
          if (this.left && !this.fwd && !this.back) {
            window.forward = 0
            window.side = -Math.min(Math.max(-1, -1), 1)
          }
          if (this.right && !this.fwd && !this.back) {
            window.forward = 0
            window.side = -Math.min(Math.max(-1, 1), 1)
          }
          window.isMoving = true
          break
        default:
          // touch input
          if (this.offsetY > sensitivity || this.offsetY < -sensitivity || this.offsetX < -sensitivity || this.offsetX > sensitivity) {
            window.forward = -Math.min(Math.max(-1, this.offsetY), 1)
            window.side = -Math.min(Math.max(-1, this.offsetX), 1)
            window.isMoving = true
            if (!this.usedJoystick) {
              this.usedJoystick = true
            }
          } else {
            window.isMoving = false
          }
      }
    }
    /// ////////////////////////////// TOUCHSCREEN MANAGEMENT //////////////////////////////////////////
    const {startPositionRaw, positionRaw, headModel} = this
    if (startPositionRaw) {
      const isTablet = window.matchMedia('(min-width: 640px)').matches
      const isDesktop = window.matchMedia('(min-width: 961px)').matches
      const maxRawDistance = Math.min(window.innerWidth, window.innerHeight) / (isDesktop ? 18 : isTablet ? 17 : 8)
      let rawOffsetX = positionRaw.x - startPositionRaw.x
      let rawOffsetY = positionRaw.y - startPositionRaw.y
      const rawDistance = Math.sqrt((rawOffsetX ** 2) + (rawOffsetY ** 2))
      if (rawDistance > maxRawDistance) {  // Normalize to maxRawDistance
        rawOffsetX *= maxRawDistance / rawDistance
        rawOffsetY *= maxRawDistance / rawDistance
      }
      const widthScale = 100 / window.innerWidth
      const heightScale = 100 / window.innerHeight
      window.joystickParent.classList.add('visible')
      this.joystickOrigin.style.left = `${startPositionRaw.x * widthScale}%`
      this.joystickOrigin.style.top = `${startPositionRaw.y * heightScale}%`
      this.joystickPosition.style.left = `${(startPositionRaw.x + rawOffsetX) * widthScale}%`
      this.joystickPosition.style.top = `${(startPositionRaw.y + rawOffsetY) * heightScale}%`
      this.offsetX = rawOffsetX / maxRawDistance
      this.offsetY = rawOffsetY / maxRawDistance
      inputCheck()
    } else if (this.hasGamepad === true) {
    /// ////////////////////////////// CONTROLLER MANAGEMENT //////////////////////////////////////////
      this.gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [])
      if (!this.gamepads) {
        return
      }
      if (this.isInHeadset) {
        inputCheck('xrGamepad')
      } else {
        inputCheck('gamepad')
      }
    }
    if (this.usingKeyboard === true) {
      inputCheck('keyboard')
    }
    if (window.isMoving) {
      const camY = this.camera.object3D.rotation.y  // get y rot of camera
      window.joystickRot = Math.atan2(window.forward, window.side)
      window.joystickRot -= camY

      const avatarPosZ = this.avatar.position.z.toFixed(2)
      if (avatarPosZ <= -0.2) {
        this.avatar.position.z -= window.speed * Math.sin(window.joystickRot) * timeDelta
      } else {
        this.avatar.position.z = -0.2
      }
      this.avatar.position.x -= window.speed * Math.cos(window.joystickRot) * timeDelta
      this.avatar.rotation.y = -window.joystickRot - Math.PI / 2
    } else {
      window.joystickParent.classList.remove('visible')
      window.forward = 0
      window.side = 0
    }
  },
  remove() {
    window.removeEventListener('onefingerstart', this.handleTouch)
    window.removeEventListener('onefingermove', this.handleTouch)
    window.removeEventListener('onefingerend', this.clearTouch)
    window.joystickParent.parentNode.removeChild(window.joystickParent)
  },
}

const characterAnimationComponent = {
  init() {
    this.lastPos = new THREE.Vector3(this.el.object3D.position)
  },
  tick(time, timeDelta) {
    if (!this.el.object3D.position.equals(this.lastPos)) {
      // Animations to call include WALK, IDLE
      this.el.setAttribute('animation-mixer', {
        clip: 'Running',
        loop: 'repeat',
        crossFadeDuration: 0.4,
      })
      this.lastPos.copy(this.el.object3D.position)
    } else {
      this.el.setAttribute('animation-mixer', {
        clip: 'Idle',
        loop: 'repeat',
        crossFadeDuration: 0.4,
      })
    }
  },
}

export {characterInputComponent, characterAnimationComponent}
