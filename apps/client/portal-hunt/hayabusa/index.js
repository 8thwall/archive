let targetScale = 1

AFRAME.registerComponent('swarm', {
  init: function() {
    const base = document.createElement('a-entity')
    base.id = 'swarmBase'
    base.setAttribute('portal-hider','')

    getSkyElement(base)

    const directionalLight = document.createElement('a-light')
    directionalLight.setAttribute('position', '150 250 100')
    base.appendChild(directionalLight)

    const camera = document.getElementById('camera')

    let hasScanned = false
    let hasTarget = false
    let launchAllowed = true

    this.el.sceneEl.addEventListener('xrimagefound', () => {
      if (!hasScanned) {
        hasScanned = true
        window.emit('scanned')
        window.emit('changeobjective', { text: 'Defeat the swarm!' })
        window.emit('changeprogress', { text: `0/${maxBugs}` })
        window.emit('changeprompt', { text: 'Aim to target\nTap to fire', icon: 'tap' })

        this.bugInterval = setInterval(spawnBug, 1200)
      }

      camera.setAttribute('missile-launcher', {isTargeting: launchAllowed})
      hasTarget = true
    })

    this.el.sceneEl.addEventListener('xrimageupdated', e => {
      targetScale = e.detail.scale
    })

    this.el.sceneEl.addEventListener('xrimagelost', () => {
      camera.setAttribute('missile-launcher', {isTargeting: false})
      hasTarget = false
    })

    const hiveDistance = 1.5
    const hiveScale = 3 * hiveDistance

    const tree = document.createElement('a-entity')
    tree.setAttribute('gltf-model', '#treeModel')
    tree.object3D.scale.set(hiveScale, hiveScale, hiveScale)
    tree.object3D.position.set(0, 0, -hiveDistance)
    base.appendChild(tree)

    const hive = document.createElement('a-entity')
    hive.id = 'hive'
    hive.setAttribute('gltf-model', '#hiveModel')
    hive.setAttribute('color', 'orange')
    hive.setAttribute('hive', '')
    hive.object3D.scale.set(hiveScale, hiveScale, hiveScale)
    hive.object3D.position.z = -hiveDistance
    base.appendChild(hive)

    const relic = document.createElement('a-entity')
    relic.setAttribute('gltf-model', '#relicModel')
    relic.object3D.scale.set(3.5, 3.5, 3.5)
    relic.object3D.position.z = -hiveDistance
    base.appendChild(relic)

    this.el.sceneEl.appendChild(base)

    camera.setAttribute('missile-launcher', {isTargeting: false})

    const maxBugs = 10
    const maxConcurrentBugs = 3
    let totalBugsSpawned = 0
    let liveBugCount = 0
    let destroyedCount = 0

    const spawnBug = () => {
      if (liveBugCount >= maxConcurrentBugs || !hasTarget) {
        return
      }

      if (totalBugsSpawned >= maxBugs) {
        clearInterval(this.bugInterval)
        return
      }
      const bug = document.createElement('a-entity')
      bug.id = `bug${totalBugsSpawned}`
      bug.setAttribute('color', 'green')
      bug.object3D.position.z = -hiveDistance
      bug.setAttribute('bug','')
      bug.setAttribute('gltf-model', '#bugModel')
      bug.setAttribute('animation-mixer', { clip: 'flap' })
      base.appendChild(bug)

      liveBugCount++
      totalBugsSpawned++
    }

    this.handleBugDestroyed = () => {
      liveBugCount--
      destroyedCount++

      window.emit('clearprompt')
      window.emit('changeprogress', { text: `${destroyedCount}/${maxBugs}` })

      if (destroyedCount >= maxBugs) {

        window.emit('newalert', { text: 'The hive is unprotected!', duration: 1500 })
        window.emit('changeobjective', { text: 'Destroy the hive' })
        window.emit('changeprogress', { text: '0/1' })

        hive.setAttribute('color', 'pink')
        this.el.sceneEl.emit('addtarget', { target: hive })
      }
    }

    this.el.sceneEl.addEventListener('hivedestroyed', () => {
      launchAllowed = false
      camera.setAttribute('missile-launcher', {isTargeting: false})
      spinRelic(relic)
      window.emit('changeprogress', { text: '1/1' })
      setTimeout(() => {
        zoomRelic(relic, 10, 'z')
        setTimeout(() => {
          window.emit('collected', { replay: true })
        }, 1000)
      }, 1500)
    })

    this.el.sceneEl.addEventListener('bugdestroyed', this.handleBugDestroyed)
  },
  remove: function() {
    this.el.sceneEl.removeEventListener('bugdestroyed', this.handleBugDestroyed)
  }
})

