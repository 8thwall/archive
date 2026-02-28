// Define an 8th Wall XR Camera Pipeline Module that adds a cube to a threejs scene on startup.

export const initScenePipelineModule = () => {
  let meshOccluder
  let meshShadowReceiver
  let meshAnimation

  let mixer
  const clock = new THREE.Clock()
  const loader = new THREE.GLTFLoader()

  const group = new THREE.Group()
  group.visible = false

  // Download the mesh from the geospatial browser and add it here.
  // const modelFile = require('./assets/mesh.glb')

  // If you have a prebaked animation that interacts with the mesh, add it here.
  // const animationFile = require('./assets/animation.glb')

  // Applies occlusion material.
  const hiderMaterial = new THREE.MeshStandardMaterial()
  hiderMaterial.colorWrite = false
  const applyHiderMaterial = (mesh) => {
    if (!mesh) return
    if (mesh.material) {
      mesh.material = hiderMaterial
    }
    mesh.traverse((node) => {
      if (node.isMesh) {
        node.material = hiderMaterial
      }
    })
  }

  // Applies shadow material.
  const shadowMaterial = new THREE.ShadowMaterial()
  shadowMaterial.opacity = 0.4
  shadowMaterial.transparent = true
  shadowMaterial.polygonOffset = true
  shadowMaterial.polygonOffsetFactor = -4
  const applyShadowMaterial = (mesh) => {
    if (!mesh) return
    if (mesh.material) {
      mesh.material = shadowMaterial
      mesh.material.needsUpdate = true
    }
    mesh.traverse((node) => {
      if (node.isMesh) {
        node.material = shadowMaterial
      }
    })
  }

  // Adds mesh occluder, shadow material, and prebaked animation
  const initXrScene = ({scene, camera, renderer}) => {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Add some light to the scene.
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
    scene.add(ambientLight)

    const light = new THREE.DirectionalLight(0xffffff, 0.8)
    light.position.set(0, 10, -6)
    light.shadow.mapSize.width = 1024
    light.shadow.mapSize.height = 1024
    light.shadow.camera.near = 0.5
    light.shadow.camera.far = 500
    light.castShadow = true
    scene.add(light)

    // Add the mesh occluder.
    // loader.load(modelFile, (gltf) => {
    //   meshOccluder = gltf.scene
    //   applyHiderMaterial(meshOccluder)
    //   group.add(meshOccluder)
    // })

    // Add the mesh shadow receiver.
    // loader.load(modelFile, (gltf) => {
    //   meshShadowReceiver = gltf.scene
    //   applyShadowMaterial(meshShadowReceiver)
    //   group.add(meshShadowReceiver)
    // })

    // Add prebaked animation, if applicable
    // loader.load(animationFile, (gltf) => {
    //   meshAnimation = gltf.scene
    //   mixer = new THREE.AnimationMixer(meshAnimation)
    //   const clip = gltf.animations[0]
    //   mixer.clipAction(clip.optimize()).play()
    //   group.add(meshAnimation)
    // })

    scene.add(group)

    camera.position.set(0, 2, 2)
  }

  const locationFound = ({detail}) => {
    group.visible = true
    group.position.copy(detail.position)
    group.quaternion.copy(detail.rotation)
  }

  const locationLost = ({detail}) => {
    group.visible = false
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
    },
    onUpdate: () => {
      if (!mixer) {
        return
      }
      // Animate the model
      const delta = clock.getDelta()
      mixer.update(delta)
    },
    listeners: [
      {event: 'reality.projectwayspotfound', process: locationFound},
      {event: 'reality.projectwayspotlost', process: locationLost},
    ],
  }
}
