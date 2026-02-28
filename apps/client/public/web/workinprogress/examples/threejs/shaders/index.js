// Copyright (c) 2019 8th Wall, Inc.

// Returns a pipeline module that initializes the threejs scene when the camera feed starts, and
// handles subsequent spawning of a glb model whenever the scene is tapped.
const customShadersPipelineModule = () => {

  const nextButton = document.getElementById('nextbutton')
  let idx = 0  // Index of the shader to use next.

  let uniforms = {}
  const clock = new THREE.Clock()

  const nextShader = () => {
    // Reconfigure the texture renderer pipline module to use the next shader.
    XR.GlTextureRenderer.configure({fragmentSource: cameraFeedFragmentShaders[idx]})
    idx = (idx + 1) % cameraFeedFragmentShaders.length
  }

  nextShader()                     // Call 'nextShader' once to set the first shader.
  nextButton.onclick = nextShader  // Switch to the next shader when the next button is pressed.

  const adjustButtonTextCenter = ({orientation}) => { // Update the line height on the button.
    const ww = window.innerWidth
    const wh = window.innerHeight

    // Wait for orientation change to take effect before handling resize.
    if (((orientation == 0 || orientation == 180) && ww > wh)
      || ((orientation == 90 || orientation == -90) && wh > ww)) {
      window.requestAnimationFrame(() => adjustButtonTextCenter({orientation}))
      return
    }

    nextButton.style.lineHeight = `${nextButton.getBoundingClientRect().height}px`
  }

  // Populates some object into an XR scene and sets the initial camera position. The scene and
  // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
  const initXrScene = ({ scene, camera, renderer }) => {
    console.log('initXrScene')

    const light = new THREE.AmbientLight( 0x404040, 5 ) // Add soft white light to the scene.
    scene.add(light)

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 3, 5)

    // Add a cube with a standard wireframe material
    const box1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1, 2, 2, 2),
      new THREE.MeshStandardMaterial({
        color: 0xffff00,
        wireframe: true
      })
    )
    box1.position.set(-1, 0.5, 0)
    scene.add(box1)

    uniforms = { "time": { value: 1.0 } }

    const box2 = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1),
      new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader(),
        fragmentShader: fragmentShader()
      })
    )
    box2.position.set(1, 0.5, 0)
    scene.add( box2 )

  }

  const myTouchHandler = (e) => {
    console.log('placeObjectTouchHandler')
    // Call XrController.recenter() when the canvas is tapped with two fingers. This resets the
    // AR camera to the position specified by XrController.updateCameraProjectionMatrix() above.
    if (e.touches.length == 2) {
      XR.XrController.recenter()
    }

    if (e.touches.length > 2) {
      return
    }
  }

  return {
    // Pipeline modules need a name. It can be whatever you want but must be unique within your app.
    name: 'custom-shaders',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR.Threejs scene to be ready before we can access it to add content. It was created in
    // XR.Threejs.pipelineModule()'s onStart method.
    onStart: ({canvas, orientation}) => {
      const {scene, camera, renderer} = XR.Threejs.xrScene()  // Get the 3js sceen from xr3js.
      initXrScene({ scene, camera, renderer }) // Add objects to the scene and set starting camera position.

      nextButton.style.visibility = 'visible'
      adjustButtonTextCenter({orientation})

      canvas.addEventListener('touchstart', myTouchHandler, true)  // Add touch listener.

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR.XrController.updateCameraProjectionMatrix({
        origin: camera.position,
        facing: camera.quaternion,
      })
    },
    onDeviceOrientationChange: ({orientation}) => { 
      adjustButtonTextCenter({orientation})
    },
    onUpdate: () => {
      uniforms[ "time" ].value += clock.getDelta() * 5;
    },
  }
}

const onxrloaded = () => {
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
    customShadersPipelineModule(),
  ])

  // Open the camera and start running the camera run loop.
  XR.run({canvas: document.getElementById('camerafeed')})
}

// Show loading screen before the full XR library has been loaded.
const load = () => { XRExtras.Loading.showLoading({onxrloaded}) }
window.onload = () => { window.XRExtras ? load() : window.addEventListener('xrextrasloaded', load) }
