const createCylinderGeometry = (properties, isFull = false) => {
  const height = properties.originalHeight / properties.height
  const radius = properties.cylinderCircumferenceTop / properties.cylinderSideLength / (2 * Math.PI) * height

  const length = isFull ? 1.0 : properties.targetCircumferenceTop / properties.cylinderCircumferenceTop
  const thetaLength = 2 * Math.PI * length
  const thetaStart = isFull ? 0.0 : (2 * Math.PI - thetaLength) / 2

  return new THREE.CylinderGeometry(radius, radius, height, 50, 1, true, thetaStart, thetaLength)
}

const curvedMeshComponent = {
  schema: {
    name: {type: 'string'},
    geometry: {type: 'string'},
  },
  init() {
    const {object3D} = this.el
    const {name, geometryChoice} = this.data
    const geometry = ['full', 'label', 'none'].indexOf(geometryChoice) >= 0 ? geometryChoice : 'label'

    object3D.visible = false
    let geomMesh = null

    const constructGeometry = ({detail}) => {
      if (geometry === 'none') {
        // User doesn't want a geometry, no construction
        return
      }

      const {imageTargets} = detail
      const targetMetadata = imageTargets.find(it => it.name === name)
      if (!targetMetadata) {
        console.warn(`Cannot find target with name ${name}`)
        return
      }

      let geo = null
      if (geometry === 'full') {
        // the full geometry without theta
        geo = createCylinderGeometry(targetMetadata.properties, true)
      } else {
        // Only the label is part of the geometry
        geo = createCylinderGeometry(targetMetadata.properties)
      }

      let material = null
      if (this.el.getAttribute('material')) {
        material = this.el.components.material.material
      } else {
        material = new THREE.MeshBasicMaterial({color: '#7611B6', opacity: 0.5, transparent: true})
      }
      geomMesh = new THREE.Mesh(geo, material)
      geomMesh.rotation.set(0, Math.PI, 0)
      this.el.setObject3D('mesh', geomMesh)
    }

    this.el.sceneEl.addEventListener('xrimagescanning', constructGeometry)
  },
}

export default curvedMeshComponent