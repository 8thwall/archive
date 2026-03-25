import {fetchMesh} from './coverage-watcher'

const nodeVisualizer = (parent, image, title, node) => {
  const INACTIVE_COLOR = new THREE.Color('#57BFFF').convertSRGBToLinear()
  const ACTIVE_COLOR = new THREE.Color('#FFC828').convertSRGBToLinear()
  const ACTIVE_NO_ANCHOR_COLOR = new THREE.Color('#DD0065').convertSRGBToLinear()
  const TRANSITION_SPEED = 1000
  const STATE_GROW = 'grow'
  const STATE_SHRINK = 'shrink'

  let nodeColor_ = INACTIVE_COLOR

  const orbHolder_ = document.createElement('a-entity')
  orbHolder_.setAttribute('position', '0 .1 0')
  const randomYRotation = Math.random() * 360
  orbHolder_.setAttribute('shadow', 'receive: false')
  orbHolder_.setAttribute('rotation', `0 ${randomYRotation} 0`)  // apply random rotation

  const texLoader_ = new THREE.TextureLoader().load(
    image,
    (texture) => {
      texture.encoding = THREE.sRGBEncoding
    }
  )

  const disc_ = document.createElement('a-entity')
  let discLoaded_ = false
  disc_.addEventListener('model-loaded', () => {
    // disc_.getObject3D('mesh').getObjectByName('inner').material = new THREE.MeshBasicMaterial()
    // disc_.getObject3D('mesh').getObjectByName('inner').material.map = texLoader_
    // disc_.getObject3D('mesh').getObjectByName('outer').material.color = nodeColor_
    discLoaded_ = true
  })
  disc_.setAttribute('gltf-model', '#splat-model')
  const randomScale = Math.floor(Math.random() * 6) + 1
  disc_.setAttribute('scale', `${randomScale} ${randomScale} ${randomScale}`)
  // disc_.setAttribute('xrextras-spin', 'speed: 12000')
  // disc_.object3D.visible = false
  disc_.classList.add('disc')
  disc_.id = title
  // orbHolder_.appendChild(disc_)

  const orb_ = document.createElement('a-sphere')
  orb_.classList.add('orb')
  orb_.setAttribute('geometry', 'primitive: sphere')
  orb_.setAttribute('material', {color: nodeColor_})
  orb_.setAttribute('scale', '0.2 0.2 0.2')
  // orbHolder_.appendChild(orb_)
  parent.appendChild(orbHolder_)

  let state_ = STATE_SHRINK

  const grow = () => {
    if (state_ === STATE_GROW) {
      return
    }
    state_ = STATE_GROW
    disc_.classList.add('cantap')
    disc_.removeAttribute('animation__shrink')
    disc_.setAttribute('animation__grow', {
      property: 'scale',
      from: '0.001 0.001 0.001',
      to: '0.5 0.5 0.5',
      dur: TRANSITION_SPEED,
      easing: 'easeInOutElastic',
    })
    orb_.removeAttribute('animation__grow')
    orb_.setAttribute('animation__shrink', {
      property: 'scale',
      from: '0.2 0.2 0.2',
      to: '0.001 0.001 0.001',
      dur: TRANSITION_SPEED,
      easing: 'easeInOutElastic',
    })
    disc_.object3D.visible = true
    setTimeout(() => {
      if (state_ !== STATE_GROW) {
        return
      }
      disc_.removeAttribute('animation__grow')
      orb_.removeAttribute('animation__shrink')
      orb_.object3D.visible = false
    }, TRANSITION_SPEED + 200)
  }

  const shrink = () => {
    if (state_ === STATE_SHRINK) {
      return
    }
    state_ = STATE_SHRINK
    disc_.classList.remove('cantap')

    disc_.removeAttribute('animation__grow')
    disc_.setAttribute('animation__shrink', {
      property: 'scale',
      from: '0.5 0.5 0.5',
      to: '0.001 0.001 0.001',
      dur: TRANSITION_SPEED,
      easing: 'easeInOutElastic',
    })

    orb_.removeAttribute('animation__shrink')
    orb_.setAttribute('animation__grow', {
      property: 'scale',
      from: '0.001 0.001 0.001',
      to: '0.2 0.2 0.2',
      dur: TRANSITION_SPEED,
      easing: 'easeInOutElastic',
    })
    orb_.object3D.visible = true
    setTimeout(() => {
      if (state_ !== 'shrink') {
        return
      }
      orb_.removeAttribute('animation__grow')
      disc_.removeAttribute('animation__shrink')
      disc_.object3D.visible = false
    }, TRANSITION_SPEED + 200)
  }

  let tapListener_ = null
  const onClick = (listener) => {
    if (tapListener_) {
      disc_.removeEventListener('click', tapListener_)
    }
    tapListener_ = listener
    if (tapListener_) {
      disc_.addEventListener('click', tapListener_)
    }
  }

  const getInlineDataUrl = (dataBase64) => {
    const bytes = Uint8Array.from(atob(dataBase64), c => c.charCodeAt(0))
    const dataBlob = new Blob([bytes.buffer], {type: 'octet/stream'})
    return URL.createObjectURL(dataBlob)
  }

  let meshPromise_ = null
  let mesh_ = null
  const loadMesh = async () => {
    if (meshPromise_) {
      return meshPromise_
    }

    let resolver
    meshPromise_ = new Promise((resolve) => {
      resolver = {resolve}
    })

    console.log(`Loading node ${node.node} for node`, node)
    const nodeId = node.node
    const meshResponse = await fetchMesh(nodeId)

    const textureLoader = new THREE.TextureLoader()
    const textureDataUrl = getInlineDataUrl(meshResponse.textureData)
    const texturePromise = textureLoader.load(
      textureDataUrl,
      (texture) => {
        texture.encoding = THREE.sRGBEncoding
      }
    )

    const geo = await meshResponse.geometryPromise
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(geo.meshPoints, 3))
    geometry.setAttribute('normal', new THREE.BufferAttribute(geo.meshNormals, 3))
    geometry.setAttribute('uv', new THREE.BufferAttribute(geo.meshUvs, 2))
    geometry.setAttribute('color', new THREE.BufferAttribute(geo.meshColors, 4))
    geometry.setIndex(Array.from(geo.meshTriangles))

    let minY = Infinity
    for (let i = 1; i < geo.meshPoints.length; i += 3) {
      if (minY > geo.meshPoints[i]) {
        minY = geo.meshPoints[i]
      }
    }

    const texture = await texturePromise
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    })
    mesh_ = new THREE.Mesh(geometry, material)
    mesh_.visible = false
    const {
      reference_lat_deg,
      reference_lon_deg,
      tracking_to_relative_reference_global_pos,
    } = meshResponse.globalPose.georeferenced_position
    const meshTransform = new THREE.Matrix4()
    meshTransform.fromArray(tracking_to_relative_reference_global_pos)
    const Sy = new THREE.Matrix4()
    Sy.set(
      1, 0, 0, 0,   // column 0
      0, -1, 0, 0,  // column 1
      0, 0, 1, 0,   // column 2
      0, 0, 0, 1    // colunn 3
    )
    const Syz = new THREE.Matrix4()
    Syz.set(
      1, 0, 0, 0,   // column 0
      0, -1, 0, 0,  // column 1
      0, 0, -1, 0,  // column 2
      0, 0, 0, 1    // colunn 3
    )
    const Sz = new THREE.Matrix4()
    Sz.set(
      1, 0, 0, 0,   // column 0
      0, 1, 0, 0,   // column 1
      0, 0, -1, 0,  // column 2
      0, 0, 0, 1    // colunn 3
    )
    // meshTransform.invert()
    meshTransform.premultiply(Sz)
    meshTransform.multiply(Sz)
    // meshTransform.invert()

    const meshPos = new THREE.Vector3()
    const meshRot = new THREE.Quaternion()
    const meshScale = new THREE.Vector3()
    meshTransform.decompose(meshPos, meshRot, meshScale)

    console.log(meshPos, meshRot, meshScale)
    // mesh_.position.copy(meshPos)
    mesh_.position.set(meshPos.x, -minY + 0.0001, meshPos.z)
    mesh_.quaternion.copy(meshRot)

    resolver.resolve(mesh_)

    const map = document.querySelector('lightship-map')
    const mapPoint = document.createElement('lightship-map-point')
    mapPoint.id = nodeId
    mapPoint.setAttribute('lat-lng', `${reference_lat_deg} ${reference_lon_deg}`)
    mapPoint.setAttribute('meters', '1')
    mapPoint.setAttribute('min', '0')
    mapPoint.object3D.add(mesh_)
    map.appendChild(mapPoint)

    return mesh_
  }

  let showingMesh = false
  const showMesh = async () => {
    showingMesh = true
    const mesh = await loadMesh()
    if (!showingMesh) {
      return
    }
    mesh.visible = true
    orb_.object3D.visible = false
    disc_.object3D.visible = false
  }

  const hideMesh = () => {
    showingMesh = false
    if (mesh_) {
      mesh_.visible = false
    }
    orb_.object3D.visible = state_ === STATE_SHRINK
    disc_.object3D.visible = state_ === STATE_GROW
  }

  const setActive = (active) => {
    nodeColor_ = active ? (node.anchor ? ACTIVE_COLOR : ACTIVE_NO_ANCHOR_COLOR) : INACTIVE_COLOR
    orb_.setAttribute('material', {color: nodeColor_})
    if (discLoaded_) {
      disc_.getObject3D('mesh').getObjectByName('outer').material.color = nodeColor_
    }

    if (active) {
      showMesh(node)
    } else {
      hideMesh()
    }
  }

  return {
    grow,
    shrink,
    onClick,
    setActive,
  }
}

