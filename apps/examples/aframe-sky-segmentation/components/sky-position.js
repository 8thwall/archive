let horizontalMovement

const positioningComponent = {
  schema: {
    z: {type: 'number', default: 0},
    x: {type: 'number', default: 0},
    y: {type: 'number', default: 0},
    resetRotation: {type: 'boolean', default: false},
  },
  init() {
    const {el} = this
    const parent = document.createElement('a-entity')
    parent.position = '0 0 0'
    el.parentNode.appendChild(parent)
    el.object3D.position.z = this.data.z
    parent.appendChild(el)

    horizontalMovement = -(this.data.x * (Math.PI / 180))
    const verticalMovement = this.data.y * (Math.PI / 180)

    parent.object3D.rotation.y = horizontalMovement
    parent.object3D.rotation.x = verticalMovement

    if (this.data.resetRotation) {
      const modelPos = new THREE.Vector3(0, 0, this.data.z).applyEuler(parent.object3D.rotation)
      el.object3D.position.copy(modelPos)
      parent.object3D.rotation.set(0, 0, 0)
    }
  },
  update() {
    horizontalMovement = -(this.data.x * (Math.PI / 180))
    this.el.parentNode.object3D.rotation.y = horizontalMovement
  },
}

export {positioningComponent}
