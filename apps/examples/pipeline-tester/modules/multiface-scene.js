// Build a pipeline module that initializes and updates the three.js scene based on facecontroller
// events.
// import {FontLoader} from 'https://unpkg.com/three@0.138.3/examples/jsm/loaders/FontLoader.js'
// import {TextGeometry} from 'https://unpkg.com/three@0.138.3/examples/jsm/geometries/TextGeometry.js'

const COLORS = ['red', 'blue', 'green', 'pink', 'orange']

const multiFaceScenePipelineModule = () => {
  // Start loading mesh url early.
  let canvas_
  let modelGeometry_
  const faceIdToMesh_ = {}
  let scene_
  let initialized_ = false

  let leftEyeWinkCount_ = 0
  let rightEyeWinkCount_ = 0
  let blinkCount_ = 0

  // init is called by onAttach and by facecontroller.faceloading. It needs to be called by both
  // before we can start.
  const init = ({canvas, detail}) => {
    if (initialized_) {
      return
    }
    canvas_ = canvas_ || canvas
    modelGeometry_ = modelGeometry_ || detail

    if (!(canvas_ && modelGeometry_)) {
      return
    }

    // Get the 3js scene from XR
    scene_ = XR8.Threejs.xrScene().scene
    // renderer_ = XR8.Threejs.xrScene().renderer

    // sets render sort order to the order of objects added to scene (for alpha rendering).
    THREE.WebGLRenderer.sortObjects = false

    // add lights.
    const targetObject = new THREE.Object3D()
    targetObject.position.set(0, 0, -1)
    scene_.add(targetObject)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.castShadow = true
    directionalLight.position.set(0, 0.25, 0)
    directionalLight.target = targetObject
    scene_.add(directionalLight)

    const bounceLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5)
    scene_.add(bounceLight)

    initialized_ = true
  }

  const onUpdate = ({processCpuResult}) => {

  }

  const onDetach = () => {
    canvas_ = null
    modelGeometry_ = null
  }

  const show = (event) => {
    const {id, transform, uvsInCameraFrame, vertices, attachmentPoints} = event.detail

    const cube = faceIdToMesh_[id]
    cube.position.copy(transform.position)
    cube.setRotationFromQuaternion(transform.rotation)
    cube.scale.set(transform.scale, transform.scale, transform.scale)
  }

  const faceLost = (event) => {
    console.log(`LOST face ${event.detail.id}`)
  }

  const faceFound = (event) => {
    console.log(`found face ${event.detail.id}`)
    // const loader = new THREE.()
    // loader.load('../assets/fonts/Hack-Regular.ttf', (font) => {
    //   font_ = font
    //   const {id} = event.detail
    //   const textGeo = new THREE.TextGeFontLoaderometry(`Face #${id}`, {
    //     font_,
    //     size: 70,
    //     height: 20,
    //     curveSegments: 4,
    //     bevelThickness: 2,
    //     bevelEnabled: 1.5,
    //   })
    // })
    const {id} = event.detail

    if (id in faceIdToMesh_) {
      console.log(`already created cube for id ${id}`)
      // we've already created a cube for this face.
      return
    }
    // Create a new box geometry and material
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({color: COLORS[id % COLORS.length]})

    // Create a mesh using the geometry and material, and add it to the scene
    const cube = new THREE.Mesh(geometry, material)
    scene_.add(cube)
    faceIdToMesh_[id] = cube
  }

  const onBlinkWink = (event) => {
    switch (event.name) {
      case 'facecontroller.lefteyewinked':
        leftEyeWinkCount_++
        document.getElementById('left-eye-wink').innerHTML = leftEyeWinkCount_
        break
      case 'facecontroller.righteyewinked':
        rightEyeWinkCount_++
        document.getElementById('right-eye-wink').innerHTML = rightEyeWinkCount_
        break
      case 'facecontroller.blinked':
        blinkCount_++
        document.getElementById('blinked').innerHTML = blinkCount_
        break
      default:
      // code block
        break
    }
  }

  const onFaceStateUpdate = (event) => {
    // console.log(`${event.name} + ${JSON.stringify(event.detail)}`)
    switch (event.name) {
      case 'facecontroller.mouthopened':
        document.getElementById('mouth-state').innerHTML = 'opened'
        break
      case 'facecontroller.mouthclosed':
        document.getElementById('mouth-state').innerHTML = 'closed'
        break
      case 'facecontroller.lefteyeopened':
        document.getElementById('left-eye-state').innerHTML = 'opened'
        break
      case 'facecontroller.lefteyeclosed':
        document.getElementById('left-eye-state').innerHTML = 'closed'
        break
      case 'facecontroller.righteyeopened':
        document.getElementById('right-eye-state').innerHTML = 'opened'
        break
      case 'facecontroller.righteyeclosed':
        document.getElementById('right-eye-state').innerHTML = 'closed'
        break
      case 'facecontroller.lefteyebrowraised':
        document.getElementById('left-eyebrow-state').innerHTML = 'raised'
        break
      case 'facecontroller.lefteyebrowlowered':
        document.getElementById('left-eyebrow-state').innerHTML = 'lowered'
        break
      case 'facecontroller.righteyebrowraised':
        document.getElementById('right-eyebrow-state').innerHTML = 'raised'
        break
      case 'facecontroller.righteyebrowlowered':
        document.getElementById('right-eyebrow-state').innerHTML = 'lowered'
        break
      case 'facecontroller.interpupillarydistance':
        document.getElementById('ipd').innerHTML = (
          `${event.detail.interpupillaryDistance.toFixed(2)}mm`
        )
        break
      default:
      // code block
        break
    }
  }

  return {
    name: 'facescene',
    onAttach: init,
    onDetach,
    onUpdate,
    listeners: [
      {event: 'facecontroller.faceloading', process: init},
      {event: 'facecontroller.facefound', process: faceFound},
      {event: 'facecontroller.faceupdated', process: show},
      {event: 'facecontroller.facelost', process: faceLost},
      // {event: 'facecontroller.mouthopened', process: onFaceStateUpdate},
      // {event: 'facecontroller.mouthclosed', process: onFaceStateUpdate},
      // {event: 'facecontroller.lefteyeopened', process: onFaceStateUpdate},
      // {event: 'facecontroller.lefteyeclosed', process: onFaceStateUpdate},
      // {event: 'facecontroller.righteyeopened', process: onFaceStateUpdate},
      // {event: 'facecontroller.righteyeclosed', process: onFaceStateUpdate},
      // {event: 'facecontroller.lefteyebrowraised', process: onFaceStateUpdate},
      // {event: 'facecontroller.lefteyebrowlowered', process: onFaceStateUpdate},
      // {event: 'facecontroller.righteyebrowraised', process: onFaceStateUpdate},
      // {event: 'facecontroller.righteyebrowlowered', process: onFaceStateUpdate},
      // {event: 'facecontroller.interpupillarydistance', process: onFaceStateUpdate},
      // {event: 'facecontroller.lefteyewinked', process: onBlinkWink},
      // {event: 'facecontroller.righteyewinked', process: onBlinkWink},
      // {event: 'facecontroller.blinked', process: onBlinkWink},
    ],
  }
}

export {multiFaceScenePipelineModule}
