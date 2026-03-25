// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall web app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import {imageTargetPortalComponent} from './image-target-portal'
AFRAME.registerComponent('image-target-portal', imageTargetPortalComponent())
// import {cubeEnvMapComponent} from './cubemap-static'

// AFRAME.registerComponent('image-target-portal', imageTargetPortalComponent())
// AFRAME.registerComponent('cubemap-static', cubeEnvMapComponent)

// import {cubeMapRealtimeComponent} from './cubemap-realtime'
// AFRAME.registerComponent('cubemap-realtime', cubeMapRealtimeComponent)

AFRAME.registerComponent('no-cull', {
  init() {
    this.el.addEventListener('model-loaded', () => {
      this.el.object3D.traverse(obj => obj.frustumCulled = false)
    })
  },
})

AFRAME.registerComponent('animate', {
  init() {
    const model = document.getElementById('model')
    const model2 = document.getElementById('model2')

    model.setAttribute('animation-mixer', {
      clip: '*',
      timeScale: 1,
      loop: 'once',
      clampWhenFinished: true,
    })
  },
})

import {myHiderMaterialComponent} from './hider-material'
AFRAME.registerComponent('my-hider-material', myHiderMaterialComponent)

import {videoTextureComponent} from './video-material'
AFRAME.registerComponent('video-texture', videoTextureComponent)

// import {shadowShaderComponent} from './custom-shadow'
// AFRAME.registerComponent('shadow-shader', shadowShaderComponent)

AFRAME.registerComponent('auto-play-video', {
  schema: {
    video: {type: 'string'},
  },
  init() {
    const v = document.querySelector(this.data.video)
    v.play()
  },
})
