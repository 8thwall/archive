/* globals mat4 */

import {drawScene} from './draw-scene'
import {initScene} from './init-scene'

const runNoXr = (canvas) => {
  Object.assign(canvas.style, {
    border: '2px solid black',
    backgroundColor: 'black',
  })
  canvas.width = 640
  canvas.height = 480
  const gl = canvas.getContext('webgl')
  const scene = initScene(gl)
  let then = 0

  // Draw the scene repeatedly
  const render = (now) => {
    // axis to rotate around (Y)
    mat4.rotate(scene.mvp.model, scene.mvp.model, (now - then) * 1e-3, [0, 1, 0])
    then = now

    drawScene(gl, scene, true)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

export {
  runNoXr,
}
