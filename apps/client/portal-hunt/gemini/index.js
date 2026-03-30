const lineComponent = 'cylinder-line'
const mirrorDistance = 0.5
const reflectorVisible = false
const debugging = false
const portalDepth = 0.65
const laserWidth = 0.008

const socket = io('socket.8thwall.com/reflection')

let targetScale = 1
let targetName = null

AFRAME.registerComponent('reflection', {
  init: function() {
    const target = document.createElement('a-entity')
    target.id = 'target'
    target.setAttribute('portal-hider', { ringDepth: portalDepth, side: 'double' })

    getSkyElement(target)

    const directionalLight = document.createElement('a-light')
    directionalLight.setAttribute('position', '150 250 60')
    target.appendChild(directionalLight)

    let didScan = false

    window.emit('changeobjective', { text: 'Turn the gem purple' })

    this.el.sceneEl.addEventListener('xrimagefound', e => {
      if (!didScan) {
        didScan = true
        window.emit('scanned')
        window.emit('changeprompt', { text: 'Move your device to reflect your laser to the gem', icon: 'move' })
      }

      const isTarget1 = e.detail.name === 'target1'
      emitterOut.setAttribute('emitter', { laserColor: isTarget1 ? 'red' : 'blue' })
      emitterIn.setAttribute('emitter',  { laserColor: isTarget1 ? 'blue' : 'red' })
    })

    this.el.sceneEl.addEventListener('xrimageupdated', e => {
      targetScale = e.detail.scale
      targetName = e.detail.name
    })

    const base = document.createElement('a-entity')
    base.id = 'base'
    base.object3D.position.z = -portalDepth / 2
    target.appendChild(base)

    const baseReverse = document.createElement('a-entity')
    baseReverse.id = 'baseReverse'
    baseReverse.object3D.rotation.y = Math.PI
    base.appendChild(baseReverse)

    const emitterOut = document.createElement('a-entity')
    emitterOut.id = 'emitterOut'
    emitterOut.setAttribute('emitter', { laserDirection: '0 -25 100' })
    emitterOut.object3D.position.set(0.1, 0.36, 0.35)
    base.appendChild(emitterOut)

    const emitterIn = document.createElement('a-entity')
    emitterIn.id = 'emitterIn'
    emitterIn.setAttribute('emitter', { laserDirection: '0 -25 -100' })
    emitterIn.object3D.position.set(-0.1, 0.36, -0.35)
    base.appendChild(emitterIn)

    const detector = document.createElement('a-entity')
    detector.id = 'detector'
    detector.setAttribute('detector', '')
    detector.object3D.position.set(0, -0.3, 0)
    base.appendChild(detector)

    this.el.sceneEl.appendChild(target)

    const camera = document.getElementById('camera')
    camera.setAttribute('reflector', { isPlayer: true })

    this.el.sceneEl.setAttribute('position-updater', '')
  }
})

// Component that emits lasers
AFRAME.registerComponent('emitter', {
  schema: {
    laserDirection: { type: 'vec3' },
    laserColor: { type: 'color' },
  },
  multiple: true,
  init: function() {
    this.camera = document.getElementById('camera')

    this.raycaster = new THREE.Raycaster()

    this.laserLength = 100

    this.tempVector3 = new THREE.Vector3()
    this.tempVector3_2 = new THREE.Vector3()

    this.source = document.createElement('a-entity')
    this.source.object3D.scale.set(3, 3, 3)
    this.el.appendChild(this.source)

    const laserBeam = document.createElement('a-entity')
    laserBeam.setAttribute(lineComponent, { start: '0 0 0', end: this.data.laserDirection, width: laserWidth, opacity: 1 })
    this.el.appendChild(laserBeam)

    this.laserBeam = laserBeam

    this.reflectors = Array.from(document.getElementsByClassName('reflector')).map(e => e.object3D)

    this.el.sceneEl.addEventListener('addreflector', event => {
      this.reflectors.push(event.detail)
    })

    this.laserDirectionVector3 = new THREE.Vector3()

    this.showingLaser = true
    this.currentReflector = null
  },
  update: function() {
    this.laserDirectionVector3.copy(this.data.laserDirection)
    this.laserBeam.setAttribute(lineComponent, { color: this.data.laserColor })
    this.source.setAttribute('gltf-model', this.data.laserColor === 'blue' ? '#emitterBlueModel' : '#emitterRedModel')

    const laserYaw = Math.atan2(this.data.laserDirection.x, this.data.laserDirection.z)
    const laserPitch = -Math.asin(this.data.laserDirection.y / this.laserDirectionVector3.length())
    this.source.object3D.rotation.order = 'XYZ'
    this.source.object3D.rotation.set(laserPitch, laserYaw, 0)
  },
  tick: function() {

    this.tempVector3.set(0, 0, 0)
    this.el.object3D.localToWorld(this.tempVector3)

    this.tempVector3_2.copy(this.data.laserDirection)
    this.tempVector3_2.transformDirection(this.el.object3D.matrixWorld)

    this.raycaster.set(this.tempVector3, this.tempVector3_2)

    const intersections = this.raycaster.intersectObjects(this.reflectors, true)

    if (intersections.length > 0 && intersections[0].distance < this.laserLength) {

      let reflectorObject = intersections[0].object
      while (reflectorObject && !(reflectorObject.el && reflectorObject.el.hasAttribute('reflector'))) {
        reflectorObject = reflectorObject.parent
      }

      const reflectorElement = reflectorObject.el

      this.showingLaser = false
      this.laserBeam.object3D.visible = false

      if (reflectorElement !== this.currentReflector) {
        this.currentReflector && this.currentReflector.setAttribute('reflector', { beaming: false })
        this.currentReflector = reflectorElement
        this.currentReflector.setAttribute('reflector', { beaming: true, laserDirection: this.data.laserDirection, laserColor: this.data.laserColor, emitter: '#' + this.el.id })
      }
    } else {
      if (!this.showingLaser) {
        this.showingLaser = true
        this.laserBeam.object3D.visible = true
        this.laserBeam.setAttribute(lineComponent, { end: this.data.laserDirection })
      }

      if (this.currentReflector) {
        this.currentReflector.setAttribute('reflector', { beaming: false })
        this.currentReflector = null
      }
    }
  }
})

