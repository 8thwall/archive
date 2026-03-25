const defaultTexture = require('../assets/textures/space.png')

let skyEl

const skyBoxComponent = {
  schema: {
    texture: {type: 'string', default: defaultTexture},
    transparent: {type: 'boolean', default: false},
  },
  init() {
    skyEl = document.createElement('a-sky')
    skyEl.setAttribute('src', this.data.texture)
    this.el.appendChild(skyEl)
  },

  update() {
    if (this.data.transparent) {
      skyEl.setAttribute('opacity', 0)
    } else if (!this.data.transparent) {
      skyEl.setAttribute('opacity', 1)
    }
  },
}
export {skyBoxComponent}
