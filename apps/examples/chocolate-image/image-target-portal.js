export const imageTargetPortalComponent = () => ({
  schema: {
    name: {type: 'string'},
  },

  init() {
    const {object3D} = this.el
    const {name} = this.data

    const model = document.getElementById('model')

    const onready = () => {
      this.el.sceneEl.removeEventListener('realityready', onready)
      object3D.visible = false
    }

    this.el.sceneEl.addEventListener('realityready', onready)

    const showImage = ({detail}) => {
      if (name !== detail.name) {
        return
      }
      object3D.position.copy(detail.position)
      object3D.quaternion.copy(detail.rotation)
      object3D.scale.set(detail.scale, detail.scale, detail.scale)

      object3D.visible = true

      setTimeout(() => {
        model.setAttribute('animation-mixer', {
          clip: '*',
          timeScale: 1,
          loop: 'once',
          clampWhenFinished: true,
        })
      }, 2500)
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
