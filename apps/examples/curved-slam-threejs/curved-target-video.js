const imageTargetPipelineModule = () => {
  const videoFile = require('./assets/Media/wine-label-video.mp4')

  let video
  let curvedGeo
  let curvedMesh
  let imageTargetObj

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
  const initXrScene = ({scene, camera, renderer}) => {
    // Enable shadows in the renderer.
    renderer.shadowMap.enabled = true

    imageTargetObj = new THREE.Object3D()
    scene.add(imageTargetObj)

    // Add some light to the scene.
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(3, 10, 3)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Add a purple cube that casts a shadow.
    const material = new THREE.MeshBasicMaterial()
    material.side = THREE.DoubleSide
    material.map = new THREE.TextureLoader().load(
      'https://cdn.8thwall.com/web/assets/cube-texture.png'
    )
    material.color = new THREE.Color(0xAD50FF)
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
    cube.position.set(0, 0.5, -3)
    cube.castShadow = true
    scene.add(cube)

    // Add soft white light to the scene.
    // This light cannot be used to cast shadows as it does not have a direction.
    scene.add(new THREE.AmbientLight(0x404040, 5))

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
    camera.position.set(0, 3, 0)
  }

  const constructGeometry = ({detail}) => {
    // create the video element
    video = document.createElement('video')
    video.src = videoFile
    video.setAttribute('preload', 'auto')
    video.setAttribute('loop', '')
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.load()

    const texture = new THREE.VideoTexture(video)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.format = THREE.RGBFormat
    texture.crossOrigin = 'anonymous'

    curvedGeo = createCurvedGeometry(detail.imageTargets[0].geometry, false)
    curvedMesh = new THREE.Mesh(
      curvedGeo,
      new THREE.MeshBasicMaterial({map: texture})
    )
    imageTargetObj.visible = false
    imageTargetObj.add(curvedMesh)
  }

  // Places content over image target
  const showTarget = ({detail}) => {
    // When the image target named 'wine-label' is detected, play video.
    // This string must match the name of the image target uploaded to 8th Wall.
    if (detail.name === 'wine-label') {
      imageTargetObj.position.copy(detail.position)
      imageTargetObj.quaternion.copy(detail.rotation)
      imageTargetObj.scale.set(detail.scale, detail.scale, detail.scale)
      imageTargetObj.visible = true
      video.play()
    }
  }

  // Hides the image frame when the target is no longer detected.
  const hideTarget = ({detail}) => {
    if (detail.name === 'wine-label') {
      video.load()
      imageTargetObj.visible = false
    }
  }

  // Grab a handle to the threejs scene and set the camera position on pipeline startup.
  const onStart = ({canvas}) => {
    const {scene, camera, renderer} = XR8.Threejs.xrScene()  // Get the 3js scene from XR

    initXrScene({scene, camera, renderer})  // Add content to the scene and set starting camera position.

    // prevent scroll/pinch gestures on canvas
    canvas.addEventListener('touchmove', (event) => {
      event.preventDefault()
    })

    // Sync the xr controller's 6DoF position and camera paremeters with our scene.
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    })
    
    // Recenter content when the canvas is tapped.
    canvas.addEventListener(
      'touchstart', (e) => {
        e.touches.length === 1 && XR8.XrController.recenter()
      }, true
    )
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

export {imageTargetPipelineModule}

