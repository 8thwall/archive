const colorChangerComponent = {
  init() {
    // custom theme materials
    const landMat = document.getElementById('land-mat')
    const buildingMat = document.getElementById('building-mat')
    const parkMat = document.getElementById('park-mat')
    const parkingMat = document.getElementById('parking-mat')
    const roadMat = document.getElementById('road-mat')
    const transitMat = document.getElementById('transit-mat')
    const sandMat = document.getElementById('sand-mat')
    const waterMat = document.getElementById('water-mat')

    // UI
    const colorInput = document.getElementById('color-input')
    const colorLabel = document.getElementById('color-label')
    const featureShow = document.getElementById('feature-show')
    const nextFeature = document.getElementById('next-feature-btn')
    const prevFeature = document.getElementById('prev-feature-btn')
    const featureUpdate = document.getElementById('feature-update')
    const featureTitle = document.getElementById('feature-title')

    const updateColor = (event) => {
      if (this.selectedFeature !== null) {
        this.selectedFeature.setAttribute('material', `color: ${event.target.value}`)
      } else {
        this.el.emit('themeSwitched', {theme: 'wayspot', color: event.target.value})
      }
      colorLabel.textContent = event.target.value
    }

    const features = [
      'land',
      'building',
      'park',
      'parking',
      'road',
      'transit',
      'sand',
      'water',
      'wayspot']
    let curFeature = 0
    let selectedFeature
    let featureString

    const switchFeature = (feature) => {
      this.selectedFeature = feature
      featureString = feature
      switch (feature) {
        case 'building':
        case 'road':
        case 'transit':
        case 'water':
          featureUpdate.style.display = 'block'
          featureShow.style.opacity = 1
          break
        case 'wayspot':
          featureUpdate.style.display = 'none'
          featureShow.style.opacity = 0
          break
        default:
          featureUpdate.style.display = 'none'
          featureShow.style.opacity = 1
      }
      this.selectedFeature = document.getElementById(`${feature}-mat`)

      if (featureString === 'road') {
        featureUpdate.value = this.el.components['lightship-map'].data[`${featureString}-m-meters`]
      } else {
        featureUpdate.value = this.el.components['lightship-map'].data[`${featureString}-meters`]
      }

      featureShow.checked = this.el.components['lightship-map'].data[`${featureString}-material`]
      if (this.selectedFeature !== null) {
        colorInput.value = this.selectedFeature.components.material.data.color
      } else {
        colorInput.value = document.querySelector('.orb').components.material.data.color
      }
      colorLabel.textContent = colorInput.value
      featureTitle.innerText = feature
    }

    switchFeature(features[0])

    const hideFeature = (event) => {
      if (!featureShow.checked) {
        this.el.setAttribute(`${featureString}-material`, '')
      } else {
        this.el.setAttribute(`${featureString}-material`, `#${featureString}-mat`)
      }
    }

    const updateFeature = (event) => {
      if (featureString === 'road') {
        this.el.setAttribute(`${featureString}-m-meters`, `${event.target.value}`)
      } else {
        this.el.setAttribute(`${featureString}-meters`, `${event.target.value}`)
      }
    }

    nextFeature.addEventListener('click', () => {
      curFeature === features.length - 1 ? curFeature = 0 : curFeature++
      switchFeature(features[curFeature % features.length])
    })

    prevFeature.addEventListener('click', () => {
      curFeature > 0 ? curFeature-- : curFeature = features.length - 1
      switchFeature(features[curFeature % features.length])
    })

    colorInput.addEventListener('input', updateColor, false)
    featureUpdate.addEventListener('change', updateFeature, false)
    featureShow.addEventListener('change', hideFeature, false)
  },
}

export {colorChangerComponent}
