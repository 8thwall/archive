const DISABLE_DEACTIVATION = 4

const arenaCenter = -20
const vehicleHome = arenaCenter + 5

const cybertruckMode = false

let inputHoriz = 0
let inputVert = 0
let canFlip = false

// SCORING
const defaultTimeLeft = 90
let timeLeft = 0
const timeInterval = 500
let countUp = 0
let oxygenCollectedCount = 0
let currentlyGame = false

let isPlaying = false

window.addEventListener('click', () => {
  const music = document.querySelector('a-camera').components.sound
  if (!isPlaying) {
    music.playSound()
    isPlaying = true
  }
})

// const frameratehist = []
// let once = false
// const updateFrameRate = (xrSession) => {
//   const raf = xrSession ? xrSession.requestAnimationFrame : window.requestAnimationFrame
//   if (!xrSession && !once) {
//     once = true
//     console.log('NO XR SESSION!!!')
//   }
//   raf(() => updateFrameRate(xrSession))
//   frameratehist.push(Date.now())
//   if (frameratehist.length === 101) {
//       let sum = 0
//       let sumsq = 0
//       for (let i = 1; i < 101; ++i) {
//         let j = i - 1
//         const diff = frameratehist[i] - frameratehist[j]
//         sum += diff
//         sumsq += diff * diff
//       }
//       frameratehist.length = 0
//       console.log(`Mean: ${sum / 100}`)
//   }
// }

const OnSceneStartComponent = {
  init() {
    const sceneEl = this.el
    const loadCover = document.querySelector('#loadcover')

    sceneEl.addEventListener('loaded', () => {
      setTimeout(() => {
        loadCover.classList.add('fade-out')
      }, 1000)

      setTimeout(() => {
        loadCover.style.display = 'none'
      }, 1750)
      console.log('SCENE LOADED')
    })

    // sceneEl.addEventListener('enter-vr', function() {
    //   console.log('ENTERED VR')
    //   // updateFrameRate(sceneEl.xrSession)
    // })
  },
}

window.addEventListener('controllerconnected', (e) => {
  const scene = document.querySelector('a-scene')
  // var gp = navigator.getGamepads()[e.gamepad.index];
  let addedControls = false

  if (!addedControls) {
    scene.setAttribute('controller-selector', {
      currSystem: e.detail.name,
    })
    addedControls = true

    // console.log(e.detail.name)
  }
})

const ControllerSelectorComponent = {
  schema: {
    currSystem: {default: ''},
  },
  init() {
    const scene = document.querySelector('a-scene')
    const controllerL = scene.querySelector('#leftController')
    const controllerR = scene.querySelector('#rightController')
    const flipText = document.querySelector('#flipWarning')

    switch (this.data.currSystem) {
      case 'oculus-go-controls':
        controllerR.setAttribute('oculus-go-controls', {
          model: true,
        })
        controllerR.addEventListener('trackpaddown', (e) => {
          if (canFlip) {
            controllerR.sceneEl.emit('resethere')
          }
          inputVert = 1
        })
        controllerR.addEventListener('trackpadup', (e) => {
          inputVert = 0
        })
        controllerR.insertAdjacentHTML('beforeend', `
        <a-entity id="tooltips">
          <a-entity id="tooltip_touchpad" 
            tooltip="text: Steer (Swipe)\nFlip (Click)\nReverse (Click + Hold);
            width: 0.14; 
            height: 0.05; 
            targetPosition: 0 0.01 0.025; 
            rotation: -90 0 0; 
            lineHorizontalAlign: left; 
            src:#tooltip"
            position="0.12 0 0">
          </a-entity>
          <a-entity id="tooltip_trigger" 
            tooltip="text: Accelerate; 
            width: 0.07; 
            height: 0.03; 
            targetPosition: 0 -0.03 0.01; 
            rotation: -90 0 0; 
            lineHorizontalAlign: right; 
            lineVerticalAlign: bottom; 
            src:#tooltip"
            position="-0.066 -0.027 -0.062">
          </a-entity>
        </a-entity>
        `)
        flipText.setAttribute('value', 'Press trackpad to flip!')
        // console.log('Oculus Go Controller Added')
        break
      case 'oculus-touch-controls':
        controllerR.setAttribute('oculus-touch-controls', {
          hand: 'right',
          model: true,
        })
        // controllerR.addEventListener('abuttondown', function (e) {
        //   controllerR.sceneEl.emit('resetnow')
        // })
        controllerR.addEventListener('bbuttondown', (e) => {
          if (canFlip) {
            controllerR.sceneEl.emit('resethere')
          }
        })
        const touchRight = document.createElement('a-entity')
        touchRight.classList.add('touch-model')
        touchRight.setAttribute('gltf-model', '#rightControllerModel')
        controllerR.appendChild(touchRight)

        controllerR.insertAdjacentHTML('beforeend', `
        <a-entity id="tooltips">
          <a-entity id="tooltip_a" tooltip="text: Flip; width: 0.04; height: 0.03; targetPosition: -0.01 -0.005 -0.01; rotation: -90 0 0; lineHorizontalAlign: left; src:#tooltip"
              position="0.076 0.025 0.02">
          </a-entity>
          <a-entity id="tooltip_trigger" tooltip="text: Accelerate; width: 0.07; height: 0.03; targetPosition: 0.01 -0.03 -0.03; rotation: -90 0 0; lineHorizontalAlign: right; lineVerticalAlign: bottom; src:#tooltip"
              position="-0.066 -0.027 -0.062">
          </a-entity>
          <a-entity id="tooltip_thumb" tooltip="text: Steer; width: 0.05; height: 0.03; targetPosition: 0.02 -0.01 0; lineHorizontalAlign: center; lineVerticalAlign: bottom; rotation: -90 0 0; src:#tooltip"
              position="0.015 0.05 -0.061">
          </a-entity>
          <a-entity id="tooltip_grip" tooltip="text: Reverse; width: 0.06; height: 0.03; targetPosition: -0.005 -0.03 0.03; rotation: -90 0 0; lineHorizontalAlign: right; src:#tooltip"
              position="-0.066 -0.01 0.02" >
          </a-entity>
        </a-entity>
        `)

        controllerL.setAttribute('oculus-touch-controls', {
          hand: 'left',
          model: false,
        })
        const touchLeft = document.createElement('a-entity')
        touchLeft.classList.add('touch-model')
        touchLeft.setAttribute('gltf-model', '#leftControllerModel')
        controllerL.appendChild(touchLeft)

        flipText.setAttribute('value', 'Press B to flip!')

        // console.log('Oculus Touch Controller Added')
        break
      case 'vive-controls':
        controllerR.setAttribute('vive-controls', {
          model: true,
        })
        controllerR.addEventListener('menudown', (e) => {
          if (canFlip) {
            controllerR.sceneEl.emit('resethere')
          }
        })

        controllerR.insertAdjacentHTML('beforeend', `
        <a-entity id="tooltip_touchpad" tooltip="text: Steer; width: 0.1; height: 0.04; targetPosition: -0.1 0.001 -0.02; src: tooltip.png"
                  position="0.1 0.025 0.048"
                  rotation="-90 0 0">
        </a-entity>
        <a-entity id="tooltip_mainmenu" tooltip="text: Flip; width: 0.07; height: 0.03; targetPosition: 0 -0.07 -0.008; lineHorizontalAlign: center; lineVerticalAlign: bottom; src: tooltip.png"
                  position="0 0.015 -0.05"
                  rotation="-90 0 0">
        </a-entity>
        <a-entity id="tooltip_trigger" tooltip="text: Accelerate; width: 0.11; height: 0.04; targetPosition: 0.115 -0.01 0.02; lineHorizontalAlign: right; src: tooltip.png"
                  position="-0.11 -0.055 0.04"
                  rotation="-90 0 0">
        </a-entity>
        <a-entity id="tooltip_grip" tooltip="text: Reverse; width: 0.06; height: 0.03; targetPosition: -0.08 0.035 -0.01; src: tooltip.png"
                  position="0.1 -0.005 0.12"
                  rotation="-90 0 0">
        </a-entity>
        `)

        flipText.setAttribute('value', 'Press Menu to flip!')

        // console.log('Vive Controller Added')
        break
    }

    // console.log('currSystem: ' + this.data.currSystem)
  },
}

