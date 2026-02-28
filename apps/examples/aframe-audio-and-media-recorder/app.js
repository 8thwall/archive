// Copyright (c) 2020 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

const autoplayMusic = () => {
  const snd = document.querySelector('[sound]')
  snd.components.sound.playSound()
}
window.addEventListener('xrfacescanning', autoplayMusic)
