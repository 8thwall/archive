/* eslint-disable */

// Visualizes the tracking status emitted from our XrController.
const meshUpdateModule = () => {
  let mesh = null

  let allowMeshUpdate = false

  // Div containing mesh opacity slider.
  let meshSlider = null

  const startingOpacity_ = 0.5

  const setMeshPosition = ({detail}) => {
    const {position, rotation} = detail
    mesh.position.copy(position)
    mesh.quaternion.copy(rotation)
  }

  const updateMeshPosition = ({detail}) => {
    if (allowMeshUpdate) {
      setMeshPosition({detail})
    }
  }

  const opacitySliderChanged = () => {
    const val = parseFloat(document.getElementById('opacity-slider').value, 10)
    if (mesh) {
      mesh.material.opacity = val
    }
    document.getElementById('opacity-val').innerHTML = val
  }
  
  const meshFound = ({detail}) => {
    const {scene} = XR8.Threejs.xrScene()  // Get the 3js scene from XR8.Threejs
    const {bufferGeometry, position, rotation} = detail 
    
    let texture = null
    const threeMaterial = new THREE.MeshBasicMaterial({
      vertexColors: !texture,
      wireframe: false,
      visible: true,
      map: texture,
    })

    mesh = new THREE.Mesh(bufferGeometry, threeMaterial)
    mesh.material.transparent = true
    mesh.material.opacity = startingOpacity_

    scene.add(mesh)
    setMeshPosition({detail})
  }

  const meshLost = () => {
    const {scene} = XR8.Threejs.xrScene()
    // Remove all children in the scene.
    scene.remove.apply(scene, scene.children);

    console.log('[mesh-update@meshLost] Num children in scene: ', scene.children)
  }

  const onAttach = () => {
    // Add a slider to configure mesh opacity, and divs for nodeId and confidence.
    meshSlider = document.createElement('div')
    meshSlider.style.cssText = 'position:absolute; margin: 5em 0 0 1em; background-color: white; z-index: 1; top: 30px'
    meshSlider.innerHTML =
      `${'Mesh Opacity: <br/>' +
      `<input id="opacity-slider" type="range" value=${startingOpacity_} max="1.0" step="0.01">` +
      '<output id="opacity-val">0.5</output>'}`
    document.body.insertBefore(meshSlider, document.body.firstChild)
    document.getElementById('opacity-slider').oninput = opacitySliderChanged
  }

  const onDetach = () => {
    meshSlider.remove()
  }

  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be unique within
    // your app.
    name: 'meshupdate',

    onAttach,
    onDetach,

    // Listeners are called right after the processing stage that fired them. This guarantees that
    // updates can be applied at an appropriate synchronized point in the rendering cycle.
    listeners: [
      {event: 'threejsrenderer.meshfound', process: meshFound},
      {event: 'threejsrenderer.meshupdated', process: updateMeshPosition},
      {event: 'threejsrenderer.meshlost', process: meshLost},
    ],
  }
}

export {meshUpdateModule}
