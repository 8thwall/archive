// Copyright (c) 2020 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'
import {worldPointsVisualizerPipelineModule} from './world-points-visualizer'
import * as camerafeedHtml from './camerafeed.html'

const onxrloaded = () => {
  XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
    XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene.
    XR8.XrController.pipelineModule(),           // Enables SLAM tracking.
    XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
    // Custom pipeline modules.
    worldPointsVisualizerPipelineModule(),
  ])

  // Open the camera and start running the camera run loop.
  document.body.insertAdjacentHTML('beforeend', camerafeedHtml)
  XR8.run({canvas: document.getElementById('camerafeed')})
}

// Show loading screen before the full XR library has been loaded.
XRExtras.Loading.showLoading({onxrloaded})
