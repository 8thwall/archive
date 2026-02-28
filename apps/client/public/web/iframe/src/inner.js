const iframeInnerPipelineModule = {
  name: 'iframe-inner',
  onCameraStatusChange: ({status}) => {
    if (status === 'hasVideo') {
      // Send message to parent that it has accepted camera permissions
      window.parent.postMessage('acceptedCamera', '*')
    }
  },
  onBeforeRun: () => {
    if (window.top === window) {
      return Promise.resolve()
    }

    const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
    const isFakingDesktopSafari =
      !!(navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /Mac/.test(navigator.platform))
    if (!iOS && !isFakingDesktopSafari) {
      return Promise.resolve()
    }

    // Disable permission requests in the inner context
    if (window.DeviceMotionEvent) {
      window.DeviceMotionEvent.requestPermission = null
    }

    if (window.DeviceOrientationEvent) {
      window.DeviceOrientationEvent.requestPermission = null
    }

    return new Promise((resolve, reject) => {
      // Handle message from parent
      window.addEventListener('message', (event) => {
        if (event.data === 'devicemotiondenied8w') {
          const properties = {type: 'permission', permission: 'devicemotion', status: 'denied'}
          reject(Object.assign(new Error(), properties))
        } else if (event.data === 'promptdenied8w') {
          const properties = {type: 'permission', permission: 'prompt', status: 'denied'}
          reject(Object.assign(new Error(), properties))
        } else if (event.data === 'devicemotiongranted8w') {
          resolve()
        }
      })

      // Send message to parent that it should initiate permissions request
      window.parent.postMessage('devicemotionrequest8w', '*')
    })
  },
}

if (window.AFRAME) {
  window.AFRAME.registerComponent('iframe-inner', {
    init() {
      window.XR8.addCameraPipelineModule(iframeInnerPipelineModule)
    },
  })
}

window.iframeInnerPipelineModule = iframeInnerPipelineModule
