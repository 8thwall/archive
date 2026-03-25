const SPLAT_BASE = require('./assets/spz.files')

const models = [
  // {
  //   src: `${SPLAT_BASE}cloudportal.spz`,
  //   position: '-0.35 -0.1 -1.5',
  //   rotation: '0 5 0',
  //   doty: '0 0 -4.5',
  // },
  // {
  //   src: `${SPLAT_BASE}academyofballet.spz`,
  //   position: '-6 1.4 -2',
  //   rotation: '0 -90 0',
  //   doty: '2 0 -5',
  // },
  // {
  //   src: `${SPLAT_BASE}garage.spz`,
  //   position: '2 1.6 0',
  //   rotation: '0 45 0',
  //   doty: '-2.25 0 -2.5',
  // },
  // {
  //   src: `${SPLAT_BASE}harrow.spz`,
  //   position: '-4 1.7 -2.5',
  //   rotation: '0 -105 0',
  //   doty: '0.8 0.5 -4.7',
  // },
  // {
  //   src: `${SPLAT_BASE}jayhawk.spz`,
  //   position: '6.5 2.95 4',
  //   rotation: '0 -160 0',
  //   doty: '-1.5 0 -2',
  // },
  // {
  //   src: `${SPLAT_BASE}spikywoodenarch.spz`,
  //   position: '0 1.4 -9.5',
  //   rotation: '0 -175 0',
  //   doty: '0 0 -2',
  // },
  /// //////////////////////////////////////////////////////////
  // {
  //   src: `${SPLAT_BASE}suspendedpossibilities.spz`,
  //   position: '-2 1.3 -7.5',
  //   rotation: '0 30 0',
  //   doty: '-1.5 0 -8',
  // },
  // {
  //   src: `${SPLAT_BASE}collegeavefountain.spz`,
  //   position: '4.0 1.5 2.0',
  //   rotation: '0 30 0',
  //   doty: '1.1 0.55 -2.25',
  // },
  // {
  //   src: `${SPLAT_BASE}fountain-threechildren.spz`,
  //   position: '2 0.645 0',
  //   rotation: '0 0 0',
  //   doty: '-1 0 -5',
  // },
  // {
  //   src: `${SPLAT_BASE}gotour-mire.spz`,
  //   position: '-1.25 1 -4.25',
  //   rotation: '0 45 0',
  //   doty: '-1.4 0.485 -0.65',
  // },
  // {
  //   src: `${SPLAT_BASE}postoffice.spz`,
  //   position: '1.5 1.9 -3.0',
  //   rotation: '0 -20 0',
  //   doty: '-1.25 0 -3.5',
  // },
  // {
  //   src: require('./assets/sundial.spz'),
  //   position: '3 1.47 -3',
  //   rotation: '0 90 0',
  //   doty: '1 0 -3',
  // },
  {
    src: require('./assets/cactus.spz'),
    position: '0 -0.18 -3',
    rotation: '0 90 0',
    doty: '0.7 -1.15 -4',
  },
]

const splatSwitcherComponent = {
  init() {
    this.splatEl = document.createElement('splat-model')
    this.el.sceneEl.insertAdjacentElement('afterbegin', this.splatEl)
    this.modelId = Number(window.location.pathname.split('/').pop()) % models.length
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
    const modelAttrs = ['src', 'position', 'rotation']
    modelAttrs.forEach((k) => {
      this.splatEl.setAttribute(k, model[k])
    })
    const doty = document.getElementById('character')
    doty.setAttribute('position', model.doty)
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
