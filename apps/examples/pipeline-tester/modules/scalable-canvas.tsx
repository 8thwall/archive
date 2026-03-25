// Build a pipeline module that users can scale the canvas for zoom in/out effects
const scalableCanvasPipelineModule = (scale) => {
  let canvas_ = null
  const scale_ = scale

  // Update the size of the camera feed canvas to fill the screen.
  const fillScreenWithCanvas = ({orientation}) => {
    if (!canvas_) {
      return
    }

    const ww = window.innerWidth
    const wh = window.innerHeight

    const wOffset = ww * (scale_ - 1) * 0.5
    const hOffset = wh * (scale_ - 1) * 0.5

    // Wait for orientation change to take effect before handling resize.
    if (((orientation === 0 || orientation === 180) && ww > wh) ||
      ((orientation === 90 || orientation === -90) && wh > ww)) {
      window.requestAnimationFrame(() => fillScreenWithCanvas({orientation}))
      return
    }

    // Set the canvas geometry to the new window size.
    canvas_.width = ww * scale_
    canvas_.height = wh * scale_
    canvas_.style.marginLeft = '-' + wOffset + 'px'
    canvas_.style.marginTop = '-' + hOffset + 'px'
  }

  const onAttach = ({canvas, orientation}) => {
    canvas_ = canvas
    const body = document.getElementsByTagName('body')[0]

    body.style.margin = '0px'
    body.style.width = '100%'
    body.style.height = '100%'

    body.appendChild(canvas_)
    fillScreenWithCanvas({orientation})
  }

  const onDeviceOrientationChange = ({orientation}) => {
    fillScreenWithCanvas({orientation})
  }

  const onDetach = () => {
    canvas_ = null
  }

  return {
    name: 'scalablecanvas',
    onAttach,
    onDetach,
    onDeviceOrientationChange,
  }
}

export {scalableCanvasPipelineModule}