const PlayAgainComponent = {
  init() {
    const {el} = this
    const rController = el.sceneEl.querySelector('#rightController')
    const title = el.sceneEl.querySelector('#titleObj')
    const poweredby = el.sceneEl.querySelector('#poweredbyObj')
    const oxParent = el.sceneEl.querySelector('#oxygenUiParent')
    const text = el.sceneEl.querySelector('#text')
    const countTxt = el.sceneEl.querySelector('#countText')
    let inVR = false

    el.sceneEl.addEventListener('enter-vr', () => {
      inVR = true
      if (currentlyGame) {
        el.object3D.visible = false
        title.object3D.visible = false
        poweredby.object3D.visible = false
        text.object3D.visible = false
      } else {
        el.object3D.visible = true
        title.object3D.visible = true
        poweredby.object3D.visible = true
        text.object3D.visible = true
      }
    })

    el.sceneEl.addEventListener('exit-vr', () => {
      inVR = false
      el.object3D.visible = false
      title.object3D.visible = false
      poweredby.object3D.visible = false
      text.object3D.visible = false
    })

    el.addEventListener('mouseenter', () => {
      el.setAttribute('scale', '12 12 12')
    })

    el.addEventListener('mouseleave', () => {
      el.setAttribute('scale', '10 10 10')
    })

    el.addEventListener('click', () => {
      newGame()
    })

    el.sceneEl.addEventListener('newGameEvent', newGame)

    el.sceneEl.addEventListener('showTitleEvent', (e) => {
      showTitle(e.detail.firstGame)
    })

    el.emit('showTitleEvent', {firstGame: true})

    function showTitle(firstGame) {
      currentlyGame = false
      if (firstGame) {
        el.object3D.children[0].el.setAttribute('src', '#startImg')
      } else {
        text.object3D.visible = true
        title.object3D.visible = true
        poweredby.object3D.visible = true
        el.object3D.children[0].el.setAttribute('src', '#playAgainImg')
      }
      if (inVR) {
        el.object3D.visible = true
      }
      oxParent.object3D.visible = false
      // add raycaster to controller
      rController.setAttribute('custom-laser-controls', {
        model: false,
      })
      rController.setAttribute('line', {
        color: '#AD50FF',
        opacity: 1,
      })
      rController.setAttribute('raycaster', {
        enabled: true,
        direction: '0 -0.5 -1',
        origin: '0.015 -0.01 0',
        objects: '.button',
        far: 3,
      })
    }

    function newGame() {
      el.components.sound.playSound()
      setTimeout(() => {
        el.components.sound.stopSound()
      }, 1000)
      currentlyGame = true
      // clear all
      el.sceneEl.emit('clearall')
      // reset rover
      el.sceneEl.emit('resetnow')
      // set first oxygen tank
      el.emit('createNewOxygen', {initSpawn: true})
      // remove raycaster
      rController.setAttribute('line', {
        opacity: 0,
      })
      rController.setAttribute('raycaster', {
        enabled: false,
      })
      oxParent.object3D.visible = true
      // hide 3D UI elements
      el.object3D.visible = false
      title.object3D.visible = false
      poweredby.object3D.visible = false
      text.object3D.visible = false
      // reset countdown
      el.emit('beginCountdown')
      // reset countup
      el.emit('beginCountup')
      // reset oxygenCollectedCount
      oxygenCollectedCount = 0
      countTxt.setAttribute('text', {value: oxygenCollectedCount})
    }
  },
  remove() {
    el.setAttribute('color', '#00d00f')
  },
}

const OxygenMonitorComponent = {
  schema: {
    thetaPos: {default: 360},
  },
  init() {
    const {el} = this

    const updateOxygen = () => {
      this.data.thetaPos = timeLeft * 3.6
      el.setAttribute('geometry', {thetaLength: this.data.thetaPos})

      if (timeLeft > 50) {
        el.setAttribute('material', {color: 'green'})
      } else if (timeLeft >= 25 && timeLeft <= 50) {
        el.setAttribute('material', {color: 'yellow'})
      } else {
        el.setAttribute('material', {color: 'red'})
      }
    }

    el.addEventListener('updateOxygenEvent', updateOxygen)
  },

}

