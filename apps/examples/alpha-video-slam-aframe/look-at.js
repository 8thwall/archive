const lookAtComponent = {
  schema: {
    target: {type: 'string'},
    tilt: {default: false},
  },
  init() {
    if (!this.data.target) console.error('no target provided to look-at')
    this.target = document.querySelector(this.data.target)
  },
  tick() {
    this.targetPos = this.target.object3D.position.clone()
    if (!this.data.tilt) this.targetPos.setY(0)
    this.el.object3D.lookAt(this.targetPos)
  },
}

export {lookAtComponent}
