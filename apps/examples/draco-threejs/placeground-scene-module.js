// Returns a pipeline module that initializes the threejs scene when the camera feed starts, and
// handles subsequent spawning of a glb model whenever the scene is tapped.

/* globals TWEEN */

export const placegroundScenePipelineModule = () => {
  let model
  let mixer
  const DEFAULT_DRACO_DECODER_LOCATION = 'https://www.gstatic.com/draco/versioned/decoders/1.3.6/'

  const modelFile = require('./assets/robot-draco.glb')  // 3D model to spawn at tap
  const clock = new THREE.Clock()

  const loader = new THREE.GLTFLoader()

  // Provide a DRACOLoader instance to decode compressed mesh data

  const dracoLoader = new THREE.DRACOLoader()
  dracoLoader.setDecoderPath(DEFAULT_DRACO_DECODER_LOCATION)
  // Optional: Pre-fetch Draco WASM/JS module.
  dracoLoader.preload()
  loader.setDRACOLoader(dracoLoader)

  // Populates some object into an XR scene and sets the initial camera position. The scene and
  // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
  const initXrScene = ({scene, camera, renderer}) => {
    // Enable shadows in the rednerer.
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // Add some light to the scene.
    renderer.physicallyCorrectLights = true
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
    renderer.outputEncoding = THREE.sRGBEncoding

    scene.add(new THREE.AmbientLight(0x404040, 5))  // Add soft white light to the scene.

    const directionalLight = new THREE.DirectionalLight(0xffffff, 8)
    directionalLight.position.set(5, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Add the 3D model
    loader.load(
      modelFile,
      (gltf) => {
        model = gltf.scene
        model.castShadow = true
        // animate the model
        mixer = new THREE.AnimationMixer(model)
        const clip = gltf.animations[0]
        mixer.clipAction(clip.optimize()).play()
        scene.add(model)
      }
    )

    // Add a plane that can receive shadows.
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000)
    planeGeometry.rotateX(-Math.PI / 2)

    const planeMaterial = new THREE.ShadowMaterial()
    planeMaterial.opacity = 0.67

    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true

    scene.add(plane)

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 2, 2)
  }

  return {
    // Pipeline modules need a name. It can be whatever you want but must be unique within your app.
    name: 'threejsinitscene',

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
    },
    onUpdate: () => {
      if(!mixer) {
        return
      }
      // Animate the model
      const delta = clock.getDelta()
      mixer.update(delta)
    },
  }
}
