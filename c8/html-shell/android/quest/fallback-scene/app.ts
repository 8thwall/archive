// @attr(npm_rule = "@npm-rendering//:npm-rendering")
// @rule(js_binary)
// @attr(esnext = 1)

import * as THREE from 'three'

import {XRButton} from './xr-button'

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.xr.enabled = true

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x505050)
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10)
camera.position.set(0, 1.6, 3)
scene.add(camera)

scene.add(new THREE.HemisphereLight(0xa5a5a5, 0x898989, 3))

{
  const light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(1, 1, 1).normalize()
  scene.add(light)
}

{
  const planeGeometry = new THREE.PlaneGeometry(1024, 128)  // Image dimensions
  const planeMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load('no-internet.png'),
    transparent: true,
  })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.position.set(0, 1.5, -5)
  plane.scale.multiplyScalar(0.01)
  scene.add(plane)
}

const handleResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
}

window.addEventListener('resize', handleResize)

handleResize()

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
})

document.body.appendChild(renderer.domElement)
document.body.appendChild(XRButton.createButton(renderer, {}))
