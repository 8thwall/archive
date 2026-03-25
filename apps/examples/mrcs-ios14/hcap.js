// This component waits for a tap to place a hologram, and then starts the hologram after dismissing
// prompt text. The hologram uses an invisible cylinder for a touch target.
const hcapComponent = () => ({
  schema: {
    'url': {default: ''},
    'scale': {default: 1},
    'touch-target': {default: '1 0.3'},
    'show-touch-target': {default: false},
  },
  init() {
  // iOS 14.0 - 14.2.1 (and 2020 iPhones) contain a bug that affects HLS streaming in WebGL,
  // blocking HCAP playback. There are also specific iOS webviews that block HCAP playback.
    let streamValue = 0

    const height = window.screen.height * window.devicePixelRatio
    const width = window.screen.width * window.devicePixelRatio
    const hlsResolutions = [1284, 2778, 2436, 1125, 2532, 1170]  // known 2020 iPhone resolutions

    const iOS14Check = () => {
      const {os, osVersion, browser} = XR8.XrDevice.deviceEstimate()
      let errorText = ''
      if (os === 'iOS') {
        switch (osVersion) {
          case '14.0':
          case '14.0.1':
          case '14.1':
          case '14.2.1':
            streamValue = 1  // HLS not supported on these iOS versions; falling back to mp4
            break
          case '14.3':
          case '14.4':
            switch (browser.inAppBrowser || browser.name) {
              case 'Instagram':
              case 'Facebook':
              case 'WeChat':
              case 'LinkedIn':
                // HCAP will not play in these iOS 14.3 webviews
                errorText = 'Open in Safari'
                this.data.url = ''
                break
              default:
                if (hlsResolutions.includes(height || width)) {
                  // HLS not supported on 2020 iPhones; falling back to mp4
                  streamValue = 1
                }
                break  // HLS works in all other iOS 14.3 webviews
            }
            break
          default:
            break  // HLS works on all other iOS versions
        }
      }

      document.body.insertAdjacentHTML('beforeend',
        `<div class="over">
          <span id="errorText">${errorText}</span>
        </div>`)
    }
    window.XR8 ? iOS14Check() : window.addEventListener('xrloaded', iOS14Check)

    this.meshInitialized = false
    this.showedPrompt = false

    const [tapVolumeHeight, tapVolumeRadius] =
      this.data['touch-target'].split(' ').map(v => Number(v))
    const touchTargetAlpha = this.data['show-touch-target'] ? 0.2 : 0.0

    this.hvo = new HoloVideoObjectThreeJS(
      this.el.sceneEl.renderer,
      (mesh) => {
        mesh.position.set(0, 0, 0)
        mesh.rotation.set(0, -3.14, 0)
        mesh.castShadow = true
        this.el.object3D.add(mesh)
        this.meshInitialized = true
      }
    )

    this.hvo.open(this.data.url, {autoloop: true, audioEnabled: true, streamMode: streamValue})

    this.el.setAttribute('visible', 'false')

    this.ground = document.getElementById('ground')
    this.prompt = document.getElementById('promptText')

    // Add a cylinder primitive is used to receive raycasting for gestures. It is raised slightly
    // off the ground to support tapping on the ground.
    this.el.insertAdjacentHTML('beforeend', `
      <a-entity 
        geometry="primitive: cylinder; height: ${tapVolumeHeight - 0.15}; radius: ${tapVolumeRadius}" 
        material="transparent: true; opacity: ${touchTargetAlpha}; depthTest: false;" 
        position="0 ${(tapVolumeHeight - 0.15) * 0.5 + 0.15} 0" 
        class="cantap" 
        shadow="cast: false; receive: false">
      </a-entity>`)

    this.placeHologram = (event) => {
      // Dismiss the prompt text.
      this.prompt.style.display = 'none'

      // Make the hologram visible at the touch point and start playback.
      this.el.setAttribute('visible', 'true')
      const touchPoint = event.detail.intersection.point
      this.el.setAttribute('position', touchPoint)
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

      // Show 'Tap to Place Hologram' when 'Opened' (2) state is reached
      if (!this.showedPrompt && this.hvo.state === 2) {
        this.prompt.style.display = 'block'
        this.prompt.innerHTML = 'Tap to Place<br>Hologram'
        this.ground.addEventListener('mousedown', this.placeHologram, {once: true})
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
    'holo-touch-target': 'hcap.touch-target',
    'holo-show-touch-target': 'hcap.show-touch-target',
  },
})

export {hcapComponent, hcapPrimitive}
