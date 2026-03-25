declare const React: any
declare const XR8: any
declare const XRExtras: any
declare const window: any

import {multiFaceScenePipelineModule} from '../modules/multiface-scene'

function MultiFaceThreejsView() {
  const start = () => {
    XR8.run({
      canvas: document.getElementById('camerafeed'),
      verbose: true,
      webgl2: true,
      cameraConfig: {direction: 'front'},
      glContextConfig: {
        alpha: false,
        desynchronized: true,
        powerPreference: 'high-performance',
      },
      allowedDevices: 'any',
    })
  }

  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.
    XR8.FaceController.configure({
      meshGeometry: ['face', 'eyes', 'mouth'],
      maxDetections: 3,
      coordinates: {mirroredDisplay: true},
    })
    XR8.addCameraPipelineModules([  // Add camera pipeline modules.
      // Existing pipeline modules.
      XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
      XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene.
      XR8.FaceController.pipelineModule(),
      XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
      XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
      XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
      XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
      XRExtras.PauseOnHidden.pipelineModule(),     // Shows an error image on runtime error.
      // Custom pipeline modules.
      multiFaceScenePipelineModule(),
    ])
    document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')

    start()

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
          backgroundColor: 'white',
        }}
      >
      </div>
    </React.Fragment>
  )
}

export {MultiFaceThreejsView}
