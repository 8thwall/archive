// Component that places trees at cursor location when screen is tapped
const tapPlaceCursorComponent = {
  init() {
    this.raycaster = new THREE.Raycaster()
    this.camera = document.getElementById('camera')
    this.threeCamera = this.camera.getObject3D('camera')
    this.ground = document.getElementById('ground')

    // 2D coordinates of the raycast origin, in normalized device coordinates (NDC)---X and Y
    // components should be between -1 and 1.  Here we want the cursor in the center of the screen.
    this.rayOrigin = new THREE.Vector2(0, 0)

    this.cursorLocation = new THREE.Vector3(0, 0, 0)

    this.el.sceneEl.addEventListener('click', (event) => {
      // Create new entity for the new object
      const newElement = document.createElement('a-entity')

      // Spawn model at location of the cursor
      newElement.setAttribute('position', this.el.object3D.position)

      const randomYRotation = Math.random() * 360
      newElement.setAttribute('rotation', `0 ${randomYRotation} 0`)

      newElement.setAttribute('visible', 'false')
      newElement.setAttribute('scale', '0.0001 0.0001 0.0001')

      newElement.setAttribute('gltf-model', '#treeModel')
      newElement.setAttribute('shadow', {receive: false})

      this.el.sceneEl.appendChild(newElement)

      newElement.addEventListener('model-loaded', () => {
        // Once the model is loaded, we are ready to show it popping in using an animation
        newElement.setAttribute('visible', 'true')
        newElement.setAttribute('animation', {
          property: 'scale',
          to: '10 10 10',
          easing: 'easeOutElastic',
          dur: 800,
        })
      })
    })
  },
  tick() {
    // Raycast from camera to 'ground'
    this.raycaster.setFromCamera(this.rayOrigin, this.threeCamera)
    const intersects = this.raycaster.intersectObject(this.ground.object3D, true)

    if (intersects.length > 0) {
      const [intersect] = intersects
      this.cursorLocation = intersect.point
    }
    this.el.object3D.position.y = 0.1
    this.el.object3D.position.lerp(this.cursorLocation, 0.4)
    this.el.object3D.rotation.y = this.threeCamera.rotation.y
  },
}

export {tapPlaceCursorComponent}
