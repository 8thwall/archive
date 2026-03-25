// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'
import {initScenePipelineModule} from './threejs-scene-init'
import * as camerafeedHtml from './camerafeed.html'

const onxrloaded = () => {
  // Configure absolute scale and coaching overlay
  XR8.XrController.configure({scale: 'absolute'})
  // Optionally, you can configure the coaching overlay styles:
  // CoachingOverlay.configure({disablePrompt: true})

  XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
    XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene.
    XR8.XrController.pipelineModule(),           // Enables SLAM tracking.
    XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
    window.LandingPage.pipelineModule(),         // Detects unsupported browsers and gives hints.
    window.CoachingOverlay.pipelineModule(),     // Show the absolute scale coaching overlay.
    // Custom pipeline modules.
    initScenePipelineModule(),  // Sets up the threejs camera and scene content.
  ])

  // Add a canvas to the document for our xr scene.
  document.body.insertAdjacentHTML('beforeend', camerafeedHtml)
  const canvas = document.getElementById('camerafeed')

  // Open the camera and start running the camera run loop.
  XR8.run({canvas, allowedDevices: 'any'})
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
