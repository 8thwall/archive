const wallFromFloorComponent = {
  schema: {
    placed: {default: false},
  },
  init() {
    this.raycaster = new THREE.Raycaster()
    this.camera = document.getElementById('camera')
    this.threeCamera = this.camera.getObject3D('camera')
    this.ground = document.getElementById('ground')
    const scene = this.el.sceneEl

    const placeWall = () => {
      this.data.placed = true
      const wall = document.createElement('a-box')
      wall.id = 'wall'
      wall.setAttribute('material', {color: 'white', transparent: true, opacity: 0})
      wall.object3D.scale.set(100, 100, 0.25)
      wall.object3D.rotation.y = this.el.object3D.rotation.y
      wall.setAttribute('position', {
        x: this.el.object3D.position.x,
        y: this.el.object3D.position.y + 25,
        z: this.el.object3D.position.z,
      })
      scene.appendChild(wall)

      const frame = document.createElement('a-entity')
      frame.id = 'frame'
      // Wall painting from https://poly.google.com/view/62zn39CRkbG
      frame.setAttribute('gltf-model', require('./assets/art.glb'))
      frame.object3D.scale.set(3, 3, 3)
      frame.setAttribute('place-on-wall', '')
      scene.appendChild(frame)

      scene.removeEventListener('click', placeWall)

      // wall placer removes itself from the scene
      this.el.parentNode.removeChild(this.el)
    }

    // click event handles the wall placement
    scene.addEventListener('click', placeWall)
  },

  tick() {
    if (!this.data.placed) {
      let pos = new THREE.Vector3(0, 0, 0)
      const a = new THREE.Vector2(0, -0.5)

      this.threeCamera = this.threeCamera || this.camera.getObject3D('camera')

      this.raycaster.setFromCamera(a, this.threeCamera)
      const intersects = this.raycaster.intersectObject(this.ground.object3D, true)

      if (intersects.length > 0) {
        pos = intersects[0].point
      }

      this.el.object3D.position.lerp(pos, 0.4)
      this.el.object3D.rotation.y = this.camera.object3D.rotation.y
    }
  },
}

const placeOnWallComponent = {
  schema: {
    placed: {default: false},
  },
  init() {
    this.raycaster = new THREE.Raycaster()
    this.camera = document.getElementById('camera')
    this.threeCamera = this.camera.getObject3D('camera')
    this.wall = document.getElementById('wall')
    const scene = this.el.sceneEl

    const placeOnWall = () => {
      this.data.placed = true
      scene.removeEventListener('click', placeOnWall)
    }

    scene.addEventListener('click', placeOnWall)
  },

  tick() {
    if (!this.data.placed) {
      let pos = new THREE.Vector3(0, 0, 0)
      const a = new THREE.Vector2(0, 0)

      this.threeCamera = this.threeCamera || this.camera.getObject3D('camera')

      this.raycaster.setFromCamera(a, this.threeCamera)
      const intersects = this.raycaster.intersectObject(this.wall.object3D, true)

      if (intersects.length > 0) {
        const i = 0
        const intersect = intersects[i]
        pos = intersect.point
      }

      this.el.object3D.position.lerp(pos, 0.4)
      this.el.object3D.rotation.y = this.wall.object3D.rotation.y
    }
  },
}

export {placeOnWallComponent, wallFromFloorComponent}
