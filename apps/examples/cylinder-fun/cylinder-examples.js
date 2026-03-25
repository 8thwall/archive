// Returns a pipeline module that initializes the threejs scene when the camera feed starts, and
// handles subsequent spawning of a glb model whenever the scene is tapped.

// Places content over image target
const showTarget = (targetName, getModel) => ({name, detail}) => {
  // When the image target is detected, show 3D model.
  // This string must match the name of the image target uploaded to 8th Wall.
  if (detail.name === targetName) {
    const model = getModel()
    document.getElementById("textbox").innerText = `x=${detail.position.x} y=${detail.position.y} z=${detail.position.z}\nscale=${detail.scale}`
    
    model.position.copy(detail.position)
    model.quaternion.copy(detail.rotation)
    model.scale.set(detail.scale, detail.scale, detail.scale)
    model.visible = true
  }
}

const logEvent = ({name, detail}) => {
  console.log(`Handling event ${name}, got detail, ${JSON.stringify(detail)}`)
}

// Hides the image frame when the target is no longer detected.
const hideTarget = (targetName, model) => ({detail}) => {
  if (detail.name === targetName) {
    model.visible = false
  }
}

// TODO(dat): Move this to xrExtras? We also need a simper API that would check that metadata.type === CYLINDER
const createCylinderGeometry = (properties) => {
  console.log("Creating cylinder with geometry", properties)
  const height = properties.originalHeight / properties.height
  const radius = properties.cylinderCircumferenceTop / properties.cylinderSideLength / (2 * Math.PI) * height
  const thetaLength = 2 * Math.PI * properties.targetCircumferenceTop / properties.cylinderCircumferenceTop
  const thetaStart = (2 * Math.PI - thetaLength) / 2
  return new THREE.CylinderGeometry(radius, radius, height, 50, 1, true, thetaStart, thetaLength)
}

const simpleGeometryExample = () => {
  let activation_ = null
  let glbModel_ = null
  let activationGeo_ = null

  const getModel = () => activation_
  
  const initializeModel = (targetName) => ({name, detail}) => {
    const {imageTargets} = detail
    const targetMetadata = imageTargets.find(it => it.name === targetName)
    if (!targetMetadata) {
      console.warn(`Cannot find target with name ${targetName} from event type ${name}`)
      return
    }
    
    activationGeo_ = createCylinderGeometry(targetMetadata.properties)
    const activationLoader = new THREE.TextureLoader()
    const activationMaterial = new THREE.MeshStandardMaterial({
      wireframe: true,
      //map: activationLoader.load(require('./assets/coke.jpg')),
      //side: THREE.DoubleSide
    })
    const activationMesh = new THREE.Mesh( activationGeo_, activationMaterial )
    activationMesh.rotation.set(0, Math.PI, 0)
    activation_.add(activationMesh)
  }

  return {
    init: () => {
      console.log('Example cylinder - overlay')
      const {scene, camera} = XR8.Threejs.xrScene()  // Get the 3js sceen from xr3js.
      
      activation_ = new THREE.Object3D()
      activation_.position.set(0, 0, -20)
      activation_.rotation.set(0, 0, 0)
      scene.add(activation_)

      //const light = new THREE.AmbientLight( 0xffffff)
      const light = new THREE.PointLight( 0xffffff, 1, 0)
      light.position.set(0, 0, 0)
      camera.add(light)
  
      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR8.XrController.updateCameraProjectionMatrix({
        origin: camera.position,
        facing: camera.quaternion,
      })
    },
    
    update: () => {

    },
    
    listeners: [
      {event: 'reality.imageloading', process: logEvent },
      {event: 'reality.imagescanning', process: initializeModel('flowerTLCrop') },
      {event: 'reality.imagefound', process: showTarget('flowerTLCrop', getModel)},
      {event: 'reality.imageupdated', process: showTarget('flowerTLCrop', getModel)},
      {event: 'reality.imagelost', process: hideTarget('flowerTLCrop', getModel)},
    ],
  }
}

export const cylinderExamples = () => {
  const example = simpleGeometryExample()

  return {
    // Pipeline modules need a name. It can be whatever you want but must be unique within your app.
    name: 'cylinder',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.

    onStart: example.init,
    onProcessGpu: example.update,
    listeners: example.listeners,
  }
}
