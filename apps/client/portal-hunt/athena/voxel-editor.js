AFRAME.registerShader('voxel-shader', {
  schema: {
    color: {type:'color', is:'uniform', default:'cyan'},
    opacity: {type:'number', is:'uniform', default: 1.0},
    fade: {type:'number', is:'uniform', default: 1.0},
  },
  vertexShader: `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }`,
  fragmentShader:
`
  precision mediump float;
  uniform vec3 color;
  varying vec2 vUv;
  uniform float opacity;
  uniform float fade;

  void main () {
    float border = step(0.05,min(min(vUv.x,vUv.y),min(1.0 - vUv.x, 1.0 - vUv.y)));

    border += 0.5;
    border = clamp(0.0,1.0, border);
    gl_FragColor.rgb = color * border * fade;
    gl_FragColor.a = fade;
  }
`
});

AFRAME.registerComponent('voxel-editor', {
  schema: {
    debug: { default: false },
    xBounds: { default: 0 },
    yBounds: { default: 0 },
    zBounds: { default: 0 },
  },
  init: function() {
    this.socket = io('socket.8thwall.com/megalith')

    this.socket.on('addblocks', ({data}) => {
      console.log(`Batch add blocks server. Found ${data.length} voxels`)
      data.forEach((voxelData, i) => {
        const newVoxel = this.createVoxel(voxelData, voxelData.color)
        this.internalState.intersectables.push(newVoxel.object3D)
        this.internalState.locationMap[newVoxel.mapPosition] = newVoxel
      })
    })

    this.socket.on('addblock', data => {
      const newVoxel = this.createVoxel(data, data.color)
      this.internalState.intersectables.push(newVoxel.object3D)
      this.internalState.locationMap[newVoxel.mapPosition] = newVoxel
    })

    this.socket.on('removeblock', data => {
      const mapPosition = this.getMapPosition(data)
      const removeBlock = this.internalState.locationMap[mapPosition]
      removeBlock && this.deleteVoxel(removeBlock)
      this.internalState.locationMap[mapPosition] = null
    })

    this.socket.on('clear', data => {
      this.state = {intersectables: [], locationMap:{}}
      this.el.object3D.children.forEach(obj=> {obj.parent.remove(obj)})
    })

    this.handlePinch = this.handlePinch.bind(this)
    this.handleStrokeStart = this.handleStrokeStart.bind(this)
    this.handleStrokeMove = this.handleStrokeMove.bind(this)
    this.handleStrokeEnd = this.handleStrokeEnd.bind(this)

    this.tryStroke = this.tryStroke.bind(this)
    this.getVoxel = this.getVoxel.bind(this)
    this.getMapPosition = this.getMapPosition.bind(this)
    this.doRaycast = this.doRaycast.bind(this)
    this.getVoxelPositionFromIntersection = this.getVoxelPositionFromIntersection.bind(this)

    this.createVoxel = this.createVoxel.bind(this)
    this.deleteVoxel = this.deleteVoxel.bind(this)

    this.mapShift = 9
    this.mapShiftConstant = (1 << (this.mapShift - 1)) + (1 << (2 * this.mapShift - 1)) + (1 << (3 * this.mapShift -1))

    this.internalState = {
      startStrokeTimeout: null,
      erasing: false,
      strokePosition: null,
      stroking: false,
      color: '#818199',
      scale: 1,
      raycaster: new THREE.Raycaster(),
      previousAction: null,
      intersectables: [document.getElementById('ground').object3D],
      strokeVoxels: [],
      locationMap: {},
      camera: document.getElementById('camera'),
      threeCamera: document.getElementById('camera').getObject3D('camera'),
    }

    this.el.sceneEl.addEventListener('mousedown', this.handleClick)

    const toggleEraseButton = document.getElementById('toggleEraseButton')

    const setErasing = erasing => {
      this.internalState.erasing = erasing
      if (erasing) {
        toggleEraseButton.textContent = 'erasing'
        toggleEraseButton.classList.add('erasing')
      } else {
        toggleEraseButton.textContent = 'placing'
        toggleEraseButton.classList.remove('erasing')
      }
    }

    this.el.sceneEl.addEventListener('palettecolorchange', event => {
      setErasing(false)
      this.internalState.color = event.detail
    })

    toggleEraseButton.addEventListener('click', () => {
      setErasing(!this.internalState.erasing)
    })

    this.el.sceneEl.addEventListener('onefingerstart', this.handleStrokeStart)
    this.el.sceneEl.addEventListener('onefingerend', this.handleStrokeEnd)
    this.el.sceneEl.addEventListener('onefingermove', this.handleStrokeMove)

    if (this.data.debug) {
      this.reticle = document.createElement('a-box')
      this.reticle.setAttribute('material', 'transparent:true;opacity:0.4')
      this.reticle.object3D.scale.set(1.2, 1.2, 1.2)
      this.el.appendChild(this.reticle)
    }
  },
  tick: function() {
    if (this.internalState.stroking) {
      this.tryStroke()
    } else if (this.reticle) {
      intersect = this.doRaycast({screenPosition:{x:0,y:0}})
      if (intersect) {
        if (!this.internalState.erasing) {
          this.reticle.object3D.visible = true
          this.reticle.object3D.position.copy(this.getVoxelPositionFromIntersection(intersect))
        } else if (intersect.object.el.mapPosition) {
          this.reticle.object3D.position.copy(intersect.object.el.object3D.position)
          this.reticle.object3D.visible = true
        } else {
          this.reticle.object3D.visible = false
        }
      } else {
        this.reticle.object3D.visible = false
      }
    }
  },
  handlePinch: function(event) {
    let scale = this.internalState.scale * (1 + event.detail.spreadChange / event.detail.startSpread)
    scale = Math.min(Math.max(0.1, scale), 5)

    this.internalState.scale = scale
    this.el.object3D.scale.set(scale, scale, scale)
    this.el.object3D.position.y = scale / 2
  },
  handleStrokeStart: function(event) {
    const state = this.internalState
    clearTimeout(state.startStrokeTimeout)
    state.startStrokeTimeout = setTimeout(() => {
      state.startStrokeTimeout = null
      state.stroking = true
      this.tryStroke()
    }, 100)

    state.strokePosition = event.detail.positionRaw
  },
  handleStrokeMove: function(event) {
    this.internalState.strokePosition = event.detail.positionRaw
  },
  handleStrokeEnd: function(event) {
    const state = this.internalState

    if (!event.detail.previousTouchCount && !event.detail.nextTouchCount && state.startStrokeTimeout) {
      this.tryStroke()
    }
    state.hadTwoFingers = false
    clearTimeout(state.startStrokeTimeout)
    state.startStrokeTimeout = null
    state.stroking = false
    if (!state.strokeVoxels || state.strokeVoxels.length == 0) {
      return
    }

    if (state.erasing) {
      state.strokeVoxels.forEach(this.deleteVoxel)
    } else {
      state.strokeVoxels.forEach(voxel => {
        state.intersectables.push(voxel.object3D)
        state.locationMap[voxel.mapPosition] = voxel
      })
    }
    state.strokeVoxels = []
  },
  tryStroke: function() {
    const state = this.internalState
    const screenPosition = {
      x: state.strokePosition.x / window.innerWidth * 2 - 1,
      y: state.strokePosition.y / window.innerHeight * -2 + 1
    }
    const intersection = this.doRaycast({screenPosition})

    if (intersection) {
      if (state.erasing) {
        let voxel = intersection.object.el

        if (voxel.id == 'ground') {
          voxel = this.getVoxel(this.getVoxelPositionFromIntersection(intersection), false)
        }
        if (voxel && state.strokeVoxels.indexOf(voxel) == -1) {
          this.socket.emit('removeblock', voxel.object3D.position)
          voxel.setAttribute('material', 'opacity:0.5')
          state.strokeVoxels.push(voxel)
        }
      } else {
        const newVoxelPosition = this.getVoxelPositionFromIntersection(intersection)

        if (this.data.xBounds && Math.abs(newVoxelPosition.x) > this.data.xBounds ||
            this.data.yBounds && Math.abs(newVoxelPosition.y) > this.data.yBounds ||
            this.data.zBounds && Math.abs(newVoxelPosition.z) > this.data.zBounds) {
          window.emit('newalert', { text: 'Stay within the bounds!', duration: 1000 })
          return
        }

        const existingVoxel = this.getVoxel(newVoxelPosition, true)

        if (existingVoxel == null) {

          this.el.sceneEl.emit('placed')

          this.socket.emit('addblock', {...newVoxelPosition, color: state.color})
          const newVoxel = this.createVoxel(newVoxelPosition, state.color)
          state.strokeVoxels.push(newVoxel)
        }
      }
    }
  },
  getVoxel(position, includeStroke = true) {
    const mapPosition = this.getMapPosition(position)
    const voxel = this.internalState.locationMap[mapPosition]
    if (voxel) {
      return voxel
    }
    if (!includeStroke) {
      return null
    }
    return this.internalState.strokeVoxels.find(voxel => voxel.mapPosition == mapPosition)
  },
  getMapPosition(position) {
    // Assigns each position in a 2^mapShift size cube to a unique positive integer
    return position.x + (position.y << this.mapShift) +
       (position.z << (2 * this.mapShift)) + this.mapShiftConstant
  },
  doRaycast: function({origin, direction, screenPosition}) {
    const state = this.internalState
    const raycaster = state.raycaster
    if (screenPosition) {
      raycaster.setFromCamera(screenPosition, state.threeCamera)
    } else {
      raycaster.set(origin, direction)
    }
    // ThreeJS will only intersect with visible objects (not what we want)
    state.intersectables.forEach(object => {
      object.wasVisible = object.visible
      object.visible = true
    })
    const intersections = raycaster.intersectObjects(state.intersectables, true)
    state.intersectables.forEach(object => {
      object.visible = object.wasVisible
    })

    if (intersections.length <= 0) {
      return null
    }
    return intersections[0]
  },
  getVoxelPositionFromIntersection(intersection) {
    const rawPosition = intersection.point.clone()
    this.el.object3D.worldToLocal(rawPosition)
    rawPosition.add(intersection.face.normal.multiplyScalar(0.5))
    return {
      x: Math.round(rawPosition.x),
      y: Math.round(rawPosition.y),
      z: Math.round(rawPosition.z),
    }
  },
  createVoxel: function(position, color) {
    const newVoxel = document.createElement('a-box')
    newVoxel.setAttribute('src', '#voxel-texture')
    newVoxel.setAttribute('color', color)
    newVoxel.setAttribute('position', position)
    newVoxel.voxelPosition = position
    newVoxel.mapPosition = this.getMapPosition(position)
    newVoxel.color = color

    this.el.appendChild(newVoxel)
    return newVoxel
  },
  deleteVoxel: function(voxel) {
    if(voxel) {
      const state = this.internalState
      state.locationMap[voxel.mapPosition] = null
      this.removeFromArray(state.intersectables, voxel.object3D)
      if (voxel.parentNode) {
        voxel.parentNode.removeChild(voxel)
      }
    }
  },
  removeFromArray(array, item) {
    const index = array.indexOf(item)
    if (index >= 0) {
      array.splice(index, 1)
    }
  },

})
