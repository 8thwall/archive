import {createModelView} from './model-view'

const WORKER_URL =
  `${new URL(window.location.href).origin}${require('./assets/model-manager-worker.min')}`

const onLoad = () => {
  const canvas = document.createElement('canvas')
  document.body.insertAdjacentElement('beforeend', canvas)

  createModelView({
    canvas,
    workerUrl: WORKER_URL,
  })
}

onLoad()

// Tony - added comment
