/* eslint-disable no-console */
/* eslint-disable max-len */

// Define an 8th Wall XR Camera Pipeline Module that displays a cube at a VPS response position.

export const vpsWayspotModule = ({onWayspotScanning, onWayspotStatus}) => {

  let cube_ = null

  let isVisible_ = false


  // Populates a cube into an XR scene and sets the initial camera position.
  const initXrScene = ({scene, camera, renderer}) => {
    // Enable shadows in the rednerer.
    renderer.shadowMap.enabled = true

    // Add some light to the scene.
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 10, 7)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Add a purple cube that casts a shadow.
    const material = new THREE.MeshPhysicalMaterial()
    material.side = THREE.DoubleSide
    material.metalness = 0
    material.color = new THREE.Color('purple')

    cube_ = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), material)
    cube_.position.set(0, 0.0, -2)
    cube_.castShadow = true
    cube_.material.opacity = isVisible_ ? 1.0 : 0.0
    scene.add(cube_)

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 1, 0)
  }


  const wayspot = ({detail}) => {
    isVisible_ = true
    if (cube_ != null) {
      cube_.position.copy(detail.position)
      cube_.quaternion.copy(detail.rotation)
      cube_.material.opacity = 1.0
    }
  }

  const wayspotLost = () => {
    isVisible_ = false
    if (cube_) {
     cube_.material.opacity = 0
    }
  }

  const wayspotScanning = ({detail}) => {
    if (onWayspotScanning) {
      onWayspotScanning(detail)
    }
  }

  const wayspotStatus = (statusName) => ({detail}) => {
    if (onWayspotStatus) {
      onWayspotStatus(statusName, detail)
    }
  }

  // Return a camera pipeline module that adds scene elements on start.
  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be unique within
    // your app.
    name: 'vpswayspot',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onAttach: ({canvas}) => {
      const {scene, camera, renderer} = XR8.Threejs.xrScene()  // Get the 3js scene from XR8.Threejs.

      initXrScene({scene, camera, renderer})  // Add objects set the starting camera position.

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR8.XrController.updateCameraProjectionMatrix(
        {origin: camera.position, facing: camera.quaternion, verbose: true}
      )

    },
    
    onDetach: () => {
      cube_ = null
      isVisible_ = false
    },

    onUpdate: ({reality, processCpuResult}) => {
      // Don't show the cube if we're not tracking.
      if (cube_ != null) {
        cube_.visible = (processCpuResult.reality &&
                         processCpuResult.reality.trackingStatus === 'NORMAL')  
      }
    },

    onProcessCpu: () => {

    },
    // Listeners are called right after the processing stage that fired them. This guarantees that
    // updates can be applied at an appropriate synchronized point in the rendering cycle.
    listeners: [
      {event: 'reality.projectwayspotscanning', process: wayspotScanning},
      {event: 'reality.projectwayspotfound', process: wayspotStatus('found')},
      {event: 'reality.projectwayspotupdated', process: wayspotStatus('updated')},
      {event: 'reality.projectwayspotlost', process: wayspotStatus('lost')},

      {event: 'reality.projectwayspotfound', process: wayspot},
      {event: 'reality.projectwayspotupdated', process: wayspot},
      {event: 'reality.projectwayspotlost', process: wayspotLost},
    ],
  }
}
