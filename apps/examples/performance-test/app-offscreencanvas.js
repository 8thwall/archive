// Copyright (c) 2021 8th Wall, Inc.
//
// This page measures the performance of texImage2D. It first sets up getUserMedia to write to a
// video element. After the video element has been created, each requestAnimationFrame it:
//
// a) Draws with texImage2D from a HTMLVideoElement
// b) Draws with texImage2D from a HTMLVideoElement on a texture that has set
//    `drawCtx.pixelStorei(drawCtx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)`
// c) Draws the HTMLVideoElement to a helper canvas, reads those pixels as an ImageData object, and
//    draws with texImage2D using the object as an ArrayBufferView. We only time texImage2D, not
//    the set up.
// - Prints the current mean and timing stats for a, b, and c.
/* eslint-disable no-console */
/* eslint-disable max-len */

//--------------------------------------------------------------------------------------------------
// Statistics helper.
//--------------------------------------------------------------------------------------------------
const now = window.performance && performance.now ? () => performance.now() : Date.now()

const Statistics = () => {
  let index_ = 0
  let sum_ = 0
  let then_ = now()

  return {
    start: () => {
      then_ = now()
    },
    finish: () => {
      sum_ += now() - then_
      ++index_
    },
    average: () => sum_ / index_,
  }
}

//--------------------------------------------------------------------------------------------------
// Set up the DOM.
//--------------------------------------------------------------------------------------------------
document.body.insertAdjacentHTML('beforeend', `
<h1>MediaRecorder + Offscreen canvas Performance Test</h1>
<button id="get-access">Get access to camera</button>
<h1>Results</h1>
<pre></pre>
<div id="errorMsg"></div>
<video autoplay playsinline>Video</video>
`)

//--------------------------------------------------------------------------------------------------
// Set up resources to run the benchmark.
//--------------------------------------------------------------------------------------------------

const stats = {
  offscreen1: Statistics(),
  offscreen2: Statistics(),
  attached: Statistics(),
  framerate: Statistics(),
}

const createContext = (id, attachToDom) => {
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.id = `${id}-attached:${attachToDom}`
  if (attachToDom) {
    document.body.appendChild(canvas)
  }
  const gl = canvas.getContext('webgl')
  const src = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, src)
  return gl
}

// Canvas and video elements
const video = document.querySelector('video')

const gl1 = createContext('1', false)
const gl2 = createContext('2', false)
const gl3 = createContext('3', true)

// Helper canvas to go from a HTMLVideoElement to an ImageData.
const helperCanvas = document.createElement('canvas')
const helperContext = helperCanvas.getContext('2d')

//--------------------------------------------------------------------------------------------------
// Run performance benchmark
//--------------------------------------------------------------------------------------------------

const checkGLError = (GLctx, msg) => {
  const err = GLctx.getError()
  if (err !== GLctx.NO_ERROR) {
    console.error(`[XR:WebGL] ${msg}: glError 0x${err.toString(16)}`)
  }
}

let first = true
const processFrame = (timestamp) => {
  if (video && video.videoWidth > 0) {
    if (first) {
      first = false
      helperCanvas.width = video.videoWidth
      helperCanvas.height = video.videoHeight
    } else {
      stats.framerate.finish()
    }
    stats.framerate.start()

    // (a) Draw with texImage2D from a HTMLVideoElement.
    stats.offscreen1.start()
    gl1.texImage2D(gl1.TEXTURE_2D, 0, gl1.RGBA, gl1.RGBA, gl1.UNSIGNED_BYTE, video)
    stats.offscreen1.finish()

    stats.offscreen2.start()
    gl1.texImage2D(gl1.TEXTURE_2D, 0, gl1.RGBA, gl1.RGBA, gl1.UNSIGNED_BYTE, video)
    stats.offscreen2.finish()

    stats.attached.start()
    gl1.texImage2D(gl1.TEXTURE_2D, 0, gl1.RGB, gl1.RGB, gl1.UNSIGNED_BYTE, video)
    stats.attached.finish()

    // Check gl error.
    checkGLError(gl1, 'gl1')
    checkGLError(gl2, 'gl2')

    document.querySelector('pre').innerHTML = `
      Timestamp: ${timestamp} 
      ---
      offscreen1:  ${(stats.offscreen1.average()).toFixed(3)} ms
      offscreen2:  ${(stats.offscreen2.average()).toFixed(3)} ms
      attached:    ${(stats.attached.average()).toFixed(3)} ms
      ---
      framerate:        ${(1000.0 / stats.framerate.average()).toFixed(3)}
    `
  }

  // Run again on the next animation frame.
  requestAnimationFrame(ts => processFrame(ts))
}

const constraints = {
  audio: false,
  video: {
    width: 960,
    height: 720,
  },
}

const errorMsg = (msg, error) => {
  const errorElement = document.querySelector('#errorMsg')
  errorElement.innerHTML += `<p>${msg}</p>`
  if (typeof error !== 'undefined') {
    console.error(error)
  }
}

const handleError = (error) => {
  if (error.name === 'ConstraintNotSatisfiedError') {
    const v = constraints.video
    errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`)
  } else if (error.name === 'PermissionDeniedError') {
    errorMsg('Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.')
  }
  errorMsg(`getUserMedia error: ${error.name}`, error)
}

document
  .querySelector('#get-access')
  .addEventListener('click', async (e) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      video.srcObject = stream

      // Hide get access button
      document.querySelector('#get-access').setAttribute('hidden', true)

      // Start update loop
      requestAnimationFrame(ts => processFrame(ts))
    } catch (error) {
      handleError(error)
    }
  })