const OxygenCountdownComponent = {
  init() {
    const {el} = this
    const textObj = el.sceneEl.querySelector('#text')

    let countDownInt
    let countUpInt

    function countdown() {
      timeLeft--
      el.emit('updateOxygenEvent')
      // textObj.setAttribute('text', {value: timeLeft})

      if (timeLeft === 1) {
        clearInterval(countDownInt)
        clearInterval(countUpInt)

        const convertedTime = convertTime(countUp)

        el.emit('clearall')
        el.emit('showTitleEvent', {firstGame: false})

        el.components.sound.playSound()
        setTimeout(() => {
          el.components.sound.stopSound()
        }, 1000)

        // textObj.setAttribute('text', {value: 'You survived ' + convertedTime[0] + ' minutes ' +
        // convertedTime[1] + ' seconds by collecting ' + oxygenCollectedCount + ' oxygen containers!'})
        textObj.setAttribute('text', {value: `${oxygenCollectedCount} oxygen tanks collected!`})
      }
    }

    function countup() {
      countUp++
    }

    el.sceneEl.addEventListener('beginCountdown', () => {
      clearInterval(countDownInt)
      countDownInt = setInterval(countdown, timeInterval)
      timeLeft = defaultTimeLeft
    })
    el.sceneEl.addEventListener('beginCountup', () => {
      clearInterval(countUpInt)
      countUpInt = setInterval(countup, 1000)
      countUp = 0
    })

    function convertTime(seconds) {
      let minutes
      var seconds
      minutes = Math.floor(seconds / 60)
      seconds %= 60

      return [minutes, seconds]
    }
  },
}

const InputListenerComponent = {
  init() {
    const {el} = this

    let triggerPress = 0.0
    let gripPress = 0.0

    el.addEventListener('triggerchanged', (e) => {
      triggerPress = e.detail.value
      inputVert = 0.5 * gripPress - triggerPress
      // console.log('triggerchanged: ' + JSON.stringify(e.detail) )
    })

    el.addEventListener('gripchanged', (e) => {
      gripPress = e.detail.value
      inputVert = 0.5 * gripPress - triggerPress
      // console.log('gripchanged: ' + JSON.stringify(e.detail) )
    })

    el.addEventListener('axismove', (e) => {
      inputHoriz = e.detail.axis[2]
      // inputVert = e.detail.axis[1]
      // console.log('axismove: ' + JSON.stringify(e.detail) )
    })
  },
}

const RoverComponent = {
  init() {
    this.target = document.createElement('a-entity')

    this.base = document.createElement('a-entity')
    this.base.id = 'base'
    this.base.object3D.position.y = 0
    this.base.object3D.scale.set(0.25, 0.25, 0.25)
    this.target.appendChild(this.base)

    this.el.sceneEl.appendChild(this.target)

    Ammo().then((ammo) => {
      window.AMMO = ammo
      this.base.setAttribute('rover-scene', '')
    })
  },
  remove() {
    this.el.removeChild(this.target)
  },
}

const ShadowMaterialComponent = {
  init() {
    this.material = new THREE.ShadowMaterial()
    this.el.getOrCreateObject3D('mesh').material = this.material
    this.material.opacity = 0.4
  },
}

const pickupRadius = 5
const hillHeight = 5
const groundHeight = 0.5

const spawnPositions = [
  {  // spawn 0
    position: new THREE.Vector3(2.7, groundHeight, -26),
  },
  {  // spawn 1
    position: new THREE.Vector3(-40, 3, 8),
  },
  {  // spawn 2
    position: new THREE.Vector3(-45, groundHeight, -68),
  },
  {  // spawn 3
    position: new THREE.Vector3(-25, hillHeight, -12.5),
  },
  {  // spawn 4
    position: new THREE.Vector3(9, hillHeight, -17),
  },
  {  // spawn 5
    position: new THREE.Vector3(2, hillHeight, -39),
  },
  {  // spawn 6
    position: new THREE.Vector3(-7, hillHeight, -30),
  },
  {  // spawn 7
    position: new THREE.Vector3(36, hillHeight, -31),
  },
  {  // spawn 8
    position: new THREE.Vector3(-7, groundHeight, -6),
  },
  {  // spawn 9
    position: new THREE.Vector3(22, groundHeight, -10),
  },
  {  // spawn 10
    position: new THREE.Vector3(-41, groundHeight, -38),
  },
  {  // spawn 11
    position: new THREE.Vector3(-3, groundHeight, -63),
  },
  {  // spawn 12
    position: new THREE.Vector3(-58, 10, -17),
  },
  {  // spawn 13
    position: new THREE.Vector3(-51, hillHeight, -56),
  },
  {  // spawn 14
    position: new THREE.Vector3(43.3, 7, -62),
  },
]

const hillY = -0.3
const hillScale = 250
const hillRot = 0
const hillModel = '#hill1Model'

