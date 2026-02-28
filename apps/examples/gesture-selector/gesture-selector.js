const gestureSelectorComponent = {
  selectedModel: null,

  schema: {
    addHoldDrag: {default: true},
    riseHeight: {default: 0.7},
    addTwoFingerRotate: {default: false},
    addOneFingerRotate: {default: false},
    addPinchScale: {default: false},
    addHighlight: {default: false},
  },

  init() {
    const self = this

    // Check if addHoldDrag is true and then set the attribute
    if (this.data.addHoldDrag) {
      this.el.setAttribute('xrextras-hold-drag', 'riseHeight', this.data.riseHeight)
    }

    this.el.addEventListener('mousedown', (event) => {
      // If another model is clicked, first remove gestures from the previously selected model
      if (self.constructor.selectedModel) {
        self.removeGestures(self.constructor.selectedModel)
      }

      // Add gestures to the current clicked model
      self.addGestures(event.currentTarget)
      self.constructor.selectedModel = event.currentTarget
    })
  },

  removeGestures(entity) {
    entity.removeAttribute('xrextras-two-finger-rotate')
    entity.removeAttribute('xrextras-pinch-scale')
    entity.removeAttribute('xrextras-one-finger-rotate')
    entity.setAttribute('highlight', 'enabled', false)
  },

  addGestures(entity) {
    const {data} = this
    if (data.addTwoFingerRotate) {
      entity.setAttribute('xrextras-two-finger-rotate', '')
    }
    if (data.addPinchScale) {
      entity.setAttribute('xrextras-pinch-scale', '')
    }
    if (data.addHighlight) {
      entity.setAttribute('highlight', 'enabled', true)
    }
    if (data.addOneFingerRotate) {
      entity.setAttribute('xrextras-one-finger-rotate', '')
    }
  },
}

export {gestureSelectorComponent}
