// Define an 8th Wall XR Camera Pipeline Module that adds a cube to a threejs scene on startup.
import {ChromaKeyMaterial} from './chromakey'
const {dat} = window

export const initScenePipelineModule = () => {
  const videoFile = `${require('./assets/alpaca.mp4')}#t=0.001`

  // Populates a cube into an XR scene and sets the initial camera position.
  const initXrScene = ({scene, camera, renderer}) => {
    // Enable shadows in the rednerer.
    renderer.shadowMap.enabled = true

    // Add some light to the scene.
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 10, 7)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    const heightAspectRatio = 9 / 16
    const geometry = new THREE.PlaneGeometry(1, heightAspectRatio)
    const greenScreenMaterial = new ChromaKeyMaterial(
      videoFile, 0x19ae31, 1920, 1080, 0.159, 0.082, 0.214
    )
    const plane = new THREE.Mesh(geometry, greenScreenMaterial)
    plane.position.set(0, 1, 0)
    plane.scale.set(4, 4, 4)
    scene.add(plane)

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 2, 2)

    // set up gui
    const gui = new dat.GUI({width: 250})
    gui.addColor({color: 0x19ae31}, 'color').onChange((e) => {
      greenScreenMaterial.uniforms.keyColor.value.set(e)
    }).name('Color')
    gui.add(greenScreenMaterial.uniforms.similarity, 'value', 0, 1, 0.001)
      .name('Similarity')
    gui.add(greenScreenMaterial.uniforms.smoothness, 'value', 0, 1, 0.001)
      .name('Smoothness')
    gui.add(greenScreenMaterial.uniforms.spill, 'value', 0, 1, 0.001)
      .name('Spill')
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
