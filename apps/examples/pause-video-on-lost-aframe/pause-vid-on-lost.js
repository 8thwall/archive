const targetVideoComponent = {
  schema: {
    name: {type: 'string'},
    video: {type: 'string'},
    thumb: {type: 'string'},
    canstop: {type: 'bool'},
  },
  init() {
    const {object3D} = this.el
    const {name} = this.data
    object3D.visible = false
    const v = document.querySelector(this.data.video)
    const p = this.data.thumb && document.querySelector(this.data.thumb)

    const {el} = this

    el.setAttribute('material', 'src', p || v)
    el.setAttribute('class', 'cantap')
    let playing = false

    el.addEventListener('click', () => {
      if (!playing) {
        el.setAttribute('material', 'src', v)
        v.play()
        playing = true
      } else if (this.data.canstop) {
        el.setAttribute('material', 'src', p || v)
        v.pause()
        playing = false
      }
    })

    const showImage = ({detail}) => {
      if (name !== detail.name) {
        return
      }
      if (!playing) {
        v.pause()
        object3D.position.copy(detail.position)
        object3D.quaternion.copy(detail.rotation)
        object3D.scale.set(detail.scale, detail.scale, detail.scale)
        object3D.visible = true
      } else if (playing) {
        v.play()
        object3D.position.copy(detail.position)
        object3D.quaternion.copy(detail.rotation)
        object3D.scale.set(detail.scale, detail.scale, detail.scale)
        object3D.visible = true
      }
    }

    const updateImage = ({detail}) => {
      object3D.position.copy(detail.position)
      object3D.quaternion.copy(detail.rotation)
      object3D.scale.set(detail.scale, detail.scale, detail.scale)
    }

    const hideImage = ({detail}) => {
      if (name !== detail.name) {
        return
      }
      v.pause()
      object3D.visible = false
    }

    this.el.sceneEl.addEventListener('xrimagefound', showImage)
    this.el.sceneEl.addEventListener('xrimageupdated', updateImage)
    this.el.sceneEl.addEventListener('xrimagelost', hideImage)
  },
}

export {targetVideoComponent}
