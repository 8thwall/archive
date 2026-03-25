// Builds a scene object with a mesh, and manages state updates to each component.
const buildHand = (modelGeometry) => {
  const hand = new THREE.Object3D()
  hand.visible = false

  let wrist_ = null
  let leftWrist_ = null
  let rightWrist_ = null

  let handKind_ = 2

  const axesHelper = new THREE.AxesHelper(0.5)

  const wristTopAxes_ = new THREE.AxesHelper(0.1)

  // build hand mesh
  console.log('hand geometry, number of verts')
  console.log(modelGeometry.pointsPerDetection)
  console.log('hand geometry, number of triangles')
  console.log(modelGeometry.rightIndices.length)

  const geometry = new THREE.BufferGeometry()
  const vertices = new Float32Array(3 * modelGeometry.pointsPerDetection)
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

  // const uvs = new Float32Array(2 * modelGeometry.pointsPerDetection)
  // const uvColor = new Float32Array(3 * modelGeometry.pointsPerDetection)
  // for (let i = 0; i < modelGeometry.pointsPerDetection; i++) {
  //   uvs[2 * i] = modelGeometry.uvs[i].u
  //   uvs[2 * i + 1] = modelGeometry.uvs[i].v

  //   uvColor[3 * i] = modelGeometry.uvs[i].u
  //   uvColor[3 * i + 1] = modelGeometry.uvs[i].v
  //   uvColor[3 * i + 2] = 0
  // }
  // geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  // Render UVs as vertex color
  // geometry.setAttribute('color', new THREE.BufferAttribute(uvColor, 3))

  // use right hand mesh by default
  const rightIndices_ = new Array(3 * modelGeometry.rightIndices.length)
  for (let i = 0; i < modelGeometry.rightIndices.length; i++) {
    rightIndices_[3 * i] = modelGeometry.rightIndices[i].a
    rightIndices_[3 * i + 1] = modelGeometry.rightIndices[i].b
    rightIndices_[3 * i + 2] = modelGeometry.rightIndices[i].c
  }
  geometry.setIndex(rightIndices_)

  const leftIndices_ = new Array(3 * modelGeometry.leftIndices.length)
  for (let i = 0; i < modelGeometry.leftIndices.length; i++) {
    leftIndices_[3 * i] = modelGeometry.leftIndices[i].a
    leftIndices_[3 * i + 1] = modelGeometry.leftIndices[i].b
    leftIndices_[3 * i + 2] = modelGeometry.leftIndices[i].c
  }

  const material = new THREE.MeshBasicMaterial({color: 0xffff00})
  material.wireframe = true
  material.vertexColors = true
  const handMesh = new THREE.Mesh(geometry, material)
  hand.add(handMesh)
  hand.add(axesHelper)

  // build wrist mesh
  console.log('wrist geometry, number of verts')
  console.log(modelGeometry.leftWristGeometry.vertices.length)
  console.log('wrist geometry, number of triangles')
  console.log(modelGeometry.leftWristGeometry.indices.length)

  // initialization
  const loader = new THREE.TextureLoader()
  // loading texture
  const uvImg = require('../assets/face/uv-debugger.png')
  const texture = loader.load(uvImg)

  const buildWristGeometry = (wristGeometry) => {
    const wrist = new THREE.Object3D()
    wrist.visible = false

    const loadUvAndTexture = false

    const wristGeom = new THREE.BufferGeometry()
    const wristVerts = new Float32Array(3 * wristGeometry.vertices.length)
    for (let i = 0; i < wristGeometry.vertices.length; i++) {
      wristVerts[3 * i] = wristGeometry.vertices[i].x
      wristVerts[3 * i + 1] = wristGeometry.vertices[i].y
      wristVerts[3 * i + 2] = wristGeometry.vertices[i].z
    }
    wristGeom.setAttribute('position', new THREE.BufferAttribute(wristVerts, 3))

    const wristIndices = new Array(3 * wristGeometry.indices.length)
    for (let i = 0; i < wristGeometry.indices.length; i++) {
      wristIndices[3 * i] = wristGeometry.indices[i].a
      wristIndices[3 * i + 1] = wristGeometry.indices[i].b
      wristIndices[3 * i + 2] = wristGeometry.indices[i].c
    }
    wristGeom.setIndex(wristIndices)

    const wristNorms = new Float32Array(3 * wristGeometry.normals.length)
    for (let i = 0; i < wristGeometry.normals.length; i++) {
      wristNorms[3 * i] = wristGeometry.normals[i].x
      wristNorms[3 * i + 1] = wristGeometry.normals[i].y
      wristNorms[3 * i + 2] = wristGeometry.normals[i].z
    }
    wristGeom.setAttribute('normal', new THREE.BufferAttribute(wristNorms, 3))

    // // TODO(yuyan): make sure the UVs are correct
    // const wristUvs = new Float32Array(2 * wristGeometry.uvs.length)
    // for (let i = 0; i < wristGeometry.uvs.length; i++) {
    //   wristUvs[2 * i] = wristGeometry.uvs[i].u
    //   wristUvs[2 * i + 1] = wristGeometry.uvs[i].v
    // }
    // wristGeom.setAttribute('uv', new THREE.BufferAttribute(wristUvs, 2))

    const wristMaterial = new THREE.MeshLambertMaterial()
    if (loadUvAndTexture) {
      wristMaterial.map = texture
    }
    const wristMesh = new THREE.Mesh(wristGeom, wristMaterial)
    wrist.add(wristMesh)
    return wrist
  }

  leftWrist_ = buildWristGeometry(modelGeometry.leftWristGeometry)
  rightWrist_ = buildWristGeometry(modelGeometry.rightWristGeometry)
  wrist_ = rightWrist_

  hand.add(leftWrist_)
  hand.add(rightWrist_)
  hand.add(wristTopAxes_)

  // Update geometry on each frame with new info from the hand controller.
  const show = (event) => {
    const {handKind, transform, vertices, normals, attachmentPoints, wristTransform} = event.detail

    if (handKind !== handKind_) {
      handKind_ = handKind
      if (handKind === 1) {
        handMesh.geometry.setIndex(leftIndices_)
        wrist_ = leftWrist_
        rightWrist_.visible = false
      } else {
        handMesh.geometry.setIndex(rightIndices_)
        wrist_ = rightWrist_
        leftWrist_.visible = false
      }
    }

    // Update the overall hand position.
    hand.position.copy(transform.position)
    hand.setRotationFromQuaternion(transform.rotation)
    hand.scale.set(transform.scale, transform.scale, transform.scale)

    // Update the hand mesh vertex positions.
    const {position} = handMesh.geometry.attributes
    const numHandVertices = vertices.length / 3
    for (let i = 0; i < numHandVertices; i++) {
      position.setXYZ(i, vertices[3 * i], vertices[3 * i + 1], vertices[3 * i + 2])
    }
    position.needsUpdate = true

    axesHelper.setRotationFromQuaternion(attachmentPoints.wrist.rotation)

    if (wristTransform !== undefined) {
      wrist_.position.copy(wristTransform.position)
      wrist_.setRotationFromQuaternion(wristTransform.rotation)
      wrist_.scale.set(wristTransform.scale, wristTransform.scale, wristTransform.scale)
    }

    if (attachmentPoints.wristTop) {
      const {wristTop} = attachmentPoints
      wristTopAxes_.position.copy(wristTop.position)
      wristTopAxes_.setRotationFromQuaternion(wristTop.rotation)
    }

    // Show the hand mesh.
    handMesh.visible = true
    hand.visible = true

    wrist_.visible = true
  }

  // Hide all objects.
  const hide = () => {
    hand.visible = false
    handMesh.visible = false

    leftWrist_.visible = false
    rightWrist_.visible = false
  }

  return {
    hand,
    leftWrist: leftWrist_,
    rightWrist: rightWrist_,
    show,
    hide,
  }
}

