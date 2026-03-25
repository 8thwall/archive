const curvyThreejsModule = () => {
  const targets = []
  // generates a mesh that matches an image target's curvature properties
  const createCurvedGeometry = (geometry, isFull, userHeight, userWidth) => {
    const length = geometry.arcLengthRadians * (userWidth || 1)
    return new THREE.CylinderGeometry(
      geometry.radiusTop,
      geometry.radiusBottom,
      userHeight ? geometry.height * userHeight : geometry.height,
      50,
      1,
      true,
      (isFull ? 0.0 : (2 * Math.PI - length) / 2) + Math.PI,
      isFull ? 2 * Math.PI : length
    )
  }
  // Populates some object into an XR scene and sets the initial camera position. The scene and
  // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
  const initXrScene = ({scene, camera}) => {
    // Add soft white light to the scene.
    // This light cannot be used to cast shadows as it does not have a direction.
    scene.add(new THREE.AmbientLight(0x404040, 5))
    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 3, 0)
  }
  const constructGeometry = ({detail}) => {
    const {scene} = XR8.Threejs.xrScene()  // Get the 3js scene from XR
    detail.imageTargets.forEach(({name, type, geometry}) => {
      if (type === 'CYLINDRICAL' || type === 'CONICAL') {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`
        const curvedMesh = new THREE.Mesh(
          createCurvedGeometry(geometry, false),
          new THREE.MeshLambertMaterial({
            color: randomColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6,
          })
        )
        const imageTargetObj = new THREE.Object3D()
        imageTargetObj.visible = false
        imageTargetObj.add(curvedMesh)
        scene.add(imageTargetObj)
        targets[name] = imageTargetObj
      }
    })
  }

  // Places content over image target
  const showTarget = ({detail}) => {
    targets[detail.name].position.copy(detail.position)
    targets[detail.name].quaternion.copy(detail.rotation)
    targets[detail.name].scale.set(detail.scale, detail.scale, detail.scale)
    targets[detail.name].visible = true
  }

  // Hides the image frame when the target is no longer detected.
  const hideTarget = ({detail}) => {
    targets[detail.name].visible = false
  }

  // Grab a handle to the threejs scene and set the camera position on pipeline startup.
  const onStart = ({canvas}) => {
    const {scene, camera} = XR8.Threejs.xrScene()  // Get the 3js scene from XR
    initXrScene({scene, camera})  // Add content to the scene and set starting camera position.
    // prevent scroll/pinch gestures on canvas
    canvas.addEventListener('touchmove', (event) => {
      event.preventDefault()
    })
    // Sync the xr controller's 6DoF position and camera paremeters with our scene.
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    })
  }
  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be
    // unique within your app.
    name: 'threejs-curved-video',
    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart,
    // Listeners are called right after the processing stage that fired them. This guarantees that
    // updates can be applied at an appropriate synchronized point in the rendering cycle.
    listeners: [
      {event: 'reality.imagescanning', process: constructGeometry},
      {event: 'reality.imagefound', process: showTarget},
      {event: 'reality.imageupdated', process: showTarget},
      {event: 'reality.imagelost', process: hideTarget},
    ],
  }
}
export {curvyThreejsModule}
