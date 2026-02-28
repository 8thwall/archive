// Build a pipeline module that initializes and updates the three.js scene based on handcontroller
// events.
const initScenePipelineModule = () => {
  let canvas_
  let modelGeometry_
  let handMesh_ = null
  let handKind = 2

  // Builds a scene object with a mesh and manages state updates to each component.
  const buildHand = (modelGeometry) => {
    const palmAttachment = new THREE.Object3D()
    const hand = new THREE.Object3D()
    hand.visible = false

    // Create a purple cube positioned relative to the palm attachment point.
    const cubeMaterial = new THREE.MeshBasicMaterial()
    cubeMaterial.side = THREE.DoubleSide
    cubeMaterial.map = new THREE.TextureLoader().load(
      'https://cdn.8thwall.com/web/assets/cube-texture.png'
    )
    cubeMaterial.color = new THREE.Color(0xAD50FF)

    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cubeMaterial)
    cube.scale.set(0.05, 0.05, 0.05)
    cube.position.set(0, 0, 0.065)
    cube.castShadow = true
    palmAttachment.add(cube)
    hand.add(palmAttachment)

    // Construct the hand mesh.
    const geometry = new THREE.BufferGeometry()
    const meshVertices = new Float32Array(3 * modelGeometry.pointsPerDetection)
    geometry.setAttribute('position', new THREE.BufferAttribute(meshVertices, 3))

    const rightIndices = new Array(3 * modelGeometry.rightIndices.length)
    for (let i = 0; i < modelGeometry.rightIndices.length; i++) {
      rightIndices[3 * i] = modelGeometry.rightIndices[i].a
      rightIndices[3 * i + 1] = modelGeometry.rightIndices[i].b
      rightIndices[3 * i + 2] = modelGeometry.rightIndices[i].c
    }
    geometry.setIndex(rightIndices)

    const leftIndices = new Array(3 * modelGeometry.leftIndices.length)
    for (let i = 0; i < modelGeometry.leftIndices.length; i++) {
      leftIndices[3 * i] = modelGeometry.leftIndices[i].a
      leftIndices[3 * i + 1] = modelGeometry.leftIndices[i].b
      leftIndices[3 * i + 2] = modelGeometry.leftIndices[i].c
    }

    // Wireframe material.
    const handMaterial = new THREE.MeshBasicMaterial({color: 0x7611B6, opacity: 0.5, transparent: true, wireframe: true})
    const handMesh = new THREE.Mesh(geometry, handMaterial)

    // Occluder Material.
    handMesh.traverse((node) => {
      if (node.isMesh) {
        const mat = new THREE.MeshBasicMaterial()
        mat.colorWrite = false
        node.renderOrder = -1
        node.material = mat
      }
    })
    hand.add(handMesh)

    // Update geometry on each frame with data from the hand controller.
    const show = (event) => {
      const {transform, vertices, normals, attachmentPoints} = event.detail

      // Update the hand mesh properties.
      hand.position.copy(transform.position)
      hand.scale.set(transform.scale, transform.scale, transform.scale)

      // Update mesh indices
      if (handKind !== event.detail.handKind) {
        handKind = event.detail.handKind
        if (handKind === 1) {
          handMesh.geometry.setIndex(leftIndices)
        } else {
          handMesh.geometry.setIndex(rightIndices)
        }
      }

      // Update the palm attachment properties.
      palmAttachment.position.copy(attachmentPoints.palm.position)
      palmAttachment.quaternion.copy(attachmentPoints.palm.rotation)

      // Update the hand mesh vertex positions.
      const {position} = handMesh.geometry.attributes
      for (let i = 0; i < vertices.length; i++) {
        position.setXYZ(i, vertices[i].x, vertices[i].y, vertices[i].z)
      }
      position.needsUpdate = true

      // Show the hand mesh.
      handMesh.visible = true
      hand.visible = true
    }

    // Hide all objects.
    const hide = () => {
      hand.visible = false
      handMesh.visible = false
    }

    return {
      object3d: hand,
      show,
      hide,
    }
  }

  // init is called by onAttach and by handcontroller.handloading. It needs to be called by both
  // before we can start.
  const init = ({canvas, detail}) => {
    canvas_ = canvas_ || canvas
    modelGeometry_ = modelGeometry_ || detail

    if (!(canvas_ && modelGeometry_)) {
      return
    }

    // Get the 3js scene from XR
    const {scene, camera, renderer} = XR8.Threejs.xrScene()  // Get the 3js scene from XR8.Threejs

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
    handMesh_ = buildHand(modelGeometry_)
    scene.add(handMesh_.object3d)

    // prevent scroll/pinch gestures on canvas.
    canvas_.addEventListener('touchmove', event => event.preventDefault())
  }

  const onDetach = () => {
    canvas_ = null
    modelGeometry_ = null
  }

  // Update the corresponding hand mesh
  const show = (event) => {
    handMesh_.show(event)
  }
  const hide = (event) => {
    handMesh_.hide()
  }

  return {
    name: 'threejsinitscene',
    onAttach: init,
    onDetach,
    listeners: [
      {event: 'handcontroller.handloading', process: init},
      {event: 'handcontroller.handfound', process: show},
      {event: 'handcontroller.handupdated', process: show},
      {event: 'handcontroller.handlost', process: hide},
    ],
  }
}

export {initScenePipelineModule}
