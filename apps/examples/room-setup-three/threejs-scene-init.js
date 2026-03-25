const planeMaterials = []
const loadManager = new THREE.LoadingManager()
const loader = new THREE.TextureLoader(loadManager)
const gridTexture = loader.load('https://raw.githubusercontent.com/google-ar/arcore-android-sdk/c684bbda37e44099c273c3e5274fae6fccee293c/samples/hello_ar_c/app/src/main/assets/models/trigrid.png')
gridTexture.wrapS = THREE.RepeatWrapping
gridTexture.wrapT = THREE.RepeatWrapping

const createPlaneMaterial = params => new THREE.MeshBasicMaterial(Object.assign(params, {
  map: gridTexture,
  opacity: 0.5,
  transparent: true,
}))
planeMaterials.push(createPlaneMaterial({color: 0xff0000}))
planeMaterials.push(createPlaneMaterial({color: 0x00ff00}))
planeMaterials.push(createPlaneMaterial({color: 0x0000ff}))
planeMaterials.push(createPlaneMaterial({color: 0xffff00}))
planeMaterials.push(createPlaneMaterial({color: 0x00ffff}))
planeMaterials.push(createPlaneMaterial({color: 0xff00ff}))

// Create planes from vertices
function createGeometryFromPolygon(polygon) {
  const geometry = new THREE.BufferGeometry()

  const vertices = []
  const uvs = []
  polygon.forEach((point) => {
    vertices.push(point.x, point.y, point.z)
    uvs.push(point.x, point.z)
  })

  const indices = []
  for (let i = 2; i < polygon.length; ++i) {
    indices.push(0, i - 1, i)
  }

  geometry.setAttribute('position',
    new THREE.BufferAttribute(new Float32Array(vertices), 3))
  geometry.setAttribute('uv',
    new THREE.BufferAttribute(new Float32Array(uvs), 2))
  geometry.setIndex(indices)

  return geometry
}

// Process the detected planes
let planeId = 1
const allPlanes = new Map()
function processPlanes(timestamp, frameStartResult) {
  const {scene, renderer} = XR8.Threejs.xrScene()
  const referenceSpace = renderer.xr.getReferenceSpace()
  const {frame, session} = frameStartResult

  if (frame.detectedPlanes) {
    allPlanes.forEach((planeContext, plane) => {
      if (!frame.detectedPlanes.has(plane)) {
        // plane was removed
        allPlanes.delete(plane)
        console.debug(`Plane no longer tracked, id=${planeContext.id}`)

        scene.remove(planeContext.mesh)
      }
    })

    frame.detectedPlanes.forEach((plane) => {
      const planePose = frame.getPose(plane.planeSpace, referenceSpace)
      let planeMesh

      if (allPlanes.has(plane)) {
        // may have been updated:
        const planeContext = allPlanes.get(plane)
        planeMesh = planeContext.mesh

        if (planeContext.timestamp < plane.lastChangedTime) {
          // updated!
          planeContext.timestamp = plane.lastChangedTime

          const geometry = createGeometryFromPolygon(plane.polygon)
          planeContext.mesh.geometry.dispose()
          planeContext.mesh.geometry = geometry
        }
      } else {
        // new plane

        // Create geometry:
        const geometry = createGeometryFromPolygon(plane.polygon)
        planeMesh = new THREE.Mesh(geometry,
          planeMaterials[planeId % planeMaterials.length])

        planeMesh.matrixAutoUpdate = false

        scene.add(planeMesh)

        const planeContext = {
          id: planeId,
          timestamp: plane.lastChangedTime,
          mesh: planeMesh,
        }

        allPlanes.set(plane, planeContext)
        console.debug(`New plane detected, id=${planeId}`)
        planeId++
      }

      if (planePose) {
        planeMesh.visible = true
        planeMesh.matrix.fromArray(planePose.transform.matrix)
      } else {
        planeMesh.visible = false
      }
    })
  }
}

// Define an 8th Wall XR Camera Pipeline Module that adds a cube to a threejs scene on startup.
export const initScenePipelineModule = () => {
  // Populates a cube into an XR scene and sets the initial camera position.
  const initXrScene = ({scene, camera, renderer}) => {
    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 2, 2)
  }

  // Return a camera pipeline module that adds scene elements on start.
  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be unique within
    // your app.
    name: 'threejsinitscene',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart: ({canvas}) => {
      const {scene, camera, renderer} = XR8.Threejs.xrScene()  // Get the 3js scene from XR8.Threejs

      initXrScene({scene, camera, renderer})  // Add objects set the starting camera position.

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR8.XrController.updateCameraProjectionMatrix(
        {origin: camera.position, facing: camera.quaternion}
      )
    },
    onUpdate: ({frameStartResult}) => {
      processPlanes(Date.now(), frameStartResult)
    },
  }
}
