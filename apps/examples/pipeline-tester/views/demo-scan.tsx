import '../style/demo-scan.scss'
import {logLifecyclePipelineModule} from '../modules/log-lifecycle'
import {qrprocessPipelineModule, qrdisplayPipelineModule} from '../modules/demo-scan'

declare let React: any
declare let XR8: any
declare let XRExtras: any

function DemoScanView() {
  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.

    XR8.addCameraPipelineModules([  // Add camera pipeline modules.
      // Existing pipeline modules.
      XR8.CameraPixelArray.pipelineModule({luminance: true, maxDimension: 640}),  // Provides pixels.
      XR8.GlTextureRenderer.pipelineModule(),                                     // Draws the camera feed.
      XRExtras.AlmostThere.pipelineModule(),                                      // Detects unsupported browsers and gives hints.
      XRExtras.FullWindowCanvas.pipelineModule(),                                 // Modifies the canvas to fill the window.
      XRExtras.Loading.pipelineModule(),                                          // Manages the loading screen on startup.
      XRExtras.RuntimeError.pipelineModule(),                                     // Shows an error image on runtime error.
      // Custom pipeline modules.
      logLifecyclePipelineModule(),
      qrprocessPipelineModule(),  // Scans the image for QR Codes
      qrdisplayPipelineModule(),  // Displays the result of QR Code scanning.
    ])

    document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')
    XR8.run({canvas: document.getElementById('camerafeed'), verbose: true, allowedDevices: 'mobile'})

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
      <canvas id='overlay2d'></canvas>
      <div className='cardplace'>
        <div className='card' id='url'></div>
      </div>
    </React.Fragment>
  )
}

export {DemoScanView}
