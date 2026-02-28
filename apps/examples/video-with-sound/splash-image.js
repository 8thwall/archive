// Note: Setting disableWorldTracking=true and requestGyro=true
// basically gives you 3DoF mode

const splashImageComponent = {
  schema: {
    disableWorldTracking: {type: 'bool', default: false},
    requestGyro: {type: 'bool', default: false},
  },
  init() {
    const splashimage = document.getElementById('splashimage')
    const start = document.getElementById('start')
    const video = document.getElementById('video')

    start.style.display = 'block'

    const addXRWeb = () => {
      if (this.data.requestGyro === true && this.data.disableWorldTracking === true) {
        // If world tracking is disabled, and you still want gyro enabled (i.e. 3DoF mode)
        // Request motion and orientation sensor via XR8's permission API
        XR8.addCameraPipelineModule({
          name: 'request-gyro',
          requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
        })
      }
      this.el.sceneEl.setAttribute('xrweb', `allowedDevices: any; disableWorldTracking: ${this.data.disableWorldTracking}`)
      video.play()

      splashimage.classList.add('hidden')
    }
    start.onclick = addXRWeb
  },
}

export {splashImageComponent}