const coverageNodeComponent = {
  schema: {
    node: {type: 'string', default: '{}'},
    title: {type: 'string'},
    image: {type: 'string'},
  },
  init() {
    const scene = this.el.sceneEl
    const node = JSON.parse(this.data.node)
    const visualizer = nodeVisualizer(this.el, this.data.image, this.data.title, node)
    const detail_ = {...this.data, node, visualizer}

    const enteredGeofence = (d) => {
      scene.emit('enteredGeofence', {...detail_, distance: d})
      // visualizer.grow()
    }
    const exitedGeofence = (d) => {
      scene.emit('exitedGeofence', {...detail_, distance: d})
      // visualizer.shrink()
    }
    visualizer.onClick(() => {
      this.el.sceneEl.emit('nodeClicked', {...detail_})
    })

    let isInside = false
    this.el.parentEl.addEventListener('distance', ({detail}) => {
      if (detail.distance < 40) {
        if (!isInside) {
          enteredGeofence(detail.distance)
          isInside = true
        } else {
          this.el.sceneEl.emit('updatedDistance', {...detail_, distance: detail.distance})
        }
      }
      if (detail.distance > 40) {
        if (isInside) {
          exitedGeofence(detail.distance)
          isInside = false
        }
      }
    })
  },
  update() {

  },
}

