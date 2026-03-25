const palmAttachment = new THREE.Object3D()
let mixer
let model

const loader = new THREE.GLTFLoader()  // This comes from GLTFLoader.js.
const modelFile = require('./assets/globe.glb')
const clock = new THREE.Clock()

// Builds a scene object with a mesh, and manages state updates to each component.
const buildHand = (modelGeometry) => {
  const hand = new THREE.Object3D()
  hand.visible = false

  // Add the 3D model
  loader.load(modelFile, (gltf) => {
    console.log('should be setting the model, gltf scene: ', gltf.scene)
    model = gltf.scene
    model.scale.set(0.0075, 0.0075, 0.0075)
    model.position.set(0, 0, 0.08)
    model.castShadow = true

    // model.children[0].material.metalness = 0
    // animate the model
    // mixer = new THREE.AnimationMixer(model)
    // const clip = gltf.animations[0]
    // mixer.clipAction(clip.optimize()).play()

    const light = new THREE.PointLight(0x800080, 100, 0, 1000)
    light.position.set(0, 0, 0.1)
    palmAttachment.add(light)

    palmAttachment.add(model)
    hand.add(palmAttachment)
  })

  // const material = new THREE.MeshBasicMaterial()
  // material.side = THREE.DoubleSide
  // material.map = new THREE.TextureLoader().load(
  //   'https://cdn.8thwall.com/web/assets/cube-texture.png'
  // )
  // material.color = new THREE.Color(0xAD50FF)

  // const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
  // cube.scale.set(0.05, 0.05, 0.05)
  // cube.position.set(0, 0, 0.05)
  // cube.castShadow = true
  // palmAttachment.add(cube)
  // hand.add(palmAttachment)

  // build hand mesh
  const geometry = new THREE.BufferGeometry()
  const meshVertices = new Float32Array(3 * modelGeometry.pointsPerDetection)
  geometry.setAttribute('position', new THREE.BufferAttribute(meshVertices, 3))
  // geometry.setAttribute('normal', new THREE.BufferAttribute(meshVertices, 3))
  const indices = new Array(3 * modelGeometry.rightIndices.length)
  for (let i = 0; i < modelGeometry.rightIndices.length; i++) {
    indices[3 * i] = modelGeometry.rightIndices[i].a
    indices[3 * i + 1] = modelGeometry.rightIndices[i].b
    indices[3 * i + 2] = modelGeometry.rightIndices[i].c
  }
  geometry.setIndex(indices)

  // Wireframe material
  const material = new THREE.MeshBasicMaterial({color: 0x7611B6, opacity: 0.5, transparent: true, wireframe: true})
  const handMesh = new THREE.Mesh(geometry, material)

  // Occluder Material
  handMesh.traverse((node) => {
    if (node.isMesh) {
      const mat = new THREE.MeshStandardMaterial()
      mat.colorWrite = false
      node.renderOrder = -1
      node.material = mat
    }
  })
  hand.add(handMesh)

  // Update geometry on each frame with new info from the hand controller.
  const show = (event) => {
    const {transform, vertices, normals, attachmentPoints} = event.detail

    // Update the overall hand position.
    hand.position.copy(transform.position)
    hand.scale.set(transform.scale, transform.scale, transform.scale)

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

// Build a pipeline module that initializes and updates the three.js scene based on handcontroller
// events.
const handScenePipelineModule = () => {
  // Start loading mesh url early.
  let canvas_
  let modelGeometry_

  // track one hand
  let handMesh_ = null

  // init is called by onAttach and by handcontroller.handloading. It needs to be called by both
  // before we can start.
  const init = ({canvas, detail}) => {
    canvas_ = canvas_ || canvas
    modelGeometry_ = modelGeometry_ || detail

    if (!(canvas_ && modelGeometry_)) {
      console.log('early exit init')
      return
    }

    console.log('doing init')
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
    name: 'handscene',
    onAttach: init,
    onUpdate: () => {
      // if (!mixer) {
      //   return
      // }
      // Animate the model
      // const delta = clock.getDelta()
      // mixer.update(delta)
      if (!model) {
        console.log('no model....')
        return
      }

      model.rotation.x += 0.01
      model.rotation.y += 0.02
    },
    onDetach,
    listeners: [
      {event: 'handcontroller.handloading', process: init},
      {event: 'handcontroller.handfound', process: show},
      {event: 'handcontroller.handupdated', process: show},
      {event: 'handcontroller.handlost', process: hide},
    ],
  }
}

export {handScenePipelineModule}
