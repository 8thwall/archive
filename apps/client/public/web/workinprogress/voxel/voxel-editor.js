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
    float border = step(0.1,min(min(vUv.x,vUv.y),min(1.0 - vUv.x, 1.0 - vUv.y)));

    border += 0.5;
    border = clamp(0.0,1.0, border);
    gl_FragColor.rgb = color * border * fade;
    gl_FragColor.a = fade;
  }
`
});

AFRAME.registerComponent('voxel-editor', {
  schema: {
    debug: {default: false},
  },
  init: function() {
    this.handlePinch = this.handlePinch.bind(this)
    this.handleStrokeStart = this.handleStrokeStart.bind(this)
    this.handleStrokeMove = this.handleStrokeMove.bind(this)
    this.handleStrokeEnd = this.handleStrokeEnd.bind(this)

    this.updateUndoStackControls = this.updateUndoStackControls.bind(this)
    this.handleUndo = this.handleUndo.bind(this)
    this.handleRedo = this.handleRedo.bind(this)
    this.handleUndo = this.handleUndo.bind(this)
    this.undoAction = this.undoAction.bind(this)
    this.redoAction = this.redoAction.bind(this)
    this.cleanUpAction = this.cleanUpAction.bind(this)

    this.tryStroke = this.tryStroke.bind(this)
    this.getVoxel = this.getVoxel.bind(this)
    this.getMapPosition = this.getMapPosition.bind(this)
    this.doRaycast = this.doRaycast.bind(this)
    this.getVoxelPositionFromIntersection = this.getVoxelPositionFromIntersection.bind(this)

    this.createVoxel = this.createVoxel.bind(this)
    this.hideVoxel = this.hideVoxel.bind(this)
    this.showVoxel = this.showVoxel.bind(this)
    this.deleteVoxel = this.deleteVoxel.bind(this)

    this.mapShift = 9
    this.mapShiftConstant = (1 << (this.mapShift - 1)) + (1 << (2 * this.mapShift - 1)) + (1 << (3 * this.mapShift -1))

    this.internalState = {
      erasing: false,
      strokePosition: null,
      stroking: false,
      color: '#0ff',
      scale: 1,
      raycaster: new THREE.Raycaster(),
      previousAction: null,
      intersectables: [document.getElementById('ground').object3D],
      strokeVoxels: [],
      locationMap: {},
      camera: document.getElementById('camera'),
      threeCamera: document.getElementById('camera').getObject3D('camera'),
      undoStack: new UndoStack(this.undoAction, this.redoAction, this.cleanUpAction)
    }

    this.el.sceneEl.addEventListener('mousedown', this.handleClick)

    this.el.sceneEl.addEventListener('palettecolorchange', event => this.internalState.color = event.detail)

    document.getElementById('toggleEraseButton').addEventListener('click', () => {
      if (this.internalState.erasing) {
        this.internalState.erasing = false
        event.target.textContent = 'placing'
      } else {
        this.internalState.erasing = true
        event.target.textContent = 'erasing'
      }
    })

    this.redoButton = document.getElementById('redoButton')
    this.undoButton = document.getElementById('undoButton')

    this.redoButton.addEventListener('click', this.handleRedo)
    this.undoButton.addEventListener('click', this.handleUndo)

    this.updateUndoStackControls()

    document.getElementById('colorPicker').addEventListener('change', event => {
      this.internalState.color = event.target.value.toLowerCase()
    })

    this.el.sceneEl.addEventListener('twofingermove', this.handlePinch)

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
    document.getElementById('paletteButton').textContent = this.internalState.intersectables.length

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
    state.stroking = true
    state.strokePosition = event.detail.positionRaw
    this.tryStroke()
  },
  handleStrokeMove: function(event) {
    this.internalState.strokePosition = event.detail.positionRaw
  },
  handleStrokeEnd: function(event) {
    const state = this.internalState
    state.stroking = false
    if (!state.strokeVoxels || state.strokeVoxels.length == 0) {
      return
    }

    if (state.erasing) {
      state.strokeVoxels.forEach(this.hideVoxel)
      state.undoStack.push({
        type: "erase",
        voxelList: state.strokeVoxels
      })
    } else {
      state.strokeVoxels.forEach(voxel => {
        state.intersectables.push(voxel.object3D)
        state.locationMap[voxel.mapPosition] = voxel
      })
      state.undoStack.push({
        type: "place",
        voxelList: state.strokeVoxels
      })
    }
    state.strokeVoxels = []
    this.updateUndoStackControls()
  },
  updateUndoStackControls: function() {
    this.redoButton.disabled = !this.internalState.undoStack.canRedo()
    this.undoButton.disabled = !this.internalState.undoStack.canUndo()
  },
  handleUndo: function() {
    if (this.internalState.stroking) {
      return
    }
    this.internalState.undoStack.undo()
    this.updateUndoStackControls()
  },
  handleRedo: function() {
    if (this.internalState.stroking) {
      return
    }
    this.internalState.undoStack.redo()
    this.updateUndoStackControls()
  },
  undoAction: function(action) {
    if (action.type == 'erase') {
      action.voxelList.forEach(this.showVoxel)
    } else if (action.type == 'place') {
      action.voxelList.forEach(this.hideVoxel)
    }
  },
  redoAction: function(action) {
    if (action.type == 'erase') {
      action.voxelList.forEach(this.hideVoxel)
    } else if (action.type == 'place') {
      action.voxelList.forEach(this.showVoxel)
    }
  },
  cleanUpAction: function(action) {
    if (action.type == 'place') {
      action.voxelList.forEach(this.deleteVoxel)
    }
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
          voxel.setAttribute('material', 'fade:0.5')
          state.strokeVoxels.push(voxel)
        }
      } else {
        const newVoxelPosition = this.getVoxelPositionFromIntersection(intersection)
        const existingVoxel = this.getVoxel(newVoxelPosition, true)

        if (existingVoxel == null) {
          const newVoxel = this.createVoxel(newVoxelPosition, state.color)
          state.strokeVoxels.push(newVoxel)
        } else {
          console.log("Already occupied", existingVoxel.voxelPosition, newVoxelPosition)
          window.voxelExisting = existingVoxel
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
    newVoxel.classList.add('voxel')
//    newVoxel.setAttribute('material', 'transparent:true;opacity:1;color:' + color)

    newVoxel.setAttribute('material','shader:voxel-shader;color:' + color)

    // const geometry = new THREE.Geometry();
    // geometry.vertices.push(new THREE.Vector3( -1,-1,-1) );
    // geometry.vertices.push(new THREE.Vector3(-1, 1,-1) );
    // geometry.vertices.push(new THREE.Vector3( 1,-1,-1) );
    // geometry.vertices.push(new THREE.Vector3( 1,-1, 1) );
    // geometry.vertices.push(new THREE.Vector3( 1,-1, -1) );
    // geometry.vertices.push(new THREE.Vector3( -1, -1, 1) );

    // const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
    // const line = new THREE.Line( geometry, material );
    // newVoxel.object3D.add(line)

    newVoxel.setAttribute('position', position)
    newVoxel.voxelPosition = position
    newVoxel.mapPosition = this.getMapPosition(position)

    this.el.appendChild(newVoxel)
    return newVoxel
  },
  hideVoxel: function(voxel) {
    const state = this.internalState
    voxel.object3D.visible = false
    voxel.setAttribute('material','transparent:false')
    state.locationMap[voxel.mapPosition] = null
    this.removeFromArray(state.intersectables, voxel.object3D)
  },
  showVoxel: function(voxel) {
    const state = this.internalState
    state.intersectables.push(voxel.object3D)
    voxel.setAttribute('material','transparent:false;opacity:1;fade:1')
    voxel.object3D.visible = true
    if (state.locationMap[voxel.mapPosition]) {
      console.error("Showing voxel where there already is one")
    }
    state.locationMap[voxel.mapPosition] = voxel
  },
  deleteVoxel: function(voxel) {
    const state = this.internalState
    this.removeFromArray(state.intersectables, voxel.object3D)
    voxel.parentNode.removeChild(voxel)
  },
  removeFromArray(array, item) {
    const index = array.indexOf(item)
    if (index >= 0) {
      array.splice(index, 1)
    }
  },

})
