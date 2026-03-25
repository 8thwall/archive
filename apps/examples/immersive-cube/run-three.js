/* globals ResponsiveImmersive */

import './main.css'

const startButtonText = {
  start: '✓ START',
  stop: '✓ STOP',
  notSupported: '✗ XR NOT SUPPORTED',
}

const bgTex = new Promise((resolve) => {
  const texture = new THREE.TextureLoader().load(
    require('./assets/skyuni-4mb.png'),
    // require('./assets/bergsjostolen.jpg'),
    () => resolve(texture)
  )
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearFilter
  texture.encoding = THREE.sRGBEncoding
})

let background_ = null

const onScene = ({scene, camera, renderer}) => {
  renderer.outputEncoding = THREE.GammaEncoding

  // Light 1 - hemisphere
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
  light.position.set(0.5, 1, 0.25)
  scene.add(light)

  // Light 2 - directional
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(5, 10, 7)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // Add a purple cube that casts a shadow.
  const cubMat = new THREE.MeshBasicMaterial()
  cubMat.side = THREE.DoubleSide
  cubMat.map = new THREE.TextureLoader().load(require('./assets/cube-texture.png'))
  cubMat.color = new THREE.Color(0x7611B6)
  const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cubMat)
  cube.position.set(0, 0.5, 0)
  cube.castShadow = true
  scene.add(cube)

  // Add a plane that can receive shadows.
  const background = new THREE.Group()
  background.name = 'xrweb-background'
  // scene.add(background)

  const planeGeometry = new THREE.PlaneGeometry(10, 10)
  planeGeometry.rotateX(-Math.PI / 2)
  const planeMaterial = new THREE.MeshBasicMaterial({color: 0x57BFFF})
  planeMaterial.opacity = 0.33
  planeMaterial.transparent = true
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.position.y = -0.01
  // plane.receiveShadow = true
  background.add(plane)
  plane.add(new THREE.GridHelper(10, 100))

  background_ = plane

  // Set the initial camera position relative to the scene we just laid out. This must be at a
  // height greater than y=0.
  camera.position.set(1.4, 2, 1.4)
  camera.lookAt(0, 0.5, 0)

  bgTex.then((texture) => {
    const sphereGeometry = new THREE.SphereGeometry(500, 64, 32)
    const sphereMaterial = new THREE.MeshBasicMaterial({
      map: texture,
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphereGeometry.scale( -1, 1, 1 )
    background.add(sphere)
  })

  const q = camera.quaternion
  XR8.XrController.updateCameraProjectionMatrix(
    {origin: camera.position, facing: {w: q._w, x: q._x, y: q._y, z: q._z}}
  )
}

// Return a camera pipeline module that adds scene elements on start.
const cubeThreejsPipelineModule = () => ({
  // Camera pipeline modules need a name. It can be whatever you want but must be unique within
  // your app.
  name: 'cubethreejs',

  // onStart is called once when the camera feed begins. In this case, we need to wait for the
  // XR8.Threejs scene to be ready before we can access it to add content. It was created in
  // XR8.Threejs.pipelineModule()'s onStart method.
  onAttach: ({canvas}) => {
    const {scene, camera, renderer} = XR8.Threejs.xrScene()  // Get the scene from XR8.Threejs.

    onScene({scene, camera, renderer})  // Add objects set the starting camera position.

    // prevent scroll/pinch gestures on canvas
    canvas.addEventListener('touchmove', (event) => {
      event.preventDefault()
    })

    // Sync the xr controller's 6DoF position and camera paremeters with our scene.
    XR8.XrController.updateCameraProjectionMatrix(
      {origin: camera.position, facing: camera.quaternion, verbose: true}
    )

    // Recenter content when the canvas is tapped.
    canvas.addEventListener(
      'touchstart', (e) => {
        e.touches.length === 2 && XR8.XrController.recenter()
      }, true
    )
  },
})

const runThree = () => {
  document.body.insertAdjacentHTML('beforeend', require('./scene.html'))

  XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
    XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene.
    XR8.XrController.pipelineModule(),           // Enables SLAM tracking.
    XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
    // window.LandingPage.pipelineModule(), 
    XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
    XRExtras.PauseOnHidden.pipelineModule(),     // Shows an error image on runtime error.
    // Custom pipeline modules.
    cubeThreejsPipelineModule(),
  ])

  console.log('run')
  XR8.run({
    canvas: document.querySelector('#responsive-immersive'),
    verbose: true,
    webgl2: true,
    glContextConfig: {
      alpha: false,
      desynchronized: true,
      powerPreference: 'high-performance',
    },
    allowedDevices: 'any',
  })
}

export {
  runThree,
}
