const wristOccluderComponent = {
  init() {
    let id_ = null
    let majorRadius
    let minorRadius
    const wristOccluder = document.getElementById('wristOccluder')
    // wristOccluder.components.material.material.color = '#FFFFFF'

    const initWristOccluder = ({detail}) => {
      if (id_ && detail.id != id_) {
        return
      }
      id_ = detail.id
      const apt = detail.attachmentPoints.wrist
      minorRadius = apt.minorRadius
      majorRadius = apt.majorRadius

      // const occluderXValue = minorRadius * 115.247
      // const occluderZValue = majorRadius * 98.1022

      // this.el.sceneEl.removeEventListener('xrhandfound', initWristOccluder)
      // set cylinder scale as radii to create oval occluder
      wristOccluder.setAttribute('scale', `${majorRadius} 1 ${minorRadius}`)
      // make occluder slightly smaller than wrist to prevent z-fighting
      // wristOccluder.object3D.scale.multiplyScalar(0.99)
    }

    this.el.sceneEl.addEventListener('xrhandfound', initWristOccluder)
  },
}

export {wristOccluderComponent}
