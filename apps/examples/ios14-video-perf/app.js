console.log(`Three.js version: ${THREE.REVISION}`)

import './index.css'
import * as bodyHtml from './video.html'
document.body.insertAdjacentHTML('beforeend', bodyHtml)

let video3, videoObj

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

camera.position.z = 3

var stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

// ThreeJS video
video3 = document.createElement('video')
video3.setAttribute('preload', 'auto')
video3.setAttribute('loop', '')
video3.setAttribute('muted', '')
video3.setAttribute('playsinline', '')
video3.setAttribute('webkit-playsinline', '')
video3.setAttribute('crossorigin', 'anonymous')
const texture = new THREE.VideoTexture(video3)
texture.minFilter = THREE.LinearFilter
texture.magFilter = THREE.LinearFilter
texture.format = THREE.RGBFormat
texture.crossOrigin = 'anonymous'

videoObj = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({map: texture})
)
scene.add(videoObj)

document.addEventListener('click', () => {
  console.log('click')
  video3.src = require('./assets/beach.mp4')
  video3.load() // must call after setting/changing source
  video3.play()
  document.getElementById('tapstart').style.display = 'none'
})

var animate = function () {
  stats.update()
  requestAnimationFrame(animate)
  videoObj.rotation.x += 0.01
  videoObj.rotation.y += 0.01
  renderer.render(scene, camera)
}

animate()
