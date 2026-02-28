// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'

import {nextbuttonPipelineModule, swapbuttonPipelineModule} from './shaders'

const onxrloaded = () => {
  // Add a canvas to the document for our xr scene.
  document.body.insertAdjacentHTML('beforeend', `
    <canvas id="camerafeed"></canvas>
    <div class="button" id="swapbutton">Swap Camera</div>
    <div class="button" id="nextbutton">Next Shader</div>`)

  XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
    window.LandingPage.pipelineModule(),         // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
    // Custom pipeline modules.
    nextbuttonPipelineModule(),  // Cycles through shaders and keeps UI up to date.
    swapbuttonPipelineModule(),  // Cycles through cameras and keeps UI up to date.
  ])

  // Open the camera and start running the camera run loop.
  XR8.run({
    canvas: document.getElementById('camerafeed'),
    allowedDevices: XR8.XrConfig.device().MOBILE,
  })
}

XRExtras.Loading.showLoading({onxrloaded})  // Show loading screen.
