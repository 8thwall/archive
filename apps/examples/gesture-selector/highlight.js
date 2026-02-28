const highlightComponent = {
  schema: {
    enabled: {default: false},
    emissiveIntensity: {default: 0.25},
    highlightColor: {default: '#FFFFFF'},
    highlightDuration: {default: 300},  // Default to 0.3 seconds, can be overridden
  },

  init() {
    this.originalMaterials = new Map()
    this.originalEmissive = new Map()
  },

  update() {
    const mesh = this.el.getObject3D('mesh')
    if (!mesh) return

    mesh.traverse((node) => {
      if (node.isMesh) {
        if (this.data.enabled && !this.originalMaterials.has(node)) {
          this.originalMaterials.set(node, node.material)
          this.originalEmissive.set(node, node.material.emissive.clone())
          node.material.emissive.set(this.data.highlightColor)
          node.material.emissiveIntensity = this.data.emissiveIntensity

          // Fade out smoothly after duration
          setTimeout(() => {
            const startTime = Date.now()
            const startIntensity = node.material.emissiveIntensity
            const fadeDuration = 1000  // 1 second fade duration, adjust as needed

            const fadeOut = () => {
              const elapsed = Date.now() - startTime
              if (elapsed < fadeDuration) {
                const progress = elapsed / fadeDuration
                node.material.emissiveIntensity = startIntensity * (1 - progress)
                requestAnimationFrame(fadeOut)
              } else {
                node.material.emissiveIntensity = 0
              }
            }
            fadeOut()
          }, this.data.highlightDuration)
        } else if (!this.data.enabled && this.originalMaterials.has(node)) {
          node.material.emissive.copy(this.originalEmissive.get(node))
          node.material.emissiveIntensity = 1.0
          this.originalMaterials.delete(node)
          this.originalEmissive.delete(node)
        }
      }
    })
  },
}

export {highlightComponent}
