import {logLifecyclePipelineModule} from '../modules/log-lifecycle'
import {startScene} from '../modules/tapplace-babylonjs'

declare const React: any
declare const XR8: any
declare const XRExtras: any

function TapPlaceBabylonjsView() {
  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.

    XR8.addCameraPipelineModules([  // Add camera pipeline modules.
      // Existing pipeline modules.
      XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
      XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
      XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
      XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
      // Custom pipeline modules.
      logLifecyclePipelineModule(),
    ])

    document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')
    // Open the camera and start running the camera run loop.
    const stopScene = startScene(document.getElementById('camerafeed'))

    // Cleanup
    return () => {
      const canvas = document.getElementById('camerafeed')
      canvas.parentNode.removeChild(canvas)
      stopScene()
    }
  }, [])

  return (
    <></>
  )
}

export {TapPlaceBabylonjsView}
