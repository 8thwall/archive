const testAnchorComponent = {
  init() {
    // Before we've seen the face, we should hide the face contents.
    this.el.object3D.visible = false

    const show = ({detail}) => {
      const {position, rotation, scale} = detail.transform
      // this.el.object3D.position.copy(position)
      this.el.object3D.quaternion.copy(rotation)
      // this.el.object3D.scale.set(scale, scale, scale)
      this.el.object3D.visible = true
    }

    const hide = ({detail}) => {
      this.el.object3D.visible = false
    }

    this.el.sceneEl.addEventListener('xrfacefound', show)
    this.el.sceneEl.addEventListener('xrfaceupdated', show)
    this.el.sceneEl.addEventListener('xrfacelost', hide)
  },
}

export {testAnchorComponent}
