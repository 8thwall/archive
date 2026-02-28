// Copyright (c) 2018 8th Wall, Inc.

const purple = 0x623cc2
const purpleHash = '#623cc2'

const hideDevicemotion = () => {
  const div = document.querySelector('#devicemotion')
  div.style.display = 'none'
  div.tween.stop()
}

const showDevicemotion = () => {
  const div = document.querySelector('#devicemotion')

  const leftMin = 0.35 * window.innerWidth
  const leftMax = window.innerWidth - leftMin - 50
  const millis = 750

  const img = document.querySelector('#device')
  const box = img.parentElement
  box.style.width = `${leftMax - leftMin + img.children[0].width}px`
  box.style.height = `${img.children[0].height}px`
  box.style.left = `${leftMin}px`
  const border = `3pt solid ${purpleHash}`
  box.style.borderLeft = border
  box.style.borderRight = border

  const devicePosition = { left: 0 }
  div.tween = new TWEEN.Tween(devicePosition)
    .to({ left: leftMax - leftMin }, millis)
    .repeat( Infinity )
    .yoyo(true)
    .onUpdate(() => img.style.left = `${devicePosition.left}px`)
  div.tween.start()
  div.style.display = 'block'
}

const live = (() => {
  let minX, maxX, heuristic;

  const reset = () => {
    minX = 1
    maxX = 0
    heuristic = 0.1
  }
  reset()

  const update = position => {
    const div = document.querySelector('#live')
    const img = document.querySelector('#device')
    if (!div) {
      return
    }
    const leftMax = window.innerWidth
    minX = Math.min(position.x, minX)
    maxX = Math.max(position.x, maxX)
    const motion = maxX - minX
    heuristic = motion > 0.5 ? 1 : 0.1
    const x = leftMax * (0.1 + 0.1 * position.x / heuristic)
    div.style.left = `${x}px`

    const imgAt = parseFloat(img.style.left.replace('px',''))
    div.style.borderColor = (Math.abs(imgAt - x) < 0.3 * img.children[0].width) ? 'green' : 'red'
  }

  return { reset, update }
})()


// Returns a pipeline module that initializes the threejs scene when the camera feed starts, and
// handles subsequent spawning of a glb model whenever the scene is tapped.
const customScenePipelineModule = () => {
  const startScale = new THREE.Vector3(0.0001, 0.0001, 0.0001) // Initial scale value for our model
  const endScale = new THREE.Vector3(0.002, 0.002, 0.002)      // Ending scale value for our model
  const animationMillis = 750                                  // Animate over 0.75 seconds

  const raycaster = new THREE.Raycaster()
  const tapPosition = new THREE.Vector2()

  let surface  // Tracking surface
  let initialRotation
  let debounce = false

  let placePapers = true // place papers or golf balls

  const resetXR = evt => {
    showDevicemotion()
    live.reset()
    initialRotation = false
    if (surface) {
      // hide the surface until a new scale is estimated
      surface.visible = false
    }
    XR.XrController.recenter()
    debounce = true
    setTimeout(() => debounce = false, 100)
  }

  // Populates some object into an XR scene and sets the initial camera position. The scene and
  // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
  const initXrScene = ({ scene, camera }) => {
    surface = new THREE.Mesh(
      new THREE.PlaneGeometry( 100, 100, 1, 1 ),
      new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      })
    )

    // Planes by default are vertical, therefore rotate.
    // Children of surface should have position (x, -z, y)
    surface.rotateX(-Math.PI / 2)
    // initially hide the surface
    surface.visible = false
    scene.add(surface)

    scene.add(new THREE.AmbientLight( 0x404040, 5 ))  // Add soft white light to the scene.
