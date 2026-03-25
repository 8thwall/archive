interface Intrinsic {
  fx: number
  fy: number
  cx: number
  cy: number
}

const recoverIntrinsic = (
  intrinsics: Intrinsic,
  pixelsWidth: number,
  pixelsHeight: number
): Intrinsic => {
  const fx = intrinsics[0] * pixelsWidth * 0.5
  const fy = intrinsics[5] * pixelsHeight * 0.5
  const cx = ((1 - intrinsics[8]) * pixelsWidth - 1) * 0.5
  const cy = ((1 + intrinsics[9]) * pixelsHeight - 1) * 0.5
  return {fx, fy, cx, cy}
}

const clipAndScaleIntrinsic = (
  intrinsics: Intrinsic,
  pixelsWidth: number,
  pixelsHeight: number,
  targetWidth: number,
  targetHeight: number,
  scale: number
): Intrinsic => {
  const cx = (targetWidth - 1) * 0.5 + (intrinsics.cx - 0.5 * (pixelsWidth - 1)) * scale
  const cy = (targetHeight - 1) * 0.5 + (intrinsics.cy - 0.5 * (pixelsHeight - 1)) * scale
  const fx = intrinsics.fx * scale
  const fy = intrinsics.fy * scale
  return {fx, fy, cx, cy}
}

const intrinsicModule = () => {
  let sizing_ = {
    videoWidth: null,
    videoHeight: null,
    canvasWidth: null,
    canvasHeight: null,
  }
  let recoveredIntrinsic_ : Intrinsic = {
    fx: null,
    fy: null,
    cx: null,
    cy: null,
  }
  let hasLogged_ = false
  return {
    name: 'intrinsic-core',
    onCanvasSizeChange: ({videoWidth, videoHeight, canvasWidth, canvasHeight}) => {
      sizing_ = {videoWidth, videoHeight, canvasWidth, canvasHeight}
    },
    onUpdate: ({frameStartResult, processCpuResult}) => {
      const {reality} = processCpuResult
      if (!reality || !reality.intrinsic) {
        return
      }
      if (hasLogged_) {
        return
      }
      const {intrinsics} = reality
      const {textureWidth, textureHeight} = frameStartResult
      console.log('Clip space intrinsic', intrinsics, 'sizing', sizing_, `texture size ${textureWidth} ${textureHeight}`)
      const pixelsWidth = sizing_.canvasWidth
      const pixelsHeight = sizing_.canvasHeight
      recoveredIntrinsic_ = recoverIntrinsic(intrinsics, pixelsWidth, pixelsHeight)

      console.log('Recovered intrinsic=', recoveredIntrinsic_)
      console.log('Processing intrinsic=', clipAndScaleIntrinsic(recoveredIntrinsic_, pixelsWidth, 
        pixelsHeight, 480, 640, 640 / pixelsHeight))
      hasLogged_ = true
    },
    getRecoveredIntrinsic: () => recoveredIntrinsic_,
  }
}

export {
  intrinsicModule,
}
