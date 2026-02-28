/* globals WEB4DS */

// Returns a pipeline module that initializes the threejs scene when the camera feed starts, and
// handles subsequent spawning of a glb model whenever the scene is tapped.

  /* 4Dviews Hologram Samples
  Speaker main-4ds: https://dev.fourdviews.com/ltd/business_man_-_speech_2_-_take_2_15_00fps_FILTERED_MOBILE_720.4ds 
  Speaker secondary-4ds: https://dev.fourdviews.com/ltd/business_man_-_speech_2_-_take_2_15_00fps_FILTERED_DESKTOP_720.4ds
  Speaker audio-4ds: https://dev.fourdviews.com/ltd/business_man_-_speech_2_-_take_2.mp3
  Fire Warrior main-4ds: https://dev.fourdviews.com/ltd/Fire_8thWall_final_20fps.4ds
  Fire Warrior secondary-4ds: https://dev.fourdviews.com/ltd/8th Wall_fire_desktop.4ds
  Fire Warrior audio-4ds: https://dev.fourdviews.com/ltd/8thWall_Fire_export_final.wav */

export const hologram4dsModule = () => {
  // set the path to the 4ds file video to play
  // it should be the "Mobile" version of 4ds file
  const modelFile4DSMain = 'https://dev.fourdviews.com/ltd/Fire_8thWall_final_20fps.4ds'
  // set the path to the 4ds file video to play on devices not compatible with Mobile 4ds
  // it is mainly used on Desktop platforms and Safari iOS version < 14
  const modelFile4DSSecondary = 'https://dev.fourdviews.com/ltd/8th Wall_fire_desktop.4ds'
  // set the path to the audio file if any
  // keep it blank if there is no audioor if it is embedded in the 4ds file
  const audioFile4DS = 'https://dev.fourdviews.com/ltd/8thWall_Fire_export_final.wav'

  let model4DS = null  // hologram object

  const raycaster = new THREE.Raycaster()
  const tapPosition = new THREE.Vector2()

  let surface
  let isPlaced = false
  const prompt = document.getElementById('promptText')
  const progressBar = document.getElementById('progressBar')
  const playProgress = document.getElementById('playProgress')
  const pauseBtn = document.getElementById('pauseBtn')
  const muteBtn = document.getElementById('muteBtn')
  let showedPrompt = false

  // Populates some object into an XR scene and sets the initial camera position. The scene and
  // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
  const initXrScene = ({scene, camera}) => {
    surface = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 1, 1),
      new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
      })
    )

    surface.rotateX(-Math.PI / 2)
    surface.position.set(0, 0, 0)
    surface.receiveShadow = true
    scene.add(surface)

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 1.6, 0)

    // Play/Pause functionality
    const playImg = require('./assets/icons/play.svg')
    const pauseImg = require('./assets/icons/pause.svg')
    const pauseHcap = () => {
      if (model4DS.isPlaying) {
        pauseBtn.src = playImg
        model4DS.pause()  // pause hcap
      } else {
        pauseBtn.src = pauseImg
        model4DS.play()  // play hcap
      }
    }
    pauseBtn.addEventListener('click', pauseHcap)

    // Mute/Unmute functionality
    const muteImg = require('./assets/icons/mute.svg')
    const soundImg = require('./assets/icons/sound.svg')
    const muteHcap = () => {
      if (!model4DS.isMuted) {
        muteBtn.src = muteImg
        model4DS.mute()    // mute hologram
      } else {
        muteBtn.src = soundImg
        model4DS.unmute()  // unmute hcap
      }
    }
    muteBtn.addEventListener('click', muteHcap)
  }

  // Load the model at the requested point on the surface.
  const placeObject = (pointX, pointZ, scene, camera, renderer) => {
    // display UI and play hologram on initial tap
    if (model4DS != null && model4DS.isLoaded && !isPlaced) {
      // start playing the sequence at the correct position
      model4DS.play()
      model4DS.model4D.setRotation([0, 0, -Math.PI / 2])
      pauseBtn.style.display = 'block'
      muteBtn.style.display = 'block'
      progressBar.style.display = 'block'
      // remove the prompt message
      prompt.style.display = 'none'
      isPlaced = true
    }

    // place model at point
    model4DS.model4D.setPosition([pointX, 0, pointZ])
    model4DS.model4D.mesh.frustumCulled = false
  }

  const placeObjectTouchHandler = (e) => {
    // If the canvas is tapped with one finger and hits the "surface", spawn an object.
    const {scene, camera, renderer} = XR8.Threejs.xrScene()

    // calculate tap position in normalized device coordinates (-1 to +1) for both components.
    tapPosition.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
    tapPosition.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1

    // Update the picking ray with the camera and tap position.
    raycaster.setFromCamera(tapPosition, camera)

    // Raycast against the "surface" object.
    const intersects = raycaster.intersectObject(surface)

    if (intersects.length === 1 && intersects[0].object === surface) {
      placeObject(intersects[0].point.x, intersects[0].point.z, scene, camera, renderer)
    }
  }

  // Show 'Tap to Place Hologram'
  const displayPrompt = () => {
    if (!showedPrompt) {
      prompt.style.display = 'block'
      prompt.innerHTML = 'Tap to Place<br>Hologram'
      showedPrompt = true
    }
  }

  return {
    // Pipeline modules need a name. It can be whatever you want but must be unique within your app.
    name: 'placeground',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart: ({canvas, canvasWidth, canvasHeight}) => {
      const {renderer, scene, camera} = XR8.Threejs.xrScene()  // Get the 3js sceen from xr3js.

      initXrScene({scene, camera})  // Add objects to the scene and set starting camera position.

      canvas.addEventListener('touchstart', placeObjectTouchHandler, true)  // Add touch listener.

      // add other touch listener to enable audio when screen is tapped
      canvas.addEventListener('touchstart', () => {
        const promise = document.getElementById('myaudio').play()
        if (promise !== undefined) {
          promise.then((_) => {
            console.log('Audio enabled')
          }).catch((error) => {
            console.log('Audio error')
          })
        }
      })

      // prevent scroll/pinch gestures on canvas
      canvas.addEventListener('touchmove', (event) => {
        event.preventDefault()
      })

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR8.XrController.updateCameraProjectionMatrix({
        origin: camera.position,
        facing: camera.quaternion,
      })

      model4DS = new WEB4DS(
        'Welcome',              // unique id
        modelFile4DSSecondary,  // url Desktop format
        modelFile4DSMain,       // url Mobile format
        audioFile4DS,           // url Audio
        [0, 0, 0],              // position
        renderer, scene, camera
      )
      
      // Set the option to keep the downloaded data in cache, to avoid a new download each time it loops
      model4DS.keepsChunksInCache(false)

      model4DS.setWaitingGif(  // empty transparent pixel
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
      )

      // Starts the loading of the data
      model4DS.load(false, false, displayPrompt)
    },

    // Update the 4D model, in sync with the app and playback framerate
    onUpdate: () => {
      if (model4DS != null && model4DS.isLoaded) {
        model4DS.update()
        if (playProgress != null) {
          playProgress.style.width =
            `${(100 * (model4DS.currentFrame / model4DS.sequenceTotalLength))}%`
        }
      // console.log(model4DS)
      }
    },
  }
}
