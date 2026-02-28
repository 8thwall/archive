// Copyright (c) 2020 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'
// This function is called by MediaRecorder whenever you call:
//     XR8.MediaRecorder.configure({configureAudioOutput: userConfiguredAudioOutput})
// This function allows you to add sounds and custom audio nodes to the audio graph.
const userConfiguredAudioOutput = ({microphoneInput, audioProcessor}) => {
  const audioContext = audioProcessor.context

  // Create a THREE.js listener.  This listener is created within the THREE.js audio context, which
  // is also the context the MediaRecorder is using since we passed the THREE.js audio context
  // into our MediaRecorder using:
  //   MediaRecorder.configure({audioContext: THREE.AudioContext.getContext()})
  const listener = new THREE.AudioListener()
  // This connects the THREE.js audio to the audioProcessor so that all sound effects initialized
  // with this listener are part of the recorded video's audio.
  listener.gain.connect(audioProcessor)
  // This connects the THREE.js audio to the hardware output, which is the audio context's
  // destination  That way, the user can also hear the sound effects initialized with this listener.
  listener.gain.connect(audioContext.destination)

  // create a global audio source in THREE.js and load a sound asset
  const soundEffect = new THREE.Audio(listener)
  const audioLoader = new THREE.AudioLoader()
  audioLoader.load(require('./assets/MagicalTransition.mp3'), (buffer) => {
    soundEffect.setBuffer(buffer)
    soundEffect.setVolume(0.1)
    soundEffect.setLoop(true)
    soundEffect.play()
  })

  // you must return a node at the end.  This node is connected to the audioProcessor automatically
  // inside MediaRecorder
  return microphoneInput
}

const onxrloaded = () => {
  XRExtras.MediaRecorder.initRecordButton()  // Adds record button
  XRExtras.MediaRecorder.initMediaPreview()  // Adds media preview and share

  XRExtras.MediaRecorder.configure({
    watermarkImageUrl: require('./assets/8logo.png'),  // Adds watermark to photo/video
    watermarkMaxWidth: 100,
    watermarkMaxHeight: 10,
  })

  XR8.MediaRecorder.configure({
    // This function is defined above.  It's how we specify what sounds will be part of the
    // recorded output.  It's also how we can customize the audio graph.  It is called internally
    // by MediaRecorder whenever the .configure() function is called and configureAudioOutput
    // is defined.
    configureAudioOutput: userConfiguredAudioOutput,
    // use the audio context provided by THREE.js.  That way, both the sounds we create in THREE.js
    // and our MediaRecorder's audio nodes can all be part of the same audio context.  If the nodes
    // are part of the same context, then they can be connected.
    audioContext: THREE.AudioContext.getContext(),
    // AUTO automatically requests the microphone at the beginning.  The other option is MANUAL,
    // which doesn't request the microphone at the beginning.  If you wanted access to the
    // microphone not at the beginning, you could call XR8.MediaRecorder.requestMicrophone() during
    // runtime.
    requestMic: XR8.MediaRecorder.RequestMicOptions.AUTO,
  })

  XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),  // Draws the camera feed.
    XR8.Threejs.pipelineModule(),  // Creates a ThreeJS AR Scene.
    window.LandingPage.pipelineModule(),  // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),  // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),  // Shows an error image on runtime error.
    // Custom pipeline modules.
    // ... put your pipeline module here :)
  ])

  // Add a canvas to the document for our xr scene.
  document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')

  // Open the camera and start running the camera run loop.
  XR8.run({
    canvas: document.getElementById('camerafeed'),
    cameraConfig: {direction: XR8.XrConfig.camera().FRONT},
    allowedDevices: XR8.XrConfig.device().ANY,
  })
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
