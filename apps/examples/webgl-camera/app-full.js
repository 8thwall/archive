// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

/* eslint-disable no-console */

const PIPELINE_SIZE = 10
const CTX_TYPE = 'webgl'

const vertexSource_ = `
  attribute vec3 position;
  attribute vec2 uv;
  varying vec2 texUv;
  void main() {
    gl_Position = vec4(position, 1.0);
    texUv = uv;
  }`

const fragmentSource_ = `
  precision lowp float;
  varying vec2 texUv;
  uniform sampler2D sampler;
  void main() { 
    vec4 c = texture2D(sampler, texUv);
    gl_FragColor.r = dot(c.rgb, vec3(.393, .769, .189));
    gl_FragColor.g = dot(c.rgb, vec3(.349, .686, .168));
    gl_FragColor.b = dot(c.rgb, vec3(.272, .534, .131));
    gl_FragColor.a = c.a;
  }`

const texturePipeline = (gl) => {
  const texs_ = []
  let nextIdx_ = 0

  const next = () => {
    const idx = nextIdx_
    nextIdx_ = (nextIdx_ + 1) % texs_.length
    return texs_[idx]
  }

  const newTex = () => {
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0, gl.RGBA,
      gl.canvas.width,
      gl.canvas.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    )

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    return tex
  }

  while (texs_.length < PIPELINE_SIZE) {
    texs_.push(newTex())
  }

  console.log(`Created pipeline with ${texs_.length} textures.`)

  return {
    next,
  }
}
const compileShader = ({gl, source, shaderType}) => {
  const shader = gl.createShader(shaderType)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('[XR:WebGL]', gl.getShaderInfoLog(shader))
    return null
  }
  return shader
}

const compileShaders = (
  {gl, vertexSource = vertexSource_, fragmentSource = fragmentSource_}
) => {
  const vertexShader = compileShader({
    gl,
    source: vertexSource,
    shaderType: gl.VERTEX_SHADER,
  })

  const fragmentShader = compileShader({
    gl,
    source: fragmentSource,
    shaderType: gl.FRAGMENT_SHADER,
  })

  if (vertexShader == null || fragmentShader == null) {
    return null
  }

  const shader = gl.createProgram()
  gl.attachShader(shader, vertexShader)
  gl.attachShader(shader, fragmentShader)
  gl.bindAttribLocation(shader, 0, 'position')
  gl.bindAttribLocation(shader, 1, 'uv')
  gl.linkProgram(shader)

  if (!gl.getProgramParameter(shader, gl.LINK_STATUS)) {
    console.error('[XR:WebGL] Error linking vertex/fragement shaders.')
    return null
  }
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  return shader
}

