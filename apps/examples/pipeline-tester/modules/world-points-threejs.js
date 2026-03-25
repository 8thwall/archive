export const worldPointsVisualizerPipelineModule = () => {
  let worldPoints = null
  let legend = null

  // Populates some object into an XR scene and sets the initial camera position. The scene and
  // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
  const initXrScene = ({scene, camera}) => {
    // Create object to attach worldPoints to
    worldPoints = new THREE.Object3D()
    scene.add(worldPoints)

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 1, 0)
  }

  // Grab a handle to the threejs scene and set the camera position on pipeline startup.
  const createLegend = () => {
    legend = document.createElement('div')
    legend.style.cssText = ('position: absolute; margin: 0em 0px 0px 0em; padding: 0.5em; ' +
        'background-color: white; z-index: 1; bottom: 0; font-size: 13px')
    legend.innerHTML = (
      'Distance to color: <br />' +
        '  < 0.1  = <span style="color: #790706">dark red</span> <br />' +
        '  < 0.25 = <span style="color: #D23107">red</span> <br />' +
        '  < 0.5  = <span style="color: #FB8022">orange</span> <br />' +
        '  < 0.75 = <span style="color: #EED03A">yellow</span> <br />' +
        '  < 1.0  = <span style="color: #A3FD3E">light green</span> <br />' +
        '  < 1.5  = <span style="color: #31F199">teal</span> <br />' +
        '  < 2.0  = <span style="color: #29BBEC">blue</span> <br />' +
        '  < 3.0  = <span style="color: #476BE3">dark blue</span> <br />' +
        '  < 4.0  = <span style="color: black">black</span> <br />' +
        ' >= 4.0  = <span style="color: black">white</span> <br />'
    )
    document.body.insertBefore(legend, document.body.firstChild)
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
      createLegend()
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

    onDetach: () => {
      legend.remove()
    },

    onUpdate: ({processCpuResult}) => {
      const {camera} = XR8.Threejs.xrScene()
      const {reality} = processCpuResult
      if (!reality || !reality.worldPoints) {
        return
      }

      let points = reality.worldPoints
      if (reality.trackingStatus === 'LIMITED') {
        points = []
      }

      for (let i = 0; i < points.length; ++i) {
        const pt = points[i]  // {id, confidence, position: {x, y, z}}
        if (i >= worldPoints.children.length) {
          const geometry = new THREE.SphereGeometry(0.0075, 8, 8)
          const material = new THREE.MeshBasicMaterial({color: 0xffffff})
          worldPoints.add(new THREE.Mesh(geometry, material))
        }
        const point = worldPoints.children[i]
        point.position.set(pt.position.x, pt.position.y, pt.position.z)
        const dist = camera.position.distanceTo(pt.position)

        switch (true) {
          case (dist < 0.1):
            point.material.color = new THREE.Color(0x790706)
            break
          case (dist < 0.25):
            point.material.color = new THREE.Color(0xD23107)
            break
          case (dist < 0.5):
            point.material.color = new THREE.Color(0xFB8022)
            break
          case (dist < 0.75):
            point.material.color = new THREE.Color(0xEED03A)
            break
          case (dist < 1.0):
            point.material.color = new THREE.Color(0xA3FD3E)
            break
          case (dist < 1.5):
            point.material.color = new THREE.Color(0x31F199)
            break
          case (dist < 2):
            point.material.color = new THREE.Color(0x29BBEC)
            break
          case (dist < 3):
            point.material.color = new THREE.Color(0x476BE3)
            break
          case (dist < 4):
            point.material.color = new THREE.Color(0x000000)
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
