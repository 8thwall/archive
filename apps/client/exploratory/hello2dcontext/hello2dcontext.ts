// Copyright (c) 2023 Niantic, Inc.
// Original Author: Erik Murphy-Chutorian (mc@nianticlabs.com)
//
// Example Usage:
//   // Run with required ANGLE OpenGL translation.
//   bazel run apps/client/exploratory/hello2dcontext/hello2dcontext --config=angle

import path from 'path'

import * as THREE from 'three'

import {glfw, Document as GlfwWindow} from '@nia/third_party/glfw-raub/glfw-raub'
import {createDom} from '@nia/c8/dom/dom'

const width = 800
const height = 600
const title = 'THREE-ANGLE from Node.js'

if (!glfw.init()) {
  throw new Error('Could not initialize GLFW')
}

const w1 = new GlfwWindow({
  width,
  height,
  title,
  vsync: true,
  noApi: true,
})

const nativeWindow = w1.getNativeWindow()

const dom = await createDom({
  width,
  height,
  title,
  context: {nativeWindow, requestAnimationFrame: w1.requestAnimationFrame},
})
const window = dom.getCurrentWindow()
const {document} = window

Object.assign(globalThis, {document, window})

const canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const gl = canvas.getContext('webgl2', {nativeWindow})

// Create an empty scene
const scene = new THREE.Scene()

// Create a basic perspective camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 4

const renderer = new THREE.WebGLRenderer({
  context: gl,
})

// Configure renderer clear color
renderer.setClearColor('#080505')
renderer.setSize(window.innerWidth, window.innerHeight)

// Create a Cube Mesh with basic material
const geometry = new THREE.BoxGeometry(2, 2, 2)

const runfilesDir = process.env.RUNFILES_DIR || path.join(__dirname, '{label}.runfiles')

const texture = new THREE.TextureLoader().load(
  path.join(
    'file://',
    runfilesDir,
    '_main/apps/client/exploratory/hello2dcontext/mona-lisa-da-vinci.jpg'
  )
)

const material = new THREE.MeshStandardMaterial({
  map: texture,
})

// Set the camera position
camera.position.z = 5

// var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
const cube = new THREE.Mesh(geometry, material)

// Add cube to Scene
scene.add(cube)

// Add a light to the scene
const directional = new THREE.DirectionalLight(0xffffff, 3)
directional.position.set(0, 5, 5)
scene.add(directional)

// Add some Ambient light.
const ambient = new THREE.AmbientLight(0x404040, 5)  // soft white light
scene.add(ambient)
const animate = () => {
  if (w1.shouldClose) {
    w1.destroy()
    glfw.terminate()
    return
  }

  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  // Render the scene
  renderer.render(scene, camera)

  gl?.eglSwapBuffers()

  // The window has a requestAnimationFrame method that runs glfw.pollEvents(). The code looks
  // like it does't respect the monitor Hz however and it renders as fast as possible. Hard to
  // tell though, because M1 macbooks have 120 Hz refresh rates.
  window.requestAnimationFrame(animate)
}

// Start the application.
animate()
