const randomColor = {
  schema: {
    color: {default: 0xffafff},
  },

  updateMatColor(color) {
    this.el.object3D.traverse((object3D) => {
      const mat = object3D.material
      if (mat && mat.name === 'Main') {
        mat.color.setHex(color)
        mat.color.setHex(color)
      }
    })
  },

  init() {
    this.data.color = Math.random() * 0xffffff
    this.el.addEventListener('model-loaded', () => this.updateMatColor(this.data.color))
  },

  update(oldData) {
    // Note: This assumes the model is loaded already
    if (oldData.color !== this.data.color) {
      this.updateMatColor(this.data.color)
    }
  },
}

export {
  randomColor,
}
