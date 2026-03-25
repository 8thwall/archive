// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'
import './aframe-import-shaderfrog'

import {handDebugComponent} from './components/hand-debug'
AFRAME.registerComponent('hand-debug', handDebugComponent)

import {clockAnimationComponent} from './components/clock-animation'
AFRAME.registerComponent('clock-animation', clockAnimationComponent)

import {wristOccluderComponent} from './components/wrist-occluder'
AFRAME.registerComponent('wrist-occluder', wristOccluderComponent)

import {scaleToHandComponent} from './components/scale-to-hand'
AFRAME.registerComponent('scale-to-hand', scaleToHandComponent)

import {cosmicWavesShader, flatDiscoShader} from './cosmic-waves'
AFRAME.registerShader('cosmic-waves', cosmicWavesShader)
AFRAME.registerShader('disco', flatDiscoShader)

import {videoTextureComponent} from './video-texture'
AFRAME.registerComponent('video-texture', videoTextureComponent)

import {setShaderFrogComponent} from './set-shaderfrog'
AFRAME.registerComponent('shader-frog', setShaderFrogComponent)

import {chromaKeyShader} from './components/chroma-key'
AFRAME.registerShader('chromakey', chromaKeyShader)

import {tapComponent} from './components/tap'
AFRAME.registerComponent('tap', tapComponent)

AFRAME.registerComponent('auto-play-video', {
  schema: {
    video: {type: 'string'},
  },
  init() {
    const v = document.querySelector(this.data.video)
    v.play()
  },
})
