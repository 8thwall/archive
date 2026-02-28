/* globals TWEEN */
/* globals Tetavi */

import {TouchControl} from './touch-controls'
const touchControl = new TouchControl()

let isReady = false
let isPlaced = false
let tetavi; let prompt; let loadProgress; let playProgress; let pauseBtn; let muteBtn; let surface

// animates the load progress bar
function setBar(width, widthPlay) {
  if (!this.loadProgress) {
    this.loadProgress = document.getElementById('loadProgress')
  }
  this.loadProgress.style.width = `${100 * (widthPlay / width)}%`
  if (widthPlay > 0 && width > 0 && tetavi.isReady()) {
    isReady = true
    prompt.innerHTML = 'Tap to Place Hologram'
  }
}

export const tetaviScenePipelineModule = () => {
  // tetavi sample volumetric video
  const dancingHologram = [require('./assets/Dancing-Hologram/DancingTexture.mp4'),
    require('./assets/Dancing-Hologram/Dancing.tetavi')]

  prompt = document.getElementById('promptText')
  loadProgress = document.getElementById('loadProgress')
  playProgress = document.getElementById('playProgress')
  pauseBtn = document.getElementById('pauseBtn')
  muteBtn = document.getElementById('muteBtn')

  const startScale = new THREE.Vector3(0.01, 0.01, 0.01)  // initial scale value for our model
  const endScale = new THREE.Vector3(2, 2, 2)             // ending scale value for our model
  const animationMillis = 750                             // animate over 0.75 seconds
  const raycaster = new THREE.Raycaster()
  const tapPosition = new THREE.Vector2()

  // Populates an XR scene with a hologram and sets the initial camera position. The scene and
  // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
  const initXrScene = ({scene, camera, renderer}) => {
    renderer.shadowMap.enabled = false
    prompt.textContent = 'Loading...'

    // create the tetavi hologram
    tetavi = Tetavi.create(
      renderer,
      camera,
      dancingHologram[0],
      dancingHologram[1]
    )
      .onSetBar(setBar)
      .setFadeAlpha(true)
      .setShadowAngle(0.4)

    tetavi.setShadowVisible(true)

    // create surface to raycast against for placement
    surface = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 1, 1),
      new THREE.MeshBasicMaterial({transparent: true, opacity: 0.0})
    )
    surface.rotateX(-Math.PI / 2)
    surface.position.set(0, 0, 0)
    scene.add(surface)

    // Set the initial camera position relative to the scene. The height must be greater than y=0.
    camera.position.set(0, 3, 0)

    // Play/Pause functionality
    const playImg = require('./assets/icons/play.svg')
    const pauseImg = require('./assets/icons/pause.svg')
    const pauseHcap = () => {
      if (tetavi.isPlaying()) {
        pauseBtn.src = playImg
        tetavi.pause()  // pause hcap
      } else {
        pauseBtn.src = pauseImg
        tetavi.resume()  // play hcap
      }
    }
    pauseBtn.addEventListener('click', pauseHcap)

    // Mute/Unmute functionality
    const muteImg = require('./assets/icons/mute.svg')
    const soundImg = require('./assets/icons/sound.svg')
    const muteHcap = () => {
      if (!tetavi.getSrcVideo().muted) {
        muteBtn.src = muteImg
        tetavi.getSrcVideo().muted = true   // mute hologram
      } else {
        muteBtn.src = soundImg
        tetavi.getSrcVideo().muted = false  // unmute hcap
      }
    }
    muteBtn.addEventListener('click', muteHcap)
  }

  // animate hologram in from a small scale to its end scale
  const animateIn = (model, pointX, pointZ, yDegrees) => {
    const scale = {...startScale}

    model.position.set(pointX, 0.0, pointZ)
    model.scale.set(scale.x, scale.y, scale.z)
    XR8.Threejs.xrScene().scene.add(model)

    new TWEEN.Tween(scale)
      .to(endScale, animationMillis)
      .easing(TWEEN.Easing.Elastic.Out)  // use an easing function to make the animation smooth
      .onUpdate(() => {
        model.scale.set(scale.x, scale.y, scale.z)
      })
      .start()
  }

  // load the hologram at the requested point on the surface
  const placeObject = (pointX, pointZ) => {
    if (tetavi != null) {
      if (!tetavi.isPlaying() && !isPlaced) {
        // begin playback
        tetavi.play()
        prompt.style.display = 'none'
        pauseBtn.style.display = 'block'
        muteBtn.style.display = 'block'
        playProgress.style.display = 'block'
        isPlaced = true
      }
      if (touchControl.hasChar()) {
        touchControl.getChar().position.set(pointX, 0.0, pointZ)
      } else {
        // add hologram to scene
        touchControl.createChar(tetavi.getScene())
        animateIn(touchControl.getChar(), pointX, pointZ, 0)
      }
    }
  }

  const placeObjectTouchHandler = (e) => {
    if (!touchControl.onTouchEnd(e)) return
    if (!isReady) return

    // if the canvas is tapped with one finger and hits the "surface", spawn an object
    const {scene, camera} = XR8.Threejs.xrScene()

    // calculate tap position in normalized device coordinates (-1 to +1) for both components
    tapPosition.x = (touchControl.getStartClientX() / window.innerWidth) * 2 - 1
    tapPosition.y = -(touchControl.getStartClientY() / window.innerHeight) * 2 + 1

    // update the picking ray with the camera and tap position
    raycaster.setFromCamera(tapPosition, camera)

    // raycast against the "surface" object
    const intersects = raycaster.intersectObject(surface)

    if (intersects.length === 1 && intersects[0].object === surface) {
      placeObject(intersects[0].point.x, intersects[0].point.z)
    }
  }

  return {
    // pipeline modules need a name. It can be whatever you want but must be unique within your app
    name: 'hologram',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart: ({canvas, canvasWidth, canvasHeight}) => {
      const {scene, camera, renderer} = XR8.Threejs.xrScene()  // Get the 3js sceen from xr3js

      // add objects to the scene and set starting camera position
      initXrScene({scene, camera, renderer})

      canvas.addEventListener('touchstart', (e) => {
        touchControl.onTouchStart(e)
      }, true)  // Add touch listener.

      canvas.addEventListener('touchend', placeObjectTouchHandler, true)

      // prevent scroll/pinch gestures on canvas
      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault()
        touchControl.onTouchMove(e)
      })

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR8.XrController.updateCameraProjectionMatrix({
        origin: camera.position,
        facing: camera.quaternion,
      })
    },
    // enable animations
    onUpdate: () => {
      if (tetavi != null) {
        tetavi.animate()
        if (tetavi.getTotalFrames() > 1) {
          if (playProgress != null) {
            playProgress.style.width =
          `${(100 * (tetavi.getFrame() / tetavi.getTotalFrames()))}%`
          }
        }
        touchControl.onAnimate()
      }
      TWEEN.update()
    }
  }
}
