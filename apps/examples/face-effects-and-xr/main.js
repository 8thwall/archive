/* eslint-disable */

import {faceScenePipelineModule} from './face-scene'
import {imageTargetPipelineModule} from './imagetarget.js'
import {placegroundScenePipelineModule} from './place-tree.js'


const Toggler = () => {
  const idMap_ = {
    0: 'face',
    2: 'target',
    1: 'SLAM'
  }
  let id_ = -1

  let isMirrored_ = false

  // Places content over image target
  const switchPipeline = () => {
    id_ = (id_ + 1) % 3

    console.log('Switching pipeline to: ', idMap_[id_] === 'face')

    if (idMap_[id_] === 'face') {
      XR8.removeCameraPipelineModules([
        'facecontroller',
        'facescene',
      ])
    } else {
      XR8.removeCameraPipelineModules([
        'reality',
        'imagetarget',
        'placeground'
      ])
    }

    XR8.stop()

    const direction = idMap_[id_] === 'face' ? XR8.XrConfig.camera().FRONT : XR8.XrConfig.camera().BACK

    if (idMap_[id_] === 'face') {
      XR8.addCameraPipelineModules([
        XR8.FaceController.pipelineModule(),
        faceScenePipelineModule(),
      ])
    } else if (idMap_[id_] === 'target') {
      XR8.addCameraPipelineModules([
        XR8.XrController.pipelineModule(),
        imageTargetPipelineModule(),
      ])
    } else {
      XR8.addCameraPipelineModules([
        XR8.XrController.pipelineModule(),
        placegroundScenePipelineModule(),
      ])
    }

    XRExtras.MediaRecorder.configure({requestMic: 'manual'})

    XR8.run({
      canvas: document.getElementById('camerafeed'),
      cameraConfig: {direction},
      allowedDevices: XR8.XrConfig.device().ANY,
      verbose: true
    })

    const xrtoggler = document.getElementById('xrtoggler')
    xrtoggler.innerText = idMap_[id_]

    return
  } 

  // Places content over image target
  const mirror = () => {
    console.log('Hit mirror with isMirrored_: ', isMirrored_)
    
    if (idMap_[id_] === 'face') {
      XR8.FaceController.configure({
        coordinates: {mirroredDisplay: isMirrored_}
      })
    } else {
      XR8.XrController.configure({
        mirroredDisplay: isMirrored_
      })
      XR8.XrController.recenter()
    }

    isMirrored_ = !isMirrored_
  }

  return {
    name: 'switcherydoodaa',

    switchPipeline,
    
    mirror,
  }
}



const runComboPipeline = () => {
  // Add a canvas to the document for our xr scene.  
  document.body.insertAdjacentHTML('beforeend', `
    <canvas id="camerafeed" width="${window.innerWidth}" height="${window.innerHeight}"></canvas>
  `)
  
  const toggler = Toggler()
  document.body.insertAdjacentHTML('beforeend', `
    <button
      id="xrtoggler"
      style="
        width: 50px;
        position: absolute;
        z-index: 1000;
        height: 50px;
        bottom: 0px;
        right: 0px;
        color: blue;"
    >
      Toggle
    </button>
  `)
  const xrtoggler = document.getElementById('xrtoggler')
  xrtoggler.onclick = toggler.switchPipeline

  document.body.insertAdjacentHTML('beforeend', `
    <button
      id="mirrorBtn"
      style="
        width: 50px;
        position: absolute;
        z-index: 1000;
        height: 50px;
        bottom: 50px;
        right: 0px;
        color: blue;"
    >
      Mirror
    </button>
  `)
  const mirrorBtn = document.getElementById('mirrorBtn')
  mirrorBtn.onclick = toggler.mirror

  XR8.FaceController.configure({
    meshGeometry: [
      XR8.FaceController.MeshGeometry.FACE, 
      XR8.FaceController.MeshGeometry.EYES, 
      XR8.FaceController.MeshGeometry.MOUTH,
    ],
    coordinates: {mirroredDisplay: toggler.isMirrored_},
  })


  // XRExtras.MediaRecorder.initRecordButton()
  // XRExtras.MediaRecorder.initMediaPreview()
  XRExtras.MediaRecorder.configure({requestMic: 'manual'})
  XRExtras.MediaRecorder.initRecordButton() // Adds record button
  XRExtras.MediaRecorder.initMediaPreview() // Adds media preview and share
  // XRExtras.MediaRecorder.configure({
  //   watermarkImageUrl: require('./assets/Logos/8logo.png'), // Adds watermark to photo/video
  //   watermarkMaxWidth: 100,
  //   watermarkMaxHeight: 10,
  // })
  XRExtras.MediaRecorder.setCaptureMode('photo')

  XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
    XR8.CanvasScreenshot.pipelineModule(),       // Required for photo capture 
    XR8.Threejs.pipelineModule(),                // Syncs threejs renderer to camera properties.
    XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
  ])

  // Open the camera and start running the camera run loop.
  XR8.run({
    canvas: document.getElementById('camerafeed'),
    cameraConfig: {direction: XR8.XrConfig.camera().BACK},
    allowedDevices: XR8.XrConfig.device().ANY,
    verbose: true,
  })
}

export {runComboPipeline}

