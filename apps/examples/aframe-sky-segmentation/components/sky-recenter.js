const recenterComponent = {
  schema: { },
  init() {
    let skyDetected = false
    const onxrloaded = () => {
      window.XR8.addCameraPipelineModule({
        name: 'recenter-sky',
        onUpdate: ({processCpuResult}) => {
          if (!processCpuResult.layerscontroller) {
            return
          }
          // Reorients the forward direction of the scene once the sky is first detected.
          const skyPercent = (processCpuResult.layerscontroller.layers.sky.percentage) * 100
          if (skyPercent > 0 && !skyDetected) {
            XR8.LayersController.recenter()
            skyDetected = true
          }
        },
      })
    }
    window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
  },
}
export {recenterComponent}
