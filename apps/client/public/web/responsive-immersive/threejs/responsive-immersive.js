import {arButton} from '../webxr-threejs/webxr-session'
import {CreateControllers} from '../webxr-threejs/create-controllers'
import {pipelineModule} from './pipeline-module'

let camera = null
let scene = null
let canvas_ = null
let renderer = null
let controllers = null
let sessionType_ = ''
let currentSession_ = null

let initialSceneCameraPosition_ = null
let sceneScale_ = 0
const originTransform_ = new window.THREE.Matrix4()
let needsRecenter_ = false
let onSelect_ = null
let environmentVisible_ = false
let bg_ = null
let bgEl_ = () => null

const selectWebXr = (event) => {
  if (!onSelect_) {
    return
  }
  if (!event.target.visible) {
    return
  }
  const [tracer] = event.target.children
  onSelect_(new window.THREE.Ray().applyMatrix4(tracer.matrixWorld))
}

const selectCanvas = (e) => {
  if (!onSelect_) {
    return
  }
  // calculate tap position in normalized device coordinates (-1 to +1) for both components.
  const x = (e.clientX / window.innerWidth) * 2 - 1  // should be canvas, not window
  const y = 1 - (e.clientY / window.innerHeight) * 2  // should be canvas, not window
  const ray = new window.THREE.Ray()
  ray.origin.setFromMatrixPosition(camera.matrixWorld)
  ray.direction.set(x, y, 0.5).unproject(camera).sub(ray.origin).normalize()
  onSelect_(ray)
}

const updateOrigin = (obj) => {
  if (!(obj && sceneScale_)) {
    return
  }
  obj.matrix.premultiply(originTransform_)
  obj.matrix.decompose(obj.position, obj.rotation, obj.scale)
}

// Limit canvas resolution to increase performance.
const resolution = () => {
  const maxDim = 1280
  const aspect = window.innerWidth / window.innerHeight
  const scale = 1 / window.devicePixelRatio
  return window.innerWidth > window.innerHeight
    ? {width: maxDim * scale, height: (maxDim / aspect) * scale}
    : {width: maxDim * aspect * scale, height: maxDim * scale}
}

const updateScale = obj => obj && obj.setScale(sceneScale_)

const groundRotation = (quat) => {
  const e = new window.THREE.Euler(0, 0, 0, 'YXZ')
  e.setFromQuaternion(quat)
  return new window.THREE.Quaternion().setFromEuler(new window.THREE.Euler(0, e.y, 0, 'YXZ'))
}

const recenter = (currentXrExtrinsic) => {
  // Get the current XR transform parameters.
  const xrTransform = new window.THREE.Matrix4().fromArray(currentXrExtrinsic)
  const xrPos = new window.THREE.Vector3()
  const xrRot = new window.THREE.Quaternion()
  const unusedScale = new window.THREE.Vector3()
  xrTransform.decompose(xrPos, xrRot, unusedScale)

  // Find the parameters of the desired initial scene camera.
  const initPos = new window.THREE.Vector3()
  const initRot = new window.THREE.Quaternion()
  initialSceneCameraPosition_.decompose(initPos, initRot, unusedScale)

  // Find the scale needed to transform between the current XR height and the desired scene height.
  sceneScale_ = initPos.y / xrPos.y

  // Get the ground rotation needed to go from the current XR camera to the desired scene camera.
  const rotY = groundRotation(initRot).multiply(groundRotation(xrRot).invert())

  // Translate xr camera to desired scene x/z with height 0.
  xrPos.applyQuaternion(rotY)
  initPos.setX(initPos.x - xrPos.x)
  initPos.setY(0)
  initPos.setZ(initPos.z - xrPos.z)

  // Put it all together.
  originTransform_.compose(
    initPos, rotY, new window.THREE.Vector3(sceneScale_, sceneScale_, sceneScale_)
  )

  needsRecenter_ = false
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  const {width, height} = resolution()
  renderer.setSize(width, height, false)
}

const onSessionStarted = () => {
  environmentVisible_ = sessionType_ === 'XR8' || currentSession_.environmentBlendMode !== 'opaque'
  sceneScale_ = 0
  if (environmentVisible_) {
    bg_ = scene.background
    if (bgEl_()) {
      bgEl_().visible = false
    }
    scene.background = null
  }
}

const onSessionEnded = () => {
  if (sessionType_ !== 'XR8') {
    currentSession_.removeEventListener('end', onSessionEnded)
  }
  initialSceneCameraPosition_.decompose(camera.position, camera.rotation, camera.scale)
  camera.updateMatrix()
  sceneScale_ = 0
  if (environmentVisible_) {
    scene.background = bg_
    environmentVisible_ = false
    bg_ = null
    if (bgEl_()) {
      bgEl_().visible = true
    }
  }
  sessionType_ = ''
}