const bugEntranceDurationBasis = 700
const bugEntranceDurationVariance = 500

const bugIdleDurationBasis = 3500
const bugIdleDurationVariance = 1500

const bugDestinationBasis = {
  x: 0,
  y: 0,
  z: 0.1,
}

const bugDestinationVariance = {
  x: 0.3,
  y: 0.3,
  z: 0,
}

const bugIdleVariance = {
  x: 0.15,
  y: 0.15,
  z: 0.1,
}

const getRandom = (basis, variance, negative = false) => {
  return basis + variance * (negative ? -1 + 2 * Math.random() : Math.random())
}

AFRAME.registerComponent('bug', {
  init: function() {
    this.el.sceneEl.emit('addtarget', { target: this.el })

    const entranceDuration = getRandom(bugEntranceDurationBasis, bugEntranceDurationVariance)

    this.el.setAttribute('bug-axis-animator__x', {
      axis: 'x',
      entranceDuration,
      easing: 'linear'
    })

    this.el.setAttribute('bug-axis-animator__y', {
      axis: 'y',
      entranceDuration,
      easing: 'linear'
    })

    this.el.setAttribute('bug-axis-animator__z', {
      axis: 'z',
      entranceDuration,
      easing: 'expoOut',
    })
  },
  remove: function() {
    this.el.sceneEl.emit('bugdestroyed', this.el)
  }
})

AFRAME.registerComponent('bug-axis-animator', {
  schema: {
    axis: { type: 'string' },
    entranceDuration: { default: 1000 },
    easing: { default: 'linear' },
  },
  multiple: true,
  init: function() {
    const { axis, entranceDuration, easing } = this.data

    const idleAmplitude = getRandom(0, bugIdleVariance[axis])
    const idleDuration = getRandom(bugIdleDurationBasis, bugIdleDurationVariance)
    const idleBasis = getRandom(bugDestinationBasis[axis], bugDestinationVariance[axis], true)

    this.el.setAttribute('bob-animator__' + axis, {
      axis,
      period: 2 * Math.PI / idleDuration,
      start: this.el.object3D.position[axis],
      baseline: idleBasis,
      amplitude: idleAmplitude,
      startSqueeze: entranceDuration,
      easing
    })
  }
})

AFRAME.registerComponent('bob-animator', {
  schema: {
    axis: { type: 'string' },
    period: { default: .01 },
    start: { default: 0 },
    baseline: { default: 0 },
    amplitude: { default: 1 },
    offset: { default: 0 },
    startSqueeze: { default: 1000 },
    easing: {default: 'linear'}
  },
  multiple: true,
  init: function() {
    this.timePassed = 0
    this.startEase = 0
  },
  tick: function(time, timeDelta) {
    this.timePassed += timeDelta
    if (this.startEase < 1) {
      if (this.data.easing === 'expoOut') {
        this.startEase = Math.min(1, Math.sqrt(this.timePassed / this.data.startSqueeze))
      } else {
        this.startEase = Math.min(1, this.timePassed / this.data.startSqueeze)
      }
    }
    this.el.object3D.position[this.data.axis] = this.data.start + this.startEase * (this.data.baseline - this.data.start + this.data.amplitude * Math.sin(this.timePassed * this.data.period - this.data.offset))
  }
})

