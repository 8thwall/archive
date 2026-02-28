// Copyright (c) 2019 8th Wall, Inc.

// Returns a pipeline module that initializes the threejs scene when the camera feed starts, and
// handles subsequent spawning of a glb model whenever the scene is tapped.
const worldPointsVisualizerPipelineModule = () => {
  let worldPoints = null

  // Populates some object into an XR scene and sets the initial camera position. The scene and
  // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
  const initXrScene = ({ scene, camera }) => {
    console.log('initXrScene')

    // Create object to attach worldPoints to
    worldPoints = new THREE.Object3D()
    scene.add(worldPoints)

    scene.add(new THREE.AmbientLight( 0x404040, 5 ))  // Add soft white light to the scene.

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 3, 0)
  }

  const worldPointsTouchHandler = (e) => {
    console.log('worldPointsTouchHandler')
    // Call XrController.recenter() when the canvas is tapped with two fingers. This resets the
    // AR camera to the position specified by XrController.updateCameraProjectionMatrix() above.
    if (e.touches.length == 2) {
      XR.XrController.recenter()
    }
  }

  return {
    // Pipeline modules need a name. It can be whatever you want but must be unique within your app.
    name: 'worldPointsPipelineModule',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR.Threejs scene to be ready before we can access it to add content. It was created in
    // XR.Threejs.pipelineModule()'s onStart method.
    onStart: ({canvas, canvasWidth, canvasHeight}) => {
      const {scene, camera} = XR.Threejs.xrScene()  // Get the 3js sceen from xr3js.

      initXrScene({ scene, camera }) // Add objects to the scene and set starting camera position.

      canvas.addEventListener('touchstart', worldPointsTouchHandler, true)  // Add touch listener.

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR.XrController.updateCameraProjectionMatrix({
        origin: camera.position,
        facing: camera.quaternion,
      })

      // Enable World Points
      XR.XrController.configure({ enableWorldPoints: true })
    },

    onUpdate: ({processCpuResult}) => {
      const {reality} = processCpuResult
      if (!reality || !reality.worldPoints) {
        console.log('No worldPoints...')
        return
      }

      const points = reality.worldPoints

      for (let i = 0; i < points.length; ++i) {
        const pt = points[i] // {id, confidence, position: {x, y, z}}
        if (i >= worldPoints.children.length) {
          const geometry = new THREE.SphereGeometry(0.05, 8, 8)
          const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
          worldPoints.add(new THREE.Mesh(geometry, material))
        }
        const point = worldPoints.children[i];
        point.position.set(pt.position.x, pt.position.y, pt.position.z)
        point.visible = true
      }

      worldPoints.children.slice(points.length).forEach(m => m.visible = false)
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
    worldPointsVisualizerPipelineModule(),
  ])

  // Open the camera and start running the camera run loop.
  XR.run({canvas: document.getElementById('camerafeed')})
}

// Show loading screen before the full XR library has been loaded.
const load = () => { XRExtras.Loading.showLoading({onxrloaded}) }
window.onload = () => { window.XRExtras ? load() : window.addEventListener('xrextrasloaded', load) }
