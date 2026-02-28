export const startScene = (canvas) => {
  const engine = new BABYLON.Engine(canvas, true /* antialias */)
  const scene = new BABYLON.Scene(engine)
  scene.useRightHandedSystem = false

  const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, 0), scene)
  camera.rotation = new BABYLON.Vector3(0, scene.useRightHandedSystem ? Math.PI : 0, 0)
  camera.minZ = 0.0001
  camera.maxZ = 10000

  // Add a light to the scene
  const directionalLight =
  new BABYLON.DirectionalLight('DirectionalLight', new BABYLON.Vector3(-5, -10, 7), scene)
  directionalLight.intensity = 0.5

  // Mesh logic
  const faceMesh = new BABYLON.Mesh('face', scene)

  const material = new BABYLON.StandardMaterial('boxMaterial', scene)
  material.diffuseColor = new BABYLON.Color3(173 / 255.0, 80 / 255.0, 255 / 255.0)
  faceMesh.material = material

  let facePoints = []

  const runConfig = {
    cameraConfig: {direction: XR8.XrConfig.camera().FRONT},
    allowedDevices: XR8.XrConfig.device().ANY,
  }

  // Connect camera to XR and show camera feed.
  camera.addBehavior(XR8.Babylonjs.faceCameraBehavior(runConfig))

  engine.runRenderLoop(() => {
    scene.render()
  })

  // this is called when the face is first found.  It provides the static information about the
  // face such as the UVs and indices
  scene.onFaceLoadingObservable.add((event) => {
    const {indices, maxDetections, pointsPerDetection, uvs} = event

    // Babylon expects all vertex data to be a flat list of numbers
    facePoints = Array(pointsPerDetection)
    for (let i = 0; i < pointsPerDetection; i++) {
      const facePoint = BABYLON.MeshBuilder.CreateBox('box', {size: 0.02}, scene)
      facePoint.material = material
      facePoint.parent = faceMesh
      facePoints[i] = facePoint
    }
  })

  // this is called each time the face is updated which is on a per-frame basis
  scene.onFaceUpdatedObservable.add((event) => {
    const {vertices, normals, transform} = event
    const {scale, position, rotation} = transform

    vertices.map((v, i) => {
      facePoints[i].position.x = v.x
      facePoints[i].position.y = v.y
      facePoints[i].position.z = v.z
    })

    faceMesh.scalingDeterminant = scale
    faceMesh.position = position
    faceMesh.rotationQuaternion = rotation
  })

  window.addEventListener('resize', () => engine.resize())
}
