import {logLifecyclePipelineModule} from '../modules/log-lifecycle'
import {flyerThreejsModule} from '../modules/demo-flyer-threejs'

declare const React: any
declare const XR8: any
declare const XRExtras: any

function DemoFlyerThreejsView() {
  const [useBackCamera, setUseBackCamera] = React.useState(true)
  const [disableWorldTracking, setDisableWorldTracking] = React.useState(true)

  React.useEffect(() => {
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
      flyerThreejsModule(),
    ])

    XR8.XrController.configure(
      {
        // You can only use back tracking on the back camera.
        disableWorldTracking: disableWorldTracking || !useBackCamera,
        // We only mirror the display on the front camera.
        mirroredDisplay: !useBackCamera,
      }
    )

    document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')
    XR8.run({
      canvas: document.getElementById('camerafeed'),
      verbose: true,
      cameraConfig: {direction: useBackCamera ? 'back' : 'front'},
      allowedDevices: XR8.XrConfig.device().ANY,
    })

    // Cleanup
    return () => {
      const canvas = document.getElementById('camerafeed')
      canvas.parentNode.removeChild(canvas)
      XR8.stop()
      XR8.clearCameraPipelineModules()
    }
  }, [useBackCamera, disableWorldTracking])

  const swapCamera = () => {
    setUseBackCamera(!useBackCamera)
  }

  const toggleDisableWorldTracking = () => {
    setDisableWorldTracking(!disableWorldTracking)
  }

  return (
    <React.Fragment>
      {useBackCamera &&
        <button
            onClick={toggleDisableWorldTracking}
            style={{
              position: 'absolute',
              zIndex: 5000,
              top: '0px',
              right: '0px',
              padding: '1em',
              margin: '1em',
            }}
          >
          World Tracking: {disableWorldTracking ? 'false' : 'true'}
        </button>
      }
      <button
          onClick={swapCamera}
          style={{
            position: 'absolute',
            zIndex: 5000,
            bottom: '5em',
            right: '0px',
            padding: '1em',
            margin: '1em',
          }}
        >
        Swap Camera
      </button>
    </React.Fragment>
  )
}

export {DemoFlyerThreejsView}
