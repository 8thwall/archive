// generates a mesh that matches an image target's curvature properties
const createCurvedGeometry = (geometry, isFull, userHeight, userWidth) => {
  const length = geometry.arcLengthRadians * (userWidth || 1)
  return new THREE.CylinderGeometry(
    geometry.radiusTop,
    geometry.radiusBottom,
    userHeight ? geometry.height * userHeight : geometry.height,
    35,
    1,
    true,
    (isFull ? 0.0 : (2 * Math.PI - length) / 2) + Math.PI,
    isFull ? 2 * Math.PI : length
  )
}

const curvyTargetsSceneModule = () => {
  const purple = 0xAD50FF
  const grey = 0x808080
  let scene3

  return {
    name: 'curvytargetsscene',
    onStart: ({canvas, canvasWidth, canvasHeight, GLctx}) => {
      const renderer = new window.THREE.WebGLRenderer({
        canvas,
        context: GLctx,
        alpha: false,
        antialias: true,
      })
      renderer.autoClear = false
      renderer.setSize(canvasWidth, canvasHeight)
      renderer.gammaFactor = 2.2
      renderer.outputColorSpace = THREE.SRGBColorSpace
      const scene = new window.THREE.Scene()
      scene.background = new THREE.Color('skyblue')
      const camera = new window.THREE.PerspectiveCamera(
        35.0,
        canvasWidth / canvasHeight,
        0.01,
        2000.0
      )
      camera.position.set(0, 5, 8)
      scene.add(camera)

      const controls = new THREE.OrbitControls(camera, renderer.domElement)
      // https://github.com/mrdoob/three.js/issues/4327#issuecomment-855203187
      // controls.listenToKeyEvents(window)
      controls.target = new THREE.Vector3(0, 2, 0)
      controls.keyPanSpeed = 40
      controls.panSpeed = 2.0
      controls.zoomSpeed = 2.0
      // controls.update() must be called after any manual changes to the camera's transform
      controls.update()

      // Set up lighting.
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
      directionalLight.position.set(10, 10, 7)
      directionalLight.castShadow = true
      directionalLight.shadowMapHeight = 2048
      directionalLight.shadowMapWidth = 2048
      directionalLight.shadowCameraTop = 10
      scene.add(directionalLight)

      const ambLight = new THREE.AmbientLight(0xffffff, 0.3)
      scene.add(ambLight)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.BasicShadowMap

      // Add a plane that can receive shadows.
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 50),
        new THREE.MeshPhysicalMaterial({
          color: grey,
          transparent: false,
          opacity: 0.8,
          side: THREE.DoubleSide,
        })
      )
      plane.rotation.x = -Math.PI / 2
      plane.position.set(0, 0, 0)
      plane.receiveShadow = true
      scene.add(plane)

      // Add a grid helper
      const gridHelper = new THREE.GridHelper(50, 50)
      gridHelper.position.copy(new THREE.Vector3(0, 0.001, 0))
      scene.add(gridHelper)

      // Add targets.
      const targets = require('../targets.json')
      const loader = new THREE.TextureLoader()
      for (let i = 0; i < targets.length; i++) {
        const target = targets[i]

        const texture = loader.load(target.originalImagePath)
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
        if (target.isRotated) {
          // Interesting read: https://github.com/mrdoob/three.js/issues/5808
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping
          texture.rotation = Math.PI / 2
        }
        const labelMesh = new THREE.Mesh(
          createCurvedGeometry(target.geometry, false),
          new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: texture,
            side: THREE.DoubleSide,
            polygonOffset: true,
            polygonOffsetUnits: 1,
            polygonOffsetFactor: -2,  // more in front
          })
        )
        // labelMesh.labelMaterial.map.minFilter = THREE.LinearFilter
        labelMesh.castShadow = true

        const fullMesh = new THREE.Mesh(
          createCurvedGeometry(target.geometry, true),
          new THREE.MeshPhongMaterial({
            color: 0x5266EE,
            side: THREE.DoubleSide,
            polygonOffset: true,
            polygonOffsetUnits: 1,
            polygonOffsetFactor: 0,
          })
        )
        fullMesh.castShadow = true

        const imageTargetObj = new THREE.Object3D()
        imageTargetObj.add(labelMesh)
        imageTargetObj.add(fullMesh)

        scene.add(imageTargetObj)
        imageTargetObj.position.set(i * 2, 2, 0)
      }
      scene3 = {scene, camera, renderer, controls}
    },
    onCanvasSizeChange: ({canvasWidth, canvasHeight}) => {
      const {renderer, camera, controls} = scene3
      camera.aspect = canvasWidth / canvasHeight
      camera.updateProjectionMatrix()
      controls.update()
      renderer.setSize(canvasWidth, canvasHeight)
    },
    onRender: () => {
      const {scene, renderer, camera, controls} = scene3
      renderer.clearDepth()
      renderer.clearColor()
      controls.update()
      renderer.render(scene, camera)
    },
    // Get a handle to the xr scene, camera and renderer. Returns:
    // {
    //   scene: The Threejs scene.
    //   camera: The Threejs main camera.
    //   renderer: The Threejs renderer.
    //   controls: The orbital controls.
    // }
    xrScene: () => scene3,
  }
}

export {curvyTargetsSceneModule}
