// Copyright (c) 2018 8th Wall, Inc.
const purple = 0xAD50FF
const cherry = 0xDD0065
const mint = 0x00EDAF
const canary = 0xFCEE21
const darkCyan = 0x3CAEA1
const colors = [purple, cherry, mint, canary]

const onxrloaded = () => {
  // To illustrate how to integrate render updates with the camera run loop, we drive a cone in
  // a circle every three seconds.
  let animateCone
  const detectedImageObjects = {}
  let scene
  let cube
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

    cube = new THREE.Group()
    const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(1,1), new THREE.MeshBasicMaterial({color: mint, side: THREE.DoubleSide}))
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(1,1), new THREE.MeshBasicMaterial({color: purple, side: THREE.DoubleSide}))
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(1,1), new THREE.MeshBasicMaterial({color: canary, side: THREE.DoubleSide}))
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(1,1), new THREE.MeshBasicMaterial({color: darkCyan, side: THREE.DoubleSide}))
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshBasicMaterial({color: cherry}))
    frontWall.position.set(0, 0, 0.5)
    leftWall.position.set(-0.5, 0, 0)
    rightWall.position.set(0.5, 0, 0)
    leftWall.rotateY(Math.PI / 2)
    rightWall.rotateY(-Math.PI / 2)
    backWall.position.set(0, 0, -0.5)
    center.position.set(0, 0, 0)
    cube.add(frontWall)
    cube.add(leftWall)
    cube.add(rightWall)
    cube.add(backWall)
    cube.add(center)
    cube.visible = false
    cube.matrixAutoUpdate = false
    scene.add(cube)

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

  let numImageFound = 0;
  const imageFound = (event) => {
    const img = event.detail
    numImageFound++
    imageUpdated(event)
  }

  const identityScale = new THREE.Vector3(1, 1,1)
  const sqrt2Over2 = Math.sqrt(2) / 2
  const faceRotations = [
    new THREE.Quaternion(0.0, 0.0, 0, 1.0), // front
    new THREE.Quaternion(0.0, -sqrt2Over2, 0, sqrt2Over2), // right
    new THREE.Quaternion(-sqrt2Over2, 0, 0, sqrt2Over2), // bottom
    // FACES NOT USED
    new THREE.Quaternion(sqrt2Over2, 0, 0, sqrt2Over2), // top
    new THREE.Quaternion(0.0, 1.0, 0, 0.0), // back
    new THREE.Quaternion(0.0, sqrt2Over2, 0, sqrt2Over2), // left
    // END NOT USED
  ]
  const imageUpdated = (event) => {
    const img = event.detail
    const p = img.position
    const q = img.rotation
    const scaledMove = new THREE.Vector3(0, 0, img.scale * img.scaledWidth * -0.5)

    const transform = new THREE.Matrix4().compose(new THREE.Vector3(p.x, p.y, p.z),
      new THREE.Quaternion(q.x, q.y, q.z, q.w), new THREE.Vector3(1, 1, 1))
    const toCubeTransform = new THREE.Matrix4().compose(scaledMove, faceRotations[img.id], identityScale)
    const centerPos =  new THREE.Matrix4().multiplyMatrices(transform, toCubeTransform)
    const scaledPos  = new THREE.Matrix4().multiplyMatrices(centerPos, new THREE.Matrix4().makeScale(img.scale, img.scale, img.scale))

    cube.matrix.copy(scaledPos)
    cube.visible = true
    isMoved = true
  }

  const imageLost = (event) => {
    const img = event.detail
    numImageFound--
    if (numImageFound <= 0) {
      cube.visible = false
    }
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
      // Get the 3js scene from xr3js.
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
