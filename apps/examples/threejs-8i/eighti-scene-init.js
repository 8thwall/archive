/* globals EightiHologram */
import Controls from './transform-controls'

export const initScenePipelineModule = () => {
  let hologram
  let plane
  let controls
  let playProgress

  const raycaster = new THREE.Raycaster()

  // Populates a cube into an XR scene and sets the initial camera position.
  const initXrScene = ({scene, camera, renderer}) => {
    const prompt = document.getElementById('promptText').getElementsByTagName('text')
    const progress = document.getElementById('progressBar')
    const loadProgress = document.getElementById('loadProgress')
    const pauseBtn = document.getElementById('pauseBtn')
    const muteBtn = document.getElementById('muteBtn')
    playProgress = document.getElementById('playProgress')

    // Enable shadows in the rednerer.
    renderer.shadowMap.enabled = true

    // Add some light to the scene.
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 10, 7)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    const opts = {
      loop: true,
      autoplay: false,
      muted: false,
    }

    // Add a plane that can receive shadows.
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000)
    planeGeometry.rotateX(-Math.PI / 2)

    const planeMaterial = new THREE.ShadowMaterial()
    planeMaterial.opacity = 0.67

    plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = false

    scene.add(plane)

    // CEO: https://assets.8i.com/8IPROMOEXPERIENCE20210204_S02_T01_20210222_130718/manifest.mpd
    // Army man: https://assets.8i.com/army/ARMY20201110_S04A_T01_2.4.1/manifest.mpd
    // Army pair: https://assets.8i.com/army/ARMY20201109_S01E_T05_1.5.6-1.5.8/manifest.mpd
    // Red dress (no audio): https://assets.8i.com/Odyssey_S32B_T02_20210322_162110/manifest.mpd

    hologram = new EightiHologram(
      'https://assets.8i.com/8IPROMOEXPERIENCE20210204_S02_T01_20210222_130718/manifest.mpd',
      scene,
      renderer,
      camera,
      opts
    )
    hologram.mesh.visible = false

    hologram.oncanplay = () => {
      for (let i = 0; i < prompt.length; i++) {
        prompt[i].textContent = 'Tap to Place Hologram'
        prompt[i].style.display = 'block'
      }

      const {body} = document
      body.addEventListener('click', () => {
        pauseBtn.style.display = 'block'
        muteBtn.style.display = 'block'
        for (let i = 0; i < prompt.length; i++) {
          prompt[i].style.display = 'none'
        }
        // Only show the progress bar if this is not a live broadcast
        if (hologram.duration !== Infinity) progress.style.display = 'block'
        hologram.mesh.visible = true
        hologram.play()
        hologram.oncanplay = null
        plane.receiveShadow = true
      }, {once: true})
    }

    controls = new Controls(renderer.domElement, hologram.mesh)

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 3, 0)

    // Play/Pause functionality
    const playImg = require('./assets/icons/play.svg')
    const pauseImg = require('./assets/icons/pause.svg')
    hologram.onplay = () => {
      pauseBtn.src = pauseImg
    }
    hologram.onpause = () => {
      pauseBtn.src = playImg
    }
    hologram.onended = () => {
      pauseBtn.src = playImg
    }
    pauseBtn.src = pauseImg
    const pause = () => {
      if (!hologram.paused) {
        hologram.pause()
      } else {
        hologram.play()
      }
    }
    pauseBtn.addEventListener('click', pause)

    // Mute/Unmute functionality
    const muteImg = require('./assets/icons/mute.svg')
    const soundImg = require('./assets/icons/sound.svg')
    muteBtn.src = soundImg
    const mute = () => {
      if (!hologram.muted) {
        muteBtn.src = muteImg
        hologram.muted = true
      } else {
        muteBtn.src = soundImg
        hologram.muted = false
      }
    }
    muteBtn.addEventListener('click', mute)
  }

  // Return a camera pipeline module that adds scene elements on start.
  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be unique within
    // your app.
    name: 'eighti-hologram',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart: ({canvas}) => {
      const {scene, camera, renderer} = XR8.Threejs.xrScene()  // Get the 3js scene from XR8.Threejs

      initXrScene({scene, camera, renderer})  // Add objects set the starting camera position.

      // prevent scroll/pinch gestures on canvas
      canvas.addEventListener('touchmove', (event) => {
        event.preventDefault()
      })

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR8.XrController.updateCameraProjectionMatrix(
        {origin: camera.position, facing: camera.quaternion}
      )

      // Recenter content on 'select'
      canvas.addEventListener(
        'select', ({position}) => {
          // update the picking ray with the camera and tap position
          raycaster.setFromCamera(position, camera)

          // raycast against the "surface" object
          const intersects = raycaster.intersectObject(plane)
          if (intersects.length === 1 && intersects[0].object === plane) {
            const {x} = intersects[0].point
            const {z} = intersects[0].point
            hologram.mesh.position.set(x, 0.0, z)
          }
        }, true
      )
    },
    onUpdate: () => {
      if (hologram != null) {
        hologram.update()
        if (hologram.duration !== Infinity) {
          playProgress.style.width =
          `${(100 * (hologram.currentTime / hologram.duration))}%`
        }
      }
    }
  }
}
