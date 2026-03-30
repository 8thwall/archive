const segmentCount = 5
const segmentAngle = 2 * Math.PI / segmentCount
const animationDuration = 400

const litColor = 'yellow'
const unlitColor = '#234'
const segmentHeight = 0.03
const segmentLength = 0.15
const segmentThickness= 0.03
const segmentColor = unlitColor
const ballHeight = 0.3
const sphereEnterDuration = 4000
const sphereSpinDuration = 2000

const generateConduits = (innerAngle) => {

  const positions = []
  const quaternions = []

  positions.push({ x: 0, y: 1, z: 0 })
  quaternions.push(new THREE.Quaternion())

  const tempEuler = new THREE.Euler(0, 0, 0, 'YXZ')

  for (let i = 0; i < segmentCount; i++) {
    const radialAngle = segmentAngle * i
    const y = Math.cos(innerAngle)
    const h = Math.sin(innerAngle)
    const x = h * Math.sin(radialAngle)
    const z = h * Math.cos(radialAngle)

    tempEuler.y = radialAngle + Math.PI
    tempEuler.x = -innerAngle

    positions.push({ x, y, z })
    quaternions.push(new THREE.Quaternion().setFromEuler(tempEuler))
  }

  const connections = [
    [0, 2],
    [0, 1],
    [0, 2],
    [0,],
    [0, 1],
    [0,],
  ]

  return { positions, quaternions, connections }
}

const followConnection = (index, connectionIndex) => {
  if (index == 0) {
    return connectionIndex + 1
  }

  if (connectionIndex == 0) {
    return 0
  }

  if (connectionIndex == 4) {
    return index % segmentCount + 1
  }

  if (connectionIndex == 1) {
    return index == 1 ? segmentCount : index - 1
  }

  return -1
}

const hasConnection = (index, neighborIndex, connections) => {
  if (index < 0 || neighborIndex < 0) {
    return false
  }

  const res = connections[index].some(c => (followConnection(index, c) === neighborIndex))
  return res
}

const getNeighbors = (index, connections) => {
  const neighbors = connections[index].map(c => followConnection(index, c))

  return neighbors.filter(n => hasConnection(n, index, connections))
}

// Get connected returns index of connected
const getConnected = (connections, rotations) => {
  const isConnected = new Array(connections.length).fill(-1)
  isConnected[0] = true

  const rotatedConnections = []

  for (let i = 0; i < connections.length; i++) {
    rotatedConnections.push(connections[i].map(c => ((c + rotations[i]) % segmentCount)))
  }

  let edge = [0,]
  while(edge.length) {
    const current = edge.pop()
    const unfound = getNeighbors(current, rotatedConnections).filter(i => isConnected[i] === -1)
    unfound.forEach(i => {
      isConnected[i] = current
      edge.push(i)
    })
  }

  return isConnected
}

