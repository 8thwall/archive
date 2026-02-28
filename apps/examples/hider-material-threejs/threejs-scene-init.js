// Define an 8th Wall XR Camera Pipeline Module that adds a cube to a three.js scene on startup.
export const initScenePipelineModule = () => {
  // Create a clock to keep track of time.
  const clock = new THREE.Clock()

  // Create an occlusion material
  const hiderMaterial = new THREE.MeshStandardMaterial()
  hiderMaterial.colorWrite = false

  let cube  // Reference to the cube so we can update it later.

  // Populates a cube into an XR scene and sets the initial camera position.
  const initXrScene = ({scene, camera, renderer}) => {
    // Enable shadows in the renderer.
    renderer.shadowMap.enabled = true

    // Add some light to the scene.
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 10, 7)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Add a purple cube
    const material = new THREE.MeshBasicMaterial()
    material.side = THREE.DoubleSide
    material.map = new THREE.TextureLoader().load(
      'https://cdn.8thwall.com/web/assets/cube-texture.png'
    )
    material.color = new THREE.Color(0xAD50FF)
    cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)  // Assign to cube variable
    cube.position.set(0, -1, 0)  // Initial position is at (0, -1, 0)
    cube.castShadow = true
    scene.add(cube)

    // Add a plane to receive shadows (shadow plane)
    const planeGeometry2 = new THREE.PlaneGeometry(2000, 2000)
    const shadowMaterial = new THREE.ShadowMaterial()
    shadowMaterial.opacity = 0.5  // Adjust opacity as needed
    const shadowPlane = new THREE.Mesh(planeGeometry2, shadowMaterial)
    shadowPlane.position.y = 0.03  // Slightly above the hider plane
    shadowPlane.rotateX(-Math.PI / 2)
    shadowPlane.receiveShadow = true  // This plane should receive shadows
    scene.add(shadowPlane)

    // Add a plane with occlusion material
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000)
    planeGeometry.rotateX(-Math.PI / 2)
    const plane = new THREE.Mesh(planeGeometry, hiderMaterial)
    scene.add(plane)

    // Set the initial camera position relative to the scene we just laid out.
    // This must be at a height greater than y=0.
    camera.position.set(0, 2, 2)
  }

  // Return a camera pipeline module that adds scene elements on start.
  return {
    name: 'threejsinitscene',
    onStart: ({canvas}) => {
      const {scene, camera, renderer} = XR8.Threejs.xrScene()  // Get the 3js scene from XR8.Threejs
      initXrScene({scene, camera, renderer})  // Add objects, set the starting camera position.

      // Prevent scroll/pinch gestures on canvas.
      canvas.addEventListener('touchmove', (event) => {
        event.preventDefault()
      })

      // Sync the XR controller's 6DoF position and camera parameters with our scene.
      XR8.XrController.updateCameraProjectionMatrix(
        {origin: camera.position, facing: camera.quaternion}
      )

      // Recenter content when the canvas is tapped.
      canvas.addEventListener(
        'touchstart', (e) => {
          e.touches.length === 1 && XR8.XrController.recenter()
        }, true
      )
    },
    onUpdate: () => {
      // Get elapsed time since the clock was created.
      const elapsedTime = clock.getElapsedTime()

      // Calculate new Y position for cube using a sine function to ping-pong between -1 and 1.
      const newY = Math.sin(elapsedTime)

      // Update cube's Y position
      if (cube) {
        cube.position.y = newY
      }
    },
  }
}