const renderer = ({
  gl,
  vertexSource: vsrc,
  fragmentSource: fsrc,
}) => {
  const vertexSource = vsrc || vertexSource_
  const fragmentSource = fsrc || fragmentSource_

  const hasVA = !!gl.bindVertexArray
  const VAext = hasVA ? null : gl.getExtension('OES_vertex_array_object')
  const createVertexArray = () => (hasVA ? gl.createVertexArray() : VAext.createVertexArrayOES())
  const bindVertexArray = v => (hasVA ? gl.bindVertexArray(v) : VAext.bindVertexArrayOES(v))
  const vertexArrayBinding = () => gl.getParameter(
    hasVA ? gl.VERTEX_ARRAY_BINDING : VAext.VERTEX_ARRAY_BINDING_OES
  )

  const shader_ = compileShaders({gl, vertexSource, fragmentSource})

  if (!shader_) {
    return null
  }

  // Create VAO and bind it.
  const vertexArray_ = createVertexArray()
  bindVertexArray(vertexArray_)

  // Construct a buffer of triangle corner positions for a quad that covers the whole viewport.
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1.0, 1.0, 0.0,
      -1.0, -1.0, 0.0,
      1.0, 1.0, 0.0,
      1.0, -1.0, 0.0,
    ]),
    gl.STATIC_DRAW
  )

  gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0)
  gl.enableVertexAttribArray(0)

  // Construct a buffer of mesh UV coordinates for each position on the quad.
  const uvBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
  const points = new Float32Array([
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,
  ])
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)

  gl.vertexAttribPointer(1, 2, gl.FLOAT, gl.FALSE, 0, 0)
  gl.enableVertexAttribArray(1)

  // Construct a buffer of two triangles (represented as indices to the positionBuffer) to
  // represent a quad that covers the whole viewport.
  const triangleBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer)
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 2, 1, 3]),
    gl.STATIC_DRAW
  )

  const render = (tex, viewport) => {
    // Cache the current state of the opengl state machine to restore it later.

    // Set the active shader.
    gl.useProgram(shader_)

    // Set the drawing viewport.
    gl.viewport(
      viewport.offsetX || 0,
      viewport.offsetY || 0,
      viewport.width,
      viewport.height
    )

    // Set the texture source for the shader.
    gl.bindTexture(gl.TEXTURE_2D, tex)

    // Draw the triangles of the quad.
    bindVertexArray(vertexArray_)
    gl.frontFace(gl.CCW)
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)

    gl.finish()
  }

  return {
    render,
  }
}

const constructVideoViewport = ({videoWidth, videoHeight, canvasWidth, canvasHeight}) => {
  const videoAspect = videoWidth / videoHeight
  const canvasAspect = canvasWidth / canvasHeight

  let videoCroppedWidth
  let videoCroppedHeight
  if (videoAspect < canvasAspect) {
    videoCroppedWidth = videoWidth
    videoCroppedHeight = videoCroppedWidth / canvasAspect
  } else {
    videoCroppedHeight = videoHeight
    videoCroppedWidth = videoCroppedHeight * canvasAspect
  }

  // height and width are equivalent to use here because
  // canvas and videoCropped have the same aspect ratio
  const videoDisplayScale = canvasHeight / videoCroppedHeight

  return {
    offsetX: 0.5 * (canvasWidth - videoWidth * videoDisplayScale),
    offsetY: 0.5 * (canvasHeight - videoHeight * videoDisplayScale),
    width: videoWidth * videoDisplayScale,
    height: videoHeight * videoDisplayScale,
  }
}

// The video from the camera will be drawn to this canvas and displayed to the user.
const drawCanvas_ = document.createElement('canvas')
const drawCtx_ = drawCanvas_.getContext(CTX_TYPE)
let drawPipeline_ = null
let drawViewport_ = null
let video_ = null
const framePipeline_ = []
const drawRenderer_ = renderer({gl: drawCtx_})

Object.assign(drawCanvas_.style, {
  width: '75vw',
  height: '75vh',
})

document.body.appendChild(drawCanvas_)

// Starts a getUserMedia stream with the given cameraConfig
// Handles getting the correct camera constraints and retrying with each resolution level
const startCameraStream = () => {
  console.log('Starting camera stream')
  return navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'environment',
      width: {min: 960},
      height: {min: 720},
    },
  })
}

const addVideoForCanvas = (drawCanvas) => {
  // The video element for capturing the camera. On Android this can be hidden or not in the
  // documet, but iOS requires at least one pixel of this video element to be visible for video
  // capture to work.
  const video = document.createElement('video')
  drawCanvas.parentNode.appendChild(video)
  video.setAttribute('width', 1)
  video.setAttribute('height', 1)
  video.setAttribute('autoplay', true)
  video.setAttribute('playsinline', true)
  // For Android (Chrome) we can set video.style.display = 'none'
  Object.assign(video.style, {
    display: 'block',
    top: '0px',
    left: '0px',
    width: '2px',
    height: '2px',
    position: 'fixed',
    opacity: '0.01',
    pointerEvents: 'none',
    zIndex: 999,
  })
  return video
}