const startSession = async (sessionType, closeElement) => {
  sessionType_ = sessionType
  if (sessionType_ === 'XR8') {
    window.XR8.addCameraPipelineModules([  // Add camera pipeline modules.
      // Existing pipeline modules.
      window.XR8.GlTextureRenderer.pipelineModule(),  // Draws the camera feed.
      window.XR8.XrController.pipelineModule(),  // Enables SLAM tracking.
      // Custom pipeline modules.
      pipelineModule({scene, camera, renderer}),
    ])
    window.XR8.run({canvas: canvas_, ownRunLoop: false})
    onSessionStarted()
    return  // TODO: wait for camera to start
  }
  const sessionInit = {
    requiredFeatures: ['local-floor'],
    optionalFeatures: ['hand-tracking', 'dom-overlay'],
  }
  sessionInit.domOverlay = {root: closeElement}
  const session = await navigator.xr.requestSession(sessionType_, sessionInit)
  currentSession_ = session
  currentSession_.addEventListener('end', onSessionEnded)
  renderer.xr.setReferenceSpaceType(sessionInit.requiredFeatures[0])
  await renderer.xr.setSession(currentSession_)
  onSessionStarted()
}

const addSessionEndListener = (listener) => {
  if (sessionType_ !== 'XR8') {
    const fireAndRemove = () => {
      listener()
      currentSession_.removeEventListener('end', fireAndRemove)
    }
    currentSession_.addEventListener('end', fireAndRemove)
  }
}

const stopSession = listener => () => {
  if (sessionType_ !== 'XR8') {
    currentSession_.end()
    return
  }
  window.XR8.stop()
  window.XR8.removeCameraPipelineModules([
    'reality',
    'threejsrenderer',
    'gltexturerenderer',
  ])
  listener()  // TODO: don't manually invoke here, and remove it from args.
  onSessionEnded()  // TODO: don't manually invoke here, invoke from pipeline.
}

const init = ({canvas, onSelect, onScene, startButtonText, background}) => {
  bgEl_ = background
  scene = new window.THREE.Scene()
  canvas_ = canvas
  camera = new window.THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20)
  renderer = new window.THREE.WebGLRenderer({canvas, antialias: true, alpha: true})
  onSelect_ = onSelect

  // Renderer
  renderer.setPixelRatio(window.devicePixelRatio)
  const {width, height} = resolution()
  renderer.setSize(width, height, false)
  renderer.xr.enabled = true

  // Enable shadows in the rednerer.
  renderer.shadowMap.enabled = true

  document.body.appendChild(
    arButton(startButtonText, startSession, stopSession, addSessionEndListener)
  )

  // TODO: move to start
  controllers = CreateControllers(renderer, scene)
  canvas_.addEventListener('click', selectCanvas, false)
  controllers.left.controller.addEventListener('select', selectWebXr)
  controllers.right.controller.addEventListener('select', selectWebXr)

  window.addEventListener('resize', onWindowResize)
  if (onScene) {
    onScene({scene, camera, renderer})
  }
}

// Adjust the scale and orientation of the scene based on the initial height of the camera.
const fixScale = (frame) => {
  if (sessionType_ === 'XR8') {
    return
  }

  if (!frame) {
    return
  }
  const referenceSpace = renderer.xr.getReferenceSpace()
  const pose = frame.getViewerPose(referenceSpace)

  if (!pose) {
    return
  }

  const {views} = pose

  if (!views.length) {
    return
  }

  views.forEach((view, idx) => {
    if (!sceneScale_ || needsRecenter_) {
      recenter(view.transform.matrix)
    }

    if (!sceneScale_) {
      return
    }

    updateOrigin(renderer.xr.getCamera(camera).cameras[idx])
  })

  if (!sceneScale_) {
    return
  }

  updateOrigin(renderer.xr.getCamera(camera))

  renderer.xr.getSession().inputSources.forEach(
    (input, idx) => {
      updateOrigin(renderer.xr.getController(idx))
    }
  )

  renderer.xr.getSession().inputSources.forEach((input, idx) => {
    const hand = renderer.xr.getHand(idx)
    if (!hand) {
      return
    }
    Object.values(hand.joints).forEach(joint => updateOrigin(joint))
  })

  renderer.xr.getSession().inputSources.forEach(
    (input, idx) => updateOrigin(renderer.xr.getControllerGrip(idx))
  )

  updateScale(controllers.left.hand.motionController)
  updateScale(controllers.right.hand.motionController)
}

const render = onUpdate => (time, frame) => {
  fixScale(frame)
  if (sessionType_ === 'XR8') {
    window.XR8.runPreRender(time)
    window.XR8.runRender()
    renderer.clearDepth()
  }
  if (onUpdate) {
    onUpdate(time)
  }
  renderer.render(scene, camera)
  if (sessionType_ === 'XR8') {
    window.XR8.runPostRender()
  }
}

const animate = (onUpdate) => {
  camera.updateMatrix()
  initialSceneCameraPosition_ = camera.matrix.clone()
  renderer.setAnimationLoop(render(onUpdate))
}

const ResponsiveImmersive = {
  run: ({canvas, onSelect, onScene, startButtonText, background, onUpdate}) => {
    console.log('Device:', window.XR8.XrDevice.deviceEstimate())
    console.log('Browser:', window.XR8.XrDevice.deviceEstimate().browser)
    console.log('navigagor.userAgent:', window.navigator.userAgent)
    init({canvas, onSelect, onScene, startButtonText, background})
    animate(onUpdate)
  },
  recenter: () => {
    if (sessionType_ === 'XR8') {
      window.XR8.XrController.recenter()
    } else {
      needsRecenter_ = true
    }
  },
}

export {
  ResponsiveImmersive,
}
