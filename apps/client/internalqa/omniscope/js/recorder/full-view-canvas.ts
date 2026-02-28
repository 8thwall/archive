// FullViewCanvas will set the canvas size to the aspect ratio of the video
interface OnCbParams {
  orientation: number
  videoWidth: number
  videoHeight: number
}

interface CameraPipelineModule {
  name: string
  onAttach(args: OnCbParams): void
  onDeviceOrientationChange(args: OnCbParams): void
  onDetach(args: OnCbParams): void
}

type CameraPipelineModuleFactory = () => CameraPipelineModule

function create() {
  let canvas_ = null

  // Update the size of the camera feed canvas to fill the screen.
  const fillViewWithCanvas = ({orientation, videoWidth, videoHeight}) => {
    if (!canvas_) {
      return
    }

    const ww = window.innerWidth
    const aspectRatio = videoHeight / videoWidth
    const wh = window.innerWidth * aspectRatio

    // Wait for orientation change to take effect before handline resize.
    if (((orientation === 0 || orientation === 180) && ww > wh) ||
      ((orientation === 90 || orientation === -90) && wh > ww)) {
      window.requestAnimationFrame(() => (
        fillViewWithCanvas({orientation, videoWidth, videoHeight})
      ))
      return
    }

    // Set the canvas geometry to the new window size.
    canvas_.width = ww
    canvas_.height = wh
  }

  const onAttach = ({canvas, orientation, videoWidth, videoHeight}) => {
    canvas_ = canvas
    fillViewWithCanvas({orientation, videoWidth, videoHeight})
  }

  const onDeviceOrientationChange = ({orientation, videoWidth, videoHeight}) => {
    fillViewWithCanvas({orientation, videoWidth, videoHeight})
  }

  const onDetach = () => {
    canvas_ = null
  }

  const pipelineModule : CameraPipelineModuleFactory = () => ({
    name: 'full-view-canvas',
    onAttach,
    onDetach,
    onDeviceOrientationChange,
  })

  return {
    pipelineModule,
  }
}

let fullWindowCanvas = null

export const FullViewCanvasFactory = () => {
  if (fullWindowCanvas === null) {
    fullWindowCanvas = create()
  }

  return fullWindowCanvas
}
