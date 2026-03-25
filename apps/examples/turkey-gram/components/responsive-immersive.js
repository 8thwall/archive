// This component is an example of how to separate behavior by device category
// using 8th Wall Reality Engine sessionAttributes
const responsiveImmersiveComponent = {
  init() {
    const onAttach = ({sessionAttributes}) => {
      const scene = this.el
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
          <xrextras-capture-config request-mic="manual"></xrextras-capture-config>
          <xrextras-capture-preview></xrextras-capture-preview>
        `)
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
          <xrextras-capture-config request-mic="manual"></xrextras-capture-config>
          <xrextras-capture-preview></xrextras-capture-preview>
        `)
      }
    }
    const onxrloaded = () => {
      XR8.addCameraPipelineModules([{'name': 'responsiveImmersive', onAttach}])
    }
    window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
  },
}
export {responsiveImmersiveComponent}
