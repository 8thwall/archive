import {logLifecyclePipelineModule} from '../modules/log-lifecycle'
import {cubeThreejsPipelineModule} from '../modules/cube-threejs'
import {accelerationsModule} from '../modules/accelerations'
import {trackingStatusModule} from '../modules/tracking-status'
import {meshUpdateModule} from '../modules/mesh-update'
import {sleepModule} from '../modules/sleep'
import {intrinsicModule} from '../modules/intrinsic'

declare const React: any
declare const XR8: any
declare const XRExtras: any

const CubeThreejsView = () => {
  const [scale, setScale] = React.useState('absolute')
  const [enableVps, setEnableVps] = React.useState(true)

  const toggleScale = () => {
    const newScale = scale === 'responsive' ? 'absolute' : 'responsive'
    setScale(newScale)
  }

  const toggleVps = () => {
    setEnableVps(!enableVps)
  }

  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: [], scale, enableVps})  // Disable default image targets.
    XR8.addCameraPipelineModules([  // Add camera pipeline modules.
      // Existing pipeline modules.
      XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
      XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene.
      XR8.XrController.pipelineModule(),           // Enables SLAM tracking.
      XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
      XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
      XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
      XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
      XRExtras.PauseOnHidden.pipelineModule(),     // Shows an error image on runtime error.
      // Custom pipeline modules.
      logLifecyclePipelineModule(),
      cubeThreejsPipelineModule(),
      trackingStatusModule(),
      meshUpdateModule(),
      // sleepModule(),
      // accelerationsModule(),
      // Show that we can compute intrinsics based existing API
      intrinsicModule(),
    ])
    document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')

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
    XR8.XrController.configure({scale, enableVps})
    XR8.run({
      canvas: document.getElementById('camerafeed'),
      verbose: true,
      webgl2: true,
      // allowedDevices: 'mobile',
      allowedDevices: 'any',
      glContextConfig: {
        alpha: false,
        desynchronized: false,
        powerPreference: 'high-performance',
      },
    })
  }, [scale, enableVps])

  return (
    <div className='hud top-right'>
      <div>
        <label>Current scale</label>
        <button onClick={toggleScale}>{scale}</button>
      </div>
      <div>
        <label>Current VPS status</label>
        <button onClick={toggleVps}>{enableVps ? 'on' : 'off'}</button>
      </div>
    </div>
  )
}

export {CubeThreejsView}
