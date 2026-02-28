// This component is an example of how to separate behavior by device category
// using 8th Wall Engine sessionAttributes
const responsiveImmersiveComponent = {
  init() {
    const onAttach = ({sessionAttributes}) => {
      const realtimeBall = document.getElementById('realtime-ball')
      const realtimeBall2 = document.getElementById('realtime-ball2')

      const s = sessionAttributes

      const isDesktop = !s.cameraLinkedToViewer && !s.controlsCamera && !s.fillsCameraTexture && !s.supportsHtmlEmbedded && s.supportsHtmlOverlay && !s.usesMediaDevices && !s.usesWebXr
      const isHMD = s.cameraLinkedToViewer && s.controlsCamera && !s.fillsCameraTexture && s.supportsHtmlEmbedded && !s.supportsHtmlOverlay && !s.usesMediaDevices && s.usesWebXr
      const isMobile = !s.cameraLinkedToViewer && !s.controlsCamera && s.fillsCameraTexture && !s.supportsHtmlEmbedded && s.supportsHtmlOverlay && s.usesMediaDevices && !s.usesWebXr

      if (isDesktop) {
        // Desktop specific behavior goes here
        realtimeBall.removeAttribute('cubemap-realtime', '')
        realtimeBall.setAttribute('cubemap-static', '')
        realtimeBall2.removeAttribute('cubemap-realtime', '')
        realtimeBall2.setAttribute('cubemap-static', '')
      } else if (isHMD) {
        // Head mounted display specific behavior goes here
        const isVRHMD = this.el.sceneEl.xrSession.environmentBlendMode === 'opaque'
        const isARHMD = this.el.sceneEl.xrSession.environmentBlendMode === 'additive' || 'alpha-blend'
        realtimeBall.removeAttribute('cubemap-realtime', '')
        realtimeBall.setAttribute('cubemap-static', '')
        realtimeBall2.removeAttribute('cubemap-realtime', '')
        realtimeBall2.setAttribute('cubemap-static', '')
      } else if (isMobile) {
        // Mobile-specific behavior goes here
      }
    }
    const onxrloaded = () => {
      XR8.addCameraPipelineModules([{'name': 'responsiveImmersive', onAttach}])
    }
    window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
  },
}
export {responsiveImmersiveComponent}
