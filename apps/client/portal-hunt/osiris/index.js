const sceneScale = 0.1
const colliderSize = 1
const asteroidScale = 20

const DISABLE_DEACTIVATION = 4

AFRAME.registerComponent('asteroid', {
  init: function() {

    this.target = document.createElement('a-entity')
    this.target.setAttribute('portal-hider', '')

    getSkyElement(this.target)

    this.base = document.createElement('a-entity')
    this.base.id = 'base'
    this.base.object3D.scale.set(sceneScale, sceneScale, sceneScale)
    this.target.appendChild(this.base)

    this.el.sceneEl.appendChild(this.target)

    const handleTargetScanned = () => {
      this.el.sceneEl.removeEventListener('xrimagefound', handleTargetScanned)
      window.emit('changeprompt', { text:  'Tap asteroids to excavate', icon: 'tap' })
      window.emit('scanned')
    }

    this.el.sceneEl.addEventListener('xrimagefound', handleTargetScanned)

    Ammo().then(ammo => {
      window.AMMO = ammo
      this.base.setAttribute('asteroid-scene', '')
    })
  },
  remove: function() {
    this.el.removeChild(this.target)
  }
})

AFRAME.registerComponent('asteroid-scene', {
  init: function() {
    this.collisionConfiguration = new AMMO.btDefaultCollisionConfiguration()
    this.dispatcher = new AMMO.btCollisionDispatcher(this.collisionConfiguration)
    this.broadphase = new AMMO.btDbvtBroadphase()
    this.solver = new AMMO.btSequentialImpulseConstraintSolver()

    this.physicsWorld = new AMMO.btDiscreteDynamicsWorld(this.dispatcher, this.broadphase, this.solver, this.collisionConfiguration)
    this.physicsWorld.setGravity(new AMMO.btVector3(0, 0, 0))

    this.convexBreaker = new THREE.ConvexObjectBreaker()

    this.tempTransform = new AMMO.btTransform()

    this.movableObjects = []
    this.bodyCount = 0
    this.bodyIndexToObject3D = {}

    this.tempVector3 = new THREE.Vector3()
    this.tempAmmoVec3 = new AMMO.btVector3()

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

    this.removeBody = body => {
      const index = this.movableObjects.indexOf(body)
      if (index >= 0) {
        this.movableObjects.splice(index, 1)
      }

      delete this.bodyIndexToObject3D[body.getUserIndex()]

      this.physicsWorld.removeRigidBody(body)
    }

    const ufo = document.createElement('a-entity')
    ufo.setAttribute('gltf-model', '#ufoModel')

    const ufoObject = ufo.object3D
    ufoObject.scale.set(10, 10, 10)
    ufoObject.position.y = 2
    ufoObject.position.z = 3.5
    ufoObject.rotation.x = 0.436332
    ufoObject.rotation.y = 0.610865
    ufoObject.rotation.z = 0.436332
    const ufoBody = new AMMO.btSphereShape(0.5)
    this.addRigidBody(ufoObject, ufoBody, 1)
    ufoObject.userData.isFragment = true
    this.el.appendChild(ufo)

    const subdivideRetryIterations = 10
    this.breakObject = (breakingObject, impactPosition, impactNormal, maxRadialIterations, maxRandomIterations) => {
      const breakingObjectVertexCount = this.convexBreaker.getGeometry(breakingObject).attributes.position.array.length
      let pieces

      let i = 0
      // Sometimes the convex breaker returns the same object duplicated instead of pieces of it
      // Since there is randomness, the second call will have a different result than the first
      while (!pieces && i < subdivideRetryIterations) {
        i++
        let tempPieces = this.convexBreaker.subdivideByImpact(breakingObject, impactPosition, impactNormal , maxRadialIterations, maxRandomIterations)

        if (i === subdivideRetryIterations || tempPieces[0].geometry.attributes.position.array.length !== breakingObjectVertexCount) {
          pieces = tempPieces
        }
      }

      pieces.forEach(piece => {

        const vertices = piece.geometry.attributes.position.array

        const shape = new AMMO.btConvexHullShape()
        for (let i = 0; i < vertices.length; i+= 3) {
          this.tempAmmoVec3.setValue(vertices[i], vertices[i + 1], vertices[i + 2])
          const isLastOne = (i >= (vertices.length - 3))
          shape.addPoint(this.tempAmmoVec3, isLastOne)
        }

        piece.userData.isFragment = true
        this.addRigidBody(piece, shape, piece.userData.mass, piece.userData.velocity, piece.userData.angularVelocity)
        this.el.object3D.add(piece)
      })

      // Remove breaking object from scene, either as an A-Frame entity or a Threejs object
      if (breakingObject.el) {
        breakingObject.el.parentEl && breakingObject.el.parentEl.removeChild(breakingObject.el)
      } else {
        breakingObject.parent && breakingObject.parent.remove(breakingObject)
      }

      this.removeBody(breakingObject.userData.physicsBody)
    }

    window.emit('changeobjective', { text: 'Find the relic' })

    const positionVariance = 5
    const positionSpacing = 2.5
    const positionSpacingSquared = Math.pow(positionSpacing, 2)

    const getRandomPoint = (position) => {
      position = position || new THREE.Vector3()
      position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      position.multiplyScalar(positionVariance)
      return position
    }

    const getRandomSpacedPoints = count => {
      const results = []
      for (let i = 0; i < count; i++) {
        const point = getRandomPoint()
        while (results.find(p => p.distanceToSquared(point) < positionSpacingSquared)) {
          getRandomPoint(point)
        }
        results.push(point)
      }
      return results
    }

    const asteroidCount = 7
    const asteroidMass = 1

    this.asteroidObjects = []
    const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0x505077, roughness: 1, metalness: 0, flatShading: true })
    const asteroidPositions = getRandomSpacedPoints(asteroidCount)

    for (let i = 0; i < asteroidCount; i++) {
      const asteroid = document.createElement('a-entity')
      asteroid.setAttribute('gltf-model', `#asteroidModel${i + 1}`)
      const asteroidObject = asteroid.object3D
      asteroidObject.position.copy(asteroidPositions[i])
      asteroidObject.userData.isAsteroid = true

      this.el.appendChild(asteroid)
      this.asteroidObjects.push(asteroidObject)

      const asteroidShape = new AMMO.btSphereShape(colliderSize)
      this.addRigidBody(asteroidObject, asteroidShape)

      // Geometry isn't instantly instantiated on entities
      asteroid.addEventListener('model-loaded', () => {

        const asteroidModelMesh = asteroidObject.getObjectByProperty('isMesh', true).geometry

        const asteroidPositions = asteroidModelMesh.attributes.position.array
        const points = []
        for (let i = 0; i < asteroidPositions.length; i += 3) {
          points.push(new THREE.Vector3(asteroidPositions[i], asteroidPositions[i + 1], asteroidPositions[i + 2]).multiplyScalar(asteroidScale))
        }

        const convexAsteroidMesh = new THREE.Mesh(new THREE.ConvexBufferGeometry( points ), asteroidMaterial)
        asteroidObject.add(convexAsteroidMesh)

        asteroidObject.material = asteroidMaterial
        this.tempVector3.set(0, 0, 0)
        this.convexBreaker.prepareBreakableObject(asteroidObject, asteroidMass, this.tempVector3, this.tempVector3, true)

        asteroid.removeAttribute('gltf-model')
      })
    }

    let collected = false
    const camera = document.getElementById('camera')
    const threeCamera = camera.getObject3D('camera')
    const raycaster = new THREE.Raycaster()
    this.el.sceneEl.addEventListener('touchstart', e => {
      const touchX = e.changedTouches[0].clientX / window.innerWidth * 2 - 1
      const touchY = e.changedTouches[0].clientY / window.innerHeight * -2 + 1

      raycaster.setFromCamera({ x: touchX, y: touchY }, threeCamera)

      const intersection = raycaster.intersectObjects(this.el.sceneEl.object3D.children, true)[0]

      if (!intersection) {
        return
      }

      let hitObject = intersection.object
      while (hitObject && !hitObject.userData.isAsteroid && !hitObject.userData.isFragment) {
        hitObject = hitObject.parent
      }
      if (!hitObject) {
        return
      }

      if (hitObject.userData.isFragment) {
        this.tempVector3.set(0, 0, 1)
        camera.object3D.localToWorld(this.tempVector3)
        this.el.object3D.worldToLocal(this.tempVector3)
        this.tempVector3.normalize().multiplyScalar(-0.5)

        this.tempAmmoVec3.setValue(this.tempVector3.x, this.tempVector3.y, this.tempVector3.z)

        const body = hitObject.userData.physicsBody
        body.applyImpulse(this.tempAmmoVec3)
        return
      }

      window.emit('clearprompt')
      const hitPoint = intersection.point.clone()
      this.el.object3D.worldToLocal(hitPoint)
      this.breakObject(hitObject, hitPoint, intersection.face.normal, 1, 1)
      this.asteroidObjects = this.asteroidObjects.filter(e=>e!==hitObject)

      if (collected || Math.random() > Math.pow(1 / this.asteroidObjects.length, 2)) {
        return
      }

      // Broken asteroid contains relic
      collected = true

      const relic = document.createElement('a-entity')
      relic.setAttribute('gltf-model', '#relicModel')
      spinRelic(relic)
      relic.setAttribute('animation__scale', {
        property: 'scale',
        from: '0.001 0.001 0.001',
        to: '10 10 10',
        dur: 500,
      })
      relic.object3D.position.copy(hitObject.position)

      this.el.appendChild(relic)

      setTimeout(() => {
        window.emit('collected', { replay: true })
      }, 1500)
    })
  },
  tick: function(time, timeDelta) {
    if (this.physicsWorld) {
      this.physicsWorld.stepSimulation(timeDelta / 1000, 10)

      // Update objects
      this.movableObjects.forEach(object3D => {
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
    }
  },
  remove: function() {
    AMMO.destroy(this.physicsWorld)
    AMMO.destroy(this.solver)
    AMMO.destroy(this.broadphase)
    AMMO.destroy(this.dispatcher)
    AMMO.destroy(this.collisionConfiguration)
  }
})
