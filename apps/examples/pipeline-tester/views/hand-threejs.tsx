declare const React: any
declare const XR8: any
declare const XRExtras: any
declare const HandCoachingOverlay: any
import {handScenePipelineModule} from '../modules/hand-scene'

function HandTrackingThreejsView() {
  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.

    XR8.HandController.configure({
      coordinates: {mirroredDisplay: false},
      enableWrists: true,
      useHandArray: true,
      // debug: {extraOutput: {renderedImg : true}, onlyDetectHands: false},
    })

    XR8.addCameraPipelineModules([  // Add camera pipeline modules.
      // Existing pipeline modules.
      XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
      XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene.
      XR8.HandController.pipelineModule(),
      XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
      XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
      XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
      XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
      XRExtras.PauseOnHidden.pipelineModule(),     // Shows an error image on runtime error.
      // Custom pipeline modules.
      handScenePipelineModule(),
      HandCoachingOverlay.pipelineModule(),
    ])
    document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')

    XR8.run({
      canvas: document.getElementById('camerafeed'),
      verbose: true,
      webgl2: true,
      // allowedDevices: 'mobile',
      glContextConfig: {
        alpha: false,
        desynchronized: false,
        powerPreference: 'high-performance',
      },
      allowedDevices: 'any',
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
    <React.Fragment>
      <div
        style={{
          position: 'absolute',
          zIndex: 5000,
          top: '0px',
          right: '0px',
        }}
      >
      </div>
    </React.Fragment>
  )
}

export {HandTrackingThreejsView}