// Build a pipeline module that initializes and updates the three.js scene based on handcontroller
// events.
const handScenePipelineModule = () => {
  // Start loading mesh url early.
  let canvas_
  let modelGeometry_

  // track one hand
  let handMesh_ = null

  //
  let debugImgRows_ = 0
  let debugImgCols_ = 0
  let debugCanv_ = null
  let debugCanvasCtx_ = null
  let debugImgData_ = null

  // init is called by onAttach and by handcontroller.handloading. It needs to be called by both
  // before we can start.
  const init = ({canvas, detail}) => {
    canvas_ = canvas_ || canvas
    modelGeometry_ = modelGeometry_ || detail

    if (!(canvas_ && modelGeometry_)) {
      return
    }

    // Get the 3js scene from XR
    const {scene} = XR8.Threejs.xrScene()

    // sets render sort order to the order of objects added to scene (for alpha rendering).
    THREE.WebGLRenderer.sortObjects = false

    // add lights.
    const targetObject = new THREE.Object3D()
    targetObject.position.set(0, 0, -1)
    scene.add(targetObject)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.castShadow = true
    directionalLight.position.set(0, 0.25, 0)
    directionalLight.target = targetObject
    scene.add(directionalLight)

    const bounceLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5)
    scene.add(bounceLight)

    // add hand mesh to the scene
    // debugger
    handMesh_ = buildHand(modelGeometry_)
    scene.add(handMesh_.hand)

    // prevent scroll/pinch gestures on canvas.
    canvas_.addEventListener('touchmove', event => event.preventDefault())
  }

  const onDetach = () => {
    canvas_ = null
    modelGeometry_ = null

    debugImgCols_ = 0
    debugImgRows_ = 0
    debugCanv_ = null
    debugCanvasCtx_ = null
    debugImgData_ = null
  }

  const onUpdate = ({framework, frameStartResult, processGpuResult, processCpuResult}) => {
    if (processCpuResult && processCpuResult.handcontroller) {
      if (processCpuResult.handcontroller.debug && processCpuResult.handcontroller.debug.renderedImg) {
        const {renderedImg} = processCpuResult.handcontroller.debug
        if (renderedImg.cols !== debugImgCols_ && renderedImg.rows !== debugImgRows_) {
          debugImgCols_ = renderedImg.cols
          debugImgRows_ = renderedImg.rows

          debugCanv_ = document.getElementById('debugCanvas')
          debugCanvasCtx_ = debugCanv_.getContext('2d')
          // size the canvas to your desired image
          debugCanv_.width = renderedImg.cols
          debugCanv_.height = renderedImg.rows
          // get the imageData and pixel array from the canvas
          debugImgData_ = debugCanvasCtx_.getImageData(0, 0, debugCanv_.width, debugCanv_.height)
        }
        if (debugCanvasCtx_ && debugImgData_) {
          const {data} = debugImgData_
          const pix = renderedImg.pixels
          // manipulate some pixel elements
          for (let i = 0; i < pix.length; i++) {
            data[i] = pix[i]
          }
          // put the modified pixels back on the canvas
          debugCanvasCtx_.putImageData(debugImgData_, 0, 0)
        }
      }
    }
  }

  // Update the corresponding hand mesh
  const show = (event) => {
    handMesh_.show(event)
  }
  const hide = (event) => {
    handMesh_.hide()
  }

  return {
    name: 'handscene',
    onAttach: init,
    onDetach,
    onUpdate,
    listeners: [
      {event: 'handcontroller.handloading', process: init},
      {event: 'handcontroller.handfound', process: show},
      {event: 'handcontroller.handupdated', process: show},
      {event: 'handcontroller.handlost', process: hide},
    ],
  }
}

export {handScenePipelineModule}
