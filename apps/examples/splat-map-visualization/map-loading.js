const mapLoadingScreenComponent = {
  init() {
    const scene = this.el.sceneEl
    const gradient = document.getElementById('gradient')
    const dismissLoadScreen = () => {
      setTimeout(() => {
        gradient.classList.add('fade-out')
      }, 1500)
      setTimeout(() => {
        gradient.style.display = 'none'
      }, 2000)
    }
    const getPosition = options => new Promise(((resolve, reject) => {
      const needGps = document.querySelector('lightship-map').getAttribute('enable-gps')
      if (needGps.toLowerCase() === 'false') {
        resolve()
        return
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    }))
    getPosition()
      .then((position) => {
        scene.hasLoaded ? dismissLoadScreen() : scene.addEventListener('loaded', dismissLoadScreen)
      })
      .catch((err) => {
        console.error(err.message)
      })
  },
}

const EARTH_RADIUS = 6378137.0
const EARTH_METERS_PER_DEGREE = (EARTH_RADIUS * Math.PI) / 180
const degToRad = deg => (deg * Math.PI) / 180.0

const latPlusMeter = (lat, m) => lat + m / EARTH_METERS_PER_DEGREE

const lngPlusMeter = (lat, lng, m) => (
  lng + (m / EARTH_METERS_PER_DEGREE) / Math.cos(degToRad(lat))
)

const truncateLatLng = (elLatLng) => {
  const [lat, lng] = elLatLng.split(' ')
  return `${Number(lat).toFixed(7)} ${Number(lng).toFixed(7)}`
}

const groundPlaneRadians = (camera) => {
  const cameraQ = camera.quaternion
  const up = new THREE.Vector3(0, 1, 0)
  up.applyQuaternion(cameraQ)
  const xd = up.x
  const zd = -up.z
  const norm = xd * xd + zd * zd
  const euler = new THREE.Euler()
  euler.setFromQuaternion(cameraQ, 'YXZ')
  return norm > 1e-3 ? Math.atan2(zd, xd) - Math.PI / 2 : euler.y
}

const facingRadians = ({fwd, left, right, back}) => {
  // diagonal controls
  if (fwd && left) {  // NW
    return 0.25 * Math.PI
  }

  if (fwd && right) {  // NE
    return -0.25 * Math.PI
  }

  if (back && left) {  // SW
    return 0.75 * Math.PI
  }

  if (back && right) {  // SE
    return -0.75 * Math.PI
  }

  // cardinal controls
  if (fwd) {  // N
    return 0
  }

  if (back) {  // S
    return Math.PI
  }

  if (left) {  // E
    return 0.5 * Math.PI
  }

  if (right) {  // W
    return -0.5 * Math.PI
  }

  return 0
}

const mapDebugControlsComponent = {
  schema: {
    distance: {default: 1},
  },
  init() {
    const {pathname} = new URL(window.location)
    const params = pathname.split('/')[2]
    this.urlAttr = ''
    this.replacingState = false
    if (params) {
      if (params[0] === '@') {
        const latlng = params.slice(1).split(',')
        const lat = Number(latlng[0])
        const lng = Number(latlng[1])
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          const urlAttr = `${lat} ${lng}`
          this.el.setAttribute('lat-lng', urlAttr)
          // Force the component to pick up changes to the primitive after init.
          this.el.components['lightship-map'].data['lat-lng'] = {x: lat, y: lng}
          this.urlAttr = urlAttr
        } else {
          console.warn(`Invalid URL Params Lat/Lng: ${params.slice(1)}`)
        }
      } else {
        console.warn(`Invalid URL Params Lat/Lng doesn't start with '@': ${params}`)
      }
    }
    this.emitting = false

    this.el.sceneEl.addEventListener('hud-button-updatate', ({detail}) => {
      switch (detail.id) {
        case 'up':
          this.fwd = detail.to === 'selected'
          break
        case 'left':
          this.left = detail.to === 'selected'
          break
        case 'right':
          this.right = detail.to === 'selected'
          break
        case 'down':
          this.back = detail.to === 'selected'
          break
        case 'gps':
          {
            const lsMap = document.querySelector('lightship-map')
            const gpsEnabled = lsMap.getAttribute('enable-gps').toLowerCase() === 'true'
            if (detail.to === 'selected') {
              if (!gpsEnabled) {
                lsMap.setAttribute('enable-gps', 'true')
              }
            } else if (gpsEnabled) {
              lsMap.setAttribute('enable-gps', 'false')
            }
          }
          break
        default:
          break
      }
    })

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        this.fwd = true
      }

      if (e.key === 'ArrowDown' || e.key === 's') {
        this.back = true
      }

      if (e.key === 'ArrowLeft' || e.key === 'a') {
        this.left = true
      }

      if (e.key === 'ArrowRight' || e.key === 'd') {
        this.right = true
      }
    }

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        this.fwd = false
      }

      if (e.key === 'ArrowDown' || e.key === 's') {
        this.back = false
      }

      if (e.key === 'ArrowLeft' || e.key === 'a') {
        this.left = false
      }

      if (e.key === 'ArrowRight' || e.key === 'd') {
        this.right = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
  },
  tick(_, timeDelta) {
    const elAttr = truncateLatLng(this.el.getAttribute('lat-lng'))
    if (this.urlAttr !== elAttr) {
      const [lat, lng] = elAttr.split(' ')
      const url = new URL(window.location)
      const {pathname} = url
      const components = pathname.split('/')
      components[2] = `@${lat},${lng}`
      url.pathname = components.join('/')
      this.nextUrl = url
      if (!this.urlTimeout) {
        this.urlTimeout = window.setTimeout(() => {
          window.history.replaceState(null, null, this.nextUrl)
          this.urlTimeout = null
        }, 200)
      }

      this.urlAttr = `${lat} ${lng}`
    }

    if (document.querySelector('lightship-map').getAttribute('enable-gps').toLowerCase() === 'true') {
      return
    }

    const camera = document.querySelector('a-camera').object3D
    const distScale = 0.1 * Math.sqrt((camera.position.y))
    const {distance} = this.data

    let dx = 0
    let dy = 0
    if (this.fwd) {
      dy += distance * distScale
    }
    if (this.back) {
      dy -= distance * distScale
    }
    if (this.right) {
      dx += distance * distScale
    }
    if (this.left) {
      dx -= distance * distScale
    }

    if (!dx && !dy) {
      if (this.emitting) {
        this.emitting = false
        this.el.emit('motion', {kmh: 0, direction: this.lastDirection})
      }
      return
    }

    const angle = groundPlaneRadians(camera)
    const alpha = Math.cos(angle)
    const beta = Math.sin(angle)

    const ndx = alpha * dx - beta * dy
    const ndy = beta * dx + alpha * dy

    const latlng = this.el.getAttribute('lat-lng')
    if (!latlng) {
      return
    }
    const [lat, lng] = latlng.split(' ').map(parseFloat)

    this.el.setAttribute('lat-lng', `${latPlusMeter(lat, ndy)} ${lngPlusMeter(lat, lng, ndx)}`)
    const km = Math.sqrt(ndx * ndx + ndy * ndy) / 1000.0
    const hrs = (timeDelta / 1000) / 3600

    this.emitting = true
    this.lastDirection = angle + facingRadians(this)
    this.el.emit('motion', {kmh: km / hrs, direction: this.lastDirection})
  },
}

let registered_ = false
const register = () => {
  const {AFRAME} = window
  if (!AFRAME || registered_) {
    return
  }

  AFRAME.registerComponent('map-loading', mapLoadingScreenComponent)
  AFRAME.registerComponent('map-debug-controls', mapDebugControlsComponent)
  registered_ = true
}

register()

const MapLoading = {
  register,
}

export {
  MapLoading,
}
