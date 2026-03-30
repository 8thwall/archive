const raycaster = new THREE.Raycaster()
const tmpVector3 = new THREE.Vector3()

const relicDistance = 7.5

const path = [
  {
    type: 'point',
    position: { x: 0, y: 0, z: -2.5 },
    duration: 0,
  },
  {
    type: 'arc',
    center: { x: 0, y: 0, z: -4 },
    radius: 1.5,
    from: Math.PI * 3 / 2,
    to: Math.PI * 5 / 2,
    duration: 2500,
  },
  {
    type: 'line',
    duration: 2500,
  },
  {
    type: 'arc',
    center: { x: -3.75, y: 0, z: -4.2 },
    radius: 1.8,
    from: Math.PI * 3 / 2,
    to: Math.PI / 2,
    duration: 3500,
  },
  {
    type: 'line',
    duration: 5000,
  },
  {
    type: 'arc',
    center: { x: 5, y: 0, z: -6 },
    radius: 2.5,
    from: Math.PI * 3 / 2,
    to: Math.PI * 5 / 2,
    duration: 5000,
  },
  {
    type: 'line',
    duration: 2000,
  },
  {
    type: 'point',
    position: { x: 1.8, y: 0, z: -relicDistance },
  }
]

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

AFRAME.registerComponent('moonlight', {
  init: function() {
    const camera = document.getElementById('camera')

    const target = document.createElement('a-entity')
    target.setAttribute('portal-hider', '')
    getSkyElement(target)

    const handleTargetScanned = () => {
      this.el.sceneEl.removeEventListener('xrimagefound', handleTargetScanned)

      const spotlight = document.createElement('a-light')
      spotlight.setAttribute('light', { type: 'spot', color: 'white', angle: 10, penumbra: 0.2 })
      setTimeout(() => {
        camera.appendChild(spotlight)
        pather.setAttribute('path-follower', '')
      }, 3000)
      window.emit('scanned')

      window.emit('changeobjective', { text: 'GUIDE THE ALIEN TO THE RELIC' })
      window.emit('changeprompt', { text: 'Move around to aim light', icon: 'move' })
    }
    this.el.sceneEl.addEventListener('xrimagefound', handleTargetScanned)

    const base = document.createElement('a-entity')
    base.object3D.position.y = -1
    base.object3D.scale.set(0.5, 0.5, 0.5)

    const ground = document.createElement('a-entity')
    ground.object3D.scale.set(25, 25, 25)
    ground.object3D.rotation.y = Math.PI / 0.96
    ground.object3D.position.z = -13
    ground.object3D.position.y = -0.5
    ground.setAttribute('gltf-model', '#ground')
    base.appendChild(ground)

    const glowLight = document.createElement('a-entity')
    glowLight.setAttribute('light', {
      type: 'directional',
      intensity: 0.5,
      color: '#69FFFF'
    })
    glowLight.object3D.position.x = 1
    glowLight.object3D.position.y = 1
    glowLight.object3D.position.z = -2
    base.appendChild(glowLight)

    const pather = document.createElement('a-entity')
    pather.id = 'pather'
    pather.object3D.position.z = -2.5
    base.appendChild(pather)

    const follower = document.createElement('a-entity')
    follower.object3D.scale.set(5, 5, 5)
    follower.object3D.position.x = 0
    follower.object3D.position.y = 0
    follower.object3D.position.z = -2.5
    follower.setAttribute('object-follower', { target: '#pather' })
    follower.setAttribute('gltf-model', '#alienModel')
    follower.setAttribute('animation-mixer', { clip: 'standidle' } )

    const lightTarget = document.createElement('a-entity')
    lightTarget.id = 'lightTarget'
    lightTarget.object3D.scale.set(0.1, 0.1, 0.1)
    lightTarget.object3D.position.y = 0.2
    follower.appendChild(lightTarget)

    base.appendChild(follower)

    const relic = document.createElement('a-entity')
    relic.setAttribute('gltf-model', '#relicModel')
    relic.object3D.scale.set(10, 10, 10)
    relic.object3D.position.set(1.8, 1, -relicDistance)
    relic.setAttribute('animation__spin', {
      property: 'object3D.rotation.y',
      dur: 1500,
      easing: 'linear',
      loop: true,
      from: 0,
      to: 2 * Math.PI
    })
    base.appendChild(relic)

    // Obstacles
    const jagged = document.createElement('a-entity')
    jagged.object3D.scale.set(23, 23, 23)
    jagged.object3D.position.z = -4
    jagged.object3D.rotation.z = 0.261799
    jagged.setAttribute('gltf-model', '#jaggedRock')
    base.appendChild(jagged)

    const arch = document.createElement('a-entity')
    arch.object3D.scale.set(35,35,35)
    arch.object3D.position.z = -8
    arch.object3D.position.x = -3
    arch.object3D.rotation.y = 0.35
    arch.setAttribute('gltf-model', '#archRock')
    base.appendChild(arch)

    const balance = document.createElement('a-entity')
    balance.object3D.scale.set(50, 50, 50)
    balance.object3D.position.z = -5.5
    balance.object3D.position.x = 5
    balance.setAttribute('gltf-model', '#balanceRock')
    base.appendChild(balance)

    target.appendChild(base)
    this.el.sceneEl.appendChild(target)

    this.el.setAttribute('light-dependent-mover', '')

    pather.addEventListener('pathcomplete', () => {

      follower.removeAttribute('object-follower')

      follower.setAttribute('animation', {
        property: 'object3D.rotation.y',
        to: 0,
        dur: 700,
      })

      follower.setAttribute('animation-mixer', {
        clip: 'dance'
      })

      relic.setAttribute('animation__rise', {
        property: 'object3D.position.y',
        dur: 1000,
        to: 50,
        easing: 'easeInQuad',
      })

      setTimeout(() => {
        window.emit('collected', { replay: true })
        relic.object3D.visible = false
      }, 1000)
    })
  }
})

