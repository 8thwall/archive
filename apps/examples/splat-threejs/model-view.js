import {Model} from './dist/model-min'
import {Pane} from './dist/tweakpane'
import * as EssentialPlugin from './dist/plugin-essentials'
import * as THREE from './dist/threemodulemin.js'
import {OrbitControls} from './dist/OrbitControls.js'
import {ThreejsModelManager} from './threejs-model-manager'
import {XRButton} from './webxr/xr-button'

const DEFAULT_MODEL = [{url: `${require('./assets/model.files')}sundial.spz`}]

let canvas_
let renderer_
let scene_
let orbitControls_
let camera_
let modelManager_
let clientWidth_ = 0
let clientHeight_ = 0

// Used with TweakPane so users can modify these on the fly.
let pane_
const PARAMS = {
  cameraFov: 75,
  numCounts: -1,
  // set numCounts based on its initial percentage
  countPercentage: 100,
  maxInstanceIdForFragment: -1,
  maxInstanceIdForFragmentPercentage: 100,
  // monitor values
  fps: 0,
}

const needsResize = () => (
  canvas_.clientWidth !== clientWidth_ || canvas_.clientHeight !== clientHeight_
)

const resize = () => {
  const MAX_RES = 1920
  clientHeight_ = canvas_.clientHeight
  clientWidth_ = canvas_.clientWidth
  const targetWidth = clientWidth_ * window.devicePixelRatio
  const targetHeight = clientHeight_ * window.devicePixelRatio
  const downsampleX = Math.min(1, MAX_RES / targetWidth)
  const downsampleY = Math.min(1, MAX_RES / targetHeight)
  const downsample = Math.min(downsampleX, downsampleY)

  const newWidth = targetWidth * downsample
  const newHeight = targetHeight * downsample
  canvas_.width = newWidth
  canvas_.height = newHeight
  camera_.aspect = newWidth / newHeight
  camera_.updateProjectionMatrix()

  renderer_.setSize(newWidth, newHeight, false)
  modelManager_.setRenderWidthPixels(newWidth)
}

let fpsGraph_
const tick = () => {
  fpsGraph_?.begin()
  if (needsResize()) {
    resize()
  }
  orbitControls_.update()
  modelManager_.tick()
  renderer_.render(scene_, camera_)

  fpsGraph_?.end()
}

const onLoad = (config) => {
  canvas_ = config.canvas
  Object.assign(canvas_.style, {
    position: 'fixed',
    left: '0px',
    top: '0px',
    height: '100vh',
    width: '100vw',
  })

  const context = canvas_?.getContext('webgl2', {antialias: false})

  // Initialize the scene
  scene_ = new THREE.Scene()
  scene_.background = new THREE.Color(0x000000)
  scene_.add(new THREE.AxesHelper(5))
  camera_ = new THREE.PerspectiveCamera(PARAMS.cameraFov, window.innerWidth / window.innerHeight,
    0.1, 1000)
  camera_.position.set(0, 0, 0)

  renderer_ = new THREE.WebGLRenderer({canvas: canvas_, context, precision: 'mediump', stencil: false, multiviewStereo: true})
  renderer_.xr.enabled = true

  document.body.appendChild(XRButton.createButton(renderer_))

  orbitControls_ = new OrbitControls(camera_, canvas_)
  orbitControls_.target = new THREE.Vector3(0, 0, -5)

  Model.setInternalConfig({workerUrl: config.workerUrl})
  modelManager_ = ThreejsModelManager.create({camera: camera_})

  scene_.add(modelManager_.model())

  resize()

  // Setting up our tweak pane for user-configurable options
  pane_ = new Pane()
  pane_.registerPlugin(EssentialPlugin)

  pane_.addBinding(PARAMS, 'cameraFov', {min: 50, max: 150, step: 1})
    .on('change', (ev) => {
      camera_.fov = ev.value
      camera_.updateProjectionMatrix()
    })

  let modelNumPoints = 0
  pane_.addBinding(PARAMS, 'numCounts', {readonly: true})
    .on('change', modelManager_.onChange.numCounts)
  const percentageChoices = [10, 20, 50, 70, 90, 100]
  pane_.addBinding(PARAMS, 'countPercentage', {
    view: 'radiogrid',
    groupName: 'countPercentage',
    size: [3, 2],
    cells: (x, y) => ({
      title: `${percentageChoices[y * 3 + x]}%`,
      value: percentageChoices[y * 3 + x],
    }),
    label: 'numCounts%',
  }).on('change', (ev) => {
    PARAMS.numCounts = modelNumPoints * (ev.value / 100)
    pane_.refresh()
  })

  pane_.addBinding(PARAMS, 'maxInstanceIdForFragment', {readonly: true, label: 'maxFragment#'})
    .on('change', modelManager_.onChange.maxInstanceIdForFragment)
  pane_.addBinding(PARAMS, 'maxInstanceIdForFragmentPercentage', {
    view: 'radiogrid',
    groupName: 'maxInstanceIdForFragmentPercentage',
    size: [3, 2],
    cells: (x, y) => ({
      title: `${percentageChoices[y * 3 + x]}%`,
      value: percentageChoices[y * 3 + x],
    }),
    label: 'maxFragment%',
  }).on('change', (ev) => {
    PARAMS.maxInstanceIdForFragment = modelNumPoints * (ev.value / 100)
    pane_.refresh()
  })

  modelManager_.setOnLoaded(({numPoints}) => {
    modelNumPoints = numPoints
    PARAMS.numCounts = numPoints * (PARAMS.countPercentage / 100)
    PARAMS.maxInstanceIdForFragment = numPoints * (PARAMS.maxInstanceIdForFragmentPercentage / 100)
    // refresh tweakpane when our model manager has data ready
    pane_.refresh()
  })

  const perfFolder = pane_.addFolder({title: 'Perf'})
  fpsGraph_ = perfFolder.addBlade({
    view: 'fpsgraph',
    label: 'fps',
    rows: 2,
  })

  modelManager_.setModelSrcs(DEFAULT_MODEL)

  // Start RAFing our tick
  renderer_.setAnimationLoop(tick)
}

const createModelView = ({canvas: c_, workerUrl}) => {
  onLoad({canvas: c_, workerUrl})
}

export {
  createModelView,
}
