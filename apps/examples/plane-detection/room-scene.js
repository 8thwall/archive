import {WebXRButton} from './webxr-button.js'

let xrButton = null

let container
let camera; let scene; let
  renderer

const planeMaterials = []

let onRequestSession; let onEndSession; let onWindowResize
let onSessionStarted; let onSessionEnded
let render

function init() {
  container = document.createElement('div')
  document.body.appendChild(container)

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20)

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
  light.position.set(0.5, 1, 0.25)
  scene.add(light)

  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.xr.enabled = true
  renderer.autoClear = false
  container.appendChild(renderer.domElement)

  xrButton = new WebXRButton({
    onRequestSession,
    onEndSession,
    textEnterXRTitle: 'START AR',
    textXRNotFoundTitle: 'INCOMPATIBLE DEVICE',
    textExitXRTitle: 'EXIT AR',
  })

  document.body.appendChild(xrButton.domElement)

  if (navigator.xr) {
    navigator.xr.isSessionSupported('immersive-ar')
      .then((supported) => {
        xrButton.enabled = supported
      })
  }

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

  window.addEventListener('resize', onWindowResize)
}

onRequestSession = () => {
  const sessionInit = {
    requiredFeatures: ['plane-detection'],
    optionalFeatures: [],
  }

  navigator.xr.requestSession('immersive-ar', sessionInit).then((session) => {
    session.mode = 'immersive-ar'
    xrButton.setSession(session)
    onSessionStarted(session)
  })
}

onSessionStarted = (session) => {
  // useDomOverlay.disabled = true
  session.addEventListener('end', onSessionEnded)

  renderer.xr.setReferenceSpaceType('local')
  renderer.xr.setSession(session)

  renderer.setAnimationLoop(render)
}

onEndSession = (session) => {
  session.end()
}

onSessionEnded = (event) => {
  // useDomOverlay.disabled = false
  xrButton.setSession(null)

  renderer.setAnimationLoop(null)
  renderer.xr.setSession(null)
}

onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

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

let planeId = 1
const allPlanes = new Map()
function processPlanes(timestamp, frame) {
  const referenceSpace = renderer.xr.getReferenceSpace()

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

render = (timestamp, frame) => {
  if (frame) {
    processPlanes(timestamp, frame)
    renderer.render(scene, camera)
  }
}

init()