AFRAME.registerComponent('detector', {
  schema: {
    red: { default: false },
    blue: { default: false },
  },
  init: function() {
    const gem = document.createElement('a-entity')
    gem.setAttribute('gltf-model', '#gemModel')
    gem.object3D.scale.set(3.5, 3.5, 3.5)
    this.el.appendChild(gem)

    const relic = document.createElement('a-entity')
    relic.setAttribute('gltf-model', '#relicModel')
    relic.object3D.visible = false
    this.el.appendChild(relic)
    spinRelic(relic)

    const gemMaterial = new THREE.MeshStandardMaterial({ color: '#99ccff', roughness: 0.25, metalness: 0, flatShading: true })

    gem.addEventListener('model-loaded', () => {
      gem.object3D.getObjectByProperty('isMesh', true).material = gemMaterial
    })

    let hasRed = false
    let hasBlue = false

    let redIsPlayer = false
    let blueIsPlayer = false

    let completed = false

    const timeoutDuration = 200

    let redTimeout
    let blueTimeout

    let hintTimeout

    let isAnimating = false
    const animateRelic = () => {
      if (isAnimating) {
        return
      }
      isAnimating = true

      const riseDuration = 1000
      const shrinkDuration = 1000
      const relicDisplayDuration = 2500
      const collectedDelay = 1000

      gem.removeAttribute('animation__rise')
      gem.setAttribute('animation__rise', {
        property: 'object3D.position.y',
        to: 0.3,
        easing: 'easeInOutQuad',
        dur: riseDuration,
      })

      setTimeout(() => {
        gem.removeAttribute('animation__shrink')
        gem.setAttribute('animation__shrink', {
          property: 'scale',
          to: '0.001 2.5 0.001',
          easing: 'easeInElastic',
          dur: shrinkDuration,
        })

        gem.removeAttribute('animation__hide')
        gem.setAttribute('animation__hide', {
          property: 'object3D.visible',
          to: false,
          dur: shrinkDuration,
        })

        relic.object3D.visible = true
        relic.object3D.position.copy(gem.object3D.position)
        relic.object3D.scale.set(0.001, 0.001, 0.001)
        relic.removeAttribute('animation__grow')
        relic.setAttribute('animation__grow', {
          property: 'scale',
          to: '2 2 2',
          easing: 'easeOutQuad',
          delay: shrinkDuration / 2,
          dur: shrinkDuration / 2,
        })
      }, riseDuration)

      setTimeout(() => {
        zoomRelic(relic, 10, 'z')
        refresh()
      }, riseDuration + shrinkDuration + relicDisplayDuration)

      setTimeout(() => {
        window.emit('collected')
        gem.removeAttribute('animation__rise')
        gem.object3D.position.y = -0.1
        gem.setAttribute('animation__rise', {
          property: 'object3D.position.y',
          from: -0.1,
          to: 0,
          dur: riseDuration,
          easing: 'easeOutQuad',
        })
        gem.object3D.visible = true
        gem.object3D.scale.set(3.5, 3.5, 3.5)
        setGemSpeed(0)
        setGemColor('#99ccff')
      }, riseDuration + shrinkDuration + relicDisplayDuration + collectedDelay)

      setTimeout(() => {
        isAnimating = false
      }, riseDuration + shrinkDuration + relicDisplayDuration + collectedDelay + riseDuration)
    }

    let currentGemSpeed = 0
    const setGemSpeed = speed => {
      if (currentGemSpeed === speed) {
        return
      }
      currentGemSpeed = speed

      if (speed === 0) {
        gem.removeAttribute('animation__spin')
        return
      }

      gem.setAttribute('animation__spin', {
        property: 'object3D.rotation.y',
        from: 0,
        to: Math.PI * 2,
        easing: 'linear',
        loop: true,
        dur: 5000 / speed,
      })
    }

    const setGemColor = color => {
      gemMaterial.color.set(color)
    }

    let canHint = true

    const doHint = hint => {
      if (!canHint) {
        return
      }
      canHint = false
      console.log('hinting', hint)
      hintTimeout = setTimeout(() => {
        window.emit('newalert', { text: hint, duration: 10000 })
        setTimeout(()=> {
          canHint = true
        }, 5000)
      }, 1000)
    }

    const selfHint = 'The other side is waiting - get into position!'
    const otherHint = 'Someone on the other side is needed to unlock!'

    const refresh = () => {

      if (!isAnimating) {
        if (hasBlue && hasRed) {
          setGemSpeed(2)
          setGemColor('#660fa6')

          if (redIsPlayer || blueIsPlayer) {
            completed = true
            animateRelic()

            window.emit('clearalert')
            clearTimeout(hintTimeout)
            hintTimeout = null
          }
        } else if (hasBlue) {
          setGemSpeed(1)
          setGemColor('#082ed0')
        } else if (hasRed) {
          setGemSpeed(1)
          setGemColor('#D21919')
        } else {
          setGemSpeed(0)
          setGemColor('#99ccff')
        }
      }

      if (!completed) {
        if (redIsPlayer || blueIsPlayer) {
          doHint(otherHint)
        } else if (targetName === 'target1' ? hasBlue : hasRed) {
          doHint(selfHint)
        }
      }
    }

    this.el.sceneEl.addEventListener('updatedetector', e => {
      if (e.detail.color === 'red') {
        clearTimeout(redTimeout)
        if (e.detail.value) {
          hasRed = true
          redIsPlayer = e.detail.involvesPlayer
          refresh()
        } else {
          redTimeout = setTimeout(() => {
            hasRed = false
            redIsPlayer = false
            refresh()
          }, timeoutDuration)
        }
      } else {
        clearTimeout(blueTimeout)
        if (e.detail.value) {
          hasBlue = true
          blueIsPlayer = e.detail.involvesPlayer
          refresh()
        } else {
          blueTimeout = setTimeout(() => {
            hasBlue = false
            blueIsPlayer = false
            refresh()
          }, timeoutDuration)
        }
      }
    })
  }
})

