// Copyright (c) 2021 8th Wall, Inc.
//
// This page measures using a video element as a texture. It:
//
// - Adds a <video> element to the DOM.
// - Creates a Three.js scene with WebGL 2 if possible, else WebGL 1.
// - Uses the video to create a video texture with THREE.VideoTexture(video)
// - Creates a cube using that texture.
// - Renders the scene, adds a timer around this call to measure performance.
// - Upates the DOM with timing stats.
//
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

const stats = {
  render: Statistics(),
  framerate: Statistics(),
}

//--------------------------------------------------------------------------------------------------
// Set up the DOM.
//--------------------------------------------------------------------------------------------------
const beach = require('./assets/beach.mp4')
// const beach = 'https://cdn.8thwall.com/web/assets/beach.mp4'
document.body.setAttribute('style', 'padding: 0; margin: 0;')
document.body.insertAdjacentHTML(
  'beforeend',
  `
<h1 style="margin: 0;">Video Texture Performance Test</h1>
<h4 style="margin-bottom: 0;">Performance</h4>
<pre style="margin: 0;"></pre>
<h4 style="margin-bottom: 0;">Source Video</h4>
<h5 style="margin: 0;">Note that the cube will stop rendering if the source video goes out of view</h5>
<video id="test-video" width="320" height="240" crossorigin="anonymous" playsinline muted loop autoplay>
   <source src="${beach}" type="video/mp4">
</video>
<h4 style="margin-bottom: 0;">Scene</h4>
`
)

//--------------------------------------------------------------------------------------------------
// Create scene.
//--------------------------------------------------------------------------------------------------
const WIDTH = window.innerWidth
const HEIGHT = 480

const canvas = document.createElement('canvas')
let webGl2Used = true
let context = canvas.getContext('webgl2')
if (!context) {
  console.log('Could not get WebGL 2 context so falling back to WebGL 1.')
  webGl2Used = false
  context = canvas.getContext('webgl')
} else {
  console.log('Using WebGL 2.')
}

// Set up renderer.
const renderer = new THREE.WebGLRenderer({canvas, context})
renderer.setSize(WIDTH, HEIGHT)
renderer.setClearColor(0xdddddd, 1)
document.body.appendChild(renderer.domElement)

// Set up scene and camera.
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT)
camera.position.z = 20
scene.add(camera)

// Create a material using THREE.VideoTexture.
const video = document.getElementById('test-video')
const videoTexture = new THREE.VideoTexture(video)
const material = new THREE.MeshBasicMaterial({map: videoTexture, side: THREE.FrontSide})

// Create a cube with the newly created material.
const boxGeometry = new THREE.BoxGeometry(10, 10, 10)
const cube = new THREE.Mesh(boxGeometry, material)
scene.add(cube)
cube.rotation.set(0.4, 0.2, 0)

//--------------------------------------------------------------------------------------------------
// Run performance benchmark
//--------------------------------------------------------------------------------------------------
let first = true
function render() {
  if (first) {
    first = false
  } else {
    stats.framerate.finish()
  }
  stats.framerate.start()

  // Render scene.
  stats.render.start()
  renderer.render(scene, camera)
  stats.render.finish()

  // Update stats.
  document.querySelector('pre').innerHTML = 
  `  render (WebGL 2=${webGl2Used}):  ${(stats.render.average()).toFixed(3)} ms

  ---
  framerate: ${(1000.0 / stats.framerate.average()).toFixed(3)}
  `

  requestAnimationFrame(render)
}
render()
