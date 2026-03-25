// Copyright (c) 2021 8th Wall, Inc.
//
// This page measures processing of images on GPU and CPU. On each animation frame,
//
// - Read to a destination Uint8Array from a 1024x1024 framebuffer with readPixels.
// - Modify a 1024x1024 source image by changing one pixel from black to white.
// - Load the new image into a 1024x1024 source texture with texImage2D.
// - Draw the source texture to a 1024x1024 framebuffer with a shader that flips black to white.
// - Compute the mean pixel value of the destination Uint8Array that was filled in the first step.
// - Print the current mean and timing stats.
//
// The benchmark finishes when the mean value is 0, i.e. every pixel in the source has been filled
// with white, and then inverted by the shader.
/* eslint-disable no-console */

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
const SIZE = 1024
const NUM_BYTES = SIZE * SIZE * 4

document.body.insertAdjacentHTML('beforeend', `
<h1>WebGL Processing Performance Test</h1>
<span>
  This page measures processing of images on GPU and CPU. On each animation frame,
  <ul>
    <li>Read to a destination Uint8Array from a ${SIZE}x${SIZE} framebuffer with readPixels.</li>
    <li>Modify a ${SIZE}x${SIZE} source image by changing one pixel from black to white.</li>
    <li>Load the new image into a ${SIZE}x${SIZE} source texture with texImage2D.</li>
    <li>Draw the source texture to a ${SIZE}x${SIZE} framebuffer with a shader that flips black to 
        white.</li>
    <li>Compute the mean pixel value of the destination Uint8Array that was filled in the first
        step.</li>
    <li>Print the current mean and timing stats.</li>
  </ul>
  The benchmark finishes when the mean value is 0, i.e. every pixel in the source has been filled
  with white, and then inverted by the shader.
</span>
<h1>Results</h1>
<pre>Starting</pre>
`)

//--------------------------------------------------------------------------------------------------
// Set up GPU/CPU resources to run the benchmark.
//--------------------------------------------------------------------------------------------------

// Vertex shader to draw from one image to another.
const noopVertex = `
attribute vec3 position;
attribute vec2 uv;
varying vec2 texUv;
void main() {
  gl_Position = vec4(position, 1.0);
  texUv = uv;
}
`

// Fragment shader to invert the color of an image.
const invertFragment = `
precision lowp float;
varying vec2 texUv;
uniform sampler2D sampler;
void main() {
  vec4 Color = texture2D(sampler, texUv);
  vec3 lum = vec3(0.299, 0.587, 0.114);
  gl_FragColor = vec4(vec3(1.0 - dot(Color.rgb, lum)), 1.0 - Color.a);
}
`

// Shader compiler.
const compileShader = ({gl, source, shaderType}) => {
  const shader = gl.createShader(shaderType)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    return null
  }
  return shader
}

const compileShaders = ({gl, vertexSource, fragmentSource}) => {
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
    console.error('Error linking vertex/fragement shaders.')
    return null
  }
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)
  return shader
}

// CPU + Timing resources.
const pix = new Uint8Array(NUM_BYTES)
const resultPix = new Uint8Array(NUM_BYTES)

const stats = {
  readPixels: Statistics(),
  texImage: Statistics(),
  draw: Statistics(),
  cpu: Statistics(),
  total: Statistics(),
  framerate: Statistics(),
}

// GPU resources.
const canvas = document.createElement('canvas')
const gl = canvas.getContext('webgl')
const hasVA = !!gl.bindVertexArray
const VAext = hasVA ? null : gl.getExtension('OES_vertex_array_object')
const createVertexArray = () => (hasVA ? gl.createVertexArray() : VAext.createVertexArrayOES())
const bindVertexArray = v => (hasVA ? gl.bindVertexArray(v) : VAext.bindVertexArrayOES(v))
const vertexArrayBinding = () => gl.getParameter(
  hasVA ? gl.VERTEX_ARRAY_BINDING : VAext.VERTEX_ARRAY_BINDING_OES
)

