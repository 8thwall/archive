import {makeCoverageWatcher} from './coverage-watcher'

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

// Materialize aframe primitives into the map at project wayspot locations.
//
// Entities will have the fllowing attributes set:
// - name: The name of the project wayspot in the project on 8thwall.com.
// - title: The Wayspot title.
// - image-url: URL to a representative image for this Wayspot.
const addVpsCoverageComponent = {
  schema: {
    primitive: {type: 'string'},
    meters: {type: 'number', default: 1},
    min: {type: 'number', default: 0},
  },
  init() {
    this.distanceState = {}
  },
  removeWayspot({id}) {
    delete this.distanceState[id]
    const el = document.getElementById(id)
    if (!el) {
      return
    }
    (el as any).parentEl.removeChild(el)
  },
  addWayspot(w) {
    const {id, name, title, image, lat, lng} = w
    const node = JSON.stringify(w)
    this.distanceState[id] = {lat, lng, d: Infinity}
    const existing = document.getElementById(id)
    // If this wayspot was nearby but now comes back as a project wayspot, we need to recreate it
    // as a project wayspot.
    if (existing) {
      if (name && !existing.getAttribute('name')) {
        this.removeWayspot({id})
      } else {
        return
      }
    }
    const el = document.createElement(this.data.primitive)
    el.setAttribute('title', title)
    el.setAttribute('image', `${image}=w256-h256-p`)
    el.setAttribute('node', node)
    const mapPt = document.createElement('lightship-map-point')
    mapPt.id = id
    mapPt.appendChild(el)
    mapPt.setAttribute('lat-lng', `${lat} ${lng}`)
    mapPt.setAttribute('meters', this.data.meters)
    mapPt.setAttribute('min', this.data.min)
    this.el.appendChild(mapPt)
  },
  tick() {
    const map = this.el.components['lightship-map']
    if (!map) {
      return
    }
    const {x: lat, y: lng} = map.data['lat-lng']
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return
    }
    Object.entries(this.distanceState).forEach(([id, state]) => {
      const d = Math.round(distance({lat, lng}, state))
      if (d !== (state as any).d) {
        (state as any).d = d
        const existing = document.getElementById(id)
        if (!existing) {
          return
        }
        (existing as any).emit('distance', {distance: d})
      }
    })
    if (!this.wayspotWatcher) {
      return
    }
    this.wayspotWatcher.setLatLng(lat, lng)
  },
  update() {
    if (this.wayspotWatcher) {
      return
    }
    this.wayspotWatcher = makeCoverageWatcher({
      onVisible: w => this.addWayspot(w),
      onHidden: w => this.removeWayspot(w),
    })
  },
  remove() {
    this.distanceState = {}
    if (this.wayspotWatcher) {
      this.wayspotWatcher.dispose()
    }
  },
}

let registered_ = false
const register = () => {
  const {AFRAME} = window as any
  if (!AFRAME || registered_) {
    return
  }
  AFRAME.registerComponent('add-vps-coverage', addVpsCoverageComponent)
  registered_ = true
}

register()

const CoverageComponents = {
  register,
}

export {
  CoverageComponents,
}
