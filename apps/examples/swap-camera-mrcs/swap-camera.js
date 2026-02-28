const swapCamComponent = () => ({
  init() {
    const scene = this.el.sceneEl
    const camBtn = document.getElementById('swap-cam-btn')
    const pauseBtn = document.getElementById('pauseBtn')
    const muteBtn = document.getElementById('muteBtn')
    const flipBg = document.getElementById('flipBg')

    scene.addEventListener('realityready', () => {
      // fade from black
      flipBg.classList.add('fade-out')
      setTimeout(() => {
        flipBg.classList.remove('fade-out')
        flipBg.style.opacity = 0
      }, 500)
    })

    camBtn.addEventListener('click', () => {
      const faceAnchor = document.querySelector('xrextras-faceanchor')
      const holo = document.getElementById('holo')
      const holoSrc = require('./assets/soccer.hcap')

      camBtn.classList.add('pulse-once')
      setTimeout(() => {
        camBtn.classList.remove('pulse-once')
        flipBg.style.opacity = 1

        if (holo) {
          holo.parentNode.removeChild(holo)
          pauseBtn.style.display = 'none'
          muteBtn.style.display = 'none'

          scene.removeAttribute('xrweb')
          scene.setAttribute('xrface', {
            mirroredDisplay: true,
            cameraDirection: 'front',
          })
          scene.insertAdjacentHTML('beforeend',
            ` 
          <xrextras-faceanchor id="face-effect">
            <xrextras-face-mesh material-resource="#paint"></xrextras-face-mesh>
          </xrextras-faceanchor>
        `)
          scene.insertAdjacentHTML('beforeend',
            ` 
          <xrextras-capture-button></xrextras-capture-button>
          <xrextras-capture-config request-mic="manual"></xrextras-capture-config>
          <xrextras-capture-preview></xrextras-capture-preview>
        `)
        } else {
          faceAnchor.parentNode.removeChild(faceAnchor)
          const captureBtn = document.querySelector('xrextras-capture-button')
          captureBtn.parentNode.removeChild(captureBtn)
          scene.removeAttribute('xrface')
          scene.setAttribute('xrweb', '')
          scene.insertAdjacentHTML('beforeend',
            `<hcap-hologram
            id="holo"
            src='${holoSrc}'
            size="6"
            xrextras-hold-drag
            xrextras-two-finger-rotate 
            xrextras-pinch-scale="scale: 6">
          </hcap-hologram>
        `)
        }
      }, 500)
    })
  },

})

export {swapCamComponent}
