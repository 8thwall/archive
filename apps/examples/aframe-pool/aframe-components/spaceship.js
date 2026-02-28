const spaceshipComponent = {
  init() {
    const {el} = this
    const geometry = 'primitive: box; height: 2; width: 2; depth: 2;'
    const material = 'color: #167341; roughness: 1.0; metalness: 0.2;'
    el.setAttribute('geometry', geometry)
    el.setAttribute('material', material)
    this.onKeyDown = this.onKeyDown.bind(this)
  },

  play() {
    this.attachKeyEventListeners()
  },

  pause() {
    this.removeKeyEventListeners()
  },

  onKeyDown(evt) {
    const {el} = this
    let laserEl
    let position
    laserEl = el.sceneEl.components.pool.requestEntity()
    if (!laserEl) {
      return
    }
    position = el.getAttribute('position')
    laserEl.setAttribute('position', position)
    laserEl.play()
    setTimeout(this.laserDestroyer(laserEl), 1000)
  },

  laserDestroyer(el) {
    const laserEl = el
    const component = this
    return function () {
      if (!laserEl.isPlaying) {
        setTimeout(component.laserDestroyer(laserEl), 1000)
        return
      }
      this.el.sceneEl.components.pool.returnEntity(laserEl)
    }.bind(this)
  },

  attachKeyEventListeners() {
    this.el.sceneEl.addEventListener('touchstart', this.onKeyDown)
  },

  removeKeyEventListeners() {
    this.el.sceneEl.removeEventListener('touchstart', this.onKeyDown)
  },
}

export {spaceshipComponent}
