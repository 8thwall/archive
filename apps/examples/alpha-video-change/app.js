// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'

import {changeVideoComponent} from './js/change-video'
AFRAME.registerComponent('change-video', changeVideoComponent)

import {holdDragComponent} from './js/custom-hold-drag'
AFRAME.registerComponent('custom-hold-drag', holdDragComponent)

import {chromaKeyShader} from './js/chroma-key'
AFRAME.registerShader('chromakey', chromaKeyShader)

AFRAME.registerComponent('play-video', {
  schema: {
    video: {type: 'string'},
    autoplay: {type: 'bool', default: true},
  },

  init() {
    const v = document.querySelector(this.data.video)
    const {el} = this
    let playing = false

    // Function to handle play and pause
    const togglePlayPause = () => {
      if (!playing) {
        v.play()
        playing = true
      } else {
        v.pause()
        playing = false
      }
    }

    if (this.data.autoplay === true) {
      v.muted = true  // Ensure the video is muted

      if (v.readyState >= 2) {  // Check if video data is available
        v.play()
      } else {
        // Wait for video data to be loaded, then play
        v.on('loadeddata', () => {
          v.play()
        })
      }
    } else {
      // Add tap event listener to play/pause
      el.on('click', togglePlayPause)
    }
  },
})