AFRAME.registerComponent('missile-launcher', {
  schema: {
    radius: { default: 0.25},
    isTargeting: { default: true },
    lockOnMillis: { default: 300 },
  },
  init: function() {
    this.cameraObject3D = this.el.object3D
    this.cameraObject = this.el.getObject3D('camera')

    const base = document.getElementById('swarmBase')

    this.reticle = document.createElement('div')
    this.reticle.classList.add('reticle', 'shadowed')
    this.reticle.style.width = `${this.data.radius * 130}vmin`
    this.reticle.style.height = `${this.data.radius * 130}vmin`
    document.body.appendChild(this.reticle)

    this.targets = []

    this.tempVector3 = new THREE.Vector3()

    const addTarget = target => {
      this.targets.push(target)
    }

    const removeTarget = (target, resetCurrent = true) => {
      this.targets = this.targets.filter(e => e !== target)
      if (this.currentTarget === target && resetCurrent) {
        this.setCurrentTarget(null)
      }
    }

    this.setCurrentTarget = (target) => {
      if (this.currentTarget === target) {
        return
      }

      clearTimeout(this.lockOnTimeout)
      this.isLockedOn = false

      if (this.currentTarget) {
        this.currentTarget.removeAttribute('animation__focus')
        this.currentTarget.removeAttribute('targeted')
      }

      if (target) {
        target.setAttribute('targeted', { focus: 0 })
        target.setAttribute('animation__focus', {
          property: 'targeted.focus',
          dur: this.data.lockOnMillis,
          from: 0,
          to: 1,
        })

        this.lockOnTimeout = setTimeout(() => {
          this.isLockedOn = true
        }, this.data.lockOnMillis)
      }

      this.currentTarget = target
    }

    this.addTargetListener = e => {
      addTarget(e.detail.target)
    }

    this.removeTargetListener = e => {
     removeTarget(e.detail.target)
    }

    this.shoot = () => {
      if (!this.currentTarget || !this.isLockedOn) {
        return
      }

      removeTarget(this.currentTarget, false)

      const missile = document.createElement('a-entity')
      this.cameraObject3D.getWorldPosition(missile.object3D.position)
      base.object3D.worldToLocal(missile.object3D.position)

      missile.object3D.position.z += 0.2

      missile.setAttribute('missile', {
        target: `#${this.currentTarget.id}`,
        initialAngle: this.currentTarget.id === 'hive' ? Math.PI * 3 / 2 : undefined,
      })

      base.appendChild(missile)

      this.currentTarget.removeAttribute('animation__focus')
      this.currentTarget.setAttribute('targeted', { locked: true })
      this.currentTarget = null
    }

    window.addEventListener('touchstart', this.shoot)
    this.el.sceneEl.addEventListener('addtarget', this.addTargetListener)
    this.el.sceneEl.addEventListener('removetarget', this.removeTargetListener)
  },
  remove: function() {
    clearTimeout(this.lockOnTimeout)
    window.removeEventListener('touchstart', this.shoot)
    this.el.sceneEl.removeEventListener('addtarget', this.addTargetListener)
    this.el.sceneEl.removeEventListener('removetarget', this.removeTargetListener)
    document.body.removeChild(this.crosshair)
  },
  update: function() {
    this.reticle.style.display = this.data.isTargeting ? 'block' : 'none'
    if (!this.data.isTargeting) {
      this.setCurrentTarget(null)
    }
  },
  tick: function() {
    if (this.data.isTargeting) {

      const maxPixelRadius = this.data.radius * Math.min(window.innerWidth, window.innerHeight)
      const maxPixelRadiusSquared = Math.pow(maxPixelRadius, 2)

      if (this.currentTarget) {
        if (getScreenPixels(this.currentTarget.object3D, this.cameraObject, this.tempVector3).lengthSq() < maxPixelRadiusSquared) {
          return
        }
      }

      const targets = this.targets.map(target => {
        const screenPosition = getScreenPixels(target.object3D, this.cameraObject, this.tempVector3)
        return { target, squaredDistanceFromCenter: screenPosition.lengthSq() }
      })
      .filter(e => {
        return (e.squaredDistanceFromCenter < maxPixelRadiusSquared)
      })
      .sort((firstEl, secondEl) => {
        return firstEl.squaredDistanceFromCenter - secondEl.squaredDistanceFromCenter
      })

      const newTarget = targets.length > 0 ? targets[0].target : null

      this.setCurrentTarget(newTarget)
    }
    window.XR = window.nativeXR
  },
})

window.addEventListener('xrloaded', () => {
  window.nativeXR = window.XR
})

const getScreenPixels = (object3D, cameraObject, vector3) => {
  const res = getScreenPosition(object3D, cameraObject, vector3)
  res.x *= window.innerWidth / 2
  res.y *= window.innerHeight / 2
  return res
}

