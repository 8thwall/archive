/* eslint-disable no-console */
// Define an 8th Wall XR Camera Pipeline Module that adds a cube to a babylonjs scene on startup.

// Additional lighting to make sure normals look right.
const useNormalsDebugLighting = false

// Populates some object into an XR scene and sets the initial camera position.
const initXrScene = ({scene, camera}) => {
  // Light.
  const directionalLight =
    new BABYLON.DirectionalLight('DirectionalLight', new BABYLON.Vector3(-5, -10, 7), scene)
  directionalLight.intensity = 2.0

  if (useNormalsDebugLighting) {
    // Red above you
    const directionalLight0 =
      new BABYLON.DirectionalLight('DirectionalLight0', new BABYLON.Vector3(-5, -10, 7), scene)
    directionalLight0.intensity = 2.0
    directionalLight0.diffuse = new BABYLON.Color3(1, 0, 0)

    // Green below you
    const directionalLight1 =
      new BABYLON.DirectionalLight('DirectionalLight1', new BABYLON.Vector3(-5, 10, 7), scene)
    directionalLight1.intensity = 2.0
    directionalLight1.diffuse = new BABYLON.Color3(0, 1, 0)

    // Blue to the right of you
    const directionalLight2 =
      new BABYLON.DirectionalLight('DirectionalLight2', new BABYLON.Vector3(5, 10, 7), scene)
    directionalLight2.intensity = 2.0
    directionalLight2.diffuse = new BABYLON.Color3(0, 0, 1)
  }

  // Cube.
  const box = BABYLON.MeshBuilder.CreateBox('box', {size: 1.0}, scene)
  box.material = new BABYLON.StandardMaterial('boxMaterial', scene)
  box.material.diffuseColor = new BABYLON.Color3(173 / 255.0, 80 / 255.0, 255 / 255.0)
  box.position = new BABYLON.Vector3(0, 0.5, 2)

  // Shadow receiver.
  const ground = BABYLON.Mesh.CreatePlane('ground', 2000, scene)
  ground.rotation.x = Math.PI / 2
  ground.material = new BABYLON.ShadowOnlyMaterial('shadowOnly', scene)
  ground.receiveShadows = true
  ground.position.y = 0

  // Shadow generator.
  const shadowGenerator = new BABYLON.ShadowGenerator(512, directionalLight)
  shadowGenerator.useBlurExponentialShadowMap = true
  shadowGenerator.blurScale = 2
  shadowGenerator.setDarkness(0.33)
  shadowGenerator.getShadowMap().renderList.push(box)

  // Set the initial camera position relative to the scene we just laid out. This must be at a
  // height greater than y=0.
  camera.position = new BABYLON.Vector3(0, 2, -2)
}

const recenterTouchHandler = (e) => {
  // Call XrController.recenter() when the canvas is tapped. This resets the AR camera to the
  // position specified by camera.position above.
  if (e.touches.length === 1) {
    XR8.XrController.recenter()
  }
}

let customMesh = null
const startScene = (canvas) => {
  const engine = new BABYLON.Engine(canvas, true /* antialias */)
  const scene = new BABYLON.Scene(engine)
  scene.useRightHandedSystem = false

  const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, 0), scene)

  initXrScene({scene, camera})

  const xrbehavior = XR8.Babylonjs.xrCameraBehavior()
  camera.addBehavior(xrbehavior)  // Connect camera to XR and show camera feed.

  canvas.addEventListener('touchstart', recenterTouchHandler, true)  // Add touch listener.
  engine.runRenderLoop(() => scene.render())

  scene.onXrMeshFoundObservable.add((event) => {
    console.log('[cube-babylon] meshfound')
    const {position, rotation, vertexData} = event
    customMesh = new BABYLON.Mesh('custom', scene)
    const material = new BABYLON.StandardMaterial('boxMaterial', scene)
    customMesh.material = material

    customMesh.position = position
    customMesh.rotation = rotation
    vertexData.applyToMesh(customMesh)
  })

  scene.onXrMeshUpdatedObservable.add((event) => {
    console.log('[cube-bablyon] meshupdated')
    const {position, rotation} = event
    customMesh.position = position
    customMesh.rotation = rotation
  })

  window.addEventListener('resize', () => engine.resize())

  return () => {
    camera.removeBehavior(xrbehavior)
    engine.stopRenderLoop()
  }
}

export {startScene}
