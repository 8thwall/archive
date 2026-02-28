// Copyright (c) 2023 Niantic, Inc.
// Original Author: Erik Murphy-Chutorian (mc@nianticlabs.com)

import path from 'path'

import * as THREE from 'three'

import {createDom} from '@nia/c8/dom/dom'

const global = globalThis as any

const nativeWindow = global.nativeWindow || null

const width = global.nativeWindowWidth || 800
const height = global.nativeWindowHeight || 600
const title = 'THREE-ANGLE from Node.js'

const dom = await createDom({width, height, title, context: {nativeWindow}})
const window = dom.getCurrentWindow()
const {document} = window

const canvas = document.createElement('canvas')
const gl = canvas.getContext('webgl', {nativeWindow})

// Create an empty scene
const scene = new THREE.Scene()

// Create a basic perspective camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 4

const renderer = new THREE.WebGL1Renderer({
  context: gl,
})

// Configure renderer clear color
renderer.setClearColor('#080505')
renderer.setSize(window.innerWidth, window.innerHeight)

// Create a Cube Mesh with basic material
const geometry = new THREE.BoxGeometry(2, 2, 2)

const runfilesDir = process.env.RUNFILES_DIR || path.join(__dirname, '{label}.runfiles')

const texture = await new Promise<THREE.Texture>((resolve, reject) => {
  new THREE.TextureLoader().load(
    path.join(
      'file://',
      runfilesDir,
      '_main/apps/client/exploratory/androidthreejs/mona-lisa-da-vinci.jpg'
    ),
    resolve,
    undefined,
    reject
  )
})

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

let lastTimestampMillis = performance.timeOrigin + performance.now()

const animate = (timestampMillis) => {
  const elapsedTime = timestampMillis - lastTimestampMillis

  cube.rotation.x += elapsedTime * 0.001
  cube.rotation.y += elapsedTime * 0.001

  // Render the scene
  renderer.render(scene, camera)

  gl.eglSwapBuffers()

  lastTimestampMillis = timestampMillis
  globalThis.requestAnimationFrame(animate)
}

animate(lastTimestampMillis)
