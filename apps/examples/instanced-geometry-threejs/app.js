// Copyright (c) 2019 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'
const {CustomThreejsFactory} = require('./threejs-custom-module')
const {FullWindowCanvasFactory} = require('./custom-full-window-canvas.js')
const myThree = CustomThreejsFactory()
const myFullWindow = FullWindowCanvasFactory()

import {statsPipelineModule} from './stats'

import {instancedBufferGeometrySceneModule} from './instanced-buffer-geometry-scene.js'
import * as camerafeedHtml from './camerafeed.html'

const onxrloaded = () => {
  document.body.insertAdjacentHTML('beforeend', camerafeedHtml)
  
  XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),       // Draws the camera feed.
    myThree.pipelineModule(document.querySelector('#mycanvas')),   // Replaces XR8.Threejs.pipelineModule()
    XR8.XrController.pipelineModule(),            // Enables SLAM tracking.
    window.LandingPage.pipelineModule(),       // Detects unsupported browsers and gives hints.
    myFullWindow.pipelineModule(document.querySelector('#mycanvas')),
    XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.

    statsPipelineModule(),
    instancedBufferGeometrySceneModule(myThree),
  ])

  // Open the camera and start running the camera run loop.
  XR8.run({canvas: document.getElementById('camerafeed')})
}

// Show loading screen before the full XR library has been loaded.
XRExtras.Loading.showLoading({onxrloaded})
