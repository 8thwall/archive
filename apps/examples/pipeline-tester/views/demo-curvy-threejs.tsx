import {logLifecyclePipelineModule} from '../modules/log-lifecycle'
import {curvyThreejsModule} from '../modules/demo-curvy-threejs'
import {trackingStatusModule} from '../modules/tracking-status'

declare const React: any
declare const XR8: any
declare const XRExtras: any

function DemoCurvyThreejsView() {
  const [scale, setScale] = React.useState('responsive')
  const [disableWorldTracking, setDisableWorldTracking] = React.useState(false)

  const toggleScale = () => {
    const newScale = scale === 'responsive' ? 'absolute' : 'responsive'
    setScale(newScale)
  }

  const toggleWorldTracking = () => {
    setDisableWorldTracking(!disableWorldTracking)
  }

  React.useEffect(() => {
    XR8.stop()
    const targets = require('../targets.json')
    const imageTargets = []

    // We can only have 5 image targets if we are using world tracking for performance reasons.
    if (!disableWorldTracking) {
      // eslint-disable-next-line
      console.warn(`[pipeline-tester] Only providing 5 out of ${targets.length} since ` +
      'disableWorldTracking is false')
    }
    for (let i = 0; i < (disableWorldTracking ? targets.length : 5); i++) {
      imageTargets.push(targets[i].name)
    }

    // eslint-disable-next-line
    console.log('[demo-curvy-threejs] imageTargets', imageTargets)

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
      curvyThreejsModule(),
      trackingStatusModule(),
    ])

    document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')

    XR8.XrController.configure({
      allowedDevices: XR8.XrConfig.device().ANY,
      disableWorldTracking,
      imageTargets,
      scale,
    })
    XR8.run({
      canvas: document.getElementById('camerafeed'),
      verbose: true,
      // cameraConfig: {direction: XR8.XrConfig.camera().ANY},
      allowedDevices: XR8.XrConfig.device().ANY,
      disableWorldTracking: true,
    })

    // Cleanup
    return () => {
      const canvas = document.getElementById('camerafeed')
      canvas.parentNode.removeChild(canvas)
      XR8.stop()
      XR8.clearCameraPipelineModules()
    }
  }, [scale, disableWorldTracking])

  return (
    <div className="hud top-right">
      <div>
        <button onClick={toggleScale} >
          Toggle Scale <br /> current: "{scale}"
        </button>
      </div>
      <div>
        <button onClick={toggleWorldTracking} >
          Disable World Tracking <br /> current: "{disableWorldTracking ? 'true' : 'false'}"
        </button>
      </div>
    </div>
  )
}

export {DemoCurvyThreejsView}
