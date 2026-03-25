// Define an 8th Wall XR Camera Pipeline Module that adds a cube to a threejs scene on startup.

export const initScenePipelineModule = (myThree) => {
  const purple = 0xAD50FF
  
  // Populates a cube into an XR scene and sets the initial camera position.
  const initXrScene = ({scene, camera, renderer}) => {
    // Enable shadows in the rednerer.
    renderer.shadowMap.enabled = true
    
    // Add some light to the scene.
    const	directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
		directionalLight.position.set(5, 10, 7)
		directionalLight.castShadow = true
		scene.add(directionalLight)
		
		// Add a purple cube that casts a shadow.
		const material = new THREE.MeshPhysicalMaterial()
		material.side = THREE.DoubleSide
		material.metalness = 0
		material.color = new THREE.Color(purple)
		
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
    cube.position.set(0, 0.5, 0)
    cube.castShadow = true
    scene.add(cube)

    // Add a plane that can receive shadows.
    const planeGeometry = new THREE.PlaneGeometry( 2000, 2000 )
    planeGeometry.rotateX( - Math.PI / 2 )

    const planeMaterial = new THREE.ShadowMaterial()
    planeMaterial.opacity = 0.67

    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    scene.add(plane)
    
    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 2, 2)
  }
  
  // Return a camera pipeline module that adds scene elements on start.
  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be unique within
    // your app.
    name: 'threejsinitscene',

    onStart: ({canvas}) => {
      const {scene, camera, renderer} = myThree.xrScene() // Get the 3js scene from myThree.

      initXrScene({scene, camera, renderer}) // Add objects set the starting camera position.
      
      // prevent scroll/pinch gestures on canvas
      canvas.addEventListener('touchmove', function (event) { event.preventDefault() }) 

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR8.XrController.updateCameraProjectionMatrix(
        {origin: camera.position, facing: camera.quaternion})
      
      // Recenter content when the canvas is tapped.
      canvas.addEventListener(
        'touchstart', (e) => { e.touches.length == 1 && XR8.XrController.recenter() }, true)
    }
  }
}
