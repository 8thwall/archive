// Builds a scene object with ear occluders and spheres.
const buildEarScene = (modelGeometry) => {
  const loader = new THREE.GLTFLoader()

  // head is anchored to the face.
  const head = new THREE.Object3D()
  head.visible = false

  // Create a purple cube positioned on the ear lobes.
  const cubeMaterial = new THREE.MeshBasicMaterial()
  cubeMaterial.side = THREE.DoubleSide
  cubeMaterial.map = new THREE.TextureLoader().load(
    'https://cdn.8thwall.com/web/assets/cube-texture.png'
  )
  cubeMaterial.color = new THREE.Color(0xAD50FF)

  const leftCube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cubeMaterial)
  leftCube.scale.set(0.1, 0.1, 0.1)
  leftCube.position.set(0, 0, 0)
  leftCube.castShadow = true
  const leftLobeAttachment = new THREE.Object3D()
  leftLobeAttachment.add(leftCube)

  const rightCube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cubeMaterial)
  rightCube.scale.set(0.1, 0.1, 0.1)
  rightCube.position.set(0, 0, 0)
  rightCube.castShadow = true
  const rightLobeAttachment = new THREE.Object3D()
  rightLobeAttachment.add(rightCube)

  head.add(leftLobeAttachment)
  head.add(rightLobeAttachment)

  const leftHelixAttachment = new THREE.Object3D()
  const rightHelixAttachment = new THREE.Object3D()
  head.add(leftHelixAttachment)
  head.add(rightHelixAttachment)

  const leftCanalAttachment = new THREE.Object3D()
  const rightCanalAttachment = new THREE.Object3D()
  head.add(leftCanalAttachment)
  head.add(rightCanalAttachment)

  // Add occluders
  const occluderMaterial = new THREE.MeshBasicMaterial({color: '#F5F5F5', transparent: false, colorWrite: false})

  // use face mesh as face occluder
  const headMesh = XRExtras.ThreeExtras.faceMesh(
    modelGeometry,
    occluderMaterial
  )
  head.add(headMesh.mesh)
  loader.load(require('./assets/Models/noEarsHeadOccluder.glb'), (occluder) => {
    occluder.scene.scale.set(1.0, 1.1, 1.0)
    occluder.scene.position.set(0.0, 0, 0.0)
    occluder.scene.traverse((node) => {
      if (node.isMesh) {
        const mat = new THREE.MeshStandardMaterial()
        mat.colorWrite = false
        node.renderOrder = -1
        node.material = mat
      }
    })
    head.add(occluder.scene)
  })

  // Update geometry on each frame with new info from the face controller.
  const show = (event) => {
    const {transform, attachmentPoints} = event.detail

    // Update the overall head position.
    head.position.copy(transform.position)
    head.setRotationFromQuaternion(transform.rotation)
    head.scale.set(transform.scale, transform.scale, transform.scale)

    // Update ear point positions if they exist
    if (attachmentPoints.rightLobe) {
      rightLobeAttachment.position.copy(attachmentPoints.rightLobe.position)
      leftLobeAttachment.position.copy(attachmentPoints.leftLobe.position)

      rightHelixAttachment.position.copy(attachmentPoints.rightHelix.position)
      leftHelixAttachment.position.copy(attachmentPoints.leftHelix.position)

      rightCanalAttachment.position.copy(attachmentPoints.rightCanal.position)
      leftCanalAttachment.position.copy(attachmentPoints.leftCanal.position)
    }

    // Update the face mesh.
    headMesh.show(event)
    head.visible = true
  }

  // Hide all objects.
  const hide = () => {
    head.visible = false
    headMesh.hide()
  }

  return {
    object3d: head,
    show,
    hide,
  }
}

// Build a pipeline module that initializes and updates the three.js scene based on facecontroller
// events.
const faceScenePipelineModule = () => {
  // Start loading mesh url early.
  let canvas_
  let modelGeometry_

  // Stores the head mesh instances by faceId.
  const faceIdToHead_ = {}
  let earScene

  // init is called by onAttach and by facecontroller.faceloading. It needs to be called by both
  // before we can start.
  const init = ({canvas, detail}) => {
    canvas_ = canvas_ || canvas
    modelGeometry_ = modelGeometry_ || detail

    // Get the 3js scene from XR
    const {scene, renderer} = XR8.Threejs.xrScene()
    renderer.outputEncoding = THREE.sRGBEncoding

    if (!(canvas_ && modelGeometry_)) {
      return
    }

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

    const bounceLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8)
    scene.add(bounceLight)

    earScene = buildEarScene(modelGeometry_)
    scene.add(earScene.object3d)

    // prevent scroll/pinch gestures on canvas.
    canvas_.addEventListener('touchmove', event => event.preventDefault())
  }

  const onDetach = () => {
    canvas_ = null
    modelGeometry_ = null
  }

  // Update the corresponding face mesh based on the faceId.

  const show = event => earScene.show(event)
  const hide = event => earScene.hide()

  return {
    name: 'facescene',
    onAttach: init,
    onDetach,

    listeners: [
      {event: 'facecontroller.faceloading', process: init},
      {event: 'facecontroller.facefound', process: show},
      {event: 'facecontroller.faceupdated', process: show},
      {event: 'facecontroller.facelost', process: hide},
    ],
  }
}

export {faceScenePipelineModule}
