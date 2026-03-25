const createCylinderGeometry = (properties, isFull = false, userHeight, userWidth) => {
  const metaHeight = properties.isRotated ? properties.originalWidth / properties.width
    : properties.originalHeight / properties.height
  const height = userHeight ? metaHeight * userHeight : metaHeight
  const radius = properties.cylinderCircumferenceTop / properties.cylinderSideLength / (2 * Math.PI) * metaHeight
  const length = isFull ? 1.0 : properties.targetCircumferenceTop / properties.cylinderCircumferenceTop
  const thetaLength = userWidth ? 2 * Math.PI * (length * userWidth) : 2 * Math.PI * length
  const thetaStart = isFull ? 0.0 : (2 * Math.PI - thetaLength) / 2
  return new THREE.CylinderGeometry(radius, radius, height, 50, 1, true, thetaStart, thetaLength)
}

const curvedImageTargetComponent = {
  schema: {
    name: {type: 'string'},
    geometry: {type: 'string'},
    height: {type: 'number'},
    width: {type: 'number'},
  },
  init() {
    const {object3D} = this.el
    const {name} = this.data
    const geometry = ['full', 'label', 'none'].indexOf(this.data.geometry) >= 0 ? this.data.geometry
      : 'label'

    object3D.visible = false
    let geomMesh = null

    const constructGeometry = ({detail}) => {
      if (geometry === 'none') {
        // no geometry is constructed, but label will still be tracked
        return
      }

      const {imageTargets} = detail
      const targetMetadata = imageTargets.find((it) => it.name === name)
      if (!targetMetadata) {
        console.warn(`Cannot find target with name ${name}`)
        return
      }
      const userHeight = this.data.height
      const userWidth = this.data.width

      let geo = null
      if (geometry === 'full') {
        // the full cylindrical geometry without theta is constructed
        geo = createCylinderGeometry(targetMetadata.properties, true, userHeight)
        console.log('is FULL')
      } else {
        // only the label geometry is constructed
        geo = createCylinderGeometry(targetMetadata.properties, false, userHeight, userWidth)
      }

      let material = null
      if (this.el.getAttribute('material')) {
        material = this.el.components.material.material
      } else {
        // fallback material if no material is specified
        material = new THREE.MeshBasicMaterial({color: '#7611B6', opacity: 0.5, transparent: true})
      }
      geomMesh = new THREE.Mesh(geo, material)
      geomMesh.rotation.set(0, Math.PI, 0)
      this.el.setObject3D('mesh', geomMesh)
    }

    const showImage = ({detail}) => {
      if (name !== detail.name) {
        return
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
      object3D.visible = false
    }

    this.el.sceneEl.addEventListener('xrimagescanning', constructGeometry)
    this.el.sceneEl.addEventListener('xrimagefound', showImage)
    this.el.sceneEl.addEventListener('xrimageupdated', showImage)
    this.el.sceneEl.addEventListener('xrimagelost', hideImage)
  },
}

export default curvedImageTargetComponent