const coverageNodePrimitive = {
  defaultComponents: {
    'coverage-node': {},
  },
  mappings: {
    'title': 'coverage-node.title',
    'image': 'coverage-node.image',
    'node': 'coverage-node.node',
  },
}

const activeNodeManager = () => {
  const nodes_ = {}
  let activeNode_ = ''

  const clearActive = () => {
    if (!activeNode_) {
      return
    }
    const active = nodes_[activeNode_]
    activeNode_ = ''
    if (!active) {
      return
    }
    active.visualizer.setActive(false)
  }

  const setActive = (title) => {
    if (title === activeNode_) {
      return
    }
    clearActive()

    const active = nodes_[title]
    if (!active) {
      return
    }

    activeNode_ = title
    active.visualizer.setActive(true)
  }

  const enteredGeofence = (detail) => {
    nodes_[detail.title] = {...detail}
    if (!activeNode_) {
      setActive(detail.title)
    }
  }

  const updateDistance = (detail) => {
    // Updates distance in addition to other fields.
    nodes_[detail.title] = {...detail}
  }

  const exitedGeofence = (detail) => {
    if (activeNode_ === detail.title) {
      clearActive()
    }
    delete nodes_[detail.title]
    if (activeNode_) {
      return
    }
    const remainingNodes = Object.values(nodes_)
    if (!remainingNodes.length) {
      return
    }

    remainingNodes.sort((a, b) => a.distance - b.distance)
    setActive(remainingNodes[0].title)
  }

  const nodeClicked = (detail) => {
    setActive(detail.title)
  }

  return {
    enteredGeofence,
    exitedGeofence,
    nodeClicked,
    updateDistance,
  }
}

const focusedNodeComponent = {
  init() {
    this.manager = activeNodeManager()
    this.el.sceneEl.addEventListener('enteredGeofence', ({detail}) => {
      this.manager.enteredGeofence(detail)
    })
    this.el.sceneEl.addEventListener('updatedDistance', ({detail}) => {
      this.manager.updateDistance(detail)
    })
    this.el.sceneEl.addEventListener('nodeClicked', ({detail}) => {
      this.manager.nodeClicked(detail)
    })
    this.el.sceneEl.addEventListener('exitedGeofence', ({detail}) => {
      this.manager.exitedGeofence(detail)
    })
  },
}

let registered_ = false
const register = () => {
  const {AFRAME} = window
  if (!AFRAME || registered_) {
    return
  }

  AFRAME.registerComponent('focused-node', focusedNodeComponent)
  AFRAME.registerComponent('coverage-node', coverageNodeComponent)
  AFRAME.registerPrimitive('coverage-node', coverageNodePrimitive)
  registered_ = true
}

register()

const CoverageNode = {
  register,
}

export {
  CoverageNode,
}
