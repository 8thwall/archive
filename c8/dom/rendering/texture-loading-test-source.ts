// @attr(npm_rule = "@npm-rendering//:npm-rendering")
// @rule(js_binary)
// @attr(esnext = 1)

import * as THREE from 'three'

// eslint-disable-next-line max-len
const SAMPLE_IMAGE_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAG0lEQVR4nGKJ2122i+Mc42E+8Q9vjgACAAD//yuFBq00geKlAAAAAElFTkSuQmCC'

const width = 2
const height = 2
const renderer = new THREE.WebGLRenderer({antialias: false})
renderer.setSize(width, height)

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
camera.position.z = 1

const loader = new THREE.TextureLoader()
loader.load(SAMPLE_IMAGE_URL, (texture) => {
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  texture.premultiplyAlpha = false

  texture.colorSpace = THREE.LinearSRGBColorSpace
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace

  const geometry = new THREE.PlaneGeometry(width, height)
  const material = new THREE.MeshBasicMaterial({map: texture})
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  renderer.render(scene, camera)

  const pixels = new Uint8Array(width * height * 4)
  const gl = renderer.getContext()
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

  const expectedValues = new Uint8Array([
    195, 14, 23, 255,
    179, 250, 219, 255,
    94, 187, 118, 255,
    24, 195, 68, 255,
  ])

  pixels.forEach((value, index) => {
    if (value !== expectedValues[index]) {
      throw new Error(
        `Pixel mismatch at index ${index}: expected ${expectedValues[index]}, got ${value}`
      )
    }
  })
}, undefined, (err) => {
  throw new Error(`Failed to load texture: ${err}`)
})