const assert = (name, statement, expected, fudge = 0) => {
  if (Math.abs(statement - expected) > fudge) {
    console.error(name, 'failed:', statement, 'vs', expected)
  }
}

// Component that reflects lasers from emitters
AFRAME.registerComponent('reflector', {
  schema: {
    beaming: { default: false },
    laserDirection: { type: 'vec3' },
    laserColor: { type: 'color' },
    isPlayer: { default: false },
    mirrorDistance: { default: mirrorDistance },
    isReverse: { default: false },
    emitter: { type: 'selector' },
  },
  init: function() {
    this.base = document.getElementById('base')
    this.detector = document.getElementById('detector')

    this.raycaster = new THREE.Raycaster()

    const reflectedBeam = document.createElement('a-entity')
    reflectedBeam.setAttribute(lineComponent, { start: '0 -0.1 0', end: '0 0 0', width: laserWidth, opacity: 1 })
    reflectedBeam.object3D.userData.laserIgnore = true
    base.appendChild(reflectedBeam)
    this.reflectedBeam = reflectedBeam

    const incomingBeam = document.createElement('a-entity')
    incomingBeam.setAttribute(lineComponent, { start: '0 -0.1 0', end: '0 0 0', width: laserWidth, opacity: 1 })
    incomingBeam.object3D.userData.laserIgnore = true
    base.appendChild(incomingBeam)
    this.incomingBeam = incomingBeam

    const mirror = document.createElement('a-entity')
    mirror.setAttribute('gltf-model', '#mirrorModel')
    mirror.object3D.scale.set(3.5, 3.5, 3.5)
    mirror.object3D.position.z = -this.data.mirrorDistance

    if (this.data.isPlayer) {
      mirror.object3D.position.y = -5

      this.el.sceneEl.addEventListener('xrimagefound', () => {
        setTimeout(()=>{
          mirror.removeAttribute('animation')
          mirror.setAttribute('animation', {
            property: 'object3D.position.y',
            to: 0,
            dur: 800,
            easing: 'easeOutQuad',
          })
        }, 10)
      })

      this.el.sceneEl.addEventListener('xrimagelost', () => {
        setTimeout(() => {
          mirror.removeAttribute('animation')
          mirror.setAttribute('animation', {
            property: 'object3D.position.y',
            to: -5,
            dur: 800,
            easing: 'easeInQuad',
          })
        }, 10)
      })
    }

    const intersector = document.createElement('a-entity')
    intersector.classList.add('reflector')
    intersector.setAttribute('gltf-model', '#surfaceModel')
    mirror.appendChild(intersector)
    this.el.appendChild(mirror)

    this.data.isPlayer && intersector.setAttribute('position-notifier', '')

    this.el.sceneEl.emit('addreflector', intersector.object3D)

    const reflectionIndicator = document.createElement('a-sphere')
    reflectionIndicator.setAttribute('material', { shader: 'flat' })
    reflectionIndicator.object3D.scale.set(laserWidth, laserWidth, laserWidth)
    reflectionIndicator.object3D.position.z = -1
    reflectionIndicator.object3D.userData.laserIgnore = true
    this.base.appendChild(reflectionIndicator)
    this.reflectionIndicator = reflectionIndicator

    this.laserOrigin = new THREE.Vector3()
    this.laserDirection = new THREE.Vector3()
    this.mirrorPosition = new THREE.Vector3()
    this.mirrorNormal = new THREE.Vector3()
    this.reflectionOrigin = new THREE.Vector3()
    this.reflectionDirection = new THREE.Vector3()
    this.reflectionOriginWorld = new THREE.Vector3()
    this.reflectionDirectionWorld = new THREE.Vector3()
    this.tempVector3 = new THREE.Vector3()

    this.tempTransform = new THREE.Matrix4()
  },
  update: function() {
    this.incomingBeam.object3D.visible = this.data.beaming
    this.reflectedBeam.object3D.visible = this.data.beaming
    this.reflectionIndicator.object3D.visible = this.data.beaming

    if (this.data.beaming && this.data.isPlayer) {
      window.emit('clearprompt')
    }

    this.reflectionIndicator.setAttribute('material', { color: this.data.laserColor })
    this.incomingBeam.setAttribute(lineComponent, { color: this.data.laserColor })
    this.reflectedBeam.setAttribute(lineComponent, { color: this.data.laserColor })
  },
  tick: function() {
    let isHittingDetector = false
    if (this.data.beaming) {

      this.el.object3D.updateMatrixWorld()

      const { laserOrigin, laserDirection, mirrorPosition, mirrorNormal, reflectionOrigin,
              reflectionDirection, tempVector3, tempTransform, reflectionOriginWorld, reflectionDirectionWorld } = this

      laserOrigin.copy(this.data.emitter.object3D.position)
      laserDirection.copy(this.data.laserDirection).normalize()

      this.el.object3D.getWorldPosition(mirrorPosition)
      this.base.object3D.worldToLocal(mirrorPosition)

      mirrorNormal.set(0, 0, -1)
      mirrorNormal.transformDirection(this.el.object3D.matrixWorld)
      tempTransform.getInverse(this.base.object3D.matrixWorld)
      mirrorNormal.transformDirection(tempTransform)

      if (this.data.mirrorDistance !== 0) {
        mirrorNormal.multiplyScalar(this.data.mirrorDistance / targetScale)
        mirrorPosition.add(mirrorNormal)
        mirrorNormal.multiplyScalar(1 / this.data.mirrorDistance * targetScale)
      }

      // Calculate reflection origin
      const top = mirrorNormal.dot(tempVector3.copy(mirrorPosition).sub(laserOrigin))
      const bottom = mirrorNormal.dot(laserDirection)
      const s = top / bottom
      reflectionOrigin.copy(laserDirection).multiplyScalar(s).add(laserOrigin)

      // Reflect laser across mirror to get reflectionDirection
      reflectionDirection.copy(mirrorNormal).multiplyScalar(mirrorNormal.dot(laserDirection) * -2).add(laserDirection).normalize()

      if (debugging) {
        // Check requirements of proper reflection
        assert('same dot products', Math.abs(reflectionDirection.dot(mirrorNormal)), Math.abs(laserDirection.dot(mirrorNormal)), 0.001)
        assert('coplanar', laserDirection.clone().cross(mirrorNormal).dot(reflectionDirection), 0, 0.001)
      }

      this.base.object3D.localToWorld(reflectionOriginWorld.copy(reflectionOrigin))
      reflectionDirectionWorld.copy(reflectionDirection).transformDirection(this.base.object3D.matrixWorld)

      this.raycaster.set(reflectionOriginWorld, reflectionDirectionWorld)
      const detectorIntersections = this.raycaster.intersectObject(this.detector.object3D, true)

      isHittingDetector = detectorIntersections.length > 0

      if (isHittingDetector) {
        this.base.object3D.worldToLocal(reflectionDirection.copy(detectorIntersections[0].point))
      } else {
        const sceneIntersections = this.raycaster.intersectObjects(this.el.sceneEl.object3D.children, true)

        const validSceneIntersection = sceneIntersections.find(intersection => {

          // Ignore super close
          if (intersection.distance < 0.1) {
            return false
          }

          let laserParent = intersection.object
          while (laserParent && !laserParent.userData.laserIgnore) {
            laserParent = laserParent.parent
          }
          if (laserParent) {
            return false
          }

          return true
        })

        if (validSceneIntersection) {
          reflectionDirection.copy(validSceneIntersection.point)
          this.base.object3D.worldToLocal(reflectionDirection)
        } else {
          reflectionDirection.multiplyScalar(10).add(reflectionOrigin)
        }
      }

      this.reflectionIndicator.object3D.position.copy(reflectionOrigin)
      this.incomingBeam.setAttribute(lineComponent, { start: reflectionOrigin, end: laserOrigin })
      this.reflectedBeam.setAttribute(lineComponent, { start: reflectionOrigin, end: reflectionDirection })

      // Manually call update because start/end vector references haven't changed, so it won't update as normal.
      this.incomingBeam.components[lineComponent].update()
      this.reflectedBeam.components[lineComponent].update()
    }

    if (this.wasHittingDetector !== isHittingDetector) {
      this.wasHittingDetector = isHittingDetector
      this.el.sceneEl.emit('updatedetector', {
        color: this.data.laserColor,
        value: isHittingDetector,
        involvesPlayer: this.data.isPlayer
      })
    }
  }
})

