// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import './index.css'

const method1 = () => {
  // add image to captured media
  XRExtras.MediaRecorder.configure({
    onProcessFrame: ({ctx}) => {
      // add a white border
      // ctx.strokeStyle = 'white'
      // ctx.lineWidth = 40
      // ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      // add a photo frame
      const img = document.getElementById('frame')
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, ctx.canvas.width, ctx.canvas.height)
    },
  })
}

const method2 = () => {
  // add overlay canvas to the document
  document.body.insertAdjacentHTML('afterbegin', `
    <canvas id="overlay" style="z-index: 1"></canvas>`)

  // setup overlay canvas
  const canvas = document.getElementById('overlay')
  const ctx = canvas.getContext('2d')
  const img = document.getElementById('frame')

  // add photo frame to overlay canvas
  img.onload = () => {
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, canvas.width, canvas.height)
  }

  // set foreground canvas
  XR8.CanvasScreenshot.setForegroundCanvas(canvas)
  XRExtras.MediaRecorder.configure({
    foregroundCanvas: canvas,
  })
}

const onxrextrasloaded = () => {
  method1()
}

window.XRExtras ? onxrextrasloaded() : window.addEventListener('xrextrasloaded', onxrextrasloaded)
