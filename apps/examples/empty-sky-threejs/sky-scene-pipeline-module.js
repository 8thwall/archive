// Returns a pipeline module that initializes a sky scene with a cube and space texture.
export const skyScenePipelineModule = () => {
  const TEXTURE = require('./assets/sky-textures/space.png')
  const PURPLE = '#AD50FF'

  let skyFound = false

  const addSkyDome = (object3d) => {
    const skyGeometry = new THREE.SphereGeometry(1000, 25, 25)
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load(TEXTURE)
    texture.encoding = THREE.sRGBEncoding
    texture.mapping = THREE.EquirectangularReflectionMapping
    const skyMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      toneMapped: true,
    })
    const skyBox = new THREE.Mesh(skyGeometry, skyMaterial)
    skyBox.material.side = THREE.BackSide
    object3d.add(skyBox)
  }

  const addCube = (object3d, x, y, z, color) => {
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    const texture =
      new THREE.TextureLoader().load('https://cdn.8thwall.com/web/assets/cube-texture.png')
    const material = new THREE.MeshBasicMaterial({map: texture, color})
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(x, y, z)
    object3d.add(cube)
  }

  const initSkyScene = ({scene, renderer}) => {
    renderer.outputEncoding = THREE.sRGBEncoding

    scene.add(new THREE.AmbientLight(0x404040, 7))

    addSkyDome(scene)

    addCube(scene, 0.15, 5, -10, PURPLE)
  }

  const layerFound = () => {
    if (!skyFound) {
      XR8.LayersController.recenter()
      skyFound = true
    }
  }

  return {
    // Pipeline modules need a name. It can be whatever you want but must be unique within your app.
    name: 'sky-scene',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart: ({canvas}) => {
      const {layerScenes, camera, renderer} = XR8.Threejs.xrScene()
      initSkyScene({scene: layerScenes.sky.scene, renderer})

      // Set the initial camera position.
      camera.position.set(0, 0, 0)

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR8.LayersController.configure({
        coordinates: {
          origin: {
            position: camera.position,
            rotation: camera.quaternion,
          },
        },
      })

      // Prevent scroll/pinch gestures on canvas.
      canvas.addEventListener('touchmove', (event) => {
        event.preventDefault()
      })

      // Prevent double tap zoom.
      document.ondblclick = function (e) {
        e.preventDefault()
      }
    },
    listeners: [
      {event: 'sky-coaching-overlay.hide', process: layerFound},
    ],
  }
}
