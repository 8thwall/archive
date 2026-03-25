import {spCode} from './spCode.js'

const scene = new THREE.Scene()
const params = {time: 0}

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 4

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

renderer.setClearColor(new THREE.Color(1, 1, 1), 1)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 9.6)
geometry.computeBoundingSphere()
geometry.center()

// Shader Park Setup
const mesh = window.createSculpture(spCode, () => ({
  time: params.time,
}))
scene.add(mesh)

const render = () => {
  requestAnimationFrame(render)
  params.time += 0.01
  renderer.render(scene, camera)
}

render()
