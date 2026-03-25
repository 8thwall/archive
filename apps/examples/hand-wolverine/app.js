// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

AFRAME.registerComponent('tap', {
  init() {
    const box = document.getElementById('box')
    document.body.addEventListener('click', () => {
      box.setAttribute('animation', {
        property: 'position',
        to: '0 0.4 0',
        dur: 3000,
        easing: 'easeInOutCubic',
        loop: false,
      })
    })
  },
})
