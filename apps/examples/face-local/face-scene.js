import {faceMeshController} from './face-mesh-controller'

// const MESH_URL = require('./assets/8-tat-flip.png')
const MESH_URL = require('./assets/mesh_map_low_res.png')

// Build a pipeline module that initializes and updates the three.js sceen based on facecontroller
// events.
const faceScenePipelineModule = () => {
  const faceMeshController_ = faceMeshController(MESH_URL)  // Start loading mesh url early.
  let canvas_
  let modelGeometry_
  
  // init is called by onAttach and by facecontroller.faceloading. It needs to be called by both
  // before we can start.
  const init = ({canvas, detail}) => {
    if (faceMeshController_.mesh()) {
      return
    }
    
    canvas_ = canvas_ || canvas
    modelGeometry_ = modelGeometry_ || detail
    
    if (!(canvas_ && modelGeometry_)) {
      return
    }
    
    const {scene, renderer} = XR8.Threejs.xrScene()  // Get the 3js scene from XR
    
    renderer.autoClear = true
    
    const targetObject = new THREE.Object3D()
    targetObject.position.set(0, 0, -1)
    scene.add(targetObject)
    
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 )
    directionalLight.castShadow = true
    directionalLight.position.set(0, 0, 0)
    directionalLight.target = targetObject
    scene.add(directionalLight)
    
    scene.add(faceMeshController_.buildMesh(modelGeometry_))
  }
  
  const onDetach = () => {
    canvas_ = null
    modelGeometry_ = null
  }
  
  const update = ({detail}) => faceMeshController_.update(detail)
  const hide = () => faceMeshController_.hide()

  return {
    name: 'facescene',
    onAttach: init,
    onDetach,
    listeners: [
      {event: 'facecontroller.faceloading', process: init},
      {event: 'facecontroller.facefound', process: update},
      {event: 'facecontroller.faceupdated', process: update},
      {event: 'facecontroller.facelost', process: hide},
    ],
  }
}

export {faceScenePipelineModule}
