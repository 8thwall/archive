import {logLifecyclePipelineModule} from '../modules/log-lifecycle'
import {startScene} from '../modules/cube-babylonjs'

declare const React: any
declare const XR8: any
declare const XRExtras: any

function CubeBabylonjsView() {
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

    // Cleanup
    return () => {
      const canvas = document.getElementById('camerafeed')
      canvas.parentNode.removeChild(canvas)
    }
  }, [])

  React.useEffect(() => {
    // Disable default image targets.
    XR8.XrController.configure({imageTargets: [], scale, enableVps})
    // Open the camera and start running the camera run loop.
    const stopScene = startScene(document.getElementById('camerafeed'))

    return () => {
      stopScene()
    }
  }, [scale, enableVps])

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
        <div>
          <button onClick={toggleScale} >
            Toggle Scale <br /> current: "{scale}"
          </button>
          <button onClick={toggleVps} >
            Toggle enableVps <br /> current: "{enableVps ? 'true' : 'false'}"
          </button>
        </div>
      </div>
    </React.Fragment>
  )
}

export {CubeBabylonjsView}
