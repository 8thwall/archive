// Define an 8th Wall XR Camera Pipeline Module that adds a cube to a threejs scene on startup.

export const initScenePipelineModule = () => {
  let ratk

  const setupRoom = ({scene, renderer}) => {
    ratk = new window.RealityAccelerator(renderer.xr)
    ratk.onPlaneAdded = (plane) => {
      console.log(plane)
      const mesh = plane.planeMesh
      mesh.material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.5,
        color: Math.random() * 0xffffff,
        side: THREE.DoubleSide,
      })
    }
    scene.add(ratk.root)
  }

  // Return a camera pipeline module that handles room setup
  return {
    name: 'roomsetup',

    onStart: () => {
      const {scene, camera, renderer} = XR8.Threejs.xrScene()

      setupRoom({scene, renderer})

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR8.XrController.updateCameraProjectionMatrix(
        {origin: camera.position, facing: camera.quaternion}
      )
    },
    onUpdate: () => {
      ratk.update()
    },
  }
}
