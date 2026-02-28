export const textureSwapComponent = {
  init() {
    const {src} = document.getElementById('imageFile')
    const loader = new THREE.TextureLoader()

    this.el.addEventListener('click', (event) => {
      const model = this.el.getObject3D('mesh').getObjectByName('Cylinder001_0')
      model.material.map = loader.load(src)
      // set flipY to false to correclty rotate texture
      model.material.map.flipY = false
    })
  },
}
