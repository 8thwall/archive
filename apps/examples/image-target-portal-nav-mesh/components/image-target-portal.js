import {resetButtonComponent} from './reset-character'

const imageTargetPortalComponent = () => ({
  schema: {
    name: {type: 'string'},
  },
  init() {
    const {object3D} = this.el
    const {name} = this.data
    object3D.visible = false
    const character = document.getElementById('character')
    let characterSet = false

    const imageFound = ({detail}) => {
      if (name !== detail.name) {
        return
      }

      object3D.position.copy(detail.position)
      object3D.quaternion.copy(detail.rotation)
      object3D.scale.set(detail.scale, detail.scale, detail.scale)

      if (!characterSet) {
        setTimeout(() => {
          character.setAttribute('position', '0 0 -.5')
          character.setAttribute('visible', true)
        }, 1000)
        characterSet = true
      }

      object3D.visible = true
    }

    const imageUpdate = ({detail}) => {
      if (name !== detail.name) {
        return
      }
      object3D.position.copy(detail.position)
      object3D.quaternion.copy(detail.rotation)
      object3D.scale.set(detail.scale, detail.scale, detail.scale)
    }

    const imageLost = (e) => {
      object3D.visible = false
    }

    this.el.sceneEl.addEventListener('xrimagefound', imageFound)
    this.el.sceneEl.addEventListener('xrimageupdated', imageUpdate)
    this.el.sceneEl.addEventListener('xrimagelost', imageLost)
  },
})

export {imageTargetPortalComponent}
