const simultaneousTargetComponent = () => ({
  schema: {
    targetList: {type: 'array', default: []},
    targetQuantity: {type: 'int', default: 0},
  },
  init() {
    if (this.data.targetList.length && this.data.targetQuantity > 0) {
      console.error('please specify EITHER targetList or targetQuantity but noth both.')
      return
    }

    this.messageEl = document.getElementById('message')
    this.foundAll = false

    this.activeSet = new Set()
    const componentMap = {}

    const forwardEvent = (event) => {
      const component = componentMap[event.detail.name]
      if (!component) {
        return
      }
      component.emit(event.type, event.detail, false)
    }

    // Generate frame components
    const addComponents = ({detail}) => {
      detail.imageTargets.forEach(({name, type, metadata, properties}) => {
        if (this.data.targetQuantity || this.data.targetList.includes(name)) {
          const el = document.createElement('artgallery-frame')
          el.setAttribute('id', `imagetarget-entity-${name}`)
          el.setAttribute('name', name)
          el.setAttribute('type', type)
          el.setAttribute('rotated', (properties && properties.isRotated) ? 'true' : 'false')
          el.setAttribute(
            'metadata', (typeof metadata === 'string') ? metadata : JSON.stringify(metadata)
          )
          document.querySelector('a-scene').appendChild(el)
          componentMap[name] = el
        }
      })
    }

    const showImage = ({detail}) => {
      if (this.data.targetQuantity || this.data.targetList.includes(detail.name)) {
        this.activeSet.add(detail.name)
        forwardEvent(event)
      }
    }

    const updateImage = ({detail}) => {
      if (this.data.targetQuantity || this.data.targetList.includes(detail.name)) {
        forwardEvent(event)
      }
    }

    const hideImage = ({detail}) => {
      if (this.data.targetQuantity || this.data.targetList.includes(detail.name)) {
        this.activeSet.delete(detail.name)
        forwardEvent(event)
      }
    }

    this.el.sceneEl.addEventListener('xrimageloading', addComponents)
    this.el.sceneEl.addEventListener('xrimagefound', showImage)
    this.el.sceneEl.addEventListener('xrimageupdated', updateImage)
    this.el.sceneEl.addEventListener('xrimagelost', hideImage)
  },
  tick() {
    if (this.foundAll === false) {
      this.messageEl.innerHTML = `
      <p>Activate ${this.data.targetQuantity || this.data.targetList.length} targets at the same time to win!</p>
      <p>Active: ${this.activeSet.size}</p>`

      if ((this.data.targetQuantity && this.activeSet.size >= this.data.targetQuantity) ||
        (this.activeSet.size >= 1 && this.activeSet.size === this.data.targetList.length)) {
        this.foundAll = true
        this.messageEl.innerHTML = '<p>You Win!</p>'

        const content = document.getElementById('gift')
        content.setAttribute('visible', true)
        content.setAttribute('animation__scale', {
          property: 'scale',
          to: '1 1 1',
          dur: 1000,
          easing: 'easeOutElastic',
        })
        content.setAttribute('animation__rotation', {
          property: 'rotation',
          to: '0 360 0',
          dur: 1500,
          easing: 'easeOutElastic',
        })
      }
    }
  },
})

export {simultaneousTargetComponent}
