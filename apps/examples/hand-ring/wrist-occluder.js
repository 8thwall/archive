const wristOccluderComponent = {
  init() {
    let id_ = null
    let majorRadius
    let minorRadius
    const wristOccluder = document.getElementById('wristOccluder')

    const initWristOccluder = ({detail}) => {
      if (id_ && detail.id != id_) {
        return
      }
      id_ = detail.id
      const apt = detail.attachmentPoints.wrist
      minorRadius = apt.minorRadius
      majorRadius = apt.majorRadius

      // set cylinder scale as radii to create oval occluder
      wristOccluder.setAttribute('scale', `${majorRadius} 1 ${minorRadius}`)
      wristOccluder.object3D.scale.multiplyScalar(0.99)
    }

    this.el.sceneEl.addEventListener('xrhandfound', initWristOccluder)
  },
}

export {wristOccluderComponent}
