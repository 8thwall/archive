import {faceScenePipelineModule} from './face-scene'

const runFacePipeline = () => {
  // Add a canvas to the document for our xr scene.  
  document.body.insertAdjacentHTML('beforeend', `
    <canvas id="camerafeed" width="${window.innerWidth}" height="${window.innerHeight}"></canvas>
  `)

  XR8.FaceController.configure({
    coordinates: { mirroredDisplay: true }
  })

  XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.Threejs.pipelineModule(),
    XR8.FaceController.pipelineModule(),
    XRExtras.FullWindowCanvas.pipelineModule(),            // Modifies the canvas to fill the window.
    faceScenePipelineModule(),
  ])

  // Open the camera and start running the camera run loop.
  XR8.run({
    canvas: document.getElementById('camerafeed'),
    cameraConfig: {direction: XR8.XrConfig.camera().FRONT},
    allowedDevices: XR8.XrConfig.device().ANY,
  })
}

export {runFacePipeline}