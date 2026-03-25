// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import {Model} from './model-min'

const WORKER_URL =
  `${new URL(window.location.href).origin}${require('./assets/model-manager-worker.min')}`
const MODELS_PATH = require('./assets/model.files')
const DEFAULT_MODEL = 3  // Set to an index of a file below if you want to load a URL at startup.

const DEFAULT_MODELS = [
  [{url: `${MODELS_PATH}doty.glb`}],                                           // 0
  [{url: `${MODELS_PATH}mesh.drc`}, {url: `${MODELS_PATH}/drc-texture.jpg`}],  // 1
  [{url: `${MODELS_PATH}mesh.mar`}, {url: `${MODELS_PATH}/mar-texture.jpg`}],  // 2
  [{url: `${MODELS_PATH}minion.spz`}],                                         // 3
  [{url: `${MODELS_PATH}pointcloud.ptz`}],                                     // 4
  [{url: `${MODELS_PATH}sundial.spz`}],                                        // 5
]

const MODEL_CONFIGS = [
  null,  // 0
  null,  // 1
  null,  // 2
  {      // 3
    orbit: {
      pitch: {max: 0.122670636, min: -0.10626347, start: 0.008158487},
      radius: {max: 9.128183, min: 0.1, start: 6.0854554},
      yaw: {max: 2.1991148, min: -0.3141592, start: 6.235432},
      center: [1.1122911, -0.73037136, 0.6330004],
    },
    space: Model.WebModelView.CoordinateSpace.RUB,
  },
  null,  // 4
  null,  // 5
]

let stats
// let domPromiseResolve
// const domPromise = new Promise((resolve) => {
//   domPromiseResolve = resolve
// })

// window.onload = () => {
//   domPromiseResolve()
// }

const preventDefault = (e) => {
  e.preventDefault()
  e.stopPropagation()
}

const onLoad = () => {
  const canvas = document.createElement('canvas')
  document.body.insertAdjacentElement('beforeend', canvas)

  Model.setInternalConfig({workerUrl: WORKER_URL})
  const modelView = Model.WebModelView.create({canvas})

  document.body.insertAdjacentElement('beforeend', document.createElement('canvas'))
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
  document.addEventListener('drop', (e) => {
    preventDefault(e)
    if (e.dataTransfer) {
      modelView.loadFiles(e.dataTransfer.files)
    }
  })

  const defaultModel = DEFAULT_MODELS[DEFAULT_MODEL]
  if (defaultModel) {
    modelView.loadModel(defaultModel)
    const config = MODEL_CONFIGS[DEFAULT_MODEL]
    if (config) {
      modelView.configure(config)
    }
  }

  stats = new window.Stats()
  stats.showPanel(0)
  stats.dom.style.zIndex = 5000
  stats.dom.style.position = 'absolute'
  stats.dom.style.top = '0px'
  stats.dom.style.left = '0px'
  document.body.appendChild(stats.dom)

  const updateStats = () => {
    stats.update()
    requestAnimationFrame(updateStats)
  }

  updateStats()
}

// domPromise.then(onLoad)
onLoad()
