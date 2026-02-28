// This component is an example of how to separate behavior by device category
// using 8th Wall Engine sessionAttributes
const responsiveImmersiveComponent = {
  init() {
    const onAttach = ({sessionAttributes}) => {
      const chair = document.getElementById('chair')
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
        const addComponents = () => {
          chair.removeAttribute('cubemap-realtime', '')
        }
        chair.getObject3D('mesh') ? addComponents() : chair.addEventListener('model-loaded', addComponents)
      } else if (
        !s.cameraLinkedToViewer &&
        !s.controlsCamera &&
        s.fillsCameraTexture &&
        !s.supportsHtmlEmbedded &&
        s.supportsHtmlOverlay &&
        s.usesMediaDevices &&
        !s.usesWebXr
      ) {  // Mobile-specific behavior goes here
        this.el.addEventListener('coaching-overlay.show', () => {
          chair.object3D.scale.set(0.001, 0.001, 0.001)
        })

        this.el.addEventListener('coaching-overlay.hide', () => {
          chair.object3D.scale.set(1, 1, 1)
        })

        const addComponents = () => {
          chair.setAttribute('cubemap-realtime', '')
        }
        chair.getObject3D('mesh') ? addComponents() : chair.addEventListener('model-loaded', addComponents)
      }
    }
    const onxrloaded = () => {
      XR8.addCameraPipelineModules([{'name': 'responsiveImmersive', onAttach}])
    }
    window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
  },
}
export {responsiveImmersiveComponent}
