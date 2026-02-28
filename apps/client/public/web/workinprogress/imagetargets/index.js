// Copyright (c) 2018 8th Wall, Inc.

const onxrloaded = () => {
  const purple = 0xAD50FF
  const cherry = 0xDD0065
  const mint = 0x00EDAF
  const canary = 0xFCEE21

  // To illustrate how to integrate render updates with the camera run loop, we drive a cone in
  // a circle every three seconds.
  let animateCone
  const detectedImageObjects = {}
  let scene
  const startTime = Date.now()
  const coneLoopMillis = 3000

  // Populates some object into an XR scene and sets the initial camera position. The scene and
  // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
  const initXrScene = ({camera}) => {
    // Add a grid of purple spheres to the scene. Objects in the scene at height/ y=0 will appear to
    // stick to physical surfaces.
    for (let i = -5; i <=5 ; i += .5) {
      for (let j = -5; j <= 5; j += .5) {
        if (Math.round(i) != i && Math.round(j) != j) { continue }
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(.03, 8, 8), new THREE.MeshBasicMaterial({color: purple}))
        sphere.position.set(i, 0, j)
        scene.add(sphere)
      }
    }

    // Add one cone in each cardinal direction, and three ahead. Objects in the scene at height
    // y=0 will appear to stick to physical surfaces.
    const cones = [
      {c: canary, p: [ 5, .5, 0]}, {c: mint, p: [-5, .5, 0]}, {c: cherry, p: [ 0, .5, 5]},
      {c: cherry, p: [ 0, .5, -5]}, {c: canary, p: [-1, .5, -5]}, {c: mint, p: [ 1, .5, -5]}
    ]
    const shape = new THREE.ConeGeometry( 0.25, 1, 8 )
    cones.forEach(({c, p}) => {
      const cone = new THREE.Mesh(shape, new THREE.MeshBasicMaterial({color: c}))
      cone.position.set(...p)
      if (p[0] == 0 && p[2] == -5) { animateCone = cone } // save one cone for animation.
      scene.add(cone)
    })


    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 3, 0)
  }

  XR.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR.GlTextureRenderer.pipelineModule(),       // Draws the camera feed.
    XR.Threejs.pipelineModule(),                 // Creates a ThreeJS AR Scene.
    XR.XrController.pipelineModule(),            // Enables SLAM tracking.
    XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
  ])

  // TODO(dat): Move to a better location
  const colors = [purple, cherry, mint, canary]
  const imageFound = (event) => {
    const img = event.detail
    if (!detectedImageObjects[img.id]) {
      const aspectRatio = img.scaledWidth / img.scaledHeight
      const cornerPointPositions = [
        [-aspectRatio / 2, -0.5, 0],
        [aspectRatio / 2, -0.5, 0],
        [aspectRatio / 2, 0.5, 0],
        [-aspectRatio / 2, 0.5, 0],
      ]
      const indicatorGroup = new THREE.Group()
      cornerPointPositions.forEach(p => {
        const corner = new THREE.Mesh(new THREE.SphereBufferGeometry(0.025, 0.025, 0.025),
          new THREE.MeshBasicMaterial({color: colors[img.id%colors.length]}))
        indicatorGroup.add(corner)
        corner.position.set(...p)
      })
      // add axes indicating the center + axis
      const axes = new THREE.Group()
      const axisLength = 0.2
      const xAxis = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.005, 0.005, axisLength, 32), new THREE.MeshBasicMaterial({color: purple}))
      const yAxis = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.005, 0.005, axisLength, 32), new THREE.MeshBasicMaterial({color: cherry}))
      const zAxis = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.005, 0.005, axisLength, 32), new THREE.MeshBasicMaterial({color: mint}))
      xAxis.rotateZ(Math.PI / 2)
      xAxis.position.set(axisLength / 2, 0, 0)
      // y axis is already in the right direction
      yAxis.position.set(0, axisLength / 2, 0)
      zAxis.rotateX(Math.PI / 2)
      zAxis.position.set(0, 0, axisLength / 2)
      axes.add(xAxis)
      axes.add(yAxis)
      axes.add(zAxis)
      indicatorGroup.add(axes)

      detectedImageObject = indicatorGroup
      scene.add(detectedImageObject)
      detectedImageObjects[img.id] = detectedImageObject
    }

    imageUpdated(event)
  }

  const imageUpdated = (event) => {
    const img = event.detail
    const p = img.position
    const q = img.rotation
    const detectedImageObject = detectedImageObjects[img.id]
    detectedImageObject.position.set(p.x, p.y, p.z)
    detectedImageObject.quaternion.set(q.x, q.y, q.z, q.w)
    detectedImageObject.scale.set(img.scale, img.scale, img.scale)
    detectedImageObject.visible = true
  }

  const imageLost = (event) => {
    const img = event.detail
    detectedImageObjects[img.id].visible = false
  }

  // Add custom logic to the camera loop. This is done with camera pipeline modules that provide
  // logic for key lifecycle moments for processing each camera frame. In this case, we'll be
  // adding onStart logic for scene initialization, and onUpdate logic for scene updates.
  XR.addCameraPipelineModule({
    // Camera pipeline modules need a name. It can be whatever you want but must be unique within
    // your app.
    name: 'myawesomeapp',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR.Threejs scene to be ready before we can access it to add content. It was created in
    // XR.Threejs.pipelineModule()'s onStart method.
    onStart: ({canvasWidth, canvasHeight}) => {
      // Get the 3js sceen from xr3js.
      const {camera} = XR.Threejs.xrScene()
      scene = XR.Threejs.xrScene().scene

      // Add some objects to the scene and set the starting camera position.
      initXrScene({camera})

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR.XrController.updateCameraProjectionMatrix({
        origin: camera.position,
        facing: camera.quaternion,
      })
    },

    // onUpdate is called once per camera loop prior to render. Any 3js geometry scene
    // would typically happen here.
    onUpdate: ({processCpuResult}) => {
      const {reality} = processCpuResult
      // Update the position of the animating cone at a constant angular velocity.
      const coneTheta = ((Date.now() - startTime) % coneLoopMillis) * 2 * Math.PI  / coneLoopMillis
      animateCone.position.set(Math.sin(coneTheta) * 1.5, .5, -Math.cos(coneTheta) * 1.5 - 3.5)
    },

    // Listeners are called right after the processing stage that fired them. This guarantees that
    // updates can be applied at an appropriate synchronized point in the rendering cycle.
    listeners: [
      {event: 'reality.imagefound', process: imageFound},
      {event: 'reality.imageupdated', process: imageUpdated},
      {event: 'reality.imagelost', process: imageLost},
    ],
  })

  const canvas = document.getElementById('camerafeed')
  // Call XrController.recenter() when the canvas is tapped with two fingers. This resets the
  // ar camera to the position specified by XrController.updateCameraProjectionMatrix() above.
  canvas.addEventListener(
    'touchstart', (e) => { e.touches.length == 2 && XR.XrController.recenter() }, true)

  // Open the camera and start running the camera run loop.
  XR.run({canvas})
}

// Show loading screen before the full XR library has been loaded.
const load = () => { XRExtras.Loading.showLoading({onxrloaded}) }
window.onload = () => { window.XRExtras ? load() : window.addEventListener('xrextrasloaded', load) }
