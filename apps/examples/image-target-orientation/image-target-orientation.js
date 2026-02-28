const imageTargetOrientationComponent = {
  schema: {
    name: {type: 'string'},
  },
  init() {
    const {object3D} = this.el
    const {name} = this.data
    object3D.visible = false

    const prompt = document.getElementById('promptText')

    const showImage = ({detail}) => {
      if (name != detail.name) {
        return
      }
      prompt.style.display = 'block'

      object3D.position.copy(detail.position)
      object3D.quaternion.copy(detail.rotation)
      object3D.scale.set(detail.scale, detail.scale, detail.scale)
      object3D.visible = true

      const rotation = new THREE.Euler().setFromQuaternion(
        new THREE.Quaternion(
          detail.rotation.x,
          detail.rotation.y,
          detail.rotation.z,
          detail.rotation.w
        )
      )
      const zRot = THREE.Math.radToDeg(rotation.z)
      if (zRot > -60 && zRot < 60) {
        prompt.innerHTML = 'Image Target Orientation: Vertical'
      } else if (zRot > 120 || zRot < -120) {
        prompt.innerHTML = 'Image Target Orientation: Upside Down'
      } else {
        prompt.innerHTML = 'Image Target Orientation: Horizontal'
      }
    }

    const hideImage = ({detail}) => {
      if (name != detail.name) {
        return
      }
      object3D.visible = false
      prompt.style.display = 'none'
    }

    this.el.sceneEl.addEventListener('xrimagefound', showImage)
    this.el.sceneEl.addEventListener('xrimageupdated', showImage)
    this.el.sceneEl.addEventListener('xrimagelost', hideImage)
  },
}

export {imageTargetOrientationComponent}