/*
    device = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1, 0.2),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(purple),
        wireframe: true,
      }))
    device.position.set(0, 0, -3)
    device.visible = true
    device.initialPosition = [0, 1, 3]
    scene.add(device)
    window.a = device
    */

    // Set the initial camera position relative to the scene. This must be at y=0.
    camera.position.set(0, 1, 0)

    // add click handler to buttons
    const togglePapers = evt => {
      evt.preventDefault()
      if (evt.target.class === 'active') {
        return
      }
      placePapers = evt.target.id === 'paper'
      document.getElementById('paper').className = placePapers ? 'active' : ''
      document.getElementById('golfball').className = !placePapers ? 'active' : ''
    }

    document.getElementById('paper').onclick = togglePapers
    document.getElementById('golfball').onclick = togglePapers
    document.getElementById('clear').onclick = () => surface.children = []
    document.getElementById('reset').onclick = resetXR
    document.getElementById('nav').style.display = 'block'
    document.querySelector('#devicemotion').onclick = resetXR
  }

  const addGolfBall = (pointX, pointZ) => {
    console.log(`placing golf ball at (${pointX.toFixed(3)}, ${surface.position.y.toFixed(3)}, ${pointZ.toFixed(3)})`)
    const size = 1.680 * 0.0254 // golf ball diameter in m
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(size / 2, 16, 16),
      new THREE.MeshBasicMaterial({ color: purple }))
    // the surface is rotated 90 degrees about X
    ball.position.set(pointX, - pointZ, size / 2)
    surface.add(ball)
  }

  const addLetterPaper  = (pointX, pointZ) => {
    console.log(`placing letter paper at (${pointX.toFixed(3)}, ${surface.position.y.toFixed(3)}, ${pointZ.toFixed(3)})`)
    // Letter size paper 8.5x11 inches
    const w = 11 * 0.0254
    const h = 8.5 * 0.0254
    const paper = new THREE.Mesh(
      new THREE.BoxGeometry(w, 0.01, h),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(purple),
        transparent: true,
        opacity: 0.5,
      }))
    // the surface is rotated 90 degrees about X
    paper.position.set(pointX + w/2, - (pointZ - h/2), 0.005)
    paper.rotation.x = + Math.PI / 2  // undo rotation
    surface.add(paper)
  }

  const placeObjectTouchHandler = (e) => {
    // Call XrController.recenter() when the canvas is tapped with two fingers. This resets the
    // AR camera to the position specified by XrController.updateCameraProjectionMatrix() above.
    if (e.touches.length == 2) {
      resetXR()
    }

    if (e.touches.length > 2 || !surface.visible) {
      return
    }

    // If the canvas is tapped with one finger and hits the "surface", spawn an object.
    const {scene, camera} = XR.Threejs.xrScene()

    // calculate tap position in normalized device coordinates (-1 to +1) for both components.
    tapPosition.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
    tapPosition.y = - (e.touches[0].clientY / window.innerHeight) * 2 + 1

    // Update the picking ray with the camera and tap position.
    raycaster.setFromCamera(tapPosition, camera)

    // Raycast against the "surface" object.
    const intersects = raycaster.intersectObject(surface)

    if (intersects.length == 1 && intersects[0].object == surface) {
      (placePapers ? addLetterPaper : addGolfBall)(intersects[0].point.x, intersects[0].point.z)
    }
  }

  return {
    // Pipeline modules need a name. It can be whatever you want but must be unique within your app.
    name: 'scene',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR.Threejs scene to be ready before we can access it to add content. It was created in
    // XR.Threejs.pipelineModule()'s onStart method.
    onStart: ({canvas, canvasWidth, canvasHeight}) => {
      const {scene, camera} = XR.Threejs.xrScene()  // Get the 3js sceen from xr3js.

      initXrScene({ scene, camera }) // Add objects to the scene and set starting camera position.

      canvas.addEventListener('touchstart', placeObjectTouchHandler, true)  // Add touch listener.

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR.XrController.updateCameraProjectionMatrix({
        origin: camera.position,
        facing: camera.quaternion,
      })

      showDevicemotion()
    },

    onUpdate: ({processCpuResult}) => {
      if (processCpuResult && processCpuResult.reality && processCpuResult.reality.trackingScale) {
        document.getElementById('scale').innerHTML = `Scale ${processCpuResult.reality.trackingScale.toFixed(3)}`
      }
      if (!surface.visible && device && processCpuResult && processCpuResult.reality) {
        const { rotation, position: p } = processCpuResult.reality
        if (!initialRotation) {
          initialRotation = rotation
        }
        const dot = (initialRotation.x * rotation.x
          + initialRotation.y * rotation.y
          + initialRotation.z * rotation.z
          + initialRotation.w * rotation.w)
        const rotationDistance = 2 * Math.acos(Math.abs(dot))
        if (rotationDistance > Math.PI/2) {
          console.log('Rotated too far!', rotationDistance)
          resetXR()
        }
        live.update(p)
      }
      if (surface.visible || !processCpuResult || !processCpuResult.reality || !processCpuResult.reality.surfaces || debounce) {
        return
      }

      // Surfaces will be returned when tracking has an estimated scale.
      // Find the first horizontal surface to use as ground
      processCpuResult.reality.surfaces
        .filter(({type}) => type === 'HORIZONTAL_PLANE')
        .forEach(({position}) => {
          hideDevicemotion()
          console.log('Setting surface to ', position)
          surface.position.set(...position)
          surface.visible = true      
        })

    },
  }
}

const onxrloaded = () => {
  XR.XrController.configure({ enableEstimateScale: true })
  XR.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR.GlTextureRenderer.pipelineModule(),       // Draws the camera feed.
    XR.Threejs.pipelineModule(),                 // Creates a ThreeJS AR Scene.
    XR.XrController.pipelineModule(),            // Enables SLAM tracking.
    XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
    // Custom pipeline modules.
    customScenePipelineModule(),
  ])

  // Open the camera and start running the camera run loop.
  XR.run({canvas: document.getElementById('camerafeed')})
}

// Show loading screen before the full XR library has been loaded.
const load = () => { XRExtras.Loading.showLoading({onxrloaded}) }
window.onload = () => { window.XRExtras ? load() : window.addEventListener('xrextrasloaded', load) }

// Enable TWEEN animations.
animate()
function animate(time) {
  requestAnimationFrame(animate)
  TWEEN.update(time)
}

