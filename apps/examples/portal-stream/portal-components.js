// This component hides and shows certain elements as the camera moves
const portalComponent = {
  schema: {
    width: {default: 4},
    height: {default: 6},
    depth: {default: 1},
  },
  init() {
    this.camera = document.getElementById('camera')
    this.contents = document.getElementById('portal-contents')
    this.walls = document.getElementById('hider-walls')
    this.portalWall = document.getElementById('portal-wall')
    this.isInPortalSpace = false
    this.wasOutside = true
  },
  tick() {
    const {position} = this.camera.object3D

    const isOutside = position.z > this.data.depth / 2
    const withinPortalBounds =
      position.y < this.data.height && Math.abs(position.x) < this.data.width / 2

    if (this.wasOutside !== isOutside && withinPortalBounds) {
      this.isInPortalSpace = !isOutside
    }

    this.contents.object3D.visible = this.isInPortalSpace || isOutside
    this.walls.object3D.visible = !this.isInPortalSpace && isOutside
    this.portalWall.object3D.visible = this.isInPortalSpace && !isOutside

    this.wasOutside = isOutside
  },
}

const bobComponent = {
  schema: {
    distance: {default: 0.15},
    duration: {default: 1000},
  },
  init() {
    const {el} = this
    const {data} = this
    data.initialPosition = this.el.object3D.position.clone()
    data.downPosition = data.initialPosition.clone().setY(data.initialPosition.y - data.distance)
    data.upPosition = data.initialPosition.clone().setY(data.initialPosition.y + data.distance)

    const vectorToString = v => `${v.x} ${v.y} ${v.z}`
    data.initialPosition = vectorToString(data.initialPosition)
    data.downPosition = vectorToString(data.downPosition)
    data.upPosition = vectorToString(data.upPosition)

    data.timeout = null

    const animatePosition = position => el.setAttribute('animation__bob', {
      property: 'position',
      to: position,
      dur: data.duration,
      easing: 'easeInOutQuad',
      loop: false,
    })

    const bobDown = () => {
      if (data.shouldStop) {
        animatePosition(data.initialPosition)
        data.stopped = true
        return
      }
      animatePosition(data.downPosition)
      data.timeout = setTimeout(bobUp, data.duration)
    }

    const bobUp = () => {
      if (data.shouldStop) {
        animatePosition(data.initialPosition)
        data.stopped = true
        return
      }
      animatePosition(data.upPosition)
      data.timeout = setTimeout(bobDown, data.duration)
    }

    const bobStop = () => {
      data.shouldStop = true
    }
    const bobStart = () => {
      if (data.stopped) {
        data.shouldStop = false
        data.stopped = false
        bobUp()
      }
    }

    this.el.addEventListener('bobStart', bobStart)
    this.el.addEventListener('bobStop', bobStop)

    bobUp()
  },
}

const livestreamComponent = {
  init() {
    const video = document.getElementById('video')
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource('https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8')
      hls.attachMedia(video)
      hls.on(Hls.Events.FRAG_BUFFERED, () => {
        video.play()
      })
    }

    // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
    // When the browser has built-in HLS support (check using `canPlayType`), we can provide an
    // HLS manifest (i.e. .m3u8 URL) directly to the video element through the `src` property.
    // This is using the built-in support of the plain video element, without using hls.js.
    // Note: it would be more normal to wait on the 'canplay' event below however on Safari
    // (where you are most likely to find built-in HLS support) the video.src URL must be on the
    // user-drive white-list before a 'canplay' event will be emitted; the last video event that
    // can be reliably listened-for when the URL is not on the white-list is 'loadedmetadata'.
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = 'https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8'
      video.addEventListener('loadedmetadata', () => {
        video.play()
      })
    }
  },
}

export {portalComponent, bobComponent, livestreamComponent}
