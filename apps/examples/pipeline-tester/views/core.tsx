/* eslint-disable no-console */
import {logLifecyclePipelineModule} from '../modules/log-lifecycle'

declare const React: any
declare const XR8: any
declare const XRExtras: any

function CoreView() {
  const [running, setRunning] = React.useState(true)
  const [resumed, setResumed] = React.useState(true)
  const [useBackCamera, setUseBackCamera] = React.useState(true)
  const [moduleAdded, setModuleAdded] = React.useState(true)

  React.useEffect(() => {
    XR8.addCameraPipelineModules([  // Add camera pipeline modules.
      // Existing pipeline modules.
      XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
      XR8.CameraPixelArray.pipelineModule({luminance: true}),
      XR8.CanvasScreenshot.pipelineModule(),
      XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
      XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window
      XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
      XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
      // Custom pipeline modules.
      logLifecyclePipelineModule(),
    ])

    if (!document.getElementById('camerafeed')) {
      document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')
    }
    const canvas = document.getElementById('camerafeed')

    XR8.run({
      canvas,
      verbose: true,
      allowedDevices: 'any',
      cameraConfig: {direction: useBackCamera ? 'back' : 'front'},
    })

    // Cleanup
    return () => {
      canvas.parentNode.removeChild(canvas)
      XR8.stop()
      XR8.clearCameraPipelineModules()
    }
  }, [useBackCamera])

  const doRunStop = () => {
    if (!running) {
      setRunning(true)
      XR8.run({canvas: document.getElementById('camerafeed'), verbose: true, allowedDevices: 'any'})
    } else {
      setRunning(false)
      XR8.stop()
    }
  }

  const doResumePause = () => {
    if (!resumed) {
      setResumed(true)
      XR8.resume()
    } else {
      setResumed(false)
      XR8.pause()
    }
  }

  const swapCamera = () => {
    setUseBackCamera(!useBackCamera)
  }

  const doAddRemove = () => {
    if (!moduleAdded) {
      setModuleAdded(true)
      XR8.addCameraPipelineModules([
        logLifecyclePipelineModule(),
        XR8.CameraPixelArray.pipelineModule({luminance: true}),
        XR8.CanvasScreenshot.pipelineModule(),
        XR8.FullWindowCanvas.pipelineModule(),
      ])
    } else {
      setModuleAdded(false)
      if (XR8.removeCameraPipelineModule) {
        XR8.removeCameraPipelineModule('loglifecycle')
        XR8.removeCameraPipelineModule('camerapixelarray')
        XR8.removeCameraPipelineModule('fullwindowcanvas')
        XR8.removeCameraPipelineModule('canvasscreenshot')
      }
    }
  }

  const doTakeScreenshot = () => {
    const statusText = document.getElementById('screenshot-status-text')
    XR8.CanvasScreenshot.takeScreenshot()
      .then((d) => {
        if (statusText) {
          statusText.innerHTML = 'Succesfully took screenshot.'
        }
      })
      .catch((e) => {
        if (statusText) {
          statusText.innerHTML = 'Screenshot error - check console.'
        }
        console.error('[core] Error with XR8.CanvasScreenshot.takeScreenshot()', e)
      })
      .finally(() => {
        setInterval(() => {
          if (statusText) {
            statusText.innerHTML = ''
          }
        },
        1000)
      })
  }

  return (
    <React.Fragment>
      <div style={{width: '100%', height: '100%', position: 'absolute'}}>
        <a href='https://www.wikipedia.com'
          style={{
            position: 'absolute',
            zIndex: 5000,
            top: '0px',
            left: '0px',
            padding: '0.2em',
            margin: '1em',
            backgroundColor: 'whitesmoke',
          }}
        >
          External site
        </a>
        <button
          onClick={doAddRemove}
          style={{
            position: 'absolute',
            zIndex: 5000,
            top: '0px',
            right: '0px',
            padding: '1em',
            margin: '1em',
          }}
        >
          Add / Remove
        </button>
        <button
          onClick={doTakeScreenshot}
          style={{
            position: 'absolute',
            zIndex: 5000,
            top: '5em',
            right: '0px',
            padding: '1em',
            margin: '1em',
          }}
        >
          Screenshot
        </button>
        <div
          id='screenshot-status-text'
          style={{
            position: 'absolute',
            zIndex: 5000,
            top: '5em',
            right: '0px',
            padding: '1em',
            margin: '1em',
            color: 'white',
          }}
        >
        </div>
        <button
          onClick={doRunStop}
          style={{
            position: 'absolute',
            zIndex: 5000,
            bottom: '0px',
            left: '0px',
            padding: '1em',
            margin: '1em',
          }}
        >
          Start / Stop
        </button>
        <button
          onClick={doResumePause}
          style={{
            position: 'absolute',
            zIndex: 5000,
            bottom: '0px',
            right: '0px',
            padding: '1em',
            margin: '1em',
          }}
        >
          Pause / Resume
        </button>
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
      </div>
    </React.Fragment>
  )
}

export {CoreView}
