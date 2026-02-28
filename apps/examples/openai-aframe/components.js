// tv-texture applies the AI texture to a specific sub-mesh (the screen) of the tv glb model
const tvTextureComponent = {
  init() {
    this.handleComplete = this.handleComplete.bind(this)
    this.el.sceneEl.addEventListener('openai-imagecomplete', this.handleComplete)
  },
  handleComplete(e) {
    const mesh = this.el.getObject3D('mesh')
    if (!mesh) {
      return
    }
    const texture = new THREE.TextureLoader().load(e.detail.url)
    mesh.traverse((node) => {
      if (node.isMesh && node.material) {
        const screen = mesh.getObjectByName('Cube_1')
        screen.material.map = texture
        screen.material.map.flipY = false
        screen.material.map.needsUpdate = true
      }
    })
  },
  remove() {
    this.el.sceneEl.removeEventListener('openai-imagecomplete', this.handleComplete)
  },
}

export {
  tvTextureComponent,
}
