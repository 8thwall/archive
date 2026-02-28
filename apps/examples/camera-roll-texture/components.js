// Component that places trees where the ground is clicked

const cameraRollTextureComponent = {
  init() {
    const scene = this.el.sceneEl
    const camera = document.getElementById('camera').object3D
    const offset = document.getElementById('offset').object3D

    const getWorldPosition = (object) => {
      const position = new THREE.Vector3()
      position.setFromMatrixPosition(object.matrixWorld)
      return position
    }

    document.getElementById('file').addEventListener('change', () => {
      const newElement = document.createElement('a-plane')
      const file = document.getElementById('file').files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        const _URL = window.URL || window.webkitURL
        img.onload = () => {
          newElement.object3D.position.copy(getWorldPosition(offset))
          newElement.object3D.rotation.set(0, camera.rotation.y, 0)
          newElement.setAttribute('width', img.width > img.height ? img.width / img.height : 1)
          newElement.setAttribute('height', img.height > img.width ? img.height / img.width : 1)
          newElement.setAttribute('scale', '4 4 4')
          scene.appendChild(newElement)
        }
        img.src = _URL.createObjectURL(file)
        newElement.setAttribute('src', e.target.result)
      }
      reader.readAsDataURL(file)
    })
  },
}

export {cameraRollTextureComponent}
