declare const React: any
declare const XR8: any
declare const XRExtras: any
declare const window: any

import {faceScenePipelineModule} from '../modules/face-scene'

function FaceThreejsView() {
  const [meshGeometry, setMeshGeometry] = React.useState([])

  const start = () => {
    XR8.run({
      canvas: document.getElementById('camerafeed'),
      verbose: true,
      webgl2: true,
      cameraConfig: {direction: 'front'},
      glContextConfig: {
        alpha: false,
        desynchronized: false,
        powerPreference: 'high-performance',
      },
      allowedDevices: 'any',
    })
  }

  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.
    XR8.FaceController.configure({
      meshGeometry: ['face', 'eyes', 'mouth'],
      enableEars: true,
      debug: {
        extraOutput: {
          renderedImg: true,
          earRenderedImg: true,
          earDetections: true,
        },
      },
      coordinates: {mirroredDisplay: true},
    })
    XR8.addCameraPipelineModules([  // Add camera pipeline modules.
      // Existing pipeline modules.
      XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
      XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene.
      XR8.FaceController.pipelineModule(),
      XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
      XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
      XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
      XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
      XRExtras.PauseOnHidden.pipelineModule(),     // Shows an error image on runtime error.
      // Custom pipeline modules.
      faceScenePipelineModule(),
    ])
    document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')

    start()

    // Cleanup
    return () => {
      const canvas = document.getElementById('camerafeed')
      canvas.parentNode.removeChild(canvas)
      XR8.stop()
      XR8.clearCameraPipelineModules()
    }
  }, [])

  // React.useEffect(() => {
  //   XR8.stop()
  //   XR8.FaceController.configure({
  //     meshGeometry,
  //   })
  //   start()
  // }, [meshGeometry])

  const tapSetMeshGeometry = (event) => {
    console.log(`Checked ${event.target.checked} - name ${event.target.value}`)
    const names = [...meshGeometry]

    if (event.target.checked) {
      names.push(event.target.value)
    } else {
      const index = names.indexOf(event.target.value)
      names.splice(index, 1)
    }

    setMeshGeometry(names)
  }

  const layoutMeshGeometry = () => {
    const meshGeometries = ['face', 'mouth', 'eyes', 'iris'].map(meshGeo => (
      <div key={meshGeo}>
        <input type='checkbox' value={meshGeo} name='mesh-geometry' />
        <span>{meshGeo}</span>
      </div>
    ))

    return (
      <div onChange={tapSetMeshGeometry}>
        {meshGeometries}
      </div>
    )
  }

  return (
    <>
      <div className='hud camera-overlay'>
        <canvas id='debugEarOnCamera'></canvas>
      </div>
      <div className='hud top-left'>
        <canvas id='debugEar' width='336' height='320'></canvas>
        <canvas id='debugFace' height='384' width='384'></canvas>
      </div>
      <div className='hud top-right'>
        <h4>Gesture State</h4>
        <div>
          <label>Mouth</label>
          <span id='mouth-state'></span>
        </div>
        <div>
          <label>Left Eyebrow</label>
          <span id='left-eyebrow-state'></span>
        </div>
        <div>
          <label>Right Eyebrow</label>
          <span id='right-eyebrow-state'></span>
        </div>
        <div>
          <label>Left Eye</label>
          <span id='left-eye-state'></span>
        </div>
        <div>
          <label>Right Eye</label>
          <span id='right-eye-state'></span>
        </div>
        <div>
          <label>IPD</label>
          <span id='ipd'></span>
        </div>
        <div>
          <label>Left wink</label>
          <span id='left-eye-wink'></span>
        </div>
        <div>
          <label>Right wink</label>
          <span id='right-eye-wink'></span>
        </div>
        <div>
          <label>Blink</label>
          <span id='blinked'></span>
        </div>
        <div>
          <label>Left Ear</label>
          <span id='left-ear-state'></span>
        </div>
        <div>
          <label>Right Ear</label>
          <span id='right-ear-state'></span>
        </div>
        <div>
          <label>Left Lobe</label>
          <span id='leftLobe'></span>
        </div>
        <div>
          <label>Left Canal</label>
          <span id='leftCanal'></span>
        </div>
        <div>
          <label>Left Helix</label>
          <span id='leftHelix'></span>
        </div>
        <div>
          <label>Right Lobe</label>
          <span id='rightLobe'></span>
        </div>
        <div>
          <label>Right Canal</label>
          <span id='rightCanal'></span>
        </div>
        <div>
          <label>Right Helix</label>
          <span id='rightHelix'></span>
        </div>
        <button onClick={() => {
          window.leggo = true
        }}>
          🐴🐴 Activate 🐴🐴
        </button>
        <input type='checkbox' id='horseTexture' alight='right'></input>
      </div>
    </>
  )
}

export {FaceThreejsView}
