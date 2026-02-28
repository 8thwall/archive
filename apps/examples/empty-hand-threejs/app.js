// Copyright (c) 2023 8th Wall, Inc.

// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import {initScenePipelineModule} from './threejs-scene-init'
import './index.css'

const onxrloaded = () => {
  // Add a canvas to the document for our xr scene.
  document.body.insertAdjacentHTML('beforeend', `
    <canvas id="camerafeed" width="${window.innerWidth}" height="${window.innerHeight}"></canvas>
  `)

  XR8.HandController.configure({
    coordinates: {mirroredDisplay: true},
  })

  XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),       // Draws the camera feed.
    XR8.Threejs.pipelineModule(),                 // Syncs threejs renderer to camera properties.
    XR8.HandController.pipelineModule(),          // Loads 8th Wall Face Engine
    XR8.CanvasScreenshot.pipelineModule(),        // Required for photo capture
    window.LandingPage.pipelineModule(),          // Detects unsupported browsers and gives hints.
    window.HandCoachingOverlay.pipelineModule(),  // Shows the hand coaching overlay.
    XRExtras.FullWindowCanvas.pipelineModule(),   // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),            // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),       // Shows an error image on runtime error.
    // Custom pipeline modules
    initScenePipelineModule(),
  ])

  // Open the camera and start running the camera run loop.
  XR8.run({
    canvas: document.getElementById('camerafeed'),
    cameraConfig: {direction: XR8.XrConfig.camera().BACK},
    allowedDevices: XR8.XrConfig.device().ANY,
  })
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
