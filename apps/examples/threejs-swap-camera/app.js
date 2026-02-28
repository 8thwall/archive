// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'
import {initWorldScenePipelineModule} from './threejs-world-scene-init'
import {initFaceScenePipelineModule} from './threejs-face-scene-init'
import * as camerafeedHtml from './camerafeed.html'
import * as swapButtonHtml from './swapbutton.html'

let isFront = false
const swapCamera = () => {
  XR8.stop()

  if (isFront) {
    // remove face tracking pipeline module
    XR8.removeCameraPipelineModules(['facecontroller', 'facescene'])
    //  add world tracking pipeline module
    XR8.addCameraPipelineModule(XR8.XrController.pipelineModule())
    XR8.addCameraPipelineModule(initWorldScenePipelineModule())
    // run the 8th wall engine using the back camera
    XR8.run({canvas: document.getElementById('camerafeed'), cameraConfig: {direction: XR8.XrConfig.camera().BACK}})
  } else {
    // configure face tracking
    XR8.FaceController.configure({
      meshGeometry: [XR8.FaceController.MeshGeometry.FACE],
      coordinates: {
        mirroredDisplay: true,
        axes: 'RIGHT_HANDED',
      },
    })
    // remove world tracking pipeline module
    XR8.removeCameraPipelineModules(['reality', 'worldscene'])
    // add face tracking pipeline module
    XR8.addCameraPipelineModule(XR8.FaceController.pipelineModule())
    XR8.addCameraPipelineModule(initFaceScenePipelineModule())
    // run the 8th wall engine using the front camera
    XR8.run({canvas: document.getElementById('camerafeed'), cameraConfig: {direction: XR8.XrConfig.camera().FRONT}})
  }
  isFront = !isFront
}

const onxrloaded = () => {
  XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
    XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene.
    XR8.XrController.pipelineModule(),           // Enables SLAM tracking.
    window.LandingPage.pipelineModule(),         // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
    // Custom pipeline modules.
    initWorldScenePipelineModule(),  // Sets up the threejs camera and scene content.
  ])

  // Add a canvas to the document for our xr scene.
  document.body.insertAdjacentHTML('beforeend', camerafeedHtml)
  const canvas = document.getElementById('camerafeed')
  
  document.body.insertAdjacentHTML('beforeend', swapButtonHtml)
  const btn = document.getElementById('swap-btn')
  btn.addEventListener('click', swapCamera)

  // Open the camera and start running the camera run loop.
  XR8.run({canvas})
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)