const hillPositions = [
  {  // hill 1
    position: new THREE.Vector3(9, hillY, -17),
    rotation: new THREE.Vector3(hillRot, hillRot, hillRot),
    scale: new THREE.Vector3(hillScale, hillScale, hillScale),
    model: hillModel,
  },
  {  // hill 2
    position: new THREE.Vector3(-25, -0.5, -14),
    rotation: new THREE.Vector3(hillRot, hillRot, hillRot),
    scale: new THREE.Vector3(hillScale, hillScale, hillScale),
    model: hillModel,
  },
  {  // hill 3
    position: new THREE.Vector3(-17, -2.5, -76),
    rotation: new THREE.Vector3(hillRot, hillRot, hillRot),
    scale: new THREE.Vector3(450, 450, 450),
    model: hillModel,
  },
  {  // hill 4
    position: new THREE.Vector3(-90, 20, -35),
    rotation: new THREE.Vector3(hillRot, hillRot, -0.959931),
    scale: new THREE.Vector3(1800, 500, 1800),
    model: hillModel,
  },
  {  // hill 5
    position: new THREE.Vector3(0.4, 4.5, 43.5),
    rotation: new THREE.Vector3(-0.872665, 0, 0),
    scale: new THREE.Vector3(1500, 800, 800),
    model: hillModel,
  },
  {  // hill 6
    position: new THREE.Vector3(15, hillY, -60),
    rotation: new THREE.Vector3(hillRot, hillRot, hillRot),
    scale: new THREE.Vector3(hillScale, hillScale, hillScale),
    model: hillModel,
  },
  {  // hill 7
    position: new THREE.Vector3(-22, -0.5, -48),
    rotation: new THREE.Vector3(hillRot, hillRot, hillRot),
    scale: new THREE.Vector3(500, 250, 500),
    model: hillModel,
  },
  {  // hill 8
    position: new THREE.Vector3(36, -1.5, -31),
    rotation: new THREE.Vector3(hillRot, 0.698132, hillRot),
    scale: new THREE.Vector3(500, 350, 500),
    model: hillModel,
  },
  {  // hill 9
    position: new THREE.Vector3(-40, hillY, 7),
    rotation: new THREE.Vector3(hillRot, hillRot, hillRot),
    scale: new THREE.Vector3(150, 150, 150),
    model: hillModel,
  },
  {  // hill 10
    position: new THREE.Vector3(22, hillY, 2),
    rotation: new THREE.Vector3(hillRot, hillRot, hillRot),
    scale: new THREE.Vector3(hillScale, hillScale, hillScale),
    model: hillModel,
  },
  {  // hill 11
    position: new THREE.Vector3(-50, hillY, -55),
    rotation: new THREE.Vector3(hillRot, hillRot, hillRot),
    scale: new THREE.Vector3(hillScale, hillScale, hillScale),
    model: hillModel,
  },
  {  // hill 12
    position: new THREE.Vector3(-50, hillY, -30),
    rotation: new THREE.Vector3(hillRot, -2.35619, hillRot),
    scale: new THREE.Vector3(500, 500, 500),
    model: '#hill3Model',
  },
  {  // hill 13
    position: new THREE.Vector3(-11, -0.8, -26),
    rotation: new THREE.Vector3(hillRot, 0.436332, hillRot),
    scale: new THREE.Vector3(250, 250, 250),
    model: '#hill2Model',
  },
  {  // hill 14
    position: new THREE.Vector3(7, 0, -42),
    rotation: new THREE.Vector3(hillRot, Math.PI, hillRot),
    scale: new THREE.Vector3(250, 250, 250),
    model: '#hill3Model',
  },
  {  // hill 15
    position: new THREE.Vector3(-16, -0.5, 11.8),
    rotation: new THREE.Vector3(hillRot, Math.PI, hillRot),
    scale: new THREE.Vector3(250, 250, 250),
    model: hillModel,
  },
  {  // hill 16
    position: new THREE.Vector3(-60, 4, -107),
    rotation: new THREE.Vector3(hillRot, 2.19911, hillRot),
    scale: new THREE.Vector3(1000, 1000, 1000),
    model: '#hill3Model',
  },
  {  // hill 17
    position: new THREE.Vector3(60, -1, 20),
    rotation: new THREE.Vector3(hillRot, -2.44346095, hillRot),
    scale: new THREE.Vector3(350, 350, 350),
    model: '#rock2Model',
  },
  {  // hill 18
    position: new THREE.Vector3(85, -1, -65.5),
    rotation: new THREE.Vector3(hillRot, 2.42601, hillRot),
    scale: new THREE.Vector3(500, 500, 500),
    model: '#rock3Model',
  },
  {  // hill 19
    position: new THREE.Vector3(35, -0.8, -62),
    rotation: new THREE.Vector3(hillRot, -0.261799, hillRot),
    scale: new THREE.Vector3(350, 350, 350),
    model: '#hill2Model',
  },
]

let oxygenSpawnedCount = 0
let lastSpawnPos
let lastSpawnValue = 0
const collectedOxygen = new Set()

