const targetVideoComponent = {
  schema: {
    name: { type: 'string' },
    video: { type: 'string' },
    fade: { type: 'number', default: 0 } // fade speed in ms. Set to 0 for no fade
  },
  init() {
    const { object3D } = this.el
    const { name } = this.data
    const v = document.querySelector(this.data.video)
    const { el } = this

    el.addEventListener('realityready', () => {
      object3D.visible = true
    })

    // pre-play video as fix for black box bug (Android Only)
    v.muted = true
    v.play()
    let videoSetup = false

    const restartVideo = () => {
      if (!videoSetup) {
        v.currentTime = 0
        videoSetup = true
      }
    }

    const showImage = ({ detail }) => {
      if (name !== detail.name) {
        return
      }

      if (this.data.fade > 0) {
        el.setAttribute('material', 'opacity: 0')
        el.setAttribute('animation', {
          property: 'material.opacity',
          from: 0,
          to: 1,
          easing: 'easeInOutQuad',
          dur: this.data.fade,
        })
      }

      v.play()
      object3D.visible = true
    }

    const updateImage = ({ detail }) => {
      object3D.position.copy(detail.position)
      object3D.quaternion.copy(detail.rotation)
      object3D.scale.set(detail.scale, detail.scale, detail.scale)
    }

    const hideImage = ({ detail }) => {
      if (this.data.fade > 0) {
        el.setAttribute('material', 'opacity: 0')
        el.removeAttribute('animation')
      }
      v.pause()
      object3D.visible = false
    }

    el.sceneEl.addEventListener('xrimagefound', showImage)
    el.sceneEl.addEventListener('xrimagefound', restartVideo)
    el.sceneEl.addEventListener('xrimageupdated', updateImage)
    el.sceneEl.addEventListener('xrimagelost', hideImage)
  },
}

export { targetVideoComponent }