AFRAME.registerComponent('position-updater', {
  init: function() {
    const base = document.getElementById('base')
    const baseReverse = document.getElementById('baseReverse')

    const objects = {}

    socket.on('moved', data => {

      let object = objects[data.id]

      const parentElement = data.name === targetName ? base : baseReverse

      if (!object) {
        const reflection = document.createElement('a-entity')

        reflection.setAttribute('reflector', { mirrorDistance: 0 })

        parentElement.appendChild(reflection)
        object = reflection.object3D
        objects[data.id] = object

      } else if (object.parent !== parentElement.object3D) {
        parentElement.object3D.add(object)
      }
      object.visible = true
      object.position.copy(data.position)
      object.quaternion.fromArray(data.quaternion)
    })

    socket.on('removed', data => {
      let object = objects[data.id]
      if (object) {
        object.visible = false
        object.position.z = 1000
      }
    })
  }
})

AFRAME.registerComponent('position-notifier', {
  init: function() {
    this.id = Math.floor(Math.random() * 1000000)
    this.target = document.getElementById('target')
    this.base = document.getElementById('base')
    this.tempVector3 = new THREE.Vector3()
    this.baseQuaternion = new THREE.Quaternion()
    this.localQuaternion = new THREE.Quaternion()
    this.isTracking = false
  },
  tick: function() {

    if (this.target.object3D.visible !== this.isTracking) {
      this.isTracking = this.target.object3D.visible
      if (!this.isTracking) {
        socket.emit('removed', {
          id: this.id,
        })
      }
    }

    if (!this.isTracking) {
      return
    }

    this.el.object3D.getWorldPosition(this.tempVector3)
    this.base.object3D.worldToLocal(this.tempVector3)

    this.base.object3D.getWorldQuaternion(this.baseQuaternion)
    this.el.object3D.getWorldQuaternion(this.localQuaternion)
    this.baseQuaternion.inverse().multiply(this.localQuaternion)

    socket.emit('moved', {
      id: this.id,
      name: targetName,
      position: this.tempVector3,
      quaternion: this.baseQuaternion.toArray()
    })
  },
  remove: function() {
    socket.emit('removed', {
      id: this.id,
    })
  }
})
