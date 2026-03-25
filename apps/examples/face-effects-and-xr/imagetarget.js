const imageTargetPipelineModule = () => {
  
  let sphere_ = null

  // Places content over image target
  const showTarget = ({detail}) => {
    sphere_.position.set(detail.position.x, detail.position.y, detail.position.z)
    sphere_.scale.set(detail.scale, detail.scale, detail.scale)
    // console.log(`show image target transform: ${JSON.stringify(detail)}`)
    // console.log(`show image target transform position: ${JSON.stringify(detail.position)}`)
  }

  // Hides the image frame when the target is no longer detected.
  const hideTarget = ({detail}) => {
    delete detail.scaledWidth
    delete detail.scaledHeight
    // console.log(`hide image target transform: ${JSON.stringify(detail)}`)
  }

  // Grab a handle to the threejs scene and set the camera position on pipeline startup.
  const onAttach = ({canvas}) => {
    const {scene, camera} = XR8.Threejs.xrScene()  // Get the 3js scene from XR
    
    const geometry = new THREE.SphereGeometry(1, 32, 32)
    const material = new THREE.MeshBasicMaterial({color: 0xffff00})
    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)
    sphere_ = sphere

    // initXrScene({scene, camera}) // Add content to the scene and set starting camera position.
    
    // prevent scroll/pinch gestures on canvas
    canvas.addEventListener('touchmove', function (event) {
      event.preventDefault()
    })
    
    // Sync the xr controller's 6DoF position and camera paremeters with our scene.
    // XR8.XrController.updateCameraProjectionMatrix({
    //   origin: camera.position,
    //   facing: camera.quaternion,
    // })
  }
  
  const onDetach = () => {
    const {scene} = XR8.Threejs.xrScene()
    scene.remove.apply(scene, scene.children)
  }

  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be
    // unique within your app.
    name: 'imagetarget',

    // onAttach is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onAttach method.
    onAttach,
    
    onDetach,

    // Listeners are called right after the processing stage that fired them. This guarantees that
    // updates can be applied at an appropriate synchronized point in the rendering cycle.
    listeners: [
      {event: 'reality.imagefound', process: showTarget},
      {event: 'reality.imageupdated', process: showTarget},
      {event: 'reality.imagelost', process: hideTarget},
    ],
  }
}

export {imageTargetPipelineModule}
