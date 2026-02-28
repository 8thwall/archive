// This is a simple component that implements some controls on top of the 'eighti-hologram'
// component.  You could do this without AFrame as well.
const eightiControlsComponent = {
  schema: {
    'size': {default: 1},  // hologram starting size
  },
  init() {
    const holo = this.el.components.hologram
    this.camera = this.el.sceneEl.querySelector('a-camera')
    this.ground = document.getElementById('ground')

    this.prompt = document.getElementById('promptText')
    this.prompt.innerHTML = 'Loading...'
    this.progress = document.getElementById('progressBar')
    this.playProgress = document.getElementById('playProgress')

    this.pauseBtn = document.getElementById('pauseBtn')
    const playImg = require('./assets/icons/play.svg')
    const pauseImg = require('./assets/icons/pause.svg')

    this.muteBtn = document.getElementById('muteBtn')
    const muteImg = require('./assets/icons/mute.svg')
    const soundImg = require('./assets/icons/sound.svg')

    // You can use event handlers on the eighti-hologram element to monitor playback progress:
    // 'onplay'
    // 'onpause'
    // 'onended'
    // 'oncanplay' - the hologram has loaded and you can issue a play() call to the component

    this.el.addEventListener('onplay', (evt) => {
      this.pauseBtn.src = pauseImg
    })
    this.el.addEventListener('onpause', (evt) => {
      this.pauseBtn.src = playImg
    })
    this.el.addEventListener('onended', (evt) => {
      this.pauseBtn.src = playImg
    })
    this.el.addEventListener('oncanplay', (evt) => {
      this.prompt.style.display = 'block'
      const scene = this.el.sceneEl

      const onAttach = ({sessionAttributes}) => {
        this.responsiveImmersive(sessionAttributes)
      }
      XR8.addCameraPipelineModules([{'name': 'responsiveImmersive', onAttach}])
      this.el.setAttribute('visible', true)

      this.placeHologram = (event) => {
        // place at touchpoint
        const touchPoint = event.detail.intersection.point
        this.el.setAttribute('position', touchPoint)
        const camRot = this.camera.getAttribute('rotation')
        const thisRot = this.el.getAttribute('rotation')
        this.el.setAttribute('rotation', `${thisRot.x} ${camRot.y} ${thisRot.z}`)

        // animate hologram in from a small scale to its end scale
        const minS = this.data.size / 50
        const maxS = this.data.size
        this.el.setAttribute('scale', `${minS} ${minS} ${minS}`)
        this.el.setAttribute('animation', {
          property: 'scale',
          to: `${maxS} ${maxS} ${maxS}`,
          easing: 'easeOutElastic',
          dur: 500,
          delay: 100,
        })

        // Commands can be sent directly to the hologram component to control playback:
        // 'play()'
        // 'pause()'
        this.el.components.hologram.play()

        this.prompt.style.display = 'none'
        this.pauseBtn.style.display = 'block'
        this.muteBtn.style.display = 'block'
        this.muteBtn.src = soundImg

        // Only show the progress bar if this is not a live broadcast
        if (holo.duration !== Infinity) this.progress.style.display = 'block'

        this.ground.setAttribute('visible', true)
      }

      this.ground.addEventListener('mousedown', this.placeHologram, {once: true})
    }, {once: true})

    this.pauseBtn.onclick = (evt) => {
      if (evt.bubbles) evt.stopPropagation()
      // The 'paused' getter will return the playback state simlar to the HTMLVideoElement API
      if (holo.paused) holo.play()
      else holo.pause()
    }
    this.pauseBtn.onmousedown = (evt) => {
      if (evt.bubbles) evt.stopPropagation()
    }

    // mute/unmute functionality
    this.muteBtn.onclick = (evt) => {
      if (evt.bubbles) evt.stopPropagation()
      // The current mute state can be queried via the 'muted' getter, again following the API
      // of the HTMLVideoElement
      holo.muted = !holo.muted
      if (holo.muted) this.muteBtn.src = muteImg
      else this.muteBtn.src = soundImg
    }
    this.muteBtn.onmousedown = (evt) => {
      if (evt.bubbles) evt.stopPropagation()
    }
  },
  // separate behavior by device category using 8th Wall Engine sessionAttributes
  responsiveImmersive(sessionAttributes) {
    const s = sessionAttributes
    if (
      s.cameraLinkedToViewer &&
        s.controlsCamera &&
        !s.fillsCameraTexture &&
        s.supportsHtmlEmbedded &&
        !s.supportsHtmlOverlay &&
        !s.usesMediaDevices &&
        s.usesWebXr
    ) {  // HMD-specific CSS changes
      this.prompt.innerHTML = 'Click Ground to<br>Place Hologram'
      this.prompt.style.width = '80vw'
      this.prompt.style.fontSize = '8vw'
      this.pauseBtn.style.width = '10vw'
      this.muteBtn.style.width = '10vw'
      this.progress.style.bottom = '11vh'
    } else if (
      !s.cameraLinkedToViewer &&
        !s.controlsCamera &&
        s.fillsCameraTexture &&
        !s.supportsHtmlEmbedded &&
        s.supportsHtmlOverlay &&
        s.usesMediaDevices &&
        !s.usesWebXr
    ) {  // Mobile-specific behavior goes here
      this.prompt.innerHTML = 'Tap to Place<br>Hologram'
    }
  },
  tick() {
    const holo = this.el.components.hologram
    if (holo && holo.duration !== Infinity && !holo.paused && this.playProgress != null) {
      this.playProgress.style.display = 'block'

      // Playback progress can be tracked using the 'currentTime' and 'duration' getters.
      this.playProgress.style.width =
        `${(100 * (holo.currentTime / holo.duration))}%`
    }
  },
}

export {eightiControlsComponent}
