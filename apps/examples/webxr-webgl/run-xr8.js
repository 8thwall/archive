/* globals mat4 */

import {drawScene} from './draw-scene'
import {initScene} from './init-scene'

const webGlSceneModule = () => {
  let scene_ = null
  let gl_ = null
  let then_ = 0

  return {
    name: 'webglscene',
    onAttach: ({GLctx}) => {
      gl_ = GLctx
      scene_ = initScene(gl_)
      XR8.XrController.updateCameraProjectionMatrix({
        origin: {x: 0, y: 1, z: 0},
        facing: {w: 1, x: 0, y: 0, z: 0},
      })
    },
    onUpdate: ({processCpuResult}) => {
      const {reality} = processCpuResult
      if (!reality || !reality.intrinsics) {
        return
      }
      const now = Date.now()
      const {model, view, projection} = scene_.mvp
      mat4.rotate(model, model, (now - then_) * 1e-3, [0, 1, 0])  // axis to rotate around (Y)
      then_ = now

      const {rotation: r, position: p, intrinsics} = reality
      mat4.copy(projection, intrinsics)
      mat4.fromRotationTranslation(view, [r.x, r.y, r.z, r.w], [p.x, p.y, p.z])
      mat4.invert(view, view)
    },
    onRender: () => {
      drawScene(gl_, scene_, false)
    },
  }
}

const onxrloaded = (canvas) => {
  XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
    XR8.XrController.pipelineModule(),           // Enables SLAM tracking.
    XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
    XRExtras.Stats.pipelineModule(),             // Shows timing info.
    // Custom pipeline modules.
    webGlSceneModule(),  // Sets up the webgl scene content.
  ])

  XR8.run({canvas, webgl2: true, verbose: true})
}

const runXr8 = canvas => (window.XR8
  ? onxrloaded(canvas)
  : window.addEventListener('xrloaded', () => onxrloaded(canvas)))

export {
  runXr8,
}
