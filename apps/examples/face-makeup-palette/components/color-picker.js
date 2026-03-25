const colorPickerComponent = {
  schema: {
    makeup: {type: 'string'},
  },
  init() {
    let initialColor
    this.once = false
    const currentMakeup = document.getElementById(this.data.makeup)
    this.colorInput = document.getElementById('color-input')
    const materialColor = currentMakeup.getAttribute('material')

    if (materialColor.color) {
      initialColor = materialColor.color
      this.colorInput.value = initialColor
    } else {
      initialColor = this.colorInput.value
    }
    currentMakeup.setAttribute('material', {color: initialColor})

    this.setColor = () => {
      const selectedColor = this.colorInput.value
      currentMakeup.setAttribute('material', {color: selectedColor})
    }

    this.colorInput.addEventListener('input', this.setColor)
  },

  update(oldData) {
    if (this.once) {
      const previousMakeup = document.getElementById(oldData.makeup)
      const currentMakeup = document.getElementById(this.data.makeup)
      if (previousMakeup) {
        this.colorInput.removeEventListener('input', this.setColor)
      }

      let initialColor
      const materialColor = currentMakeup.getAttribute('material')
      if (materialColor.color) {
        initialColor = materialColor.color
        this.colorInput.value = initialColor
      } else {
        initialColor = this.colorInput.value
      }
      currentMakeup.setAttribute('material', {color: initialColor})
      this.setColor = () => {
        const selectedColor = this.colorInput.value
        currentMakeup.setAttribute('material', {color: selectedColor})
      }
      this.colorInput.addEventListener('input', this.setColor)
    } else {
      this.once = true
    }
  },
}

export {colorPickerComponent}