const captureStreamToVideo = drawCanvas => (stream) => {
  const video = addVideoForCanvas(drawCanvas_)
  video.srcObject = stream
  console.log('Video srcObject = stream')
  return video
}

const waitForFirstFrame = (video) => {
  const resolveWaitForFrame = (resolve) => {
    // Keep waiting until video has a width and time.
    if (video.videoWidth <= 0 || !video.currentTime) {
      requestAnimationFrame(() => resolveWaitForFrame(resolve))
      return null
    }

    console.log('Video got first frame')
    return resolve(video)
  }
  return new Promise(resolve => resolveWaitForFrame(resolve))
}

const readCameraToTexture = () => {
  const tex = drawPipeline_.next()
  // Bind texture and configure pixelStorei.
  drawCtx_.bindTexture(drawCtx_.TEXTURE_2D, tex)

  // Read the texture from the video.
  drawCtx_.texImage2D(
    drawCtx_.TEXTURE_2D,
    0,
    drawCtx_.RGBA,
    drawCtx_.RGBA,
    drawCtx_.UNSIGNED_BYTE,
    video_
  )

  if (framePipeline_.length > 1) {
    framePipeline_.shift()
  }

  framePipeline_.push({
    drawTex: tex,
  })
}

const runPreRender = (timestamp) => {
  // runOnProcessCpu()
  readCameraToTexture()
}

const runRender = () => {
  if (!framePipeline_.length) {
    return
  }
  drawRenderer_.render(framePipeline_[0].drawTex, drawViewport_)
}

const runPostRender = () => {
  // runOnProcessGpu()
}

let lastTimestamp_ = 0
const shouldSkipFrame = (timestamp) => {
  if (lastTimestamp_ === timestamp) {
    console.log(`Skipping second run on same animation frame ${timestamp}`)
    return true
  }
  lastTimestamp_ = timestamp
  return false
}

const updateFrame = (timestamp) => {
  requestAnimationFrame(ts => updateFrame(ts))

  if (shouldSkipFrame(timestamp)) {
    return
  }

  runPreRender()
  runRender()
  runPostRender()
}

const setCanvasResolution = (video, drawCanvas) => {
  const videoSize = {
    width: video.videoWidth,
    height: video.videoHeight,
  }

  console.log('Capturing video at size:', videoSize)

  const canvasScreenPix = {
    width: window.devicePixelRatio * drawCanvas.clientWidth,
    height: window.devicePixelRatio * drawCanvas.clientHeight,
  }

  console.log('Drawing to canvas with screen pixels', canvasScreenPix)

  const desiredPix = {...canvasScreenPix}
  if (desiredPix.width > videoSize.width) {
    const ratio = videoSize.width / canvasScreenPix.width
    desiredPix.width *= ratio
    desiredPix.height *= ratio
  }
  if (desiredPix.height > videoSize.height) {
    const ratio = videoSize.height / canvasScreenPix.height
    desiredPix.width *= ratio
    desiredPix.height *= ratio
  }
  desiredPix.width = Math.round(desiredPix.width)
  desiredPix.height = Math.round(desiredPix.height)

  console.log('Setting canvas resolution to', desiredPix)
  drawCanvas.width = desiredPix.width
  drawCanvas.height = desiredPix.height

  drawViewport_ = constructVideoViewport({
    videoWidth: videoSize.width,
    videoHeight: videoSize.height,
    canvasWidth: drawCanvas.width,
    canvasHeight: drawCanvas.height,
  })
}

const handleFirstFrame = (video) => {
  setCanvasResolution(video, drawCanvas_)

  drawPipeline_ = texturePipeline(drawCtx_)
  video_ = video

  requestAnimationFrame(ts => updateFrame(ts))
}

startCameraStream()
  .then(captureStreamToVideo(drawCanvas_))
  .then(waitForFirstFrame)
  .then(handleFirstFrame)
