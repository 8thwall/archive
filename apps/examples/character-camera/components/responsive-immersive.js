// This component is an example of how to separate behavior by device category
// using 8th Wall Engine sessionAttributes
const responsiveImmersiveComponent = {
  init() {
    const scene = this.el
    const particleCompatCheck = (platform) => {
      const {os, osVersion, browser} = XR8.XrDevice.deviceEstimate()
      const errorText = ''
      const mParticles = // particle system for mobile
      `<a-entity 
        id="particles" 
        position="0 16 0" 
        particle-system="preset: snow; texture: ${require('.././assets/textures/snowparticle.png')}; 
        particleCount: 1000; blending: 1; maxAge: 1.5; size: 2; opacity: 0.8; 
        positionSpread: 50 20 50;"
      ></a-entity>`
      const dParticles = // particle system for Desktop
      `<a-entity 
        id="particles" 
        position="0 16 0" 
        particle-system="
          preset: snow; 
          particleCount: 2000; 
          blending: 2; 
          maxAge: 1.5; 
          size: 0.75; 
          opacity: 0.5; 
          positionSpread: 50 20 50;"
      ></a-entity>`
      const vParticles = // particle system for VR
      `<a-entity 
        id="particles" 
        position="0 32 0" 
        particle-system="
          preset: snow; 
          particleCount: 500; 
          blending: 2; 
          maxAge: 4; 
          size: 0.3; 
          opacity: 0.5; 
          positionSpread: 50 20 50;"
      ></a-entity>`
      if (platform === 'desktop') {
        scene.insertAdjacentHTML('beforeend', dParticles)
      } else if (platform === 'virtual') {
        scene.insertAdjacentHTML('beforeend', vParticles)
      } else if (os === 'iOS' || os === 'Android') {
        switch (osVersion) {
          case '15.0':
          case '15.0.1':
          case '15.0.2':
          case '15.1':
          case '15.1.1':
            // Don't show snow for unsupported versions of iOS
            break
          default:
            // Show snow for other mobile versions
            scene.insertAdjacentHTML('beforeend', mParticles)
            break
        }
      }
    }

    const onAttach = ({sessionAttributes}) => {
      const message = document.getElementById('message')
      const s = sessionAttributes
      if (
        !s.cameraLinkedToViewer &&
        !s.controlsCamera &&
        !s.fillsCameraTexture &&
        !s.supportsHtmlEmbedded &&
        s.supportsHtmlOverlay &&
        !s.usesMediaDevices &&
        !s.usesWebXr
      ) {  // Desktop-specific behavior goes here
        scene.setAttribute('share-name', '')
        scene.insertAdjacentHTML('beforeend',
          `
          <xrextras-capture-button></xrextras-capture-button>
          <xrextras-capture-config
            request-mic="manual"
            short-link="8th.io/holiday-gram"
            watermark-image-url="${require('../assets/textures/holiday-watermark.png')}"
            watermark-location="topMiddle"
            watermark-max-width="70"
            end-card-call-to-action="Make your own at"
          ></xrextras-capture-config>
          <xrextras-capture-preview></xrextras-capture-preview>
        `)
        particleCompatCheck('desktop')
      } else if (
        s.cameraLinkedToViewer &&
        s.controlsCamera &&
        !s.fillsCameraTexture &&
        s.supportsHtmlEmbedded &&
        !s.supportsHtmlOverlay &&
        !s.usesMediaDevices &&
        s.usesWebXr
      ) {  // HMD-specific behavior goes here
        scene.setAttribute('name-from-param', '')
        message.style.fontSize = '12vmin'
        message.style.width = '100vw'
        message.style.top = '20vh'
        particleCompatCheck('virtual')
        if (this.el.sceneEl.xrSession.environmentBlendMode === 'opaque') {
          // VR HMD (i.e. Oculus Quest) behavior goes here
        } else if (this.el.sceneEl.xrSession.environmentBlendMode === 'additive' || 'alpha-blend') {
          // AR HMD (i.e. Hololens) behavior goes here
        }
      } else if (
        !s.cameraLinkedToViewer &&
        !s.controlsCamera &&
        s.fillsCameraTexture &&
        !s.supportsHtmlEmbedded &&
        s.supportsHtmlOverlay &&
        s.usesMediaDevices &&
        !s.usesWebXr
      ) {  // Mobile-specific behavior goes here
        scene.setAttribute('share-name', '')
        scene.insertAdjacentHTML('beforeend',
          `
          <xrextras-capture-button></xrextras-capture-button>
          <xrextras-capture-config
            request-mic="manual"
            short-link="8th.io/holiday-gram"
            watermark-image-url="${require('../assets/textures/holiday-watermark.png')}"
            watermark-location="bottomMiddle"
            watermark-max-width="80"
            end-card-call-to-action="Make your own at"
          ></xrextras-capture-config>
          <xrextras-capture-preview></xrextras-capture-preview>
        `)
        particleCompatCheck()
      }
    }

    const onxrloaded = () => {
      XR8.addCameraPipelineModules([{'name': 'responsiveImmersive', onAttach}])
    }
    window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
  },
}
export {responsiveImmersiveComponent}
