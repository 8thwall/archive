const twoFingerSpinComponent = () => ({
  schema: {
    factor: {default: 5}
  },
  init: function() {
    this.handleEvent = this.handleEvent.bind(this)
    this.el.sceneEl.addEventListener('twofingermove', this.handleEvent)
    this.el.classList.add('cantap')
  },
  remove: function() {
    this.el.sceneEl.removeEventListener('twofingermove', this.handleEvent)
  },
  handleEvent: function(event) {
    this.el.object3D.rotation.y += event.detail.positionChange.x * this.data.factor
  }
})

AFRAME.registerComponent('two-finger-spin', twoFingerSpinComponent())
