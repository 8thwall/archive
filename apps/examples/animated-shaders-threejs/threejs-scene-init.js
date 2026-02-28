// Define an 8th Wall XR Camera Pipeline Module that adds a cube to a threejs scene on startup.
import {fragmentShaders, vertexShaders} from './shaders'

export const initScenePipelineModule = () => {
  const clock = new THREE.Clock()
  const purple = 0xAD50FF
  let idx = 0
  let cube

  const uniforms1 = {
    'time': {value: 1.0},
  }

  const uniforms2 = {
    'time': {value: 1.0},
    'colorTexture': {value: new THREE.TextureLoader().load(require('./assets/textures/disturb.jpg'))},
  }
  uniforms2.colorTexture.value.wrapS = uniforms2.colorTexture.value.wrapT = THREE.RepeatWrapping

  const uniforms3 = {
    'fogDensity': {value: 0.45},
    'fogColor': {value: new THREE.Vector3(0, 0, 0)},
    'time': {value: 1.0},
    'uvScale': {value: new THREE.Vector2(3.0, 1.0)},
    'texture1': {value: new THREE.TextureLoader().load(require('./assets/textures/cloud.png'))},
    'texture2': {value: new THREE.TextureLoader().load(require('./assets/textures/lavatile.jpg'))},

  }
  uniforms3.texture1.value.wrapS = uniforms3.texture1.value.wrapT = THREE.RepeatWrapping
  uniforms3.texture2.value.wrapS = uniforms3.texture2.value.wrapT = THREE.RepeatWrapping

  const params = [
    [fragmentShaders[0], vertexShaders[0], uniforms1],  // fragment_shader1
    [fragmentShaders[1], vertexShaders[0], uniforms2],  // fragment_shader2
    [fragmentShaders[2], vertexShaders[0], uniforms1],  // fragment_shader3
    [fragmentShaders[3], vertexShaders[0], uniforms1],  // fragment_shader4
    [fragmentShaders[4], vertexShaders[1], uniforms3],
  ]

  const changeMaterial = () => {
    const material = new THREE.ShaderMaterial({
      fragmentShader: params[idx][0],
      vertexShader: params[idx][1],
      uniforms: params[idx][2],
    })
    cube.material = material
    idx = (idx + 1) % params.length
  }

  // Populates a cube into an XR scene and sets the initial camera position.
  const initXrScene = ({scene, camera, renderer}) => {
    // Enable shadows in the rednerer.
    renderer.shadowMap.enabled = true

    // Add some light to the scene.
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 10, 7)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Set initial material
    const material = new THREE.ShaderMaterial({
      fragmentShader: params[idx][0],
      vertexShader: params[idx][1],
      uniforms: params[idx][2],
    })
    idx = (idx + 1) % params.length

    cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
    cube.position.set(0, 0.5, 0)
    cube.castShadow = true
    scene.add(cube)

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
    camera.position.set(0, 2, 2)
  }

  // Return a camera pipeline module that adds scene elements on start.
  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be unique within
    // your app.
    name: 'threejsinitscene',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart: ({canvas}) => {
      const nextButton = document.getElementById('nextbutton')
      nextButton.style.display = 'block'
      nextButton.onclick = changeMaterial

      const {scene, camera, renderer} = XR8.Threejs.xrScene()  // Get the 3js scene from XR8.Threejs

      initXrScene({scene, camera, renderer})  // Add objects set the starting camera position.

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
    onUpdate: () => {
      const delta = clock.getDelta()
      uniforms1.time.value += delta * 5
      uniforms2.time.value = clock.elapsedTime
      uniforms3.time.value += delta * 2
    },
  }
}
