const xrLightSystem = {
  init() {
    this.intensity = 0.45

    const startListen = () => {
      window.XR8.XrController.configure({enableLighting: true})
      window.XR8.addCameraPipelineModule({
        name: 'xr-light',
        onUpdate: ({processCpuResult}) => {
          if (processCpuResult.reality &&
            processCpuResult.reality.lighting &&
            processCpuResult.reality.lighting.exposure) {
            this.intensity = 1 + processCpuResult.reality.lighting.exposure
          }
        },
      })
    }

    window.XR8 ? startListen() : window.addEventListener('xrloaded', startListen)
  },
}

const xrLightComponent = {
  schema: {
    min: {default: 0},
    max: {default: 2},
  },
  tick() {
    const headlights = this.el.sceneEl.querySelectorAll('a-cone')
    this.el.setAttribute(
      'light',
      `intensity: ${Math.max(this.data.min, Math.min(this.system.intensity, this.data.max))}`
    )

    if (this.system.intensity < 0.5) {
      headlights[0].object3D.visible = true
      headlights[1].object3D.visible = true
    } else {
      headlights[0].object3D.visible = false
      headlights[1].object3D.visible = false
    }
  },
}

export {xrLightComponent, xrLightSystem}