const getScreenPosition = (object3D, cameraObject, vector3) => {
  const res = object3D.getWorldPosition(vector3 || new THREE.Vector3()).project(cameraObject)
  res.z = 0
  return res
}

AFRAME.registerComponent('targeted', {
  schema: {
    focus: { default: 1 }, // 0 - 1, where 1 is most focused
    locked: { default: false },
  },
  init: function() {
    this.crosshair = document.createElement('div')
    this.crosshair.classList.add('crosshair', 'shadowed')
    document.body.appendChild(this.crosshair)
    this.tempVector3 = new THREE.Vector3()
    this.cameraObject = document.getElementById('camera').getObject3D('camera')
  },
  update: function() {
    const size = `${20 / (this.data.focus + 1)}vmax`
    this.crosshair.style.width = size
    this.crosshair.style.height = size

    if (this.data.locked) {
      this.crosshair.style.filter = 'none'
      this.crosshair.style.opacity = 1
    } else {
      this.crosshair.style.filter = 'grayscale(100%) brightness(1000%)'
      this.crosshair.style.opacity = this.data.focus
    }
  },
  tick: function() {
    getScreenPosition(this.el.object3D, this.cameraObject, this.tempVector3)
    this.crosshair.style.left = `${(this.tempVector3.x + 1) * 50}%`
    this.crosshair.style.top = `${(-this.tempVector3.y + 1) * 50}%`
  },
  remove: function() {
    document.body.removeChild(this.crosshair)
  }
})

const finWidth = 0.75
const finSlant = 0.75
const finLength = 1
const finDepth = 0.1
const finCount = 4

const finShape = new THREE.Shape()
finShape.moveTo(0, 0)
finShape.lineTo(finWidth, finSlant)
finShape.lineTo(finWidth, finSlant + finLength)
finShape.lineTo(0, finLength)

const finExtrudePath = new THREE.LineCurve3(new THREE.Vector3(-finDepth, 0, 0), new THREE.Vector3(finDepth, 0, 0))

const finGeometry = new THREE.ExtrudeBufferGeometry(finShape, {
  amount: finDepth,
  bevelEnabled: false,
  extrudePath: finExtrudePath,
})

const finMaterial = new THREE.MeshStandardMaterial({color: 'red'})

