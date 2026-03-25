const SPLAT_BASE = require('./assets/spz.files')

const models = [
  {
    src: `${SPLAT_BASE}academyofballet.spz`,
    position: '-6 1.4 0',
    rotation: '0 -90 0',
  },
  {
    src: `${SPLAT_BASE}cloudportal.spz`,
    position: '0 -0.1 -2.5',
    rotation: '0 5 0',
  },
  {
    src: `${SPLAT_BASE}collegeavefountain.spz`,
    position: '4.0 1.5 3.0',
    rotation: '0 30 0',
  },
  {
    src: `${SPLAT_BASE}fountain-threechildren.spz`,
    position: '1 0.645 0',
    rotation: '0 0 0',
  },
  {
    src: `${SPLAT_BASE}garage.spz`,
    position: '1 1.6 0.5',
    rotation: '0 45 0',
  },
  {
    src: `${SPLAT_BASE}harrow.spz`,
    position: '-4 1.7 -0.5',
    rotation: '0 -105 0',
  },
  {
    src: `${SPLAT_BASE}jayhawk.spz`,
    position: '8 2.95 5',
    rotation: '0 -160 0',
  },
  {
    src: `${SPLAT_BASE}postoffice.spz`,
    position: '1.5 1.9 -3.0',
    rotation: '0 -20 0',
  },
  {
    src: `${SPLAT_BASE}spikywoodenarch.spz`,
    position: '0 1.4 -10',
    rotation: '0 -175 0',
  },
  {
    src: `${SPLAT_BASE}suspendedpossibilities.spz`,
    position: '-4.5 1.3 -6.5',
    rotation: '0 50 0',
  },
]

const splatSwitcherComponent = {
  init() {
    this.splatEl = document.createElement('splat-model')
    this.el.sceneEl.insertAdjacentElement('afterbegin', this.splatEl)
    this.modelId = 0
    this.setModel(this.modelId)
    this.el.addEventListener('splat-switcher-next', () => this.nextModel())
    this.el.addEventListener('splat-switcher-prev', () => this.previousModel())

    const nextBtn = document.getElementById('nextBtn')
    nextBtn.addEventListener('click', () => {
      nextBtn.classList.add('pulse-once')
      setTimeout(() => nextBtn.classList.remove('pulse-once'), 500)
      this.el.sceneEl.emit('splat-switcher-next')
    })

    const prevBtn = document.getElementById('prevBtn')
    prevBtn.addEventListener('click', () => {
      prevBtn.classList.add('pulse-once')
      setTimeout(() => prevBtn.classList.remove('pulse-once'), 500)
      this.el.sceneEl.emit('splat-switcher-prev')
    })
  },
  setModel(num) {
    const model = models[num % models.length]
    Object.entries(model).forEach(([k, v]) => {
      this.splatEl.setAttribute(k, v)
    })
  },
  nextModel() {
    this.modelId = (this.modelId + 1) % models.length
    this.setModel(this.modelId)
  },
  previousModel() {
    this.modelId--
    if (this.modelId < 0) {
      this.modelId = models.length - 1
    }
    this.setModel(this.modelId)
  },
}

export {
  splatSwitcherComponent,
}
