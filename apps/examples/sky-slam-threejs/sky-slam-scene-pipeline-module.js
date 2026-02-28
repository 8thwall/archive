// Returns a pipeline module that initializes a sky + world tracking scene with a hot air balloon.
/* globals TWEEN */
export const skySlamScenePipelineModule = () => {
  let skyFound = false
  let balloon
  let slamScene

  let balloonForwardTween
  let balloonRiseTween
  let balloonLandTween

  const addLights = (scene) => {
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(5, 10, 5)  // default
    light.shadow.mapSize.width = 2048
    light.shadow.mapSize.height = 2048
    light.shadow.camera.near = 0.5  // default
    light.shadow.camera.far = 500  // default
    light.shadow.camera.top = 20
    light.shadow.camera.bottom = -20
    light.shadow.camera.left = -20
    light.shadow.camera.right = 20
    light.shadow.radius = 8
    light.castShadow = true
    scene.add(light)
    scene.add(new THREE.AmbientLight(0x404040, 5))
  }

  const initSkyScene = ({scene, renderer}) => {
    renderer.shadowMap.enabled = true
    addLights(scene)

    const balloonGlbPath = require('./assets/models/balloon.glb')

    // create a loader for GLB files
    const loader = new THREE.GLTFLoader()
    // load the balloon model
    loader.load(
      balloonGlbPath,
      (gltf) => {
        // get the root object from the loaded scene
        balloon = gltf.scene
        balloon.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true
          }
        })

        // set the initial position, scale, and rotation of the balloon
        balloon.position.set(0, -7, -13)
        balloon.scale.set(0.7, 0.7, 0.7)
        balloon.rotation.set(0, 0, 0)

        balloonRiseTween = new TWEEN.Tween(balloon.position).to({x: 0, y: 10, z: -11}, 6000)
          .easing(TWEEN.Easing.Quadratic.InOut)
        balloonForwardTween = new TWEEN.Tween(balloon.position).to({x: 0, y: 8, z: -9}, 2000)
          .easing(TWEEN.Easing.Sinusoidal.In)
        balloonRiseTween.chain(balloonForwardTween)

        balloonLandTween = new TWEEN.Tween(balloon.position).to({x: 0, y: 0, z: -6}, 5000)
          .easing(TWEEN.Easing.Quadratic.Out)

        // add the model to the scene
        scene.add(balloon)
      },
      undefined,
      (error) => {
        console.error('Error loading GLB model:', error)
      }
    )
  }

  const initSLAMScene = ({scene}) => {
    slamScene = scene
    addLights(scene)
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000, 1, 1),
      new THREE.ShadowMaterial({
        opacity: 0.5,
      })
    )
    ground.rotateX(-Math.PI / 2)
    ground.position.set(0, 0, 0)
    ground.receiveShadow = true
    scene.add(ground)
  }

  const layerFound = () => {
    if (!skyFound) {
      SkyCoachingOverlay.control.setAutoShowHide(false)

      XR8.LayersController.recenter()
      XR8.XrController.recenter()

      balloonRiseTween.start()
      setTimeout(() => {
        slamScene.add(balloon)
        balloonLandTween.start()
      }, 8000)

      skyFound = true
    }
  }

  return {
    // Pipeline modules need a name. It can be whatever you want but must be unique within your app.
    name: 'sky-slam-scene',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart: ({canvas}) => {
      const {scene, layerScenes, camera, renderer} = XR8.Threejs.xrScene()
      initSkyScene({scene: layerScenes.sky.scene, renderer})
      initSLAMScene({scene})

      // Set the initial camera position.
      camera.position.set(0, 3, 0)

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR8.LayersController.configure({
        coordinates: {
          origin: {
            position: camera.position,
            rotation: camera.quaternion,
          },
        },
      })

      XR8.XrController.updateCameraProjectionMatrix({
        origin: camera.position,
        facing: camera.quaternion,
      })

      // Enable TWEEN animations.
      const animate = (time) => {
        requestAnimationFrame(animate)
        TWEEN.update(time)
      }
      animate()

      // Prevent scroll/pinch gestures on canvas.
      canvas.addEventListener('touchmove', (event) => {
        event.preventDefault()
      })

      // Prevent double tap zoom.
      document.ondblclick = (e) => {
        e.preventDefault()
      }
    },
    listeners: [
      {event: 'sky-coaching-overlay.hide', process: layerFound},
    ],
  }
}
