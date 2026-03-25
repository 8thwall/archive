function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}

const fallComponent = {
  init() {
    this.fall = this.fall.bind(this)
    this.caught = this.caught.bind(this)
    this.miss = this.miss.bind(this)

    this.el.addEventListener('caught', this.caught)
    this.el.addEventListener('animationcomplete__fall', this.miss)

    this.fall()
  },
  remove() {
    this.el.removeEventListener('caught', this.caught)
    this.el.removeEventListener('animationcomplete__fall', this.miss)
  },
  fall() {
    // give the candy a random position and rotation
    const x = getRandomArbitrary(-0.15, 0.15)
    this.el.setAttribute('position', `${x} 2.3 -0.4}`)
    this.el.setAttribute('rotation', `${getRandomArbitrary(0, 360)} ${getRandomArbitrary(0, 360)} ${getRandomArbitrary(0, 360)}`)

    this.el.setAttribute('animation__fall', {
      property: 'position',
      from: `${x} 2.3 -0.4`,
      to: `${x} -2.3 -0.4`,
      dur: 1750,
    })
  },
  caught() {
    // hide the candy, reset fall animation
    this.el.setAttribute('visible', false)
    setTimeout(() => {
      this.el.setAttribute('visible', true)
      this.fall()
    }, 1000)
  },
  miss() {
    // emit fall event, reset fall animation
    this.el.sceneEl.emit('miss')
    this.fall()
  },
}
export {fallComponent}
