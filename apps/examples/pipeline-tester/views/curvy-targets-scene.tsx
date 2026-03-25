import {logLifecyclePipelineModule} from '../modules/log-lifecycle'
import {curvyTargetsSceneModule} from '../modules/curvy-targets-scene'

declare const React: any
declare const XR8: any
declare const XRExtras: any

function CurvyTargetsSceneView() {
  React.useEffect(() => {
    XR8.addCameraPipelineModules([                 // Add camera pipeline modules.
      XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
      XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
      curvyTargetsSceneModule(),                   // Render curvy targets.
    ])

    document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')
    XR8.run({
      canvas: document.getElementById('camerafeed'),
      verbose: true,
      cameraConfig: {direction: XR8.XrConfig.camera().FRONT},
      allowedDevices: XR8.XrConfig.device().ANY,
    })

    // Cleanup
    return () => {
      const canvas = document.getElementById('camerafeed')
      canvas.parentNode.removeChild(canvas)
      XR8.stop()
      XR8.clearCameraPipelineModules()
    }
  }, [])

  return (
    <></>
  )
}

export {CurvyTargetsSceneView}
