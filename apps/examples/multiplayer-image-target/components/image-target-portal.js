import {roomState} from '../scripts/create-room'
const configTargetsComponent = {
  schema: {
    targets: {type: 'array', default: ['']},
  },
  ensureImageTargetsConfigured() {
    if (this.configured || !this.configOk) {
      return
    }
    console.log(`Scanning for targets: ${JSON.stringify(this.data.targets)}`)
    XR8.XrController.configure({imageTargets: this.data.targets})
    this.configured = true
  },
  init() {
    this.configured = false
    this.configOk = false
    this.el.sceneEl.addEventListener('realityready', () => {
      this.configOk = true
      this.ensureImageTargetsConfigured()
    })
  },
  update() {
    this.configured = false
    this.ensureImageTargetsConfigured()
  },
}

const imageTargetPortalComponent = () => ({
  schema: {
    name: {type: 'string'},
  },
  init() {
    const {object3D} = this.el
    const {name} = this.data
    const character = document.getElementById('character')

    const showImage = async ({detail}) => {
      if (name !== detail.name) {
        return
      }
      if (!NAF.connection.isConnected()) {
        // Connect the client once we find the image target.
        const roomId = await roomState.roomId
        this.el.sceneEl.setAttribute('networked-scene', 'room', roomId)
        AFRAME.scenes[0].emit('connect')
      }

      object3D.position.copy(detail.position)
      object3D.quaternion.copy(detail.rotation)
      object3D.scale.set(detail.scale, detail.scale, detail.scale)

      let characterSet = false

      if (!characterSet) {
        setTimeout(() => {
          character.setAttribute('visible', true)
        }, 1000)
        characterSet = true
      }

      object3D.visible = true
    }

    const imageFound = ({detail}) => {
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

    this.el.sceneEl.addEventListener('xrimagefound', showImage)
    this.el.sceneEl.addEventListener('xrimageupdated', imageFound)
    this.el.sceneEl.addEventListener('xrimagelost', imageLost)
  },
})

export {configTargetsComponent, imageTargetPortalComponent}
