/* globals Ammo, AMMO */

// Component that places trees where the ground is clicked
const DISABLE_DEACTIVATION = 4

const arenaCenter = -35
const vehicleHome = arenaCenter + 10

const roverComponent = {
  init() {
    this.target = document.createElement('a-entity')

    this.base = document.createElement('a-entity')
    this.base.id = 'base'
    this.base.object3D.position.y = 0
    this.base.object3D.scale.set(0.5, 0.5, 0.5)
    this.target.appendChild(this.base)

    this.el.sceneEl.appendChild(this.target)

    const handleTargetScanned = () => {
      this.el.sceneEl.removeEventListener('xrimagefound', handleTargetScanned)
      // window.emit('changeprompt', { text: 'Drag anywhere to drive rover', icon: 'swipe' })
      // window.emit('scanned')
    }

    this.el.sceneEl.addEventListener('xrimagefound', handleTargetScanned)

    Ammo().then((ammo) => {
      window.AMMO = ammo
      this.base.setAttribute('rover-scene', '')
      console.log(ammo)
    })
  },
  remove() {
    this.el.removeChild(this.target)
  },
}

const shaderMaterialComponent = {
  init() {
    this.material = new THREE.ShadowMaterial()
    this.el.getOrCreateObject3D('mesh').material = this.material
    this.material.opacity = 0.4
  },
}

