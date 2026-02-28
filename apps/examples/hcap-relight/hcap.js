// This component places a hologram, and then starts the hologram after dismissing loading text.
const hcapComponent = () => ({
  schema: {
    'url': {default: ''},
    'scale': {default: 1},
  },
  init() {
    this.meshInitialized = false
    this.showedPrompt = false

    this.hvo = new HoloVideoObjectThreeJS(
      this.el.sceneEl.renderer,
      (mesh) => {
        mesh.position.set(0, 0, 0)
        mesh.rotation.set(0, -3.14, 0)
        mesh.castShadow = true
        mesh.material = new THREE.MeshStandardMaterial({map: mesh.material.map})
        this.el.object3D.add(mesh)
        this.meshInitialized = true
      }
    )

    // This check improves iOS webview compatibility
    if (['iPhone', 'iPad', 'iPod'].includes(navigator.platform)) {
      this.hvo.hvo.isSafari = true
    }

    this.hvo.open(this.data.url, {autoloop: true, audioEnabled: false})

    this.el.setAttribute('visible', 'false')
    this.prompt = document.getElementById('promptText')
    this.message = document.getElementById('messageText')

    // Play/Pause functionality
    this.pauseBtn = document.getElementById('pauseBtn')
    let pause = false
    const playImg = require('./assets/icons/play.svg')
    const pauseImg = require('./assets/icons/pause.svg')
    const pauseHcap = () => {
      pause = !pause
      if (pause) {
        this.pauseBtn.src = playImg
        this.hvo.pause()  // pause hcap
      } else {
        this.pauseBtn.src = pauseImg
        this.hvo.play()  // play hcap
      }
    }
    this.pauseBtn.addEventListener('click', pauseHcap)

    // Mute/Unmute functionality
    this.muteBtn = document.getElementById('muteBtn')
    let mute = this.hvo.audioEnabled
    const muteImg = require('./assets/icons/mute.svg')
    const soundImg = require('./assets/icons/sound.svg')
    const muteHcap = () => {
      mute = !mute
      if (mute) {
        this.muteBtn.src = muteImg
        this.hvo.setAudioEnabled(false)  // mute hcap
      } else {
        this.muteBtn.src = soundImg
        this.hvo.setAudioEnabled(true)  // unmute hcap
      }
    }
    this.muteBtn.addEventListener('click', muteHcap)

    // Place HCAP
    this.placeHologram = (event) => {
      // Dismiss the prompt text and show playback controls
      this.prompt.style.display = 'none'
      this.message.style.display = 'block'
      this.pauseBtn.style.display = 'block'
      this.muteBtn.style.display = 'block'

      // Make the hologram visible and start playback.
      this.el.setAttribute('visible', 'true')
      this.hvo.play()

      // Animate hologram in from a small scale to its end scale.
      const minS = this.data.scale / 50
      const maxS = this.data.scale
      this.el.setAttribute('scale', `${minS} ${minS} ${minS}`)
      this.el.setAttribute('animation', {
        property: 'scale',
        to: `${maxS} ${maxS} ${maxS}`,
        easing: 'easeOutElastic',
        dur: 800,
      })

      console.log(`HasNormals: ${this.hvo.fileInfo.haveNormals}`)
    }
  },
  tick() {
    if (this.meshInitialized) {
      this.hvo.update()

      // Display loading
      if (!this.showedPrompt && this.hvo.state === 1) {
        this.prompt.style.display = 'block'
        this.prompt.innerHTML = 'Loading...'
      }

      // Place hologram when 'Opened' (2) state is reached
      if (!this.showedPrompt && this.hvo.state === 2) {
        this.placeHologram()
        this.showedPrompt = true
      }
    }
  },
})

const hcapPrimitive = () => ({
  defaultComponents: {
    hcap: {},
  },
  mappings: {
    'src': 'hcap.url',
    'holo-scale': 'hcap.scale',
  },
})

export {hcapComponent, hcapPrimitive}
