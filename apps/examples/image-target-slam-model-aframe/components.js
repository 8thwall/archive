const modelSpawnComponent = {
  init() {
    // const model = document.getElementById('model')
    const scene = this.el.sceneEl
    const {object3D} = this.el
    let found = false

    const showObject = ({detail}) => {
      if (!found) {
        const absPos = new THREE.Vector3().copy(
          detail.position
        )
        console.log('image-found')
        const model = document.createElement('a-entity')
        const cam = this.el.sceneEl.camera.el

        model.setAttribute('visible', 'false')
        // This is where we call the src of the 3D model
        model.setAttribute('gltf-model', require('./assets/sand-castle.glb'))
        model.setAttribute('shadow', {receive: false})
        model.setAttribute('scale', '1 1 1')

        this.el.sceneEl.appendChild(model)

        model.addEventListener('model-loaded', () => {
          model.setAttribute('visible', 'true')
          model.setAttribute('xrextras-pinch-scale', '')
          model.setAttribute('xrextras-two-finger-rotate', '')
          model.setAttribute('xrextras-hold-drag', 'riseHeight: 0.25')
          model.classList.add('cantap')
          // The root node of your 3D model will appear under the image target
          model.object3D.position.set(detail.position.x, 0, detail.position.z)
          model.object3D.lookAt(cam.object3D.position.x, model.object3D.position.y, cam.object3D.position.z)
        })
        found = true
      }
    }
    this.el.sceneEl.addEventListener('xrimagefound', showObject)
  },
}
export {modelSpawnComponent}