AFRAME.registerComponent('disarray', {
  schema: {
    planetSize: { default:  0.25 },
    planetDistance: { default: 0 },
    conduitInnerAngle: { default: 0.7 },
  },
  init: function() {
    const camera = document.getElementById('camera')
    camera.setAttribute('raycaster', 'objects: .cantap')
    camera.setAttribute('cursor','fuse:false; rayOrigin:mouse')

    this.tempVector3 = new THREE.Vector3()

    const root = document.createElement('a-entity')
    root.setAttribute('portal-hider', '')

    getSkyElement(root)

    const directionalLight = document.createElement('a-light')
    directionalLight.setAttribute('position', '150 250 150')
    root.appendChild(directionalLight)

    const handleTargetScanned = () => {
      this.el.sceneEl.removeEventListener('xrimagefound', handleTargetScanned)
      window.emit('scanned')

      sphere.setAttribute('animation', {
        property: 'object3D.position.z',
        to: -0.1,
        dur: sphereEnterDuration,
        easing: 'easeOutQuad',
      })

      setTimeout(() => {
        window.emit('changeobjective', { text: 'Connect all conduits' })
        window.emit('changeprogress', { text: `${this.initialConnectedCount}/${conduits.length}` })
        window.emit('changeprompt', { text: 'Tap conduit to rotate', icon: 'tap' })
      }, sphereEnterDuration)
    }
    this.el.sceneEl.addEventListener('xrimagefound', handleTargetScanned)

    const sphere = document.createElement('a-entity')
    sphere.object3D.scale.set(this.data.planetSize, this.data.planetSize, this.data.planetSize)
    sphere.object3D.rotation.x = Math.PI / 2
    sphere.object3D.position.z = -1.5

    const relicParent = document.createElement('a-entity')
    relicParent.object3D.position.y = -0.8
    relicParent.object3D.rotation.x = -Math.PI / 2
    relicParent.object3D.rotation.y = Math.PI

    const relic = document.createElement('a-entity')
    relic.setAttribute('gltf-model', '#relicModel')
    relic.object3D.scale.set(7, 7, 7)
    relicParent.appendChild(relic)

    sphere.appendChild(relicParent)

    const moon = document.createElement('a-entity')
    moon.setAttribute('gltf-model', '#moonModel')
    moon.object3D.scale.set(20,20,20)
    moon.object3D.rotation.x = -Math.PI / 2
    sphere.appendChild(moon)

    root.appendChild(sphere)

    const { positions, quaternions, connections } = generateConduits(this.data.conduitInnerAngle)

    const originalConnections = connections.slice(0)

    const rotations = []
    for(let i = 0; i < positions.length; i++) {
      rotations.push(Math.floor(Math.random() * 5))
    }

    // Initialize conduits
    const conduits = []
    const conduitTransitionTimeouts = []
    for(let i = 0; i < positions.length; i++) {

      const base = document.createElement('a-entity')
      base.object3D.position.copy(positions[i])
      base.object3D.quaternion.copy(quaternions[i])

      const conduit = document.createElement('a-entity')
      conduit.setAttribute('conduit', {
        index: i,
        rotation: rotations[i],
        connections: connections[i],
        hideConnection: i === 0,
      })

      base.appendChild(conduit)
      sphere.appendChild(base)

      conduits.push(conduit)
    }

    const updateConnections = () => {
      const connected = getConnected(connections, rotations)

      const connectedCount = connected.reduce((o,e) => o + (e !== -1 ? 1 : 0), 0)
      const isComplete = connectedCount === connected.length

      connected.forEach((e, i) => {
        if (e === -1) {
          conduits[i].setAttribute('conduit', { isConnected: false })
        } else if (e === true) {
          // Special case for central conduit
          conduits[i].setAttribute('conduit', { isConnected: true, isStopped: isComplete })
        } else {
          this.tempVector3.set(0, ballHeight, 0)
          conduits[e].object3D.localToWorld(this.tempVector3)
          conduits[i].setAttribute('conduit', { isConnected: true, connectedPosition: this.tempVector3, isStopped: isComplete })
          conduits[i].components.conduit.update()
        }
      })
      return connectedCount
    }

    this.el.sceneEl.appendChild(root)

    setTimeout(() => {
      this.el.sceneEl.object3D.updateMatrixWorld(true)
      this.initialConnectedCount = updateConnections()
    }, 10)

    // Handle conduit rotations
    this.el.sceneEl.addEventListener('conduitupdate', e => {
      const { index, rotation } = e.detail
      rotations[index] = rotation

      // Disconnect rotating conduit
      connections[index] = []

      conduits[index].setAttribute('conduit', { isConnected: index === 0 })

      updateConnections()

      clearTimeout(conduitTransitionTimeouts[index])
      conduitTransitionTimeouts[index] = setTimeout(() => {

        // Reconnect rotating conduit
        connections[index] = originalConnections[index]

        const connectedCount = updateConnections()

        window.emit('changeprogress', {text: `${connectedCount}/${conduits.length}`})

        if (connectedCount > this.initialConnectedCount) {
          window.emit('clearprompt')
        }

        if (connectedCount == conduits.length) {
          sphere.setAttribute('animation', {
            property: 'object3D.rotation.z',
            to: Math.PI,
            dur: sphereSpinDuration,
            easing: 'easeInOutQuad',
          })

          relic.setAttribute('animation__spin', {
            property: 'object3D.rotation.y',
            dur: 1500,
            easing: 'linear',
            loop: true,
            from: 0,
            to: 2 * Math.PI
          })

          setTimeout(() => {
            zoomRelic(relic, 10, 'z')
            setTimeout(() => {
              window.emit('collected', { replay: true })
            }, 1500)
          }, sphereSpinDuration)
        }
      }, animationDuration + 20)
    })
  }
})

