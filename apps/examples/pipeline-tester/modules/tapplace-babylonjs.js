/* globals TWEEN */

// NOTE(paris): Code based on https://www.8thwall.com/8thwall/placeground-babylonjs/files

const modelRootURL = require('../assets/tapplace/tree.glb')     // Path to 3D model
const startScale = new BABYLON.Vector3(0.1, 0.1, -0.1)          // Initial scale value for our model
const endScale = new BABYLON.Vector3(2.0, 2.0, -2.0)            // Ending scale value for our model

let surface
let engine; 
let scene; 
let camera
let model

// Populates some object into an XR scene and sets the initial camera position.
const initXrScene = () => {
  // Light.
  const light = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(-5, -10, 7), scene)
  light.intensity = 1.0

  // Shadow receiver.
  const ground = BABYLON.Mesh.CreatePlane('ground', 2000, scene)
  ground.rotation.x = Math.PI / 2
  ground.material = new BABYLON.ShadowOnlyMaterial('shadowOnly', scene)
  ground.receiveShadows = true
  ground.position.y = 0
  surface = ground

  // load in model
  BABYLON.SceneLoader.ImportMeshAsync('', modelRootURL, null, scene).then((result) => {
    model = result.meshes[0]
    model.position = new BABYLON.Vector3(0, 0, 0)
    model.scaling = new BABYLON.Vector3(0, 0, 0)
  })

  // Set the initial camera position relative to the scene we just laid out. This must be at a
  // height greater than y=0.
  camera.position = new BABYLON.Vector3(0, 2, -2)
}

const placeObjectTouchHandler = (e) => {
  // Call XrController.recenter() when the canvas is tapped with two fingers. This resets the
  // AR camera to the position specified by XrController.updateCameraProjectionMatrix() above.
  if (e.touches.length === 2) {
    XR8.XrController.recenter()
  }

  if (e.touches.length > 2) {
    return
  }

  // If the canvas is tapped with one finger and hits the "ground", spawn an object.
  const pickResult = scene.pick(e.touches[0].clientX, e.touches[0].clientY)
  if (pickResult.hit && pickResult.pickedMesh === surface) {
    // clone the loaded model and set new position
    const clone = model.clone('newname')
    clone.position = new BABYLON.Vector3(pickResult.pickedPoint.x, 0, pickResult.pickedPoint.z)

    const yRot = Math.random() * Math.PI
    clone.rotation = new BABYLON.Vector3(0, yRot, 0)
    clone.scaling = new BABYLON.Vector3(startScale.x, startScale.y, startScale.z)

    BABYLON.Animation.CreateAndStartAnimation('scalex', clone, 'scaling.x', 30, 10, startScale.x, endScale.x, 0)
    BABYLON.Animation.CreateAndStartAnimation('scaley', clone, 'scaling.y', 30, 10, startScale.y, endScale.y, 0)
    BABYLON.Animation.CreateAndStartAnimation('scalez', clone, 'scaling.z', 30, 10, startScale.z, endScale.z, 0)
  }
}

const startScene = (canvas) => {
  engine = new BABYLON.Engine(canvas, true, {stencil: true, preserveDrawingBuffer: true})
  scene = new BABYLON.Scene(engine)
  camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, 0), scene)

  initXrScene({scene, camera})

  // Connect camera to XR and show camera feed.
  const xrbehavior = XR8.Babylonjs.xrCameraBehavior({allowedDevices: 'any'})
  camera.addBehavior(xrbehavior, true)

  // Add touch listener.
  canvas.addEventListener('touchstart', placeObjectTouchHandler, true)
  engine.runRenderLoop(() => scene.render())
  window.addEventListener('resize', () => engine.resize())

  return () => {
    camera.removeBehavior(xrbehavior)
    engine.stopRenderLoop()
  }
}

export {startScene}
