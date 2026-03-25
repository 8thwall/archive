import {logLifecyclePipelineModule} from '../modules/log-lifecycle'
import {trackingStatusModule} from '../modules/tracking-status'
import {worldPointsVisualizerPipelineModule} from '../modules/world-points-threejs'

declare const React: any
declare const XR8: any
declare const XRExtras: any

const ScanTargetView = () => {
  React.useEffect(() => {
    // XR8.XrController.configure({mapSrcUrl: 'https://cdn.8thwall.com/web/resources/map_318_cambridge-lj8vpash.map8'})  // Disable default image targets.
    // XR8.XrController.configure({mapSrcUrl: 'https://cdn.8thwall.com/web/resources/map_318_cambridge_june26-ljddyi6i.map8'})  // Disable default image targets.
    // XR8.XrController.configure({mapSrcUrl: 'https://cdn.8thwall.com/web/resources/entrance_map_june29-ljhof8by.map8'})  // Disable default image targets.
    // XR8.XrController.configure({mapSrcUrl: 'https://cdn.8thwall.com/web/resources/sfo-neighborhood-two-ljixrw6v.map8'})  // Disable default image targets.
    XR8.XrController.configure({mapSrcUrl: 'https://cdn.8thwall.com/web/resources/doty-cropped-lkso0mki.map8'})
    // XR8.XrController.configure({mapSrcUrl: 'https://cdn.8thwall.com/web/resources/ted-thompson-fall-lksppsl5.mp8'})
    
    // XR8.XrController.configure({mapSrcUrl: 'https://cdn.8thwall.com/web/resources/catan_histories_2-ljrfik9e.map8'})  // Disable default image targets.
    // XR8.XrController.configure({mapSrcUrl: 'https://cdn.8thwall.com/web/resources/catan_histories_far-ljromh1r.map8'})  // Disable default image targets.

    XR8.addCameraPipelineModules([  // Add camera pipeline modules.
      // Existing pipeline modules.
      XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
      XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene.
      XR8.XrController.pipelineModule(),           // Enables SLAM tracking.
      XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
      XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
      XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.›
      XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
      XRExtras.PauseOnHidden.pipelineModule(),     // Shows an error image on runtime error.
      // Custom pipeline modules.
      // logLifecyclePipelineModule(),
      worldPointsVisualizerPipelineModule(),
      trackingStatusModule(),
    ])
    document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')

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

    // Cleanup
    return () => {
      const canvas = document.getElementById('camerafeed')
      canvas.parentNode.removeChild(canvas)
      XR8.stop()
      XR8.clearCameraPipelineModules()
    }
  }, [])

  return (
    <div className='hud top-right'>
      <p>Scan Target Hud</p>
    </div>
  )
}

export {ScanTargetView}
