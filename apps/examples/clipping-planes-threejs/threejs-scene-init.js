// Define an 8th Wall XR Camera Pipeline Module that adds a cube to a threejs scene on startup.

/* globals dat */

const clippingPlaneScenePipelineModule = () => {
  // Populates XR Scene
  const initXrScene = ({scene, camera, renderer}) => {
    // Renderer should respect object-level clipping planes
    renderer.localClippingEnabled = true

    const params = {
      clipIntersection: true,
      planeConstant: 0,
      showHelpers: true,
    }

    const clipPlanes = [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), 0),
    ]

    // Generate spheres
    const group = new THREE.Group()
    for (let i = 1; i <= 30; i += 2) {
      const geometry = new THREE.SphereGeometry(i / 30, 48, 24)
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5),
        side: THREE.DoubleSide,
        clippingPlanes: clipPlanes,
        clipIntersection: params.clipIntersection,
      })
      group.add(new THREE.Mesh(geometry, material))
    }
    scene.add(group)

    // Helpers
    const helpers = new THREE.Group()
    helpers.add(new THREE.PlaneHelper(clipPlanes[0], 2, 0xff0000))
    helpers.add(new THREE.PlaneHelper(clipPlanes[1], 2, 0x00ff00))
    helpers.add(new THREE.PlaneHelper(clipPlanes[2], 2, 0x0000ff))
    helpers.visible = true
    scene.add(helpers)

    // GUI
    const gui = new dat.GUI({width: 250})
    gui.domElement.id = 'gui'

    gui.add(params, 'clipIntersection').name('clip intersection').onChange((value) => {
      const {children} = group
      for (let i = 0; i < children.length; i++) {
        children[i].material.clipIntersection = value
      }
    })
    gui.add(params, 'planeConstant', -1, 1).step(0.01).name('plane constant').onChange((value) => {
      for (let j = 0; j < clipPlanes.length; j++) {
        clipPlanes[j].constant = value
      }
    })

    gui.add(params, 'showHelpers').name('show helpers').onChange((value) => {
      helpers.visible = value
    })

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x080808, 1.5)
    hemisphereLight.position.set(-1.25, 1, 1.25)
    scene.add(hemisphereLight)

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 2.5, 3)
  }

  // Return a camera pipeline module that adds scene elements on start.
  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be unique within
    // your app.
    name: 'clipping-plane-scene',

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

      // Recenter content when the canvas is tapped.
      canvas.addEventListener(
        'touchstart', (e) => {
          e.touches.length === 1 && XR8.XrController.recenter()
        }, true
      )
    },
  }
}

export {clippingPlaneScenePipelineModule}