const RoverSceneComponent = {
  init() {
    const {el} = this
    this.collisionConfiguration = new AMMO.btDefaultCollisionConfiguration()
    this.dispatcher = new AMMO.btCollisionDispatcher(this.collisionConfiguration)
    this.broadphase = new AMMO.btDbvtBroadphase()
    this.solver = new AMMO.btSequentialImpulseConstraintSolver()

    this.physicsWorld = new AMMO.btDiscreteDynamicsWorld(this.dispatcher, this.broadphase, this.solver, this.collisionConfiguration)
    this.physicsWorld.setGravity(new AMMO.btVector3(0, -20.86, 0))

    this.tempTransform = new AMMO.btTransform()

    this.movableObjects = []
    this.bodyCount = 0
    this.bodyIndexToObject3D = {}

    this.addRigidBody = (object3D, physicsShape, mass, velocity, angularVelocity) => {
      mass = mass || 0

      const transform = new AMMO.btTransform()
      transform.setIdentity()
      transform.setOrigin(new AMMO.btVector3(object3D.position.x, object3D.position.y, object3D.position.z))
      transform.setRotation(new AMMO.btQuaternion(object3D.quaternion.x, object3D.quaternion.y, object3D.quaternion.z, object3D.quaternion.w))
      const motionState = new AMMO.btDefaultMotionState(transform)

      const localInertia = new AMMO.btVector3(0, 0, 0)
      physicsShape.calculateLocalInertia(mass, localInertia)

      const rbInfo = new AMMO.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia)
      const body = new AMMO.btRigidBody(rbInfo)

      if (velocity) {
        body.setLinearVelocity(new AMMO.btVector3(velocity.x, velocity.y, velocity.z))
      }
      if (angularVelocity) {
        body.setAngularVelocity(new AMMO.btVector3(angularVelocity.x, angularVelocity.y, angularVelocity.z))
      }

      // Disable deactivation
      body.setActivationState(DISABLE_DEACTIVATION)

      object3D.userData.physicsBody = body
      object3D.userData.collided = false

      if (mass > 0) {
        this.movableObjects.push(object3D)
        // Disable deactivation
        body.setActivationState(4)
      }

      body.setUserIndex(this.bodyCount)
      this.bodyIndexToObject3D[this.bodyCount] = object3D
      this.bodyCount++

      body.setFriction(0.5)

      this.physicsWorld.addRigidBody(body)
      return body
    }

    this.removeBody = (body) => {
      const index = this.movableObjects.indexOf(body)
      if (index >= 0) {
        this.movableObjects.splice(index, 1)
      }

      delete this.bodyIndexToObject3D[body.getUserIndex()]

      this.physicsWorld.removeRigidBody(body)
    }

    const groundSize = 500
    const groundShape = new AMMO.btBoxShape(new AMMO.btVector3(groundSize, 0.5, groundSize))
    const ground = document.createElement('a-box')
    ground.id = 'ground'
    ground.setAttribute('material', 'color: #9D9D9D')
    ground.setAttribute('visible', 'false')
    ground.object3D.scale.set(groundSize * 2, 0.5, groundSize * 2)
    ground.object3D.position.y = -0.25
    this.addRigidBody(ground.object3D, groundShape)
    this.el.appendChild(ground)

    const writeVector3FromPositionArray = (positions, positionIndex, vector3, scale = 1) => {
      vector3.setValue(positions[positionIndex] * scale.x, positions[positionIndex + 1] * scale.y, positions[positionIndex + 2] * scale.z)
    }

    const getTriangleShape = (geometry, scale = 1, doubleSided = false) => {
      const indices = geometry.index.array
      const positions = geometry.attributes.position.array

      const vertexCount = indices.length

      const vertex1 = new AMMO.btVector3()
      const vertex2 = new AMMO.btVector3()
      const vertex3 = new AMMO.btVector3()

      const triangleMesh = new AMMO.btTriangleMesh()

      for (let i = 0; i < vertexCount;) {
        writeVector3FromPositionArray(positions, indices[i++] * 3, vertex1, scale)
        writeVector3FromPositionArray(positions, indices[i++] * 3, vertex2, scale)
        writeVector3FromPositionArray(positions, indices[i++] * 3, vertex3, scale)

        triangleMesh.addTriangle(vertex1, vertex2, vertex3)
        if (doubleSided) {
          triangleMesh.addTriangle(vertex1, vertex3, vertex2)
        }
      }
      return new AMMO.btBvhTriangleMeshShape(triangleMesh)
    }

    const craterScale = 600
    const crater = document.createElement('a-entity')
    crater.id = 'crater'
    crater.setAttribute('gltf-model', '#craterModel')
    crater.object3D.position.set(0, 0.3, arenaCenter - 15)
    crater.object3D.rotation.y = 0.785398
    if (cybertruckMode) {
      crater.setAttribute('set-color', 'red: 0.4; green: 0.1; blue: 0;')
    } else {
      crater.setAttribute('set-color', 'red: 0.5; green: 0.5; blue: 0.5;')
    }
    crater.setAttribute('shadow', '')
    crater.object3D.scale.set(craterScale, craterScale, craterScale)
    this.el.appendChild(crater)

    let hillCount = 0

    for (let i = 0; i < hillPositions.length; i++) {
      hillCount++
      let hillName = 'hill'
      hillName += hillCount.toString()
      // console.log(hillName)

      const newHill = document.createElement('a-entity')
      newHill.id = hillName
      newHill.object3D.position.set(hillPositions[i].position.x, hillPositions[i].position.y, hillPositions[i].position.z)
      newHill.object3D.rotation.set(hillPositions[i].rotation.x, hillPositions[i].rotation.y, hillPositions[i].rotation.z)
      newHill.object3D.scale.set(hillPositions[i].scale.x, hillPositions[i].scale.y, hillPositions[i].scale.z)
      newHill.classList.add('hill')
      newHill.addEventListener('model-loaded', () => {
        const {geometry} = newHill.getObject3D('mesh').children.filter(c => c.name === 'RootNode')[0].children[0]
        const triangleMeshShape = getTriangleShape(geometry, newHill.object3D.scale, true)
        this.addRigidBody(newHill.object3D, triangleMeshShape)
      })
      newHill.setAttribute('gltf-model', hillPositions[i].model)
      if (cybertruckMode) {
        newHill.setAttribute('set-color', 'red: 0.4; green: 0.1; blue: 0;')
      } else {
        newHill.setAttribute('set-color', 'red: 0.5; green: 0.5; blue: 0.5;')
      }
      newHill.setAttribute('shadow', 'cast: false')
      this.el.appendChild(newHill)
    }

    const flag = document.createElement('a-entity')
    flag.object3D.position.set(-28, 0, -33)
    flag.object3D.scale.set(25, 25, 25)
    flag.setAttribute('shadow', '')
    flag.setAttribute('gltf-model', '#flagModel')
    this.el.appendChild(flag)

    // Circle of invisible blockers to set bounds
    const blockerCount = 10
    const blockerOpacity = 0
    const blockerHeight = 60
    const blockerWidth = 55
    const blockerThickness = 1
    const fenceWidth = 75
    const fenceLength = 70

    const blockerShape = new AMMO.btBoxShape(new AMMO.btVector3(blockerWidth / 2, blockerHeight / 2, blockerThickness / 2))

    for (let i = 0; i < blockerCount; i++) {
      const blocker = document.createElement('a-box')
      blocker.classList.add('blocker')
      blocker.setAttribute('material', {color: 'red', transparent: true, opacity: blockerOpacity})

      const blockerAngle = i * 2 * Math.PI / blockerCount
      blocker.object3D.scale.set(blockerWidth, blockerHeight, blockerThickness)
      blocker.object3D.rotation.y = blockerAngle
      blocker.object3D.position.set(fenceWidth * Math.sin(blockerAngle), 0, fenceLength * Math.cos(blockerAngle) + arenaCenter - 4)

      this.addRigidBody(blocker.object3D, blockerShape)

      this.el.appendChild(blocker)
    }

    function getRandomInt(min, max, exclude) {
      min = Math.ceil(min)
      max = Math.floor(max)
      let randInt = Math.floor(Math.random() * (max - min)) + min
      if (randInt == exclude) {
        // console.log('same value')
        if (randInt < max - 1) {
          randInt++
          // console.log('increment randValue')
        } else {
          randInt--
          // console.log('decrement randValue')
        }
      }
      return randInt  // The maximum is exclusive and the minimum is inclusive
    }

    const countText = el.sceneEl.querySelector('#countText')

    function newOxygen(initSpawn) {
      let spawnPos
      const baseEl = document.getElementById('base')

      oxygenSpawnedCount++
      let oxygenName = 'oxygen'
      oxygenName += oxygenSpawnedCount.toString()
      // console.log(oxygenName)

      if (!initSpawn) {
        const randValue = getRandomInt(0, spawnPositions.length, lastSpawnValue)
        // console.log('spawn: ' + randValue + ' | lastSpawnPos: ' + lastSpawnValue)
        spawnPos = spawnPositions[randValue]
        timeLeft += 10
        oxygenCollectedCount++
        countText.setAttribute('text', {value: oxygenCollectedCount})
        lastSpawnValue = randValue
      } else {
        spawnPos = spawnPositions[0]
      }

      const oxygenObj = document.createElement('a-entity')
      oxygenObj.classList.add('oxygen')
      oxygenObj.id = oxygenName
      oxygenObj.setAttribute('sound', {
        src: '#pickupSnd',
        rolloffFactor: 0.5,
      })
      oxygenObj.setAttribute('gltf-model', '#oxygenModel')
      oxygenObj.object3D.scale.set(60, 60, 60)
      oxygenObj.object3D.rotation.x = -0.5
      oxygenObj.setAttribute('shadow', '')
      oxygenObj.setAttribute('animation__spin', {
        property: 'object3D.rotation.y',
        from: 0,
        to: 360,
        easing: 'linear',
        dur: 5000,
        loop: true,
      })
      oxygenObj.object3D.position.copy(spawnPos.position)
      baseEl.appendChild(oxygenObj)
    }

    el.sceneEl.addEventListener('createNewOxygen', (e) => {
      newOxygen(e.detail.initSpawn)
    })

    function clearOxygen() {
      const oxygenList = el.sceneEl.querySelectorAll('.oxygen')
      for (let i = 0; i < oxygenList.length; i++) {
        oxygenList[i].parentNode.removeChild(oxygenList[i])
      }
    }

    el.sceneEl.addEventListener('clearall', () => {
      clearOxygen()
    })

    // let rig = document.querySelector('#rig') // uncomment for FPV mode

    const vehicle = document.createElement('a-entity')
    vehicle.id = 'vehicle'
    vehicle.object3D.rotation.y = Math.PI
    vehicle.object3D.position.x = -2
    vehicle.object3D.position.y = 0.5
    vehicle.object3D.position.z = vehicleHome
    vehicle.setAttribute('vehicle', '')
    vehicle.setAttribute('shadow', '')
    vehicle.setAttribute('vehicle-monitor', '')
    this.el.appendChild(vehicle)
    this.vehicle = vehicle

    // this.vehicle.object3D.add(rig.object3D) // uncomment for FPV mode

    const flipWarn = document.createElement('a-text')
    flipWarn.id = 'flipWarning'
    flipWarn.object3D.visible = false
    flipWarn.setAttribute('side', 'double')
    flipWarn.setAttribute('attach', {
      target: 'vehicle',
      yOffset: 5,
    })
    flipWarn.setAttribute('font', 'monoid')
    flipWarn.setAttribute('width', 2)
    flipWarn.setAttribute('align', 'center')
    this.el.appendChild(flipWarn)

    this.el.sceneEl.addEventListener('addbody', (e) => {
      const {object3D, physicsShape, mass, velocity} = e.detail
      if (mass === undefined) {
        mass = 0
      }
      this.addRigidBody(object3D, physicsShape, mass, velocity)
    })

    this.el.sceneEl.addEventListener('removebody', (e) => {
      const {physicsBody} = e.detail
      this.removeBody(physicsBody)
    })
  },
  tick(time, timeDelta) {
    if (this.physicsWorld) {
      const {el} = this
      this.physicsWorld.stepSimulation(timeDelta / 1000, 10)

      // Update objects
      this.movableObjects.forEach((object3D) => {
        const body = object3D.userData.physicsBody

        const motion = body && body.getMotionState()

        if (!motion) {
          return
        }

        motion.getWorldTransform(this.tempTransform)
        const p = this.tempTransform.getOrigin()
        const q = this.tempTransform.getRotation()
        object3D.position.set(p.x(), p.y(), p.z())
        object3D.quaternion.set(q.x(), q.y(), q.z(), q.w())
        object3D.userData.collided = false
      })

      const oxygenList = this.el.sceneEl.querySelectorAll('.oxygen')

      function checkDistance(oxobj) {
        if (oxobj.collected) {
          return
        }

        const distance = vehicle.object3D.position.distanceTo(oxobj.object3D.position)

        if (distance < pickupRadius && !collectedOxygen.has(oxobj.id)) {
          oxobj.collected = true
          collectedOxygen.add(oxobj.id)

          // console.log(`collected oxygen tank ${oxobj.id}`)

          oxobj.setAttribute('animation__hide', {
            property: 'scale',
            to: '0.001 0.001 0.001',
            dur: 300,
          })

          oxobj.components.sound.playSound()
          setTimeout(() => {
            oxobj.components.sound.stopSound()
          }, 1000)

          el.emit('createNewOxygen', {initSpawn: false})

          setTimeout(() => {
            oxobj.parentNode.removeChild(oxobj)
          }, 2000)
        }
      }

      oxygenList.forEach(checkDistance)
    }
  },
  remove() {
    AMMO.destroy(this.physicsWorld)
    AMMO.destroy(this.solver)
    AMMO.destroy(this.broadphase)
    AMMO.destroy(this.dispatcher)
    AMMO.destroy(this.collisionConfiguration)
  },
}

