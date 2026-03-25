import {logLifecyclePipelineModule} from '../modules/log-lifecycle'
import {tapplacePipelineModule} from '../modules/tapplace-threejs'

declare const React: any
declare const XR8: any
declare const XRExtras: any

function TapPlaceThreejsView() {
  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.

    XR8.addCameraPipelineModules([  // Add camera pipeline modules.
      // Existing pipeline modules.
      XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
      XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene.
      XR8.XrController.pipelineModule(),           // Enables SLAM tracking.
      XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
      XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
      XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
      XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
      // Custom pipeline modules.
      logLifecyclePipelineModule(),
      tapplacePipelineModule(),
    ])

    document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')
    XR8.run({canvas: document.getElementById('camerafeed'), verbose: true, allowedDevices: 'any'})

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

export {TapPlaceThreejsView}