const roverSceneComponent = {
  init() {
    this.collisionConfiguration = new AMMO.btDefaultCollisionConfiguration()
    this.dispatcher = new AMMO.btCollisionDispatcher(this.collisionConfiguration)
    this.broadphase = new AMMO.btDbvtBroadphase()
    this.solver = new AMMO.btSequentialImpulseConstraintSolver()

    this.physicsWorld = new AMMO.btDiscreteDynamicsWorld(this.dispatcher, this.broadphase, this.solver, this.collisionConfiguration)
    this.physicsWorld.setGravity(new AMMO.btVector3(0, -15, 0))

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
    ground.setAttribute('xrextras-hider-material', '')
    // ground.setAttribute('material', {
    //   shader: 'shadow',
    //   transparent: true,
    //   opacity: 0.4,
    // })
    // ground.setAttribute('shadow', {cast: false})
    ground.object3D.scale.set(groundSize * 2, 0.5, groundSize * 2)
    ground.object3D.position.y = -1
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

    // const craterScale = 300
    // const crater = document.createElement('a-entity')
    // crater.setAttribute('gltf-model', '#craterModel')
    // crater.object3D.position.set(0, 0, arenaCenter - 4)
    // crater.object3D.rotation.y = 0.785398
    // crater.object3D.scale.set(craterScale, craterScale, craterScale)
    // this.el.appendChild(crater)

    const hill = document.createElement('a-entity')
    hill.object3D.position.set(9, -1, -17)
    hill.object3D.scale.set(235, 235, 235)
    hill.addEventListener('model-loaded', () => {
      const {geometry} = hill.getObject3D('mesh').children[0].children[0]
      const triangleMeshShape = getTriangleShape(geometry, hill.object3D.scale, true)
      this.addRigidBody(hill.object3D, triangleMeshShape)
    })
    hill.setAttribute('gltf-model', '#hill1Model')
    this.el.appendChild(hill)

    const hill2 = document.createElement('a-entity')
    hill2.object3D.position.set(-11, -0.8, -26)
    hill2.object3D.scale.set(250, 250, 250)
    hill2.object3D.rotation.y = 0.436332
    hill2.addEventListener('model-loaded', () => {
      const {geometry} = hill2.getObject3D('mesh').children[0].children[0]
      const triangleMeshShape = getTriangleShape(geometry, hill2.object3D.scale, true)
      this.addRigidBody(hill2.object3D, triangleMeshShape)
    })
    hill2.setAttribute('gltf-model', '#hill2Model')
    this.el.appendChild(hill2)

    const hill3 = document.createElement('a-entity')
    hill3.object3D.position.set(7, 0, -42)
    hill3.object3D.scale.set(250, 250, 250)
    hill3.object3D.rotation.y = 3.14
    hill3.addEventListener('model-loaded', () => {
      const {geometry} = hill3.getObject3D('mesh').children[0].children[0]
      const triangleMeshShape = getTriangleShape(geometry, hill3.object3D.scale, true)
      this.addRigidBody(hill3.object3D, triangleMeshShape)
    })
    hill3.setAttribute('gltf-model', '#hill3Model')
    this.el.appendChild(hill3)

    const flag = document.createElement('a-entity')
    flag.object3D.position.set(-28, 0, -33)
    flag.object3D.scale.set(25, 25, 25)
    flag.setAttribute('gltf-model', '#flagModel')
    this.el.appendChild(flag)

    // Circle of invisible blockers to set bounds
    //     const blockerCount = 10
    //     const blockerOpacity = 0
    //     const blockerHeight = 25
    //     const blockerWidth = 28
    //     const blockerThickness = 1
    //     const fenceWidth = 41
    //     const fenceLength = 38

    //     const blockerShape = new AMMO.btBoxShape(new AMMO.btVector3(blockerWidth / 2, blockerHeight / 2, blockerThickness / 2))

    //     for (let i = 0; i < blockerCount; i++) {
    //       const blocker = document.createElement('a-box')
    //       blocker.setAttribute('material', { color: 'red', transparent: true, opacity: blockerOpacity })

    //       const blockerAngle = i * 2 * Math.PI / blockerCount
    //       blocker.object3D.scale.set(blockerWidth, blockerHeight, blockerThickness)
    //       blocker.object3D.rotation.y = blockerAngle
    //       blocker.object3D.position.set(fenceWidth * Math.sin(blockerAngle), 0, fenceLength * Math.cos(blockerAngle) + arenaCenter - 2)

    //       this.addRigidBody(blocker.object3D, blockerShape)

    //       this.el.appendChild(blocker)
    //     }

    this.fragmentCollectedCount = 0
    this.fragments = [
      {
        position: new THREE.Vector3(0, 5, 0).add(hill.object3D.position),
      },
      {
        position: new THREE.Vector3(-1, 2, -5).add(flag.object3D.position),
      },
      {
        position: new THREE.Vector3(-5, 5.5, 3).add(hill3.object3D.position),
      },
    ]

    // window.emit('changeobjective', { text: 'Collect the fragments' })
    // window.emit('changeprogress', { text: `0/${this.fragments.length}` })

    for (let i = 0; i < this.fragments.length; i++) {
      const fragment = this.fragments[i]
      const fragmentElement = document.createElement('a-entity')
      fragmentElement.setAttribute('gltf-model', '#water')
      fragmentElement.object3D.scale.set(1, 1, 1)
      fragmentElement.object3D.rotation.x = -0.5
      fragmentElement.setAttribute('animation__spin', {
        property: 'object3D.rotation.y',
        from: 0,
        to: Math.PI * 2,
        easing: 'linear',
        dur: 5000,
        loop: true,
      })
      fragmentElement.object3D.position.copy(fragment.position)
      this.el.appendChild(fragmentElement)
      fragment.element = fragmentElement
    }

    const fragmentRadius = 5
    this.fragmentRadiusSquared = fragmentRadius * fragmentRadius

    const vehicle = document.createElement('a-entity')
    vehicle.object3D.rotation.y = Math.PI
    vehicle.object3D.position.y = 0.5
    vehicle.object3D.position.z = vehicleHome
    vehicle.setAttribute('vehicle', '')
    vehicle.setAttribute('shadow', '')
    vehicle.setAttribute('vehicle-monitor', '')
    this.el.appendChild(vehicle)
    this.vehicle = vehicle

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

      this.fragments.forEach((fragment) => {
        if (fragment.collected) {
          return
        }
        const distanceSquared = this.vehicle.object3D.position.distanceToSquared(fragment.position)

        if (distanceSquared < this.fragmentRadiusSquared) {
          fragment.collected = true
          fragment.element.setAttribute('animation__hide', {
            property: 'scale',
            to: '0.001 0.001 0.001',
            dur: 300,
          })

          this.fragmentCollectedCount++

          // window.emit('changeprogress', { text: `${this.fragmentCollectedCount}/${this.fragments.length}` })
          // window.emit('newalert', { text: 'Got it!', duration: 1000 })

          // if (this.fragmentCollectedCount >= this.fragments.length) {
          //   const relic = document.createElement('a-entity')
          //   relic.setAttribute('gltf-model', '#relicModel')
          //   relic.object3D.scale.set(50, 50, 50)
          //   relic.object3D.position.copy(this.vehicle.object3D.position)
          //   relic.object3D.position.y += 3
          //   this.el.appendChild(relic)
          //   zoomRelic(relic, this.vehicle.object3D.position.y + 8, 'y', 1500, 'easeOutQuad', false)
          //   spinRelic(relic)
          //   setTimeout(() => {
          //     zoomRelic(relic, 100)
          //     setTimeout(()=>{
          //       // window.emit('collected')
          //     }, 1500)
          //   }, 2500)
          // }
        }
      })
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
const chassisHeight = 0.6
const chassisLength = 4
const massVehicle = 800

const wheelRadiusFront = 0.7
const wheelWidthFront = 0.7

const wheelRadiusBack = 0.7
const wheelWidthBack = 0.7

const wheelHalfTrackFront = 1
const wheelAxisHeightFront = 0.3

const wheelHalfTrackBack = 1
const wheelAxisHeightBack = 0.3

const wheelAxisFrontPosition = 1.5
const wheelAxisPositionBack = -1.5

const friction = 10000

const suspensionStiffness = 100.0
const suspensionDamping = 5
const suspensionCompression = 4.4
const suspensionRestLength = 0.6

const rollInfluence = 0.2
const steeringIncrement = 0.04

const steeringClamp = 0.5
const maxEngineForce = 4000
const maxBrakingForce = 100

const FRONT_LEFT = 0
const FRONT_RIGHT = 1
const BACK_LEFT = 2
const BACK_RIGHT = 3

const vehicleComponent = {
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

    const chassisModel = document.createElement('a-entity')
    chassisModel.id = 'rover-chassis'
    chassisModel.setAttribute('gltf-model', '#roverBodyModel')
    chassisModel.object3D.scale.set(25, 25, 25)
    this.el.appendChild(chassisModel)

    const headModel = document.createElement('a-entity')
    headModel.setAttribute('gltf-model', '#roverHeadModel')
    headModel.object3D.scale.set(25, 25, 25)
    headModel.object3D.position.set(0.5, 1.7, 0.55)
    this.el.appendChild(headModel)
    this.headModel = headModel

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
      wheelModel.setAttribute('gltf-model', '#roverWheelModel')
      wheelModel.object3D.scale.set(25, 25, 25)
      wheel.appendChild(wheelModel)

      baseEl.appendChild(wheel)

      wheelMeshes[index] = wheel.object3D
    }

    addWheel(true, new Ammo.btVector3(wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_LEFT)
    addWheel(true, new Ammo.btVector3(-wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_RIGHT)
    addWheel(false, new Ammo.btVector3(-wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_LEFT)
    addWheel(false, new Ammo.btVector3(wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_RIGHT)

    this.vehicle = vehicle
    this.wheelMeshes = wheelMeshes
    this.chassisObject = this.el.object3D

    this.handleTouch = (e) => {
      this.positionRaw = e.detail.positionRaw
      this.startPositionRaw = this.startPositionRaw || this.positionRaw
    }

    window.addEventListener('onefingerstart', this.handleTouch)
    window.addEventListener('onefingermove', this.handleTouch)
    window.addEventListener('onefingerend', () => this.startPositionRaw = null)

    const overlay = document.getElementById('overlay')

    this.joystickParent = document.createElement('div')
    this.joystickParent.classList.add('joystick-container', 'absolute-fill', 'shadowed')

    this.joystickPosition = document.createElement('div')
    this.joystickPosition.classList.add('joystick', 'position')
    this.joystickParent.appendChild(this.joystickPosition)

    this.joystickOrigin = document.createElement('div')
    this.joystickOrigin.classList.add('joystick', 'origin')
    this.joystickParent.appendChild(this.joystickOrigin)

    this.resetBtn = document.createElement('div')
    this.resetBtn.id = 'resetBtn'
    this.resetBtn.classList.add('reset', 'fade-in-on-scan')

    this.resetBtn.addEventListener('click', () => {
      this.el.sceneEl.emit('resetnow')
      // window.emit('newalert', { text: 'Rover reset!', duration: 1000 })
    })

    overlay.appendChild(this.resetBtn)

    overlay.appendChild(this.joystickParent)

    this.promptHidden = false
  },
  tick(time, dt) {
    const {vehicle, wheelMeshes, chassisObject, startPositionRaw, positionRaw, headModel} = this

    let brakingForce = 0
    let engineForce = 0
    let vehicleSteering = 0

    if (startPositionRaw) {
      const maxRawDistance = Math.min(window.innerWidth, window.innerHeight) / 5

      let rawOffsetX = positionRaw.x - startPositionRaw.x
      let rawOffsetY = positionRaw.y - startPositionRaw.y

      const rawDistance = Math.sqrt(Math.pow(rawOffsetX, 2) + Math.pow(rawOffsetY, 2))

      // Normalize to maxRawDistance
      if (rawDistance > maxRawDistance) {
        rawOffsetX *= maxRawDistance / rawDistance
        rawOffsetY *= maxRawDistance / rawDistance

        if (!this.promptHidden) {
          this.promptHidden = true
          // window.emit('clearprompt')
        }
      }

      const widthScale = 100 / window.innerWidth
      const heightScale = 100 / window.innerHeight

      this.joystickParent.classList.add('visible')
      this.joystickOrigin.style.left = `${startPositionRaw.x * widthScale}%`
      this.joystickOrigin.style.top = `${startPositionRaw.y * heightScale}%`
      this.joystickPosition.style.left = `${(startPositionRaw.x + rawOffsetX) * widthScale}%`
      this.joystickPosition.style.top = `${(startPositionRaw.y + rawOffsetY) * heightScale}%`

      const offsetX = rawOffsetX / maxRawDistance
      const offsetY = rawOffsetY / maxRawDistance

      const acceleration = -Math.min(Math.max(-1, offsetY), 1)
      const steering = -Math.min(Math.max(-1, offsetX), 1)

      engineForce = acceleration * maxEngineForce

      vehicleSteering = steeringClamp * steering
    } else {
      brakingForce = maxBrakingForce / 3
      this.joystickParent.classList.remove('visible')
    }

    headModel.object3D.rotation.y = vehicleSteering

    vehicle.applyEngineForce(engineForce, BACK_LEFT)
    vehicle.applyEngineForce(engineForce, BACK_RIGHT)
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
const vehicleMonitorComponent = {
  schema: {
    resetPosition: {type: 'vec3', default: {x: 0, y: 0, z: vehicleHome}},
    boundsCenter: {type: 'vec3', default: {x: 0, y: 0, z: arenaCenter}},
    resetHeight: {default: 1.5},
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
      return this.tempVector3.y < 0.2
    }

    this.isStopped = () => this.getVehicle().getCurrentSpeedKmHour() < 1

    this.resetvehicle = (position) => {
      clearTimeout(this.resetTimeout)
      this.resetTimeout = null

      this.tempVector3.copy(position || this.resetPositionVector3)
      this.tempVector3.y += this.data.resetHeight

      const vehicle = this.getVehicle()
      vehicle.getChassisWorldTransform().getOrigin().setValue(...this.tempVector3.toArray())
      vehicle.getChassisWorldTransform().setRotation(new Ammo.btQuaternion(0, 1, 0, 0))

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
  },
  tick() {
    if (this.isOutOfBounds()) {
      // this.resetvehicle()
      return
    }

    if (this.isStopped() && this.isFlipped()) {
      if (!this.resetTimeout) {
        this.resetTimeout = setTimeout(() => {
          this.resetvehicle(this.el.object3D.position)
        }, 500)
      }
    } else if (this.resetTimeout) {
      clearTimeout(this.resetTimeout)
      this.resetTimeout = null
    }
  },
}

export {roverComponent, shaderMaterialComponent, roverSceneComponent, vehicleComponent, vehicleMonitorComponent}
