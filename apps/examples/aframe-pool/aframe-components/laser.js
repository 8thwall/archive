const laserComponent = {
  schema: {
    speed: {default: 1},
  },

  init() {
    const {el} = this
    const geometry = 'primitive: box; height: 2; width: 0.1; depth: 0.1'
    const material = 'color: yellow'
    el.setAttribute('geometry', geometry)
    el.setAttribute('material', material)
  },

  tick() {
    const {el} = this
    const position = el.getAttribute('position')
    position.y += this.data.speed
    el.setAttribute('position', position)
  },
}

export {laserComponent}
