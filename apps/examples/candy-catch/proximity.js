const proximityTriggerComponent = {
  schema: {
    radius: {type: 'number', default: 0.1},
  },
  init() {
    // Initialize vectors to hold world positions
    this.handWorldPos = new THREE.Vector3()
    this.candyWorldPos = new THREE.Vector3()
    this.caught = false

    this.el.addEventListener('caught', () => {
      setTimeout(() => {
        this.caught = false
      }, 500)
    })
  },
  tick() {
    // Update the world positions of the hand and the target
    document.getElementById('bowlEl').object3D.getWorldPosition(this.handWorldPos)
    // console.log(this.handWorldPos)
    this.el.object3D.getWorldPosition(this.candyWorldPos)

    const distance = this.handWorldPos.distanceTo(this.candyWorldPos)

    if (distance <= this.data.radius && !this.caught) {
      this.caught = true
      this.el.emit('caught')
    }
  },
}
export {proximityTriggerComponent}
