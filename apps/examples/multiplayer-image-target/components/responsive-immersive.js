// start inside portal scene on desktop / VR
// use image target portal on mobile

import {roomState, maybeCreateRoom} from '../scripts/create-room'

// This component is an example of how to separate behavior by device category
// using 8th Wall Engine sessionAttributes
const responsiveImmersiveComponent = {
  init() {
    const onAttach = ({sessionAttributes}) => {
      const s = sessionAttributes
      const imgPortal = document.getElementById('img-portal')
      const hiderWall = document.getElementById('hider-wall')
      if (
        !s.cameraLinkedToViewer &&
        !s.controlsCamera &&
        !s.fillsCameraTexture &&
        !s.supportsHtmlEmbedded &&
        s.supportsHtmlOverlay &&
        !s.usesMediaDevices &&
        !s.usesWebXr
      ) {  // Desktop-specific behavior goes here
        hiderWall.setAttribute('visible', false)
        if (!NAF.connection.isConnected()) {
          roomState.roomId.then((roomId) => {
            this.el.sceneEl.setAttribute('networked-scene', 'room', roomId)
            AFRAME.scenes[0].emit('connect')
          })
        }
      } else if (
        s.cameraLinkedToViewer &&
        s.controlsCamera &&
        !s.fillsCameraTexture &&
        s.supportsHtmlEmbedded &&
        !s.supportsHtmlOverlay &&
        !s.usesMediaDevices &&
        s.usesWebXr
      ) {  // HMD-specific behavior goes here
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
        imgPortal.setAttribute('visible', false)
        hiderWall.setAttribute('visible', true)
      }
    }
    const onxrloaded = () => {
      XR8.addCameraPipelineModules([{'name': 'responsiveImmersive', onAttach}])
    }
    window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
  },
  remove() {
    XR8.removeCameraPipelineModule('responsiveImmersive')
  },
}
export {responsiveImmersiveComponent}
