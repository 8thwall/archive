// Copyright (c) 2023 Niantic, Inc.
// Original Author: Erik Murphy-Chutorian (mc@nianticlabs.com)
//
// Example Usage:
//   // Run with required ANGLE OpenGL translation.
//   bazel run apps/client/exploratory/helloglfw/hello-glfw-node --config=angle

/* eslint-disable import/no-unresolved */
import {glfw, Document} from 'third_party/glfw-raub/glfw-raub'
import {createContext} from 'third_party/headless-gl/index'
import * as THREE from 'three'
/* eslint-enable import/no-unresolved */

const width = 800
const height = 600
const title = 'THREE-ANGLE from Node.js'

if (!glfw.init()) {
  throw new Error('Could not initialize GLFW')
}

const w1 = new Document({
  width,
  height,
  title,
  vsync: true,
  noApi: true,
})

const nativeWindow = w1.getNativeWindow()

const gl = createContext(width, height, {
  nativeWindow,
})

// Override window swapBuffers with eglSwapBuffers, as we are using noApi with ANGLE.
w1.swapBuffers = () => {
  gl.eglSwapBuffers()
}

global.window = w1
global.document = w1

// Create an empty scene
const scene = new THREE.Scene()

// Create a basic perspective camera
const camera = new THREE.PerspectiveCamera(75, w1.innerWidth / w1.innerHeight, 0.1, 1000)
camera.position.z = 4

// Create a renderer with Antialiasing
const renderer = new THREE.WebGL1Renderer({
  antialias: true,
  context: gl,
})

// Configure renderer clear color
renderer.setClearColor('#080505')
renderer.setSize(w1.innerWidth, w1.innerHeight)

// Create a Cube Mesh with basic material
const geometry = new THREE.BoxGeometry(1, 1, 1)

// Create a custom shader material that shimmers with rainbow colors
const rainbowShader = `
    uniform float time;
    varying vec3 vColor;
    void main() {
        vec3 transformed = position.xyz;
        vColor = vec3(0.5 + 0.3 * sin(3.0 * transformed.x + time),
                      0.5 + 0.3 * cos(3.0 * transformed.y + time),
                      0.5 + 0.3 * sin(3.0 * transformed.z + time));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
`

const material = new THREE.ShaderMaterial({
  vertexShader: rainbowShader,
  fragmentShader: `
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `,
  uniforms: {time: {value: 0}},
})

// Set the camera position
camera.position.z = 5

// var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
const cube = new THREE.Mesh(geometry, material)

// Add cube to Scene
scene.add(cube)

const animate = () => {
  if (w1.shouldClose) {
    w1.destroy()
    glfw.terminate()
    return
  }

  const time = Date.now()

  // Update the shader's time uniform
  const normalizedTime = (time * 0.002) % (2 * Math.PI)
  material.uniforms.time.value = normalizedTime

  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  // Render the scene
  renderer.render(scene, camera)

  w1.swapBuffers()

  // The window has a requestAnimationFrame method that runs glfw.pollEvents(). The code looks
  // like it does't respect the monitor Hz however and it renders as fast as possible. Hard to
  // tell though, because M1 macbooks have 120 Hz refresh rates.
  w1.requestAnimationFrame(animate)
}

// Start the application.
animate()
