import {logLifecyclePipelineModule} from '../modules/log-lifecycle'
import {trackingStatusModule} from '../modules/tracking-status'
import {webGlSceneModule} from '../modules/cube-webgl'
import {tapplaceTrueScale} from '../modules/tapplace-truescale'

declare const React: any
declare const XR8: any
declare const XRExtras: any
declare const CoachingOverlay: any

const HEIGHTS = [1.0, 2.0, 5.0, 25.0]
const XZ_OFFSETS = [{x: 0.0, z: 0.0}, {x: -1.0, z: 1.0}, {x: 1.0, z: -1.0}]
const FACING = {
  'forward': {w: 1.0, x: 0.0, y: 0.0, z: 0.0},
  '45° right': {w: 0.923880, x: 0.0, y: -0.382683, z: 0.0},
  '45° left': {w: 0.923880, x: 0.0, y: 0.382683, z: 0.0},
}

const MODELS = ['8.5\'\' x 11\'\' paper', 'Height Ruler', 'Tennis Ball']

function EstimateScaleView() {
  // NOTE(paris): tapplaceTrueScale_ is broken when you switch between scales, so just disabling.
  const [scale, setScale] = React.useState('absolute')
  const [height, setHeight] = React.useState(HEIGHTS[0])
  const [offsetIdx, setOffsetIdx] = React.useState(0)
  const [orientation, setOrientation] = React.useState('forward')

  let tapplaceTrueScale_ = null

  const start = () => {
    const canvas = document.getElementById('camerafeed')

    XR8.run({
      canvas,
      verbose: true,
      allowedDevices: 'any',
      cameraConfig: {direction: 'back'},
    })
  }

  React.useEffect(() => {
    tapplaceTrueScale_ = tapplaceTrueScale()

    XR8.addCameraPipelineModules([  // Add camera pipeline modules.
      // Existing pipeline modules.
      XR8.GlTextureRenderer.pipelineModule(),  // Draws the camera feed.
      XR8.CameraPixelArray.pipelineModule({luminance: true}),
      XR8.XrController.pipelineModule(),
      XR8.CanvasScreenshot.pipelineModule(),
      XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
      XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window
      XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
      XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
      XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene.
      logLifecyclePipelineModule(),                // Logs the lifecycle
      trackingStatusModule(),                      // Shows the tracking status.
      tapplaceTrueScale_,                          // Allows you to add various true scale models.
      CoachingOverlay.pipelineModule(),
    ])

    if (!document.getElementById('camerafeed')) {
      document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')
    }

    start()

    const canvas = document.getElementById('camerafeed')
    // Cleanup
    return () => {
      canvas.parentNode.removeChild(canvas)
      XR8.stop()
      XR8.clearCameraPipelineModules()
    }
  }, [])

  const toggleScale = () => {
    const newScale = scale === 'responsive' ? 'absolute' : 'responsive'
    setScale(newScale)
  }

  // Whenever the scale changes, stop the engine, set the new configuration, and then start the
  // engine.
  React.useEffect(() => {
    XR8.stop()
    XR8.XrController.configure({scale})
    XR8.XrController.updateCameraProjectionMatrix({origin})
    XR8.XrController.recenter()
    start()
  },
  [scale])

  // Whenever x, y, or z offset changes, update the camera projection matrix and call recenter.
  React.useEffect(() => {
    const {x, z} = XZ_OFFSETS[offsetIdx]
    const origin = {x, y: height, z}
    const facing = FACING[orientation]
    XR8.XrController.updateCameraProjectionMatrix({origin, facing})
    XR8.XrController.recenter()
  },
  [offsetIdx, height, orientation])

  const toggleCameraHeight = () => {
    // Select the following height in the list.
    const newHeight = HEIGHTS[(HEIGHTS.indexOf(height) + 1) % HEIGHTS.length]
    setHeight(newHeight)
  }

  const setXZOffset = (event) => {
    setOffsetIdx(event.target.value)
  }

  const setModel = (event) => {
    tapplaceTrueScale_.selectModel(event.target.value)
  }

  const layoutXZOffsets = () => {
    const radioButtons = XZ_OFFSETS.map((xzOffset, index) => (
      <div key={index}>
        <input type='radio' value={index} name='xzoffset' />
        <span>x: {xzOffset.x}, z: {xzOffset.z}</span>
      </div>
    ))

    return (
      <div onChange={setXZOffset}>
        {radioButtons}
      </div>
    )
  }

  const layoutModels = () => {
    const radioButtons = MODELS.map((modelName, index) => (
      <div key={index}>
        <input type='radio' value={index} name='modelSelection' />
        <span>{modelName}</span>
      </div>
    ))

    return (
      <div onChange={setModel}>
        {radioButtons}
      </div>
    )
  }

  const setStartingDirection = (event) => {
    setOrientation(event.target.value)
  }

  const layoutStartingDirection = () => {
    const radioButtons = Object.keys(FACING).map((key, index) => (
      <div key={index}>
        <input type='radio' value={key} name='direction' />
        <span>{key}</span>
      </div>
    ))

    return (
      <div onChange={setStartingDirection}>
        {radioButtons}
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className='hud top-right'
        style={{
          color: 'black',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      >
        {/*
        <div>
           <button onClick={toggleScale} >
             Toggle Scale <br /> current: "{scale}"
           </button>
         </div>
        */}
        
        <div>
          <button onClick={() => {
            XR8.XrController.recenter()
          }} >
            Recenter
          </button>
        </div>

        <div>
          <button onClick={toggleCameraHeight}>
            Toggle Cam Height <br /> current: "{height}"
          </button>
        </div>

        <div>
          True scale model:
          {layoutModels()}
        </div>

        <div>
          XZ offset:
          {layoutXZOffsets()}
        </div>

        <div>
          Starting direction:
          {layoutStartingDirection()}
        </div>
      </div>
    </React.Fragment>
  )
}

export {EstimateScaleView}
