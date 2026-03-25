const createCylinderGeometry = (geometry, isFull = false, userHeight, userWidth) => {
  const length = userWidth ? geometry.arcLengthRadians * userWidth : geometry.arcLengthRadians
  return new THREE.CylinderGeometry(
    geometry.radiusTop,
    geometry.radiusBottom,
    userHeight ? geometry.height * userHeight : geometry.height,
    50,
    1,
    true,
    isFull ? 0.0 : (2 * Math.PI - length) / 2,
    isFull ? 2 * Math.PI : length
  )
}

const curvedTargetVideoSoundComponent = {
  schema: {
    name: {type: 'string'},
    video: {type: 'string'},
    thumb: {type: 'string'},
    height: {type: 'number'},
    width: {type: 'number'},
  },
  init() {
    const {object3D} = this.el
    const {name} = this.data
    const v = document.querySelector(this.data.video)
    const p = this.data.thumb && document.querySelector(this.data.thumb)
    let tapped = false

    object3D.visible = false
    let geomMesh = null

    const constructGeometry = ({detail}) => {
      const {imageTargets} = detail
      const targetMetadata = imageTargets.find(it => it.name === name)
      if (!targetMetadata) {
        console.warn(`Cannot find target with name ${name}`)
        return
      }
      const userHeight = this.data.height
      const userWidth = this.data.width

      const geo = createCylinderGeometry(targetMetadata.geometry, false, userHeight, userWidth)
      geomMesh = new THREE.Mesh(geo)
      geomMesh.rotation.set(0, Math.PI, 0)
      this.el.setObject3D('mesh', geomMesh)

      this.el.setAttribute('class', 'cantap')
      this.el.setAttribute('material', 'src', p || v)
    }

    this.el.addEventListener('click', () => {
      if (!tapped) {
        this.el.setAttribute('material', 'src', v)
        v.play()
        tapped = true
      }
    })

    const showImage = ({detail}) => {
      if (name !== detail.name) {
        return
      }
      if (tapped) {
        v.play()
      }
      object3D.position.copy(detail.position)
      object3D.quaternion.copy(detail.rotation)
      object3D.scale.set(detail.scale, detail.scale, detail.scale)
      object3D.visible = true
    }

    const hideImage = ({detail}) => {
      if (name !== detail.name) {
        return
      }
      if (tapped) {
        v.pause()
      }
      object3D.visible = false
    }

    this.el.sceneEl.addEventListener('xrimagescanning', constructGeometry)
    this.el.sceneEl.addEventListener('xrimagefound', showImage)
    this.el.sceneEl.addEventListener('xrimageupdated', showImage)
    this.el.sceneEl.addEventListener('xrimagelost', hideImage)
  },
}

export default curvedTargetVideoSoundComponent
