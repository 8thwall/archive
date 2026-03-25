export const worldPointsVisualizerPipelineModule = () => {
  let worldPoints = null

  // Populates some object into an XR scene and sets the initial camera position. The scene and
  // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
  const initXrScene = ({scene, camera}) => {
    // Create object to attach worldPoints to
    worldPoints = new THREE.Object3D()
    scene.add(worldPoints)

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 3, 0)
  }

  const worldPointsTouchHandler = (e) => {
    // Call XrController.recenter() when the canvas is tapped with two fingers. This resets the
    // AR camera to the position specified by XrController.updateCameraProjectionMatrix() above.
    if (e.touches.length === 2) {
      XR8.XrController.recenter()
    }
  }

  return {
    // Pipeline modules need a name. It can be whatever you want but must be unique within your app.
    name: 'worldPointsPipelineModule',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR.Threejs scene to be ready before we can access it to add content. It was created in
    // XR.Threejs.pipelineModule()'s onStart method.
    onStart: ({canvas, canvasWidth, canvasHeight}) => {
      const {scene, camera} = XR8.Threejs.xrScene()  // Get the 3js sceen from xr3js.

      initXrScene({scene, camera})  // Add objects to the scene and set starting camera position.

      canvas.addEventListener('touchstart', worldPointsTouchHandler, true)  // Add touch listener.

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR8.XrController.updateCameraProjectionMatrix({
        origin: camera.position,
        facing: camera.quaternion,
      })

      // prevent scroll/pinch gestures on canvas
      canvas.addEventListener('touchmove', (event) => {
        event.preventDefault()
      })

      // Enable World Points
      XR8.XrController.configure({enableWorldPoints: true})
    },

    onUpdate: ({processCpuResult}) => {
      const {camera} = XR8.Threejs.xrScene()
      const {reality} = processCpuResult
      if (!reality || !reality.worldPoints) {
        return
      }

      const points = reality.worldPoints

      for (let i = 0; i < points.length; ++i) {
        const pt = points[i]  // {id, confidence, position: {x, y, z}}
        if (i >= worldPoints.children.length) {
          const geometry = new THREE.SphereGeometry(0.05, 8, 8)
          const material = new THREE.MeshBasicMaterial({color: 0xffffff})
          worldPoints.add(new THREE.Mesh(geometry, material))
        }
        const point = worldPoints.children[i]
        point.position.set(pt.position.x, pt.position.y, pt.position.z)
        const dist = camera.position.distanceTo(pt.position)

        switch (true) {
          case (dist < 1):
            point.material.color = new THREE.Color(0x790706)
            break
          case (dist < 2):
            point.material.color = new THREE.Color(0xD23107)
            break
          case (dist < 3):
            point.material.color = new THREE.Color(0xFB8022)
            break
          case (dist < 4):
            point.material.color = new THREE.Color(0xEED03A)
            break
          case (dist < 5):
            point.material.color = new THREE.Color(0xA3FD3E)
            break
          case (dist < 6):
            point.material.color = new THREE.Color(0x31F199)
            break
          case (dist < 7):
            point.material.color = new THREE.Color(0x29BBEC)
            break
          case (dist < 8):
            point.material.color = new THREE.Color(0x476BE3)
            break
          case (dist < 9):
            point.material.color = new THREE.Color(0x30123B)
            break
          default:
            point.material.color = new THREE.Color('white')
            break
        }
        point.visible = true
      }

      worldPoints.children.slice(points.length).forEach(m => m.visible = false)
    },
  }
}
