import {logLifecyclePipelineModule} from '../modules/log-lifecycle'
import {webGlSceneModule} from '../modules/cube-webgl'
import {accelerationsModule} from '../modules/accelerations'
import {trackingStatusModule} from '../modules/tracking-status'

declare const React: any
declare const XR8: any
declare const XRExtras: any
declare const CoachingOverlay: any

function CubeWebGlView() {
  const [scale, setScale] = React.useState('responsive')

  const toggleScale = () => {
    const newScale = scale === 'responsive' ? 'absolute' : 'responsive'
    setScale(newScale)
  }

  const start = () => {
    XR8.run({
      canvas: document.getElementById('camerafeed'),
      verbose: true,
      webgl2: true,
      // allowedDevices: 'mobile',
      glContextConfig: {
        alpha: false,
        desynchronized: true,
        powerPreference: 'high-performance',
      },
    })
  }

  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: [], allowedDevices: 'ANY'})  // Disable default image targets.

    XR8.addCameraPipelineModules([  // Add camera pipeline modules.
      // Existing pipeline modules.
      XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
      XR8.XrController.pipelineModule(),           // Enables SLAM tracking.
      XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
      XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
      XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
      XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
      // Custom pipeline modules.
      logLifecyclePipelineModule(),
      webGlSceneModule(),
      accelerationsModule(),
      trackingStatusModule(),
      CoachingOverlay.pipelineModule(),
    ])

    document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')
    XR8.run({
      canvas: document.getElementById('camerafeed'),
      verbose: true,
      webgl2: true,
      glContextConfig: {
        alpha: false,
        desynchronized: false,
        powerPreference: 'high-performance',
      },
    })

    // Cleanup
    return () => {
      const canvas = document.getElementById('camerafeed')
      canvas.parentNode.removeChild(canvas)
      XR8.stop()
      XR8.clearCameraPipelineModules()
    }
  }, [])

  React.useEffect(() => {
    XR8.stop()
    XR8.XrController.configure({scale})
    start()
  }, [scale])

  return (
    <React.Fragment>
      <div className='hud top-right'>
        <div>
          <button onClick={toggleScale} >
            Toggle Scale <br /> current: "{scale}"
          </button>
        </div>
      </div>
    </React.Fragment>
  )
}

export {CubeWebGlView}
