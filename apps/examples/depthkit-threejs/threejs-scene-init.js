// Define an 8th Wall XR Camera Pipeline Module that adds a cube to a threejs scene on startup.

export const initScenePipelineModule = () => {
  let depthkit
  let character
  const capture = 'autumn'

  // Populates a cube into an XR scene and sets the initial camera position.
  const initXrScene = ({scene, camera, renderer}) => {
    // Add some light to the scene.
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 10, 7)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    depthkit = new Depthkit()
    depthkit.meshScalar = 8.0
    depthkit.name = 'dk'
    depthkit.load(require(`./capture-data/${capture}.txt`),
      require(`./assets/captures/${capture}.mp4`),
      (dkCharacter) => {
        character = dkCharacter

        // Position and rotation adjustments
        dkCharacter.position.set(0, 1.18, 0)
        dkCharacter.scale.set(1.25, 1.25, -1.25)

        // Depthkit video playback control
        depthkit.video.muted = 'muted'  // Necessary for auto-play in chrome now
        depthkit.setLoop(true)
        depthkit.play()

        // Add the character to the scene
        scene.add(character)
      })

    // Add a blob shadow.
    const geometry = new THREE.CircleGeometry(1, 32)
    const texture = new THREE.TextureLoader().load(require('./assets/shadow.png'))
    const material = new THREE.MeshBasicMaterial({map: texture, transparent: true, opacity: 0.4})
    const circle = new THREE.Mesh(geometry, material)
    circle.rotation.set(-Math.PI / 2, 0, Math.PI / 4)
    circle.scale.set(1, 0.8, 1)
    scene.add(circle)

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 2, 2)
  }

  // Return a camera pipeline module that adds scene elements on start.
  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be unique within
    // your app.
    name: 'threejsinitscene',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart: ({canvas}) => {
      const {scene, camera, renderer} = XR8.Threejs.xrScene()  // Get the 3js scene from XR8.Threejs

      initXrScene({scene, camera, renderer})  // Add objects set the starting camera position.

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR8.XrController.updateCameraProjectionMatrix(
        {origin: camera.position, facing: camera.quaternion}
      )

      // prevent scroll/pinch gestures on canvas.
      canvas.addEventListener('touchmove', event => event.preventDefault())

      // Recenter content when the canvas is tapped.
      canvas.addEventListener(
        'touchstart', (e) => {
          if (e.touches.length === 1) {
            XR8.XrController.recenter()
          }
        }, true
      )
    },
  }
}