AFRAME.registerComponent('missile', {
  schema: {
    target: {type: 'selector'},
    scale: { default: 0.025 },
    initialSpeed: { default: 0.001 },
    acceleration: { default: 1 },
    initialAngle: { default: '' },
    trajectoryFactor: { default: 300 },
    launchDuration: { default: 500 },
  },
  init: function() {
    this.tempVector3 = new THREE.Vector3()
    this.tempVector3_2 = new THREE.Vector3()
    this.unitVector = new THREE.Vector3(0, 0, 1)

    const radialSegments = 8

    this.el.object3D.rotation.order = 'YXZ'
    this.el.object3D.scale.set(this.data.scale, this.data.scale, this.data.scale)

    const fuselage = document.createElement('a-cylinder')
    fuselage.setAttribute('segments-radial', radialSegments)
    fuselage.setAttribute('material', { color: '#ccc', flatShading: true })
    fuselage.object3D.rotation.x = Math.PI / 2
    fuselage.object3D.scale.set(0.5, 3, 0.5)
    this.el.appendChild(fuselage)

    const noseCone = document.createElement('a-sphere')
    noseCone.setAttribute('segments-height', 8)
    noseCone.setAttribute('segments-width', radialSegments)
    noseCone.setAttribute('material', { color: 'red', flatShading: true })
    noseCone.object3D.position.z = 1.5
    noseCone.object3D.rotation.x = Math.PI / 2
    noseCone.object3D.scale.set(0.5, 0.5, 0.5)
    this.el.appendChild(noseCone)

    const fins = document.createElement('a-entity')
    for (let i = 0; i < finCount; i++) {
      const fin = new THREE.Mesh(finGeometry, finMaterial)
      fin.rotation.y = i * 2 * Math.PI / finCount
      fin.rotation.x = -Math.PI / 2
      fins.object3D.add(fin)
    }
    this.el.appendChild(fins)

    this.entityAge = 0
    this.speed = this.data.initialSpeed

    const trajectorySpeed = this.data.trajectoryFactor * this.speed
    const trajectoryAngle = (this.data.initialAngle || this.data.initialAngle === 0) ? this.data.initialAngle : 2 * Math.PI * Math.random()
    this.trajectory = new THREE.Vector3(
      trajectorySpeed * Math.cos(trajectoryAngle),
      trajectorySpeed * Math.sin(trajectoryAngle),
      trajectorySpeed * -5
    )
  },
  tick: function(time, timeDelta) {
    this.entityAge += timeDelta
    const secondsDelta = timeDelta / 1000

    if (!this.data.target ) {
      return
    }

    this.tempVector3.copy(this.el.object3D.position).sub(this.data.target.object3D.position) // Target to position

    // Update rotation to point at target
    const distance = this.tempVector3.length()
    this.el.object3D.rotation.y = Math.atan2(-this.tempVector3.x, -this.tempVector3.z)
    this.el.object3D.rotation.x = -Math.asin(-this.tempVector3.y / distance)
    this.el.object3D.rotation.z += secondsDelta / 2

    if (this.entityAge > this.data.launchDuration) {

      if (!this.rocketParticles) {
        //create particle system
        this.rocketParticles = document.createElement('a-entity');
        this.rocketParticles.object3D.position.z = -1.7
        this.rocketParticles.setAttribute('particle-system', {
          color: '#ffa500,#ff0000,#555555',
          texture: 'images/cloud.png',
          positionSpread: '0 0 0',
          rotationAxis: 'x',
          size: 0.15 * targetScale,
          particleCount: 50,
          maxParticleCount: 50,
          maxAge: 0.45,
          accelerationValue: '0, 0, 0',
          accelerationSpread: '0 0 0',
          velocityValue: `0 0 ${-3 * targetScale}`,
          velocitySpread: `${0.5 * targetScale} ${0.5 * targetScale} 0`,
          blending: 1,
        })
        this.el.appendChild(this.rocketParticles)
      }

      const currentDistanceToTarget = this.tempVector3.length()
      const nextDistanceToTarget = currentDistanceToTarget - this.speed * secondsDelta

      if (nextDistanceToTarget < this.data.scale * 2.5) {

        const isHive = this.data.target.id === 'hive'

        const explosion = document.createElement('a-entity')
        explosion.setAttribute('explosion', {
          scale: isHive ? 0.2 : 0.06,
          lookAt: document.getElementById('camera').object3D.position,
          color: isHive ? '#c5e' : '#ee5',
        })

        explosion.object3D.position.copy(this.data.target.object3D.position)
        if (isHive) {
          explosion.object3D.position.z -= 0.5
        }
        this.el.parentElement.appendChild(explosion)

        this.data.target.setAttribute('animation__explode', {
          property: 'scale',
          to: isHive ? '5 5 5' : '1.5 1.5 1.5',
          dur: 200,
          easing: 'easeOutQuad',
        })

        setTimeout(() => {
          this.data.target.parentEl && this.data.target.parentEl.removeChild(this.data.target)
        }, 200)

        this.el.parentEl && this.el.parentEl.removeChild(this.el)
        return
      }

      this.tempVector3.add(this.tempVector3_2.copy(this.trajectory).multiplyScalar(secondsDelta)) // Target to trajectory

      this.tempVector3.normalize().multiplyScalar(nextDistanceToTarget) // Target to next position

      this.tempVector3.add(this.data.target.object3D.position) // New position

      this.trajectory.copy(this.tempVector3).sub(this.el.object3D.position)

      this.el.object3D.position.copy(this.tempVector3)

      // Drag to prevent overshoots (speed still locked in)
      this.trajectory.multiplyScalar(0.8)

      this.speed += this.data.acceleration * secondsDelta
    } else {
      this.tempVector3.copy(this.trajectory).multiplyScalar(secondsDelta)
      this.el.object3D.position.add(this.tempVector3)
      this.trajectory.multiplyScalar(0.93)
    }
  }
})

AFRAME.registerComponent('hive', {
  init: function() {

  },
  remove: function() {
    this.el.sceneEl.emit('hivedestroyed')
  }
})