// Source texture.
const src = gl.createTexture()
gl.bindTexture(gl.TEXTURE_2D, src)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

// Destination framebuffer + texture.
const dest = gl.createTexture()
gl.bindTexture(gl.TEXTURE_2D, dest)
const framebuffer = gl.createFramebuffer()
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SIZE, SIZE, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, dest, 0)

// Shader
const shader = compileShaders({gl, vertexSource: noopVertex, fragmentSource: invertFragment})

// Geometry (vertices + uvs)
const vertexArray = createVertexArray()
bindVertexArray(vertexArray)

const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
const quadIdxs = new Float32Array([  // Quad that covers the whole viewport.
  -1.0, 1.0, 1.0,
  -1.0, -1.0, 1.0,
  1.0, 1.0, 1.0,
  1.0, -1.0, 1.0,
])
gl.bufferData(gl.ARRAY_BUFFER, quadIdxs, gl.STATIC_DRAW)
gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0)
gl.enableVertexAttribArray(0)
gl.frontFace(gl.CCW)

const uvBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
const points = new Float32Array([  // UVs to cover the whole texture.
  0.0, 0.0,
  0.0, 1.0,
  1.0, 0.0,
  1.0, 1.0,
])
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)
gl.vertexAttribPointer(1, 2, gl.FLOAT, gl.FALSE, 0, 0)
gl.enableVertexAttribArray(1)

const triangleBuffer = gl.createBuffer()  // Triangle indices into vertices + uvs.
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 2, 1, 3]), gl.STATIC_DRAW)

gl.useProgram(shader)                            // Set the active shader.
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)  // Draw to the framebuffer.
gl.viewport(0, 0, SIZE, SIZE)                    // Set the drawing viewport.
gl.bindTexture(gl.TEXTURE_2D, src)               // Set the texture source for the shader.
bindVertexArray(vertexArray)                     // Draw the triangles of the quad.

//--------------------------------------------------------------------------------------------------
// Run performance benchmark
//--------------------------------------------------------------------------------------------------
const processFrame = (i) => {
  if (i > NUM_BYTES) {
    return
  }

  stats.total.start()

  // Read back the framebuffer that was drawn on the previous animation frame.
  stats.readPixels.start()
  gl.readPixels(0, 0, SIZE, SIZE, gl.RGBA, gl.UNSIGNED_BYTE, resultPix)
  stats.readPixels.finish()

  // Modify the source image and upload it to the source texture.
  pix[i + 0] = 255
  pix[i + 1] = 255
  pix[i + 2] = 255
  pix[i + 3] = 255

  stats.texImage.start()
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SIZE, SIZE, 0, gl.RGBA, gl.UNSIGNED_BYTE, pix)
  stats.texImage.finish()

  // Draw src texture to framebuffer.
  stats.draw.start()
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
  gl.finish()
  stats.draw.finish()

  // Compute mean of framebuffer. This is a test of CPU performance.
  stats.cpu.start()
  let sum = 0
  for (let j = 0; j < NUM_BYTES; ++j) {
    sum += resultPix[j]
  }
  stats.cpu.finish()

  // Print progress and stats.
  stats.total.finish()
  stats.framerate.finish()
  stats.framerate.start()

  document.querySelector('pre').innerHTML = `
    Mean pixel value: ${(sum / NUM_BYTES).toFixed(3)}
    ---
    readPixels:       ${(stats.readPixels.average()).toFixed(3)} ms
    texImage:         ${(stats.texImage.average()).toFixed(3)} ms
    draw:             ${(stats.draw.average()).toFixed(3)} ms
    cpu:              ${(stats.cpu.average()).toFixed(3)} ms
    total:            ${(stats.total.average()).toFixed(3)} ms
    ---
    framerate:        ${(1000.0 / stats.framerate.average()).toFixed(3)}
  `

  // Run again on the next animation frame.
  setTimeout(() => processFrame(i + 4), 0)
  // requestAnimationFrame(() => processFrame(i + 4))
}

processFrame(0)
