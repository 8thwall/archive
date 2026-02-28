// The attach component copies the position of the target object.  This is used to keep the
// directional light directly above the hologram when dragging. It allows the position to be
// matched without matching scale.
const attachComponent = () => ({
  schema: {
    target: { default: '' },
  },
  update: function() {
    const targetElement = document.getElementById(this.data.target)
    if (!targetElement) {
      return
    }
    this.target = targetElement.object3D
  },
  tick: function() {
    if (this.target) {
      this.el.object3D.position.set(
        this.target.position.x, this.target.position.y + 15, this.target.position.z)
    }
  }
})

AFRAME.registerComponent('attach', attachComponent())
