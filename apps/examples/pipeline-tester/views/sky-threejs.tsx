import '../style/vps-threejs.scss'
import {userConfiguredAudioOutput} from '../modules/media-audio'
import {logLifecyclePipelineModule} from '../modules/log-lifecycle'

declare const React: any
declare const XR8: any
declare const XRExtras: any
declare const SkyCoachingOverlay: any
declare const THREE: any
declare const window: any

const skyBasicScenePipelineModule = () => {
  let onPercentageCb_ = null
  let onSkySceneConfiguredCb_ = null

  // debug output related
  let debugSkyCanvasCtx_ = null

  const GREEN = '#8fce00'
  const PURPLE = '#AD50FF'

  const addCube = (scene, x, y, z, color) => {
    const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3)
    let material = null
    if (color) {
      const texture =
        new THREE.TextureLoader().load('https://cdn.8thwall.com/web/assets/cube-texture.png')
      material = new THREE.MeshBasicMaterial({map: texture, color})
    } else {
      material = new THREE.MeshNormalMaterial()
    }
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(x, y, z)
    scene.add(cube)
    return cube
  }

  const addSkyDome = (scene) => {
    // Creates a sky dome to use as a skybox.
    const skyGeo = new THREE.SphereGeometry(1000, 25, 25)

    // Add a material to the skydome.
    const skyMaterial = new THREE.MeshPhongMaterial({color: PURPLE})

    const skyDome = new THREE.Mesh(skyGeo, skyMaterial)
    skyDome.material.side = THREE.BackSide
    scene.add(skyDome)

    return skyDome
  }

  const initScene = (scene) => {
    // Add directional light to the scene.
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 10, 7)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Add soft white light to the scene.
    scene.add(new THREE.AmbientLight(0xffffff, 5))
  }

  return {
    // Pipeline modules need a name. It can be whatever you want but must be unique within your app.
    name: 'sky-threejs',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart: () => {
      const {scene, layerScenes, camera} = XR8.Threejs.xrScene()

      // Initialize lighting and a sky texture.
      initScene(layerScenes.sky.scene)
      initScene(scene)

      const skyDome = addSkyDome(layerScenes.sky.scene)

      // Add a cube to the sky.
      addCube(layerScenes.sky.scene, 0.1, 0, -2, GREEN)
      const nonSkyCube = addCube(scene, -0.1, 0, -2, PURPLE)

      // Add a camera-locked cube to the sky.
      if (layerScenes.sky.camera) {
        addCube(layerScenes.sky.camera, 0.1, -0.1, -4, GREEN)
      }
      const nonSkyCameraLockedCube = addCube(camera, -0.1, -0.1, -4, PURPLE)

      if (onSkySceneConfiguredCb_) {
        onSkySceneConfiguredCb_(nonSkyCube, nonSkyCameraLockedCube, skyDome)
      }

      // Set the initial camera position
      camera.position.set(0, 3, 0)

      XR8.LayersController.configure({
        coordinates: {
          origin: {
            position: camera.position,
            rotation: camera.quaternion,
          },
        },
        debug: {
          inputMask: true,
        },
      })
      XR8.XrController.updateCameraProjectionMatrix({
        origin: camera.position,
        facing: camera.quaternion,
      })
    },
    onPercentage: (cb) => {
      onPercentageCb_ = cb
    },
    onSkySceneConfigured: (cb) => {
      onSkySceneConfiguredCb_ = cb
    },
    onUpdate: ({processCpuResult}) => {
      const {layerscontroller} = processCpuResult
      if (!layerscontroller?.layers?.sky) {
        return
      }
      if (onPercentageCb_) {
        onPercentageCb_(layerscontroller.layers.sky.percentage)
      }
      if (layerscontroller.layers.sky.debug?.inputMaskImg) {
        // Update semantics image
        const img = layerscontroller.layers.sky.debug.inputMaskImg
        const dataArr = new Uint8ClampedArray(img.pixels, 0)
        const imageData = new ImageData(dataArr, img.cols, img.rows)

        // initialize 2d canvas context once
        if (!debugSkyCanvasCtx_) {
          debugSkyCanvasCtx_ = (document.getElementById('debugSkyMask') as HTMLCanvasElement)?.getContext('2d')
        }
        debugSkyCanvasCtx_?.putImageData(imageData, 0, 0)
      }
    },
  }
}