const getPositionOnSegment = (segment, proportion, result) => {
  result = result || new THREE.Vector3()
  switch (segment.type) {
    case 'arc':
      const currentAngle = segment.from + proportion * (segment.to - segment.from)
      result.copy(segment.center)
      result.x += segment.radius * Math.cos(currentAngle)
      result.z -= segment.radius * Math.sin(currentAngle)
      return result
    case 'point':
      return result.copy(segment.position)
  }
  throw new Error('Can\'t get position of segment of type:' + segment.type )
}

const getPositionFromPath = (path, index, elapsed, result) => {
  const segment = path[index]
  const proportion = elapsed / (segment.duration || 1)

  switch(segment.type) {
    case 'arc':
    case 'point':
      return getPositionOnSegment(segment, proportion, result)
    case 'line':
      getPositionOnSegment(path[index - 1], 1, result)
      getPositionOnSegment(path[index + 1], 0, tmpVector3)
      return result.lerp(tmpVector3, proportion)
  }
}

AFRAME.registerComponent('path-follower', {
  schema: {
    moving: { default: true },
  },
  init: function() {
    this.currentSegmentIndex = 0
    this.currentSegmentElapsed = 0
    this.path = path
  },
  tick: function(time, deltaTime) {

    if (!this.data.moving) {
      return
    }

    this.currentSegmentElapsed += deltaTime


    let currentSegment = this.path[this.currentSegmentIndex]

    while (currentSegment && this.currentSegmentElapsed >= (currentSegment.duration || 0)) {
      this.currentSegmentElapsed -= (currentSegment.duration || 0)
      this.currentSegmentIndex++
      currentSegment = this.path[this.currentSegmentIndex]
    }

    if (!currentSegment) {
      this.el.emit('pathcomplete')
      this.el.removeAttribute(this.attrName)
      return
    }

    getPositionFromPath(path, this.currentSegmentIndex, this.currentSegmentElapsed, this.el.object3D.position)
  }
})

AFRAME.registerComponent('object-follower', {
  schema: {
    target: { type: 'selector' },
    moving: { default: true },
  },
  init: function() {
    this.tempVector3 = new THREE.Vector3()
    this.zAxis = new THREE.Vector3(0, 0, -1)
  },
  tick: function(time, timeDelta) {
    const target =  this.data.target
    let moved = false
    if (target && this.data.moving) {
      this.tempVector3.copy(this.el.object3D.position).lerp(target.object3D.position, 0.2).sub(this.el.object3D.position)

      const moveDistance = this.tempVector3.length()

      if (moveDistance > 0.05) {
        this.el.object3D.rotation.y = Math.atan2(this.tempVector3.x, this.tempVector3.z)
        this.el.object3D.position.add(this.tempVector3)
        moved = true
      }
    }

    if (moved) {
      window.emit('clearprompt')
      this.el.setAttribute('animation-mixer', { clip: 'flail', crossFadeDuration: 0.4 })
    } else {
      this.el.setAttribute('animation-mixer', { clip: 'standidle', crossFadeDuration: 0.4 })
    }
  }
})

AFRAME.registerComponent('light-dependent-mover', {
  init: function() {
    this.pather = document.getElementById('pather')
    this.target = document.getElementById('lightTarget')
    this.camera = document.getElementById('camera').getObject3D('camera')
    this.tempVector3 = new THREE.Vector3()
    this.wasLooking = false
  },
  tick: function() {

    const offsetPixels = getScreenPixels(this.target.object3D, this.camera, this.tempVector3)

    const maxRadiusSquared = Math.pow(Math.min(window.innerWidth, window.innerHeight) / 5, 2)

    const squaredOffset = this.tempVector3.lengthSq()

    let looking = false

    if (this.wasLooking) {
      looking = squaredOffset < Math.pow(Math.min(window.innerWidth, window.innerHeight) / 5, 2)
    } else {
      looking = squaredOffset < Math.pow(Math.min(window.innerWidth, window.innerHeight) / 6, 2)
    }

    this.pather.hasAttribute('path-follower') && this.pather.setAttribute('path-follower', { moving: looking })
    this.target.setAttribute('object-follower', { moving: looking })

    this.wasLooking = looking
  }
})

