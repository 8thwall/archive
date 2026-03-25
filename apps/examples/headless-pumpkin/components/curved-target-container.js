const createCylinderGeometry = (properties, isFull = false, userHeight, userWidth) => {
  let scaleValue = 1.0
  if (properties.inputMode === 'BASIC') {
    scaleValue = properties.cylinderSideLength
  }

  const cylCirTop = properties.cylinderCircumferenceTop / scaleValue
  const cylSideLength = properties.cylinderSideLength / scaleValue
  const targetCirTop = properties.targetCircumferenceTop / scaleValue

  const metaHeight = properties.isRotated ? properties.originalWidth / properties.width
    : properties.originalHeight / properties.height
  const height = userHeight ? metaHeight * userHeight : metaHeight
  const radius = cylCirTop / cylSideLength / (2 * Math.PI) * metaHeight
  const length = isFull ? 1.0 : targetCirTop / cylCirTop
  let thetaLength
  if (isFull) {
    thetaLength = 2 * Math.PI
  } else {
    let arcLength
    if (properties.inputMode === 'BASIC') {
      arcLength = properties.arcAngle * Math.PI / 180
    } else {
      arcLength = userWidth ? length * 2 * Math.PI * userWidth : length * 2 * Math.PI
    }
    thetaLength = 2 * Math.PI - arcLength
  }

  const thetaStart = isFull ? 0.0 : 2 * Math.PI - thetaLength / 2
  const open = isFull
  return new THREE.CylinderGeometry(radius, radius, height, 50, 1, open, thetaStart, thetaLength)
}

const createCircleGeometry = (properties) => {
  const metaHeight = properties.isRotated ? properties.originalWidth / properties.width
    : properties.originalHeight / properties.height
  const radius = properties.cylinderCircumferenceTop / properties.cylinderSideLength / (2 * Math.PI) * metaHeight
  return new THREE.CircleGeometry(radius, 50)
}

const curvedImageContainerComponent = {
  schema: {
    name: {type: 'string'},
    color: {type: 'string', default: '#AF5200'},
    height: {type: 'number'},
    width: {type: 'number'},
  },
  init() {
    const {object3D} = this.el
    const {name} = this.data

    object3D.visible = false
    let openingMesh = null
    let topMesh = null
    let bottomMesh = null
    let intTopMesh = null
    let intMesh = null
    let intBottomMesh = null

    // set interior container color
    const intColor = this.data.color

    const constructGeometry = ({detail}) => {
      // create hider CYLINDER - opening
      const {imageTargets} = detail
      const targetMetadata = imageTargets.find((it) => it.name === name)
      if (!targetMetadata) {
        console.warn(`Cannot find target with name ${name}`)
        return
      }
      const userHeight = this.data.height
      const userWidth = this.data.width

      const openingEl = document.createElement('a-entity')
      const openingGeo = createCylinderGeometry(targetMetadata.properties, false, userHeight, userWidth)

      const material = new THREE.MeshBasicMaterial({colorWrite: false})
      // const material = new THREE.MeshBasicMaterial({color: '#7611B6', opacity: 0.5, transparent: true})
      openingMesh = new THREE.Mesh(openingGeo, material)
      openingMesh.rotation.set(0, Math.PI, 0)
      openingEl.setObject3D('mesh', openingMesh)
      this.el.appendChild(openingEl)

      const labelHeight = openingMesh.geometry.parameters.height

      // create hider CYLINDER - top
      const topEl = document.createElement('a-entity')
      const topGeo = createCylinderGeometry(targetMetadata.properties, true, userHeight, userWidth)
      topMesh = new THREE.Mesh(topGeo, material)
      topMesh.rotation.set(0, Math.PI, 0)
      topEl.setObject3D('mesh', topMesh)
      topEl.object3D.position.set(0, labelHeight, 0)
      this.el.appendChild(topEl)

      // create hider CYLINDER - bottom
      const bottomEl = document.createElement('a-entity')
      const bottomGeo = createCylinderGeometry(targetMetadata.properties, true, userHeight, userWidth)
      bottomMesh = new THREE.Mesh(bottomGeo, material)
      bottomMesh.rotation.set(0, Math.PI, 0)
      bottomEl.setObject3D('mesh', bottomMesh)
      bottomEl.object3D.position.set(0, -labelHeight, 0)
      this.el.appendChild(bottomEl)

      const intBackMat = new THREE.MeshStandardMaterial({color: intColor, side: THREE.BackSide})
      const intFrontMat = new THREE.MeshStandardMaterial({color: intColor, side: THREE.FrontSide})

      // create interior CIRCLE - top
      const intTopEl = document.createElement('a-entity')
      const intTopGeo = createCircleGeometry(targetMetadata.properties)
      intTopMesh = new THREE.Mesh(intTopGeo, intFrontMat)
      intTopMesh.rotation.set(Math.PI / 2, 0, 0)
      intTopEl.setObject3D('mesh', intTopMesh)
      intTopEl.object3D.position.set(0, labelHeight / 2, 0)
      this.el.appendChild(intTopEl)

      // create interior CYLINDER
      const intEl = document.createElement('a-entity')
      const intGeo = createCylinderGeometry(targetMetadata.properties, true, userHeight, userWidth)
      intMesh = new THREE.Mesh(intGeo, intBackMat)
      intMesh.rotation.set(0, Math.PI, 0)
      intEl.setObject3D('mesh', intMesh)
      intEl.object3D.position.set(0, 0, 0)
      intEl.object3D.scale.set(1, 1, 1)
      this.el.appendChild(intEl)

      // create interior CIRCLE - bottom
      const intBottomEl = document.createElement('a-entity')
      const intBottomGeo = createCircleGeometry(targetMetadata.properties)
      intBottomMesh = new THREE.Mesh(intBottomGeo, intBackMat)
      intBottomMesh.rotation.set(Math.PI / 2, 0, 0)
      intBottomEl.setObject3D('mesh', intBottomMesh)
      intBottomEl.object3D.position.set(0, -labelHeight / 2, 0)
      this.el.appendChild(intBottomEl)
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

export default curvedImageContainerComponent