AFRAME.registerComponent('conduit', {
  schema: {
    index: { default: 0 },
    rotation: { default: 0 },
    isConnected: { default: false },
    isStopped: { default: false },
    connections: { default: [] },
    connectedPosition: { type: 'vec3' },
    hideConnection: { default: false },
  },
  init: function() {
    this.el.classList.add('cantap')
    this.rotation = this.data.rotation
    this.el.object3D.rotation.y = this.rotation * segmentAngle

    const tapTarget = document.createElement('a-sphere')
    tapTarget.object3D.scale.set(0.3, 0.3, 0.3)
    tapTarget.setAttribute('material', { opacity: 0 })
    this.el.appendChild(tapTarget)

    const ball = document.createElement('a-sphere')
    ball.setAttribute('segments-height', 6)
    ball.setAttribute('segments-width', 8)
    ball.object3D.scale.set(0.1, 0.1, 0.1)
    ball.object3D.position.y = ballHeight
    this.el.appendChild(ball)
    this.ball = ball

    const tower = document.createElement('a-cylinder')
    tower.setAttribute('segments-height', 1)
    tower.setAttribute('segments-radial', 8)
    tower.object3D.scale.set(0.07, ballHeight, 0.07)
    tower.object3D.position.y = ballHeight / 2
    tower.setAttribute('material', { color: '#aaa', flatShading: true })
    this.el.appendChild(tower)

    const bottom = document.createElement('a-cylinder')
    bottom.setAttribute('segments-radial', segmentCount)
    bottom.object3D.scale.set(0.2, 0.05, 0.2)
    bottom.setAttribute('material', { color: '#aaa', flatShading: true })
    this.el.appendChild(bottom)

    // Initialize connection lines
    for (let j = 0; j < this.data.connections.length; j++) {
      const connectionParent = document.createElement('a-entity')

      const connection = document.createElement('a-box')
      connection.setAttribute('material', {color: segmentColor, flatShading: true })
      connection.object3D.scale.set(segmentThickness, segmentThickness, segmentLength)
      connection.object3D.position.z = segmentLength / 2
      connectionParent.appendChild(connection)

      connectionParent.object3D.rotation.y = this.data.connections[j] * segmentAngle
      connectionParent.object3D.position.y = segmentHeight
      this.el.appendChild(connectionParent)
    }

    const mainConnection = document.createElement('a-entity')
    mainConnection.setAttribute('cylinder-line', { color: litColor, opacity: 1, start: { x: 0, y: ballHeight, z: 0 } })
    this.el.appendChild(mainConnection)
    this.mainConnection = mainConnection

    this.tempVector3 = new THREE.Vector3()

    this.el.addEventListener('click', () => {
      if (this.data.isStopped) {
        return
      }

      this.rotation++

      this.el.setAttribute('animation', {
        property: 'object3D.rotation.y',
        to: this.rotation * segmentAngle,
        dur: animationDuration,
        easing: 'easeOutQuad'
      })

      this.el.sceneEl.emit('conduitupdate', { index: this.data.index, rotation: this.rotation % segmentCount })
    })
  },
  update: function() {
    if (!this.data) {
      return
    }
    if (this.data.isConnected && !this.data.hideConnection) {
      this.mainConnection.object3D.visible = true
      this.tempVector3.copy(this.data.connectedPosition)
      this.el.object3D.worldToLocal(this.tempVector3)
      this.mainConnection.setAttribute('cylinder-line', { end: this.tempVector3 })
      this.mainConnection.components['cylinder-line'].update()
    } else {
      this.mainConnection.object3D.visible = false
    }

    if (this.data.isConnected) {
      this.ball.setAttribute('material', { color: litColor, flatShading: false, shader: 'flat' })
    } else {
      this.ball.setAttribute('material', { color: unlitColor, flatShading: true, shader: 'standard' })
    }
  }
})
