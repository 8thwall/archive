const videoTextureComponent = {
  schema: {
    'video': {type: 'string'},
  },
  init() {
    const video = document.querySelector(this.data.video)
    const texture = new THREE.VideoTexture(video)

    video.play()

    const applyVideoMaterial = (mesh) => {
      if (!mesh) {
        return
      }
      if (mesh.material) {
        // replaces every material that can take a diffuse map with video texture
        mesh.material.map = texture
      }
      mesh.traverse((node) => {
        if (node.isMesh) {
          node.material.map = texture
        }
      })
    }

    this.el.addEventListener(
      'model-loaded', () => applyVideoMaterial(this.el.getObject3D('mesh'))
    )
  },
}

export {videoTextureComponent}
