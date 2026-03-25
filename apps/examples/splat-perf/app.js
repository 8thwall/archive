// Copyright (c) 2021 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './main.css'

import {Model} from './model-min'

const workerUrl =
  `${new URL(window.location.href).origin}${require('./assets/model-manager-worker.min')}`

const preventDefault = (e) => {
  e.preventDefault()
  e.stopPropagation()
}

const resize = (canvas, camera, renderer, modelManager) => {
  const MAX_RES = 1920
  const targetWidth = window.innerWidth * window.devicePixelRatio
  const targetHeight = window.innerHeight * window.devicePixelRatio
  const downsampleX = Math.min(1, MAX_RES / targetWidth)
  const downsampleY = Math.min(1, MAX_RES / targetHeight)
  const downsample = Math.min(downsampleX, downsampleY)

  const newWidth = targetWidth * downsample
  const newHeight = targetHeight * downsample

  canvas.width = newWidth
  canvas.height = newHeight
  camera.aspect = newWidth / newHeight
  camera.updateProjectionMatrix()

  renderer.setSize(newWidth, newHeight)
  modelManager.setRenderWidthPixels(newWidth)
}

const setup = (canvas) => {
  Object.assign(canvas.style, {
    position: 'fixed',
    left: '0px',
    top: '0px',
    height: '100vh',
    width: '100vw',
  })
  document.addEventListener('dragenter', preventDefault)
  document.addEventListener('dragover', preventDefault)
  document.addEventListener('dragleave', preventDefault)

  const context = canvas?.getContext('webgl2', {antialias: false})

  // Initialize the scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  scene.add(new THREE.AxesHelper(5))
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 5)

  const renderer = new THREE.WebGLRenderer({canvas, context})
  const orbitControls = new THREE_ADDONS.OrbitControls(camera, renderer.domElement)

  Model.setInternalConfig({workerUrl})
  const modelManager = Model.ThreejsModelManager.create({camera})
  const model = modelManager.model()
  scene.add(model)

  const resizeFunc = () => resize(canvas, camera, renderer, modelManager)
  window.addEventListener('resize', resizeFunc)
  resizeFunc()

  return {scene, camera, renderer, orbitControls, modelManager, model}
}

// Setup the canvas, scene, model manager
const canvas_ = document.createElement('canvas')
document.body.insertAdjacentElement('beforeend', canvas_)
const {scene, camera, renderer, orbitControls, modelManager, model} = setup(canvas_)

// Load a splat
const SPLAT_BASE = require('./assets/spz.files')
const src = `${SPLAT_BASE}academyofballet.spz`
const filename = src.split('/').pop()
fetch(src, {mode: 'cors'})
  .then(response => Promise.all([response.arrayBuffer(), response.status]))
  .then(([buffer, status]) => {
    if (status !== 200) {
      console.error(`Failed to load ${src}: ${status}`)  // eslint-disable-line no-console
      return
    }
    const bytes = new Uint8Array(buffer)
    modelManager.dispose()
    modelManager.setModelBytes(filename, bytes)
  })

// Set model position based on data in spz.files
model.position.set(-6, 1.4, 0)
model.rotation.set(0, -90, 0)

// Set up our recursive tick for rendering
const tick = () => {
  orbitControls.update()
  modelManager.tick()
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}
tick()
