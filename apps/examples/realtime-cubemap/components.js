const xrLightSystem = {
  init() {
    this.intensity = 1
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
    this.el.setAttribute(
      'light',
      `intensity: ${Math.max(this.data.min, Math.min(this.system.intensity, this.data.max))}`
    )
  },
}

const tapRecenterComponent = {
  init() {
    document.getElementById('recenterBtn').addEventListener('click', () => this.recenter())
  },
  recenter() {
    this.el.sceneEl.emit('recenter', {origin: this.origin, facing: {w: 0, x: 0, y: 0, z: 0}})
  },

}

export {xrLightComponent, xrLightSystem, tapRecenterComponent}
