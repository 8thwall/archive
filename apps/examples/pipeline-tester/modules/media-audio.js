/* eslint-disable */
let MIC_VOLUME = null
let BETTER_SAMPLE_RATE = false
let AUDIO_CONTEXT = null
let ADD_USER_GRAPH = false

const Toggler = () => {

  const toggleOscillator = () => {
    ADD_USER_GRAPH = !ADD_USER_GRAPH
    XR8.MediaRecorder.configure({
      configureAudioOutput: userConfiguredAudioOutput,
    })
    
    const osciToggler = document.getElementById('osciToggler')
    osciToggler.textContent = ADD_USER_GRAPH ? 'user audio graph on' : 'user audio graph off'
  }
  
  const toggleSampleRate = () => {
    BETTER_SAMPLE_RATE = !BETTER_SAMPLE_RATE
    let newAudioContext = null
    if (BETTER_SAMPLE_RATE) {
      newAudioContext = new AudioContext({sampleRate: 44100})
    } else {
      newAudioContext = new AudioContext({sampleRate: 8000})
    }
    XR8.MediaRecorder.configure({
      audioContext: newAudioContext,
      configureAudioOutput: userConfiguredAudioOutput,
    })
    
    const betterAudioBtn = document.getElementById('betterAudio')
    betterAudioBtn.textContent = BETTER_SAMPLE_RATE ? '44100hz' : '8000hz'
  }

  return {
    toggleOscillator,
    toggleSampleRate,
  }
}


const userConfiguredAudioOutput = ({microphoneInput, audioProcessor}) => {
  const audioContext = audioProcessor.context
  AUDIO_CONTEXT = audioContext
  
  // this is the final node that ends the user's part of the audio graph
  const finalNode = audioContext.createGain()
  
  // if audio permissions are set to RECORD_MIC_MANUAL, then the mic input won't be provided if it
  // is not setup
  if (microphoneInput) {
    if (ADD_USER_GRAPH) {
      const convolver = audioContext.createConvolver();
      const waveShaper = audioContext.createWaveShaper();
      
      // our distortion curve function
      function makeDistortionCurve(amount) {
        var k = typeof amount === 'number' ? amount : 50,
            n_samples = 44100,
            curve = new Float32Array(n_samples),
            deg = Math.PI / 180,
            i = 0,
            x;
        for ( ; i < n_samples; ++i ) {
            x = i * 2 / n_samples - 1;
            curve[i] = ( 3 + k ) * x * 20 * deg / 
                (Math.PI + k * Math.abs(x));
        }
        return curve;
      }
      
      waveShaper.curve = makeDistortionCurve(200);
      
      // connect the nodes
      microphoneInput.connect(waveShaper)
      // convolver.connect(finalNode)
      waveShaper.connect(finalNode)
      
      // microphoneInput.connect(finalNode)
    } else {
      microphoneInput.connect(finalNode)
    }
  }
  
  
  // THREE.AudioContext.setContext(audioProcessor.context)
  const listener = new THREE.AudioListener()
  audioProcessor.context.resume()
  // This connects the THREE.js audio to the mp4recorder so that the sound effect is saved in the
  // recording!
  listener.setFilter(audioProcessor)
  // This connects the THREE.js audio to the hardware output
  listener.gain.connect(audioProcessor.context.destination)

  _setupAudio(listener)

  return finalNode
}

let SOUND_EFFECT
const TOGGLER = Toggler()

const _setupAudio = (listener) => {
  // create an AudioListener and add it to the camera

  // create a global audio source
  const soundEffect = new THREE.Audio(listener)
  SOUND_EFFECT = soundEffect

  // load a sound and set it as the Audio object's buffer
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load( require('../assets/sound-effects/price_is_wrong.mp3'), function( buffer ) {
    soundEffect.setBuffer( buffer );
    soundEffect.setVolume( 0.2 );
    SOUND_EFFECT = soundEffect
  });
  
  document.body.insertAdjacentHTML('beforebegin', `
    <button
      id="soundEffect"
      style="
        width: 50px;
        position: absolute;
        z-index: 1000; 
        height: 50px;
        bottom: 100px;
        right: 0px;
        color: blue;"
    >
      Sound effect
    </button>
  `)
  
  
  const soundEffectButton = document.getElementById('soundEffect')
  soundEffectButton.onclick = () => {
    SOUND_EFFECT.play()
  }

  document.onkeypress = (e) => {
    const event = e || window.event
    // use e.keyCode

    if (e.keyCode === 97) {
      TOGGLER.toggleOscillator()
    }
    if (e.keyCode === 115) {
      SOUND_EFFECT.play()
    }
  }
}

const requestMicPermission = () => {
  XR8.MediaRecorder.requestMicrophone()
  .catch((e) => {
    console.error('[media-audio] Got an error getting permissions: ', e)
  })
}

// Build a pipeline module that initializes and updates the three.js scene based on facecontroller
// events.
const audioConfigPipeline = () => {
  // Start loading mesh url early.
  let canvas_
  let modelGeometry_
  let head_
  
  let hasSetupAudio_ = false
 
  // init is called by onAttach and by facecontroller.faceloading. It needs to be called by both
  // before we can start.
  const onAttach = ({canvas, detail}) => {
    document.body.insertAdjacentHTML('beforebegin', `
      <button
        id="osciToggler"
        style="
          width: 50px;
          position: absolute;
          z-index: 1000; 
          height: 50px;
          bottom: 50px;
          right: 0px;
          color: blue;"
      >
        
      </button>
    `)
    const osciToggler = document.getElementById('osciToggler')
    osciToggler.onclick = TOGGLER.toggleOscillator
    osciToggler.textContent = ADD_USER_GRAPH ? 'user audio graph on' : 'user audio graph off'

    document.body.insertAdjacentHTML('beforebegin', `
      <button
        id="betterAudio"
        style="
          width: 50px;
          position: absolute;
          z-index: 1000; 
          height: 50px;
          bottom: 150px;
          right: 0px;
          color: blue;"
      >
        
      </button>
    `)
  
    const betterAudioBtn = document.getElementById('betterAudio')
    betterAudioBtn.onclick = TOGGLER.toggleSampleRate
    betterAudioBtn.textContent = '16000hz'

    document.body.insertAdjacentHTML('beforebegin', `
      <button
        id="requestMic"
        style="
          width: 50px;
          position: absolute;
          z-index: 1000; 
          height: 50px;
          bottom: 200px;
          right: 0px;
          color: blue;"
      >
        
      </button>
    `)
    const requestMicButton = document.getElementById('requestMic')
    requestMicButton.textContent = 'request mic'
    requestMicButton.onclick = requestMicPermission
    
    // make sure to resume the audio
    THREE.AudioContext.getContext().resume()
  }
  
  const onDetach = () => {
    canvas_ = null
    modelGeometry_ = null

    document.getElementById('soundEffect').remove()
    document.getElementById('osciToggler').remove()
    document.getElementById('betterAudio').remove()
    document.getElementById('requestMic').remove()
    document.getElementById('flashElement').remove()
    document.getElementById('recorder').remove()
    document.getElementById('previewContainer').remove()
  }

  return {
    name: 'media-audio',
    onAttach,
    onDetach,
  }
}

export {audioConfigPipeline, userConfiguredAudioOutput}
