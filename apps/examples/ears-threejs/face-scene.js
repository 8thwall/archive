const loadEnvmap = () => {
  const posx = require('./assets/envmap/px.png')
  const negx = require('./assets/envmap/nx.png')
  const posy = require('./assets/envmap/py.png')
  const negy = require('./assets/envmap/ny.png')
  const posz = require('./assets/envmap/pz.png')
  const negz = require('./assets/envmap/nz.png')

  const cubeTextureLoader = new THREE.CubeTextureLoader()
  const cubeMap = cubeTextureLoader.load([
    posx, negx,
    posy, negy,
    posz, negz,
  ])
  return cubeMap
}

// Load models
const loadEarring = (loader, envMap) => {
  const earring = new THREE.Object3D()
  loader.load(require('./assets/Models/earring.glb'), (earringModel) => {
    earringModel.scene.scale.set(0.085, 0.085, 0.085)
    earringModel.scene.traverse((o) => {
      if (o.isMesh) {
        o.material.envMap = envMap
        o.castShadow = true
      }
    })
    earring.add(earringModel.scene)
  })
  return earring
}

const loadStud = (loader, envMap) => {
  const stud = new THREE.Object3D()
  loader.load(require('./assets/Models/8stud.glb'), (studModel) => {
    studModel.scene.scale.set(0.1, 0.1, 0.1)
    studModel.scene.traverse((o) => {
      if (o.isMesh) {
        o.material.envMap = envMap
        o.castShadow = true
      }
    })
    stud.add(studModel.scene)
  })
  return stud
}

const loadArrowIn = (loader) => {
  const arrowIn = new THREE.Object3D()
  loader.load(require('./assets/Models/arrowIn.glb'), (arrowInModel) => {
    arrowInModel.scene.scale.set(1, 1, 1)
    arrowIn.add(arrowInModel.scene)
  })
  return arrowIn
}

const loadArrowOut = (loader) => {
  const arrowOut = new THREE.Object3D()
  loader.load(require('./assets/Models/arrowOut.glb'), (arrowOutModel) => {
    arrowOutModel.scene.scale.set(1, 1, 1)
    arrowOut.add(arrowOutModel.scene)
  })
  return arrowOut
}

// Builds a scene object with occluders, earrings, and arrows..
// each component.
const buildEarScene = (modelGeometry) => {
  const envMap = loadEnvmap()
  const loader = new THREE.GLTFLoader()

  // head is anchored to the face.
  const head = new THREE.Object3D()
  head.visible = false

  // Place earrings on earlobes
  const leftEarring = loadEarring(loader, envMap)
  const rightEarring = loadEarring(loader, envMap)

  leftEarring.position.set(0, 0, 0)
  leftEarring.rotation.set(0, -0.7854, 0)
  const leftLobeAttachment = new THREE.Object3D()
  leftLobeAttachment.add(leftEarring)

  rightEarring.position.set(0, 0, 0)
  rightEarring.rotation.set(0, 0.7854, 0)
  const rightLobeAttachment = new THREE.Object3D()
  rightLobeAttachment.add(rightEarring)

  head.add(leftLobeAttachment)
  head.add(rightLobeAttachment)

  // Place studs on helixes
  const leftStud = loadStud(loader, envMap)
  const rightStud = loadStud(loader, envMap)

  leftStud.position.set(-0.04, 0, 0.04)
  leftStud.rotation.set(0.1745, 2.7925, -0.4363)
  const leftHelixAttachment = new THREE.Object3D()
  leftStud.visible = false
  leftHelixAttachment.add(leftStud)

  rightStud.position.set(0.04, 0, 0.04)
  rightStud.rotation.set(0.1745, -2.7925, 0.4363)
  const rightHelixAttachment = new THREE.Object3D()
  rightStud.visible = false
  rightHelixAttachment.add(rightStud)

  head.add(leftHelixAttachment)
  head.add(rightHelixAttachment)

  // Place arrow on canals
  const arrowIn = loadArrowIn(loader)
  const arrowOut = loadArrowOut(loader)

  arrowIn.position.set(0, 0.01, 0.01)
  arrowIn.rotation.set(0, Math.PI, 0)
  const leftCanalAttachment = new THREE.Object3D()
  arrowIn.visible = false
  leftCanalAttachment.add(arrowIn)

  arrowOut.position.set(0.1, 0.03, 0.15)
  arrowOut.rotation.set(0, Math.PI, 0)
  const rightCanalAttachment = new THREE.Object3D()
  arrowOut.visible = false
  rightCanalAttachment.add(arrowOut)

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

  // add next button functionality
  const nextButton = document.createElement('div')
  document.body.appendChild(nextButton)
  nextButton.id = 'nextButton'
  nextButton.textContent = 'Next'

  let counter = 1
  nextButton.addEventListener('click', () => {
    if (counter === 0) {
      leftStud.visible = false
      rightStud.visible = false
      leftEarring.visible = true
      rightEarring.visible = true
    } else if (counter === 1) {
      leftEarring.visible = false
      rightEarring.visible = false
      arrowIn.visible = true
      arrowOut.visible = true
    } else if (counter === 2) {
      arrowIn.visible = false
      arrowOut.visible = false
      leftStud.visible = true
      rightStud.visible = true
    }
    // Update the counter for the next click
    counter = (counter + 1) % 3
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
