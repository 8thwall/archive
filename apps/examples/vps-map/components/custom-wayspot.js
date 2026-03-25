const distance = (from, to) => {
  // Computational optimization for no change.
  if (from.lat === to.lat && from.lng === to.lng) {
    return 0
  }
  const lat1R = (from.lat * Math.PI) / 180
  const lat2R = (to.lat * Math.PI) / 180
  const halfLatD = 0.5 * (lat2R - lat1R)
  const halfLngD = 0.5 * ((to.lng * Math.PI) / 180 - (from.lng * Math.PI) / 180)
  const v = Math.sin(halfLatD) ** 2 + (Math.sin(halfLngD) ** 2) * Math.cos(lat1R) * Math.cos(lat2R)
  const arc = 2 * Math.atan2(Math.sqrt(v), Math.sqrt(1 - v))
  return arc * 6371008.8  // Earth arithmetic mean radius, per en.wikipedia.org/wiki/Earth_radius
}

const customWayspotComponent = {
  schema: {
    name: {type: 'string'},
    title: {type: 'string'},
    imageUrl: {type: 'string'},
  },
  init() {
    const scene = this.el.sceneEl
    const projectWayspotColor = new THREE.Color('#94eaff').convertSRGBToLinear()
    const anyWayspotColor = new THREE.Color('#ffc894').convertSRGBToLinear()
    const texLoader = new THREE.TextureLoader().load(this.data.imageUrl)
    const uiSection = document.getElementById('ui-section')
    const wayspotDistance = document.getElementById('wayspot-distance')
    const wayspotTitle = document.getElementById('wayspot-title')
    const startBtn = document.getElementById('start-btn')
    let isInside = false

    this.swapScene = () => {
      window.location.assign(`${window.location.href}?scene=detect-mesh`)
    }

    startBtn.addEventListener('click', this.swapScene)

    this.wayspotHolder = document.createElement('a-entity')
    this.wayspotHolder.setAttribute('position', '0 1.5 0')
    const randomYRotation = Math.random() * 360
    this.wayspotHolder.setAttribute('shadow', 'receive: false')
    this.wayspotHolder.setAttribute('rotation', `0 ${randomYRotation} 0`)  // apply random rotation

    const disc = document.createElement('a-entity')
    disc.addEventListener('model-loaded', () => {
      disc.getObject3D('mesh').getObjectByName('inner').material.map = texLoader
      disc.getObject3D('mesh').getObjectByName('outer').material.color = this.data.name ? projectWayspotColor : anyWayspotColor
    })
    disc.setAttribute('gltf-model', '#poi-model')
    disc.setAttribute('scale', '0.001 0.001 0.001')
    disc.setAttribute('xrextras-spin', 'speed: 12000')
    disc.object3D.visible = false
    disc.id = this.data.title
    this.wayspotHolder.appendChild(disc)

    const orb = document.createElement('a-sphere')
    orb.setAttribute('geometry', 'primitive: sphere')
    orb.setAttribute('material', {color: this.data.name ? '#94eaff' : '#ffc894'})
    orb.setAttribute('scale', '0.2 0.2 0.2')
    this.wayspotHolder.appendChild(orb)

    this.el.appendChild(this.wayspotHolder)

    const transitionSpeed = 1000

    const enteredGeofence = () => {
      uiSection.classList.remove('slide-down')
      uiSection.classList.add('slide-up')
      disc.object3D.visible = true
      disc.setAttribute('animation__grow', {
        property: 'scale',
        from: '0.001 0.001 0.001',
        to: '0.5 0.5 0.5',
        dur: transitionSpeed,
        easing: 'easeInOutElastic',
      })

      orb.setAttribute('animation__shrink', {
        property: 'scale',
        from: '0.2 0.2 0.2',
        to: '0.001 0.001 0.001',
        dur: transitionSpeed,
        easing: 'easeInOutElastic',
      })
      setTimeout(() => {
        disc.removeAttribute('animation__grow')
        orb.removeAttribute('animation__shrink')
        orb.object3D.visible = false
      }, transitionSpeed + 200)
    }

    const exitedGeofence = () => {
      uiSection.classList.remove('slide-up')
      uiSection.classList.add('slide-down')
      orb.object3D.visible = true
      disc.setAttribute('animation__shrink', {
        property: 'scale',
        from: '0.5 0.5 0.5',
        to: '0.001 0.001 0.001',
        dur: transitionSpeed,
        easing: 'easeInOutElastic',
      })

      orb.setAttribute('animation__grow', {
        property: 'scale',
        from: '0.001 0.001 0.001',
        to: '0.2 0.2 0.2',
        dur: transitionSpeed,
        easing: 'easeInOutElastic',
      })
      setTimeout(() => {
        disc.removeAttribute('animation__shrink')
        orb.removeAttribute('animation__grow')
        disc.object3D.visible = false
      }, transitionSpeed + 200)
    }

    this.el.sceneEl.addEventListener('enter-fence', enteredGeofence)
    this.el.sceneEl.addEventListener('exit-fence', exitedGeofence)
    this.el.parentEl.addEventListener('distance', ({detail}) => {
      if (detail.distance < 40) {
        wayspotDistance.textContent = `${detail.distance.toFixed(0)}m`
        wayspotTitle.textContent = this.data.title.length >= 43 ? `${this.data.title.slice(0, 43)}...` : this.data.title

        if (!isInside) {
          enteredGeofence()
          startBtn.setAttribute('disabled', '')
          isInside = true
        }
      }

      if (detail.distance < 20) {
        startBtn.removeAttribute('disabled')
      }

      if (detail.distance > 40) {
        if (isInside) {
          exitedGeofence()
          isInside = false
        }
      }
    })
  },
  tick() {
    if (this.isInsideOuter) {
      const map = this.el.parentEl.parentEl.components['lightship-map']
      if (!map) {
        return
      }

      const {x: lat, y: lng} = map.data['lat-lng']
      const mapPt = this.el.parentEl.components['lightship-map-point']
      if (!mapPt) {
        return
      }
      const {x: lat2, y: lng2} = mapPt.data['lat-lng']
      this.d = distance({lat, lng}, {lat: lat2, lng: lng2})
    }
  },
}

const customWayspotPrimitive = {
  defaultComponents: {
    'custom-wayspot': {},
  },
  mappings: {
    'name': 'custom-wayspot.name',
    'title': 'custom-wayspot.title',
    'image-url': 'custom-wayspot.imageUrl',
  },
}

export {customWayspotComponent, customWayspotPrimitive}
