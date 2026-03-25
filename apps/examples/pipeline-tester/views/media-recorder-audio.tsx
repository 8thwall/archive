import {logLifecyclePipelineModule} from '../modules/log-lifecycle'
import {audioConfigPipeline, userConfiguredAudioOutput} from '../modules/media-audio'

declare const React: any
declare const THREE: any
declare const XR8: any
declare const XRExtras: any

function MediaRecorderAudioTestsView() {
  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.

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

    XR8.addCameraPipelineModules([  // Add camera pipeline modules.
      // Existing pipeline modules.
      XR8.GlTextureRenderer.pipelineModule(),  // Draws the camera feed.
      XR8.Threejs.pipelineModule(),  // Syncs threejs renderer to camera properties.
      // XR8.FaceController.pipelineModule(), // Loads 8th Wall Face Engine
      XR8.CanvasScreenshot.pipelineModule(),  // Required for photo capture
      XRExtras.AlmostThere.pipelineModule(),  // Detects unsupported browsers and gives hints.
      XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
      XRExtras.Loading.pipelineModule(),  // Manages the loading screen on startup.
      XRExtras.RuntimeError.pipelineModule(),  // Shows an error image on runtime error.
      XRExtras.PauseOnBlur.pipelineModule(),
      // Custom pipeline modules
      // faceScenePipelineModule(),
      // Custom pipeline modules.
      logLifecyclePipelineModule(),
      audioConfigPipeline(),
    ])

    document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')
    XR8.run({
      canvas: document.getElementById('camerafeed'),
      cameraConfig: {direction: XR8.XrConfig.camera().FRONT},
      allowedDevices: XR8.XrConfig.device().ANY,
      verbose: true,
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
    <></>
  )
}

export {MediaRecorderAudioTestsView}
