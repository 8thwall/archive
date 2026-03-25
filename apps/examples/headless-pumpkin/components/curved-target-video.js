const createCylinderGeometry = (properties, userHeight, userWidth) => {
  const metaHeight = properties.isRotated ? properties.originalWidth / properties.width
    : properties.originalHeight / properties.height
  const height = userHeight ? metaHeight * userHeight : metaHeight
  const radius = properties.cylinderCircumferenceTop / properties.cylinderSideLength / (2 * Math.PI) * metaHeight
  const length = properties.targetCircumferenceTop / properties.cylinderCircumferenceTop
  const thetaLength = userWidth ? 2 * Math.PI * (length * userWidth) : 2 * Math.PI * length
  const thetaStart = (2 * Math.PI - thetaLength) / 2
  return new THREE.CylinderGeometry(radius, radius, height, 50, 1, true, thetaStart, thetaLength)
}

const curvedTargetVideoComponent = {
  schema: {
    name: {type: 'string'},
    video: {type: 'string'},
    thumb: {type: 'string'},
    autoplay: {type: 'bool', default: true},
    canstop: {type: 'bool', default: true},
    height: {type: 'number'},
    width: {type: 'number'},
  },
  init() {
    const {object3D} = this.el
    const {name} = this.data
    const v = document.querySelector(this.data.video)
    const p = this.data.thumb && document.querySelector(this.data.thumb)
    let playing = false

    object3D.visible = false
    let geomMesh = null

    const constructGeometry = ({detail}) => {
      const {imageTargets} = detail
      const targetMetadata = imageTargets.find((it) => it.name === name)
      if (!targetMetadata) {
        console.warn(`Cannot find target with name ${name}`)
        return
      }
      const userHeight = this.data.height
      const userWidth = this.data.width

      const geo = createCylinderGeometry(targetMetadata.properties, userHeight, userWidth)
      geomMesh = new THREE.Mesh(geo)
      geomMesh.rotation.set(0, Math.PI, 0)
      this.el.setObject3D('mesh', geomMesh)

      this.el.setAttribute('class', 'cantap')
      if (this.data.autoplay) {
        this.el.setAttribute('material', 'src', v)
      } else {
        this.el.setAttribute('material', 'src', p || v)
      }
    }

    this.el.addEventListener('click', () => {
      if (!playing) {
        this.el.setAttribute('material', 'src', v)
        v.play()
        playing = true
      } else if (this.data.canstop) {
        this.el.setAttribute('material', 'src', p || v)
        v.pause()
        playing = false
      }
      console.log('tapped')
    })

    const showImage = ({detail}) => {
      if (name !== detail.name) {
        return
      }

      if (this.data.autoplay) {
        v.play()
        playing = true
        this.data.autoplay = false
        console.log('autoplayed')
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

export default curvedTargetVideoComponent