// Vehicle contants
const chassisWidth = 1.8
const chassisHeight = 0.5
const chassisLength = 3
const massVehicle = 550

const wheelRadiusFront = 0.7
const wheelWidthFront = 0.7

const wheelRadiusBack = 0.7
const wheelWidthBack = 0.7

const wheelHalfTrackFront = 1.2
const wheelAxisHeightFront = 0.4

const wheelHalfTrackBack = 1.2
const wheelAxisHeightBack = 0.4

let wheelAxisFrontPosition = 1.5
const wheelAxisPositionBack = -1.5

const friction = 18000

const suspensionStiffness = 90
const suspensionDamping = 5
const suspensionCompression = 4.4
const suspensionRestLength = 0.5

const rollInfluence = 0.12
const steeringIncrement = 0.04

const steeringClamp = 0.5
const maxEngineForce = 12000
const maxBrakingForce = 100

const FRONT_LEFT = 0
const FRONT_RIGHT = 1
const BACK_LEFT = 2
const BACK_RIGHT = 3

const SHOW_CHASSIS = false

const VehicleComponent = {
  init() {
    const baseEl = document.getElementById('base')
    const physicsScene = baseEl.object3D
    const {physicsWorld} = baseEl.components['rover-scene']

    const pos = this.el.object3D.position
    const quat = this.el.object3D.quaternion

    // Chassis
    const geometry = new Ammo.btBoxShape(new Ammo.btVector3(chassisWidth * 0.5, chassisHeight * 0.5, chassisLength * 0.5))
    const transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
    const motionState = new Ammo.btDefaultMotionState(transform)
    const localInertia = new Ammo.btVector3(0, 0, 0)
    geometry.calculateLocalInertia(massVehicle, localInertia)
    const body = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(massVehicle, motionState, geometry, localInertia))
    body.setActivationState(DISABLE_DEACTIVATION)
    physicsWorld.addRigidBody(body)
    this.el.object3D.userData.physicsBody = body

    if (!SHOW_CHASSIS) {
      const chassisModel = document.createElement('a-entity')
      if (cybertruckMode) {
        chassisModel.setAttribute('gltf-model', '#cyberTruckModel')
        chassisModel.object3D.scale.set(16, 16, 16)
        chassisModel.object3D.position.y = -0.3
        chassisModel.object3D.position.z = 0.070
      } else {
        chassisModel.setAttribute('gltf-model', '#roverBodyModel')
        chassisModel.object3D.scale.set(25, 25, 25)
        chassisModel.object3D.position.y = 0.3

        const headModel = document.createElement('a-entity')
        headModel.setAttribute('gltf-model', '#roverHeadModel')
        headModel.object3D.scale.set(25, 25, 25)
        headModel.object3D.position.set(0.5, 2, 0.55)
        this.el.appendChild(headModel)
        this.headModel = headModel

        const santaHat = document.createElement('a-entity')
        santaHat.id = 'santahat'
        santaHat.setAttribute('gltf-model', '#santaHatModel')
        santaHat.object3D.rotation.y = Math.PI / 2
        santaHat.object3D.scale.set(0.9, 0.9, 0.9)
        santaHat.object3D.position.set(0, 0.015, 0)
        this.headModel.appendChild(santaHat)
      }

      this.el.appendChild(chassisModel)
    } else {
      const chassisBox = document.createElement('a-box')
      chassisBox.setAttribute('color', 'darkblue')
      chassisBox.setAttribute('scale', {x: chassisWidth, y: chassisHeight, z: chassisLength})
      this.el.appendChild(chassisBox)
    }

    // Raycast Vehicle
    const tuning = new Ammo.btVehicleTuning()
    const rayCaster = new Ammo.btDefaultVehicleRaycaster(physicsWorld)
    const vehicle = new Ammo.btRaycastVehicle(tuning, body, rayCaster)
    vehicle.setCoordinateSystem(0, 1, 2)
    physicsWorld.addAction(vehicle)

    // Wheels
    const wheelMeshes = []
    const wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0)
    const wheelAxleCS = new Ammo.btVector3(-1, 0, 0)

    function addWheel(isFront, pos, radius, width, index) {
      const wheelInfo = vehicle.addWheel(
        pos,
        wheelDirectionCS0,
        wheelAxleCS,
        suspensionRestLength,
        radius,
        tuning,
        isFront
      )
      wheelInfo.set_m_suspensionStiffness(suspensionStiffness)
      wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping)
      wheelInfo.set_m_wheelsDampingCompression(suspensionCompression)
      wheelInfo.set_m_frictionSlip(friction)
      wheelInfo.set_m_rollInfluence(rollInfluence)

      const wheel = document.createElement('a-entity')

      const wheelModel = document.createElement('a-entity')
      wheelModel.setAttribute('shadow', '')
      wheelModel.setAttribute('gltf-model', '#roverWheelModel')
      if (cybertruckMode) {
        wheelModel.object3D.scale.set(20, 20, 20)
      } else {
        wheelModel.object3D.scale.set(25, 25, 25)
      }
      wheel.appendChild(wheelModel)

      baseEl.appendChild(wheel)

      wheelMeshes[index] = wheel.object3D
    }

    if (cybertruckMode) {
      wheelAxisFrontPosition = 2
    }

    addWheel(true, new Ammo.btVector3(wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_LEFT)
    addWheel(true, new Ammo.btVector3(-wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_RIGHT)
    addWheel(false, new Ammo.btVector3(-wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_LEFT)
    addWheel(false, new Ammo.btVector3(wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_RIGHT)

    this.vehicle = vehicle
    this.wheelMeshes = wheelMeshes
    this.chassisObject = this.el.object3D

    this.promptHidden = false
  },
  tick(time, dt) {
    const {vehicle, wheelMeshes, chassisObject, headMode, headModel} = this

    let brakingForce = 0
    let engineForce = 0
    let vehicleSteering = 0

    const offsetX = inputHoriz
    const steering = -Math.min(Math.max(-1, offsetX), 1)
    vehicleSteering = steeringClamp * steering

    // console.log(vehicle.getCurrentSpeedKmHour())

    const maxRawDistance = Math.min(window.innerWidth, window.innerHeight) / 5

    const offsetY = inputVert

    const acceleration = -Math.min(Math.max(-1, offsetY), 1)

    const speed = Math.abs(vehicle.getCurrentSpeedKmHour())
    engineForce = acceleration * maxEngineForce * Math.min(1, Math.exp(-0.05 * (speed - 60.0)))

    // player.playbackRate = inputVert
    // console.log('playbackRate : ' + player.playbackRate)

    brakingForce = maxBrakingForce / 3

    // rovr sound
    // modify rovrToneSnd playback speed based on inputVert
    // const rovrSound = this.el.components.sound.playbackRate =

    if (headModel) {
      headModel.object3D.rotation.y = vehicleSteering
    }

    vehicle.applyEngineForce(engineForce / 4, BACK_LEFT)
    vehicle.applyEngineForce(engineForce / 4, BACK_RIGHT)
    vehicle.applyEngineForce(engineForce * 3 / 4, FRONT_RIGHT)
    vehicle.applyEngineForce(engineForce * 3 / 4, FRONT_LEFT)
    vehicle.setBrake(brakingForce / 2, FRONT_LEFT)
    vehicle.setBrake(brakingForce / 2, FRONT_RIGHT)
    vehicle.setBrake(brakingForce, BACK_LEFT)
    vehicle.setBrake(brakingForce, BACK_RIGHT)
    vehicle.setSteeringValue(vehicleSteering, FRONT_LEFT)
    vehicle.setSteeringValue(vehicleSteering, FRONT_RIGHT)
    let tm; let p; let
      q
    const n = vehicle.getNumWheels()
    for (let i = 0; i < n; i++) {
      vehicle.updateWheelTransform(i, true)
      tm = vehicle.getWheelTransformWS(i)
      p = tm.getOrigin()
      q = tm.getRotation()
      wheelMeshes[i].position.set(p.x(), p.y(), p.z())
      wheelMeshes[i].quaternion.set(q.x(), q.y(), q.z(), q.w())
    }
    tm = vehicle.getChassisWorldTransform()
    p = tm.getOrigin()
    q = tm.getRotation()
    chassisObject.position.set(p.x(), p.y(), p.z())
    chassisObject.quaternion.set(q.x(), q.y(), q.z(), q.w())
  },
}

// Prevents the vehicle from getting out of bounds or flipping
const VehicleMonitorComponent = {
  schema: {
    resetPosition: {type: 'vec3', default: {x: -2, y: 0, z: vehicleHome}},
    boundsCenter: {type: 'vec3', default: {x: 0, y: 0, z: arenaCenter}},
    resetHeight: {default: 1},
    boundsRadius: {default: 40},
  },
  init() {
    this.boundsRadiusSquared = Math.pow(this.data.boundsRadius, 2)
    this.tempVector3 = new THREE.Vector3()
    this.resetPositionVector3 = new THREE.Vector3().copy(this.data.resetPosition)

    let ammoVehicle
    this.getVehicle = () => {
      ammoVehicle = ammoVehicle || this.el.components.vehicle.vehicle
      return ammoVehicle
    }

    let ammoChassis
    this.getChassis = () => {
      ammoChassis = ammoChassis || this.el.components.Chassis.Chassis
      return ammoChassis
    }

    this.getChassis = () => this.el.object3D.userData.physicsBody

    this.isOutOfBounds = () => this.el.object3D.position.distanceToSquared(this.data.boundsCenter) > this.boundsRadiusSquared

    this.isFlipped = () => {
      this.tempVector3.set(0, 1, 0)
      this.tempVector3.applyQuaternion(this.el.object3D.quaternion)
      return this.tempVector3.y < 0.75
    }

    this.isStopped = () => this.getVehicle().getCurrentSpeedKmHour() < 1

    this.resetvehicle = (position) => {
      clearTimeout(this.resetTimeout)
      this.resetTimeout = null

      this.tempVector3.copy(position || this.resetPositionVector3)
      this.tempVector3.y += this.data.resetHeight

      const vector = new THREE.Vector3()

      const vehicle = this.getVehicle()
      vehicle.getChassisWorldTransform().getOrigin().setValue(...this.tempVector3.toArray())
      if (position != null) {
        const vr = this.el.object3D.rotation.clone().reorder('YXZ')
        vr.z = 0
        vr.x = 0
        const q = new THREE.Quaternion().setFromEuler(vr)
        vehicle.getChassisWorldTransform().setRotation(new Ammo.btQuaternion(q.x, q.y, q.z, q.w))
      } else {
        vehicle.getChassisWorldTransform().setRotation(new Ammo.btQuaternion(0, 1, 0, 0))
      }

      const chassis = this.getChassis()

      const transform = new Ammo.btTransform()
      transform.setIdentity()
      transform.setOrigin(new Ammo.btVector3(...this.tempVector3.toArray()))
      transform.setRotation(new Ammo.btQuaternion(0, 0, 0, 1))
      chassis.getMotionState().setWorldTransform(transform)

      chassis.setAngularVelocity(new AMMO.btVector3(0, 0, 0))
      chassis.setLinearVelocity(new AMMO.btVector3(0, 0, 0))
    }

    this.el.sceneEl.addEventListener('resetnow', () => this.resetvehicle())
    this.el.sceneEl.addEventListener('resethere', () => this.resetvehicle(new THREE.Vector3(this.el.object3D.position.x, this.el.object3D.position.y + 1, this.el.object3D.position.z)))
    this.el.sceneEl.addEventListener('showflip', (e) => {
      flipWarningVisibility(e.detail.show)
    })

    function flipWarningVisibility(show) {
      const flipText = document.querySelector('#flipWarning').object3D
      flipText.visible = show
    }
  },
  tick() {
    // if (this.isOutOfBounds()) {
    //   //this.resetvehicle()
    //   return
    // }

    canFlip = this.isFlipped()

    if (this.isStopped() && this.isFlipped()) {
      if (!this.resetTimeout) {
        this.resetTimeout = setTimeout(() => {
          this.el.emit('showflip', {show: true})
        }, 500)
      }
    } else {
      if (this.resetTimeout) {
        clearTimeout(this.resetTimeout)
        this.resetTimeout = null
      }
      this.el.emit('showflip', {show: false})
    }
  },
}

const SetColorComponent = {
  schema: {
    red: {default: 0},
    green: {default: 0},
    blue: {default: 0},
    opacity: {default: 1},
  },
  init() {
    this.el.addEventListener('model-loaded', this.update.bind(this))
  },
  update() {
    const {data} = this
    const mesh = this.el.getObject3D('mesh')
    if (!mesh) {
      return
    }
    mesh.traverse((node) => {
      if (node.isMesh) {
        const black = new THREE.Color(0, 0, 0)
        const newcolor = new THREE.Color(data.red, data.green, data.blue)
        node.material.color = newcolor
        node.material.opacity = data.opacity
        node.material.transparent = data.opacity < 1.0
        node.material.needsUpdate = true
      }
    })
  },
}

const DebugControlsComponent = {
  init() {
    const sceneEl = document.querySelector('a-scene')

    let triggerPress
    let gripPress

    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyW') {
        inputVert = -1
      }

      if (e.code === 'KeyS') {
        inputVert = 1
      }

      if (e.code === 'KeyA') {
        inputHoriz = -1
      }

      if (e.code === 'KeyD') {
        inputHoriz = 1
      }

      if (e.code === 'KeyE' && canFlip) {
        sceneEl.emit('resethere')
      }

      if (e.code === 'KeyR') {
        sceneEl.emit('resetnow')
      }

      if (e.code === 'KeyC') {
        sceneEl.emit('newGameEvent')
      }

      if (e.code === 'KeyP') {
        sceneEl.emit('createNewOxygen', {initSpawn: false})
      }
    })

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyW') {
        inputVert = 0
      }

      if (e.code === 'KeyS') {
        inputVert = 0
      }

      if (e.code === 'KeyA') {
        inputHoriz = 0
      }

      if (e.code === 'KeyD') {
        inputHoriz = 0
      }
    })
  },
}

const ROVER = {
  components: [
    {name: 'on-scene-start', val: OnSceneStartComponent},
    {name: 'controller-selector', val: ControllerSelectorComponent},
    {name: 'input-listener', val: InputListenerComponent},
    {name: 'rover', val: RoverComponent},
    {name: 'play-again', val: PlayAgainComponent},
    {name: 'shadow-material', val: ShadowMaterialComponent},
    {name: 'rover-scene', val: RoverSceneComponent},
    {name: 'vehicle', val: VehicleComponent},
    {name: 'vehicle-monitor', val: VehicleMonitorComponent},
    {name: 'set-color', val: SetColorComponent},
    {name: 'debug-controls', val: DebugControlsComponent},
    {name: 'oxygen-monitor', val: OxygenMonitorComponent},
    {name: 'oxygen-countdown', val: OxygenCountdownComponent},
  ],
  primitives: [],
}

export {ROVER}