function SkyThreejsView() {
  const [percentage, setPercentage] = React.useState(0)
  const [nonSkyCube, setNonSkyCube] = React.useState(null)
  const [nonSkyCameraLockedCube, setNonSkyCameraLockedCube] = React.useState(null)
  const [skyDome, setSkyDome] = React.useState(null)

  // User configuration
  const [autoShowHide, setAutoShowHide] = React.useState(true)
  const [invertLayerMask, setInvertLayerMask] = React.useState(false)
  const [edgeSmoothness, setEdgeSmoothness] = React.useState(0.5)
  const [slamEnabled, setSlamEnabled] = React.useState(false)
  const [encoding, setEncoding] = React.useState(THREE.LinearSRGBColorSpace)
  const [skyDomeVisible, setSkyDomeVisible] = React.useState(true)
  const [nonSkyCubeVisible, setNonSkyCubeVisible] = React.useState(true)

  const skyModule = skyBasicScenePipelineModule()
  skyModule.onPercentage((p) => {
    setPercentage(p)
  })
  skyModule.onSkySceneConfigured((_nonSkyCube, _nonSkyCameraLockedCube, _skyDome) => {
    setNonSkyCube(_nonSkyCube)
    setNonSkyCameraLockedCube(_nonSkyCameraLockedCube)
    _nonSkyCube.visible = nonSkyCubeVisible
    _nonSkyCameraLockedCube.visible = nonSkyCubeVisible
    setSkyDome(_skyDome)
  })

  React.useEffect(() => {
    // Sky via Layers controller
    XR8.LayersController.configure({layers: {sky: {invertLayerMask, edgeSmoothness}}})
    XR8.Threejs.configure({layerScenes: ['sky']})

    // Media Recorder
    XRExtras.MediaRecorder.initRecordButton()  // Adds record button
    XRExtras.MediaRecorder.initMediaPreview()  // Adds media preview and share

    XRExtras.MediaRecorder.configure({
      watermarkImageUrl: require('../assets/logos/8logo.png'),  // Adds watermark to photo/video
      watermarkMaxWidth: 100,
      watermarkMaxHeight: 10,
    })

    const threejsAudioContext = THREE.AudioContext.getContext()

    XR8.MediaRecorder.configure({
      configureAudioOutput: userConfiguredAudioOutput,
      audioContext: threejsAudioContext,
      requestMic: XR8.MediaRecorder.RequestMicOptions.MANUAL,
    })

    XR8.addCameraPipelineModules([                 // Add camera pipeline modules.
      XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
      XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene and a Sky scene.
      XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
      XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
      XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
      window.LandingPage.pipelineModule(),         // Detects unsupported browsers and gives hints.

      // Logs events.
      logLifecyclePipelineModule(),

      // Enables Semantic Segmentation.
      XR8.LayersController.pipelineModule(),

      // Coaching overlay pipeline module
      SkyCoachingOverlay.pipelineModule(),

      // NOTE(paris): XrController and skyModule are dynamically added below.
    ])

    // Add a canvas to the document for our xr scene.
    document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')

    // Cleanup
    return () => {
      XR8.stop()
      XR8.clearCameraPipelineModules()
      XRExtras.MediaRecorder.removeRecordButton()

      const canvas = document.getElementById('camerafeed')
      canvas.parentNode.removeChild(canvas)
    }
  }, [])

  React.useEffect(() => {
    XR8.stop()

    XR8.removeCameraPipelineModule('sky-threejs')
    XR8.removeCameraPipelineModule('reality')

    // Either add or remove XrController.
    if (slamEnabled) {
      XR8.addCameraPipelineModule(XR8.XrController.pipelineModule())
    }
    XR8.addCameraPipelineModule(skyModule)

    // Open the camera and start running the camera run loop.
    XR8.run({
      canvas: document.getElementById('camerafeed'),
      verbose: true,
      allowedDevices: XR8.XrConfig.device().ANY,
    })
  }, [slamEnabled])

  React.useEffect(() => {
    XR8.LayersController.configure({layers: {sky: {invertLayerMask, edgeSmoothness}}})
  }, [invertLayerMask, edgeSmoothness])

  React.useEffect(() => {
    if (skyDome) {
      skyDome.visible = skyDomeVisible
    }
  }, [skyDomeVisible])

  React.useEffect(() => {
    if (nonSkyCube && nonSkyCameraLockedCube) {
      nonSkyCube.visible = nonSkyCubeVisible
      nonSkyCameraLockedCube.visible = nonSkyCubeVisible
    }
  }, [nonSkyCubeVisible])

  return (
    <>
      <div className='hud top-right'>
        <div className='segment'>
          Turn off Auto when perform manual control
        </div>
        <div className='segment'>
          <button onClick={() => {
            SkyCoachingOverlay.control.show()
          }}>Show Overlay</button>
        </div>
        <div className='segment'>
          <button onClick={() => {
            SkyCoachingOverlay.control.hide()
          }}>Hide Overlay</button>
        </div>
        <div className='segment'>
          <button onClick={() => {
            SkyCoachingOverlay.control.cleanup()
          }}>Clean Up</button>
        </div>
        <div className='segment'>
          <button onClick={() => {
            SkyCoachingOverlay.control.setAutoShowHide(!autoShowHide)
            setAutoShowHide(!autoShowHide)
          }}>
            Toggle Auto. Currently {autoShowHide ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
      <div className='hud top-left'>
        <div className='segment'>
          Percentage <span id='sky-percentage'>{percentage?.toFixed(2)}</span>
        </div>
        <div className='segment'>
          <button onClick={() => {
            setInvertLayerMask(!invertLayerMask)
          }}>Invert Layer Mask: {invertLayerMask ? 'TRUE' : 'FALSE'}</button>
        </div>
        <div className='segment'>
          <button onClick={() => {
            setSlamEnabled(!slamEnabled)
          }}>
            Toggle SLAM. Currently {slamEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className='segment'>
          edgeSmoothness: {edgeSmoothness}
          <input type='range' value={edgeSmoothness} min='0.0' max='1.0' step='0.05' onChange={e => setEdgeSmoothness(parseFloat(e.target.value))}>
          </input>
        </div>
        <div className='segment'>
          <button onClick={() => {
            setNonSkyCubeVisible(!nonSkyCubeVisible)
          }}>Non-sky cube is {nonSkyCubeVisible ? 'showing' : 'hidden'}</button>
        </div>
        <div className='segment'>
          <button onClick={() => {
            setSkyDomeVisible(!skyDomeVisible)
          }}>Sky dome is {skyDomeVisible ? 'showing' : 'hidden'}</button>
        </div>
        <div className='segment'>
          <button onClick={() => {
            const {renderer} = XR8.Threejs.xrScene()
            if (renderer) {
              renderer.outputColorSpace = renderer.outputColorSpace === THREE.SRGBColorSpace ? THREE.LinearSRGBColorSpace : THREE.SRGBColorSpace
              setEncoding(renderer.outputColorSpace)
            }
          }}>Encoding {encoding === THREE.SRGBColorSpace ? 'sRGB' : 'linear'}</button>
        </div>
        <div className='segment'>
          <canvas id='debugSkyMask' height='256' width='144'></canvas>
        </div>
      </div>
    </>
  )
}

export {SkyThreejsView}
