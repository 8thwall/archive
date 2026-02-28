import {cubeThreejsPipelineModule} from './cube-threejs'
import {FloatingBackButton} from '../../../lib/material-ui-components'

declare let React: any
declare let ReactRouterDOM: any
declare let XR8: any
declare let window: any
declare let XRExtras: any
declare let LandingPage: any

const {withRouter} = ReactRouterDOM

const onxrloaded = () => {
  XR8.XrController.configure({imageTargets: []})  // Disable default image targets.

  LandingPage.configure({
    mediaSrc: 'https://media.giphy.com/media/UIQc7mECaH5nw0Y03Y/giphy.mp4',
  })

  XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
    XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene.
    XR8.XrController.pipelineModule(),           // Enables SLAM tracking.
    LandingPage.pipelineModule(),                // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
    // Custom pipeline modules.
    cubeThreejsPipelineModule(),
  ])

  document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')
  XR8.run({canvas: document.getElementById('camerafeed'), verbose: true})

  // Cleanup
  return () => {
    const canvas = document.getElementById('camerafeed')
    canvas.parentNode.removeChild(canvas)
    XR8.stop()
    XR8.clearCameraPipelineModules()
  }
}

const GettingStartedThreejs = withRouter(() => {
  React.useEffect(() => {
    window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
  }, [])

  return (
    <React.Fragment>
      <FloatingBackButton />
    </React.Fragment>
  )
})

export {GettingStartedThreejs}
