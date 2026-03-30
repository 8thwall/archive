AFRAME.registerComponent('megalith', {

  init: function() {
    const camera = document.getElementById('camera')

    const target = document.createElement('a-entity')
    target.object3D.visible = false
    target.setAttribute('unnamed-image-target', '')

    const rotationMatrix = new THREE.Matrix4()
    const tempVector3 = new THREE.Vector3()
    const tempVector3_2 = new THREE.Vector3()
    const tempQuaternion = new THREE.Quaternion()
    const tempMatrix4 = new THREE.Matrix4()
    const inverseMatrix4 = new THREE.Matrix4()

    rotationMatrix.makeRotationX(-Math.PI / 2)

    const tempEuler = new THREE.Euler()
    tempEuler.order = 'YXZ'

    let canRecenter = true

    // recenterWithImageTarget = transform => {
    //   target.object3D.visible = true
    //   tempVector3.copy(transform.position)
    //   tempQuaternion.copy(transform.rotation)
    //   tempVector3_2.set(transform.scale, transform.scale, transform.scale)

    //   tempMatrix4.compose(tempVector3, tempQuaternion, tempVector3_2)
    //   inverseMatrix4.getInverse(tempMatrix4)

    //   inverseMatrix4.multiply(camera.object3D.matrix)

    //   inverseMatrix4.premultiply(rotationMatrix)

    //   tempVector3.setFromMatrixPosition(inverseMatrix4)

    //   tempEuler.setFromRotationMatrix(inverseMatrix4)
    //   tempEuler.x = 0
    //   tempEuler.z = 0

    //   const distance = camera.object3D.position.distanceTo(tempVector3)
    //   const rotation = tempEuler.y

    //   if (distance < 0.16 && rotation < Math.PI / 6) {
    //     return
    //   }

    //   tempQuaternion.setFromEuler(tempEuler)

    //   this.el.sceneEl.emit('recenter', {
    //     origin: tempVector3,
    //     facing: tempQuaternion,
    //   })
    // }

    // this.el.sceneEl.addEventListener('xrimagefound', e => {
    //   if (!canRecenter) {
    //     setTimeout(()=> {
    //       canRecenter = true
    //     }, 2000)
    //   }
    // })

    // this.el.sceneEl.addEventListener('xrimageupdated', e => {
    //   if (!canRecenter) {
    //     return
    //   }
    //   canRecenter = false
    //   recenterWithImageTarget(e.detail)
    // })

    const base = document.createElement('a-entity')
    base.object3D.scale.set(0.03, 0.03, 0.03)
    base.object3D.rotation.x = Math.PI / 2
    target.appendChild(base)

    const box = document.createElement('a-box')
    box.id = 'ground'
    box.setAttribute('material', { transparent: true, opacity: 0})
    box.object3D.scale.set(1000, 2, 1000)
    box.object3D.position.y = -1
    base.appendChild(box)

    const voxelBase = document.createElement('a-entity')
    voxelBase.object3D.position.y = 0.5
    voxelBase.setAttribute('voxel-editor', { xBounds: 16, yBounds: 20, zBounds: 12 })
    base.appendChild(voxelBase)

    this.el.sceneEl.appendChild(target)

    const blockRequirement = 10
    let placedBlocksCount = 0

    let collected = false
    this.el.sceneEl.addEventListener('placed', () => {
      placedBlocksCount ++

      window.emit('clearprompt')

      if (placedBlocksCount >= blockRequirement) {
        if (!collected) {
          collected = true
          cameraZoomRelic(camera)
          setTimeout(() => {
            window.emit('collected')
          }, 1500)
        }
        window.emit('changeprogress', { text: `${placedBlocksCount}` })
      } else {
        window.emit('changeprogress', { text: `${placedBlocksCount}/${blockRequirement}` })
      }
    })

    const handleTargetScanned = () => {
      this.el.sceneEl.removeEventListener('xrimagefound', handleTargetScanned)
      window.emit('scanned')

      window.emit('changeobjective', { text: 'Build a monument' })
      window.emit('changeprogress', { text: `0/${blockRequirement}` })
      window.emit('changeprompt', { text: 'Tap to build', icon: 'tap' })

    }
    this.el.sceneEl.addEventListener('xrimagefound', handleTargetScanned)
  }
})
