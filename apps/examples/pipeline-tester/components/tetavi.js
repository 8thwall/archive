/* globals Tetavi */

const tetaviHologramComponent = () => ({
  schema: {
    'tvm-file': {type: 'asset'},                // tvm asset reference
    'mp4-file': {type: 'asset'},                // mp4 asset reference
    'proximity-fade': {default: true},          // fades out as camera approaches
    'loop': {default: true},                    // volumetric video looping
    'playback-rate': {default: 1.0},            // rate of playback (0.5 is half, 2.0 is double)
    'size': {default: 1},                       // hologram starting size
    'touch-target-size': {default: '1.5 0.5'},  // size of touch target cylinder: height, radius
    'touch-target-offset': {default: '0 0'},    // offset of touch target cylinder: x, z
    'touch-target-visible': {default: false},   // show touch target for debugging
  },
  init() {
    this.prompt = document.getElementById('promptText').getElementsByTagName('text')
    this.playProgress = document.getElementById('playProgress')
    this.loadProgress = document.getElementById('loadProgress')
    this.pauseBtn = document.getElementById('pauseBtn')
    this.muteBtn = document.getElementById('muteBtn')
    this.ground = document.getElementById('ground')

    // runs when hologram is loaded and ready for playback
    this.readytoplay = (event) => {
      for (let i = 0; i < this.prompt.length; i++) {
        this.prompt[i].textContent = 'Tap to Place Hologram'
        this.prompt[i].style.display = 'block'
      }
      this.ground.addEventListener('mousedown', this.placeHologram, {once: true})
    }

    // add event listener for when hologram is ready for playback
    this.el.addEventListener('ready', this.readytoplay, {once: true})

    // animates the load progress bar
    const setBar = (width, widthPlay) => {
      if (!this.loadProgress) {
        this.loadProgress = document.getElementById('loadProgress')
      }
      this.loadProgress.style.width = `${100 * (widthPlay / width)}%`
      if ((widthPlay / width) > 0.95) {
        this.el.emit('ready', '')  // emits 'ready' event when loaded
      }
    }

    // create the tetavi hologram
    this.tetavi = Tetavi.create(
      document.querySelector('a-scene').renderer,
      document.querySelector('a-scene').camera,
      this.data['mp4-file'],
      this.data['tvm-file']
    )
      .onSetBar(setBar)
      .setFadeAlpha(this.data['proximity-fade'])
      .setShadowAngle(0.4)

    // video playback settings
    this.tetavi.twbLib.srcVideo.loop = this.data.loop
    this.tetavi.twbLib.srcVideo.playbackRate = this.data['playback-rate']

    this.placeHologram = (event) => {
      // hide "Tap to Place Hologram" text + show playback buttons
      for (let i = 0; i < this.prompt.length; i++) {
        this.prompt[i].style.display = 'none'
      }
      this.pauseBtn.style.display = 'block'
      this.muteBtn.style.display = 'block'

      // add hologram to scene
      const model = this.tetavi.getScene()
      this.el.object3D.add(model)

      // place at touchpoint
      const touchPoint = event.detail.intersection.point
      this.el.setAttribute('position', touchPoint)

      // begin playback
      this.tetavi.play()

      // add a cylinder primitive to receive raycasting for gestures. It is raised slightly
      // off the ground to support tapping on the ground.
      const [tapVolumeHeight, tapVolumeRadius] =
      this.data['touch-target-size'].split(' ').map(v => Number(v))
      const [tapTargetOffsetX, tapTargetOffsetZ] =
      this.data['touch-target-offset'].split(' ').map(v => Number(v))
      const touchTargetAlpha = this.data['touch-target-visible'] ? 0.2 : 0.0

      this.el.insertAdjacentHTML('beforeend', `
      <a-entity 
        geometry="primitive: cylinder; height: ${tapVolumeHeight - 0.15}; radius: ${tapVolumeRadius}" 
        material="transparent: true; opacity: ${touchTargetAlpha}; depthTest: false;" 
        position="${tapTargetOffsetX} ${(tapVolumeHeight - 0.15) * 0.5 + 0.15} ${tapTargetOffsetZ}" 
        class="cantap"
        shadow="cast: false; receive: false">
      </a-entity>`)

      // animate hologram in from a small scale to its end scale
      const minS = this.data.size / 50
      const maxS = this.data.size
      this.el.setAttribute('scale', `${minS} ${minS} ${minS}`)
      this.el.setAttribute('animation', {
        property: 'scale',
        to: `${maxS} ${maxS} ${maxS}`,
        easing: 'easeOutElastic',
        dur: 800,
        delay: 800,
      })

      // tetavi shadow visibility
      this.tetavi.twbLib.shadowMaterial.visible = true
    }

    // play/pause functionality
    const playImg = require('../assets/mrcs/icons/play.svg')
    const pauseImg = require('../assets/mrcs/icons/pause.svg')
    const pauseHcap = () => {
      if (this.tetavi.isPlaying()) {
        this.pauseBtn.src = playImg
        this.tetavi.pause()  // pause hcap
      } else {
        this.pauseBtn.src = pauseImg
        this.tetavi.resume()  // play hcap
      }
    }
    this.pauseBtn.addEventListener('click', pauseHcap)

    // mute/unmute functionality
    const muteImg = require('../assets/mrcs/icons/mute.svg')
    const soundImg = require('../assets/mrcs/icons/sound.svg')
    const muteHcap = () => {
      if (!this.tetavi.twbLib.srcVideo.muted) {
        this.muteBtn.src = muteImg
        this.tetavi.twbLib.srcVideo.muted = true   // mute hologram
      } else {
        this.muteBtn.src = soundImg
        this.tetavi.twbLib.srcVideo.muted = false  // unmute hcap
      }
    }
    this.muteBtn.addEventListener('click', muteHcap)
  },
  tick() {
    if (this.tetavi != null) {
      this.tetavi.animate()

      // play progress
      if (this.tetavi.getTotalFrames() > 1) {
        if (this.playProgress != null) {
          this.playProgress.style.display = 'block'
          this.playProgress.style.width =
            `${(100 * (this.tetavi.getFrame() / this.tetavi.getTotalFrames()))}%`
        }
      }
    }
  },
})

const tetaviHologramPrimitive = () => ({
  defaultComponents: {
    tetavi: {},
  },
  mappings: {
    'tvm-file': 'tetavi.tvm-file',
    'mp4-file': 'tetavi.mp4-file',
    'proximity-fade': 'tetavi.proximity-fade',
    'loop': 'tetavi.loop',
    'playback-rate': 'tetavi.playback-rate',
    'size': 'tetavi.size',
    'touch-target-size': 'tetavi.touch-target-size',
    'touch-target-offset': 'tetavi.touch-target-offset',
    'touch-target-visible': 'tetavi.touch-target-visible',
  },
})

export {tetaviHologramComponent, tetaviHologramPrimitive}
