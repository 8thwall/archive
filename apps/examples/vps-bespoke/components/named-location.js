/* eslint-disable no-console */
// Updates a single a-entity to track a Location with the given name.
// Sets the animation visible when found.
const namedLocationComponent = {
  schema: {
    name: {type: 'string'},
  },
  init() {
    const {object3D} = this.el
    const {name} = this.data
    this.el.sceneEl.addEventListener('realityready', () => {
      object3D.visible = false
    })

    const foundLocation = ({detail}) => {
      if (name !== detail.name) {
        return
      }
      object3D.position.copy(detail.position)
      object3D.quaternion.copy(detail.rotation)
      object3D.visible = true
    }

    const lostLocation = ({detail}) => {
      if (name !== detail.name) {
        return
      }
      object3D.visible = false
    }

    this.el.sceneEl.addEventListener('xrprojectwayspotfound', foundLocation)
    this.el.sceneEl.addEventListener('xrprojectwayspotlost', lostLocation)
  },
}
// Plays VPS animation after vps-coaching-overlay has disappeared
const playVpsAnimationComponent = {
  init() {
    const overlayHidden = () => {
      this.el.setAttribute('animation-mixer', 'clip: *')
    }

    const overlayVisible = () => {
      this.el.removeAttribute('animation-mixer')
    }

    const onxrloaded = () => {
      window.XR8.addCameraPipelineModule({
        name: 'vps-coaching-overlay-listen',
        listeners: [
          {event: 'vps-coaching-overlay.hide', process: overlayHidden},
          {event: 'vps-coaching-overlay.show', process: overlayVisible},
        ],
      })
    }
    window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
  },
}

export {namedLocationComponent, playVpsAnimationComponent}
