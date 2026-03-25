// Copyright (c) 2023 8th Wall, Inc.

// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'
import {threejsPipelineModule} from './threejs-pipeline-module'
import {handScenePipelineModule} from './hand-scene'
import {statsPipelineModule} from './stats'

const onxrloaded = () => {
  // Add a canvas to the document for our xr scene.
  document.body.insertAdjacentHTML('beforeend', `
    <canvas id="camerafeed" width="${window.innerWidth}" height="${window.innerHeight}"></canvas>
  `)

  // XR8.HandController.configure({
  //   coordinates: {mirroredDisplay: false},
  // })

  XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),  // Draws the camera feed.
    XR8.HandController.pipelineModule(),  // Loads 8th Wall Face Engine
    window.HandCoachingOverlay.pipelineModule(),

    window.LandingPage.pipelineModule(),  // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),  // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),  // Shows an error image on runtime error.
    // Custom pipeline modules
    threejsPipelineModule(),  // Custom threejs pipeline module with postprocessing
    handScenePipelineModule(),  // Sets up the threejs camera and scene content.
    // statsPipelineModule(),
  ])

  // Open the camera and start running the camera run loop.
  XR8.run({
    canvas: document.getElementById('camerafeed'),
    cameraConfig: {direction: XR8.XrConfig.camera().BACK},
    allowedDevices: XR8.XrConfig.device().ANY,
  })
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
