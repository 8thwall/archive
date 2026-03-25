// Visualizes the tracking status emitted from our XrController.
const trackingStatusModule = () => {
  let statusDisplayElem = null
  let trackingReason_ = '?'
  let trackingStatus_ = '?'
  let currentPos_ = {x: -1, y: -1, z: -1}
  let currentRot_ = {x: 0, y: 0, z: 0, w: 1}
  // Helps us roughly calculate the estimated scale by taking the previous responsive y and the current
  // metric y to determine the scale.  (metric.y / responsive.y = scale)
  let shouldSetFirstScale_ = false
  let previousY_ = -1
  let firstScale_ = -1
  let overlayShouldShow_ = false

  const updateMessage = () => {
    if (!statusDisplayElem) {
      return
    }

    statusDisplayElem.innerHTML = `Tracking Status: ${trackingStatus_} <br/>` +
      `Reason: ${trackingReason_} <br />` +
      `Pos: ${currentPos_.x.toFixed(2)}x, ${currentPos_.y.toFixed(2)}y, ${currentPos_.z.toFixed(2)}z <br />` +
      `Rot: ${currentRot_.z.toFixed(2)}w, ${currentRot_.x.toFixed(2)}x, ${currentRot_.y.toFixed(2)}y, ${currentRot_.z.toFixed(2)}z <br / >` +
      `Scale: ${firstScale_.toFixed(2)} <br / >` +
      `Overlay show: ${overlayShouldShow_ ? 'True' : 'False'}`
  }

  // Hides the image frame when the target is no longer detected.
  const trackingStatusUpdate = ({detail}) => {
    console.log('[tracking-status@trackingStatusUpdate] status ', detail.status, ' reason ', detail.reason)
    if (trackingStatus_ !== 'NORMAL' && detail.status === 'NORMAL') {
      shouldSetFirstScale_ = true
    }
    trackingStatus_ = detail.status
    trackingReason_ = detail.reason
    updateMessage()
  }

  const onShow = () => {
    overlayShouldShow_ = true
    updateMessage()
  }

  const onHide = () => {
    overlayShouldShow_ = false
    updateMessage()
  }

  // Grab a handle to the threejs scene and set the camera position on pipeline startup.
  const onAttach = ({canvasWidth, canvasHeight}) => {
    statusDisplayElem = document.createElement('div')
    statusDisplayElem.style.cssText = 'position:absolute; margin: 5em 0 0 1em; background-color: white; z-index: 1;'
    document.body.insertBefore(statusDisplayElem, document.body.firstChild)
  }

  const onUpdate = ({processCpuResult}) => {
    const {reality} = processCpuResult
    if (!reality || !reality.intrinsics) {
      return
    }

    if (shouldSetFirstScale_) {
      firstScale_ = reality.position.y / previousY_
      shouldSetFirstScale_ = false
    }
    currentPos_ = reality.position
    currentRot_ = reality.rotation
    previousY_ = reality.position.y

    updateMessage()
  }

  const onDetach = () => {
    if (statusDisplayElem !== null) {
      statusDisplayElem.remove()  
    }

    statusDisplayElem = null
    trackingReason_ = '?'
    trackingStatus_ = '?'
    currentPos_ = {x: -1, y: -1, z: -1}
    currentRot_ = {x: 0, y: 0, z: 0, w: 1}
    // Helps us roughly calculate the estimated scale by taking the previous responsive y and the current
    // metric y to determine the scale.  (metric.y / responsive.y = scale)
    shouldSetFirstScale_ = false
    previousY_ = -1
    firstScale_ = -1
    overlayShouldShow_ = false
  }

  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be unique within
    // your app.
    name: 'trackingstatus',

    // onAttach is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onAttach method.
    onAttach,
    onUpdate,
    onDetach,

    // Listeners are called right after the processing stage that fired them. This guarantees that
    // updates can be applied at an appropriate synchronized point in the rendering cycle.
    listeners: [
      {event: 'reality.trackingstatus', process: trackingStatusUpdate},
      {event: 'coaching-overlay.show', process: onShow},
      {event: 'coaching-overlay.hide', process: onHide},
    ],
  }
}

export {trackingStatusModule}
