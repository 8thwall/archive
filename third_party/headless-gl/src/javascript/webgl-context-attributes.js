class WebGLContextAttributes {
  constructor (
    alpha,
    depth,
    stencil,
    antialias,
    premultipliedAlpha,
    preserveDrawingBuffer,
    preferLowPowerToHighPerformance,
    failIfMajorPerformanceCaveat,
    nativeWindow,
  ) {
    this.alpha = alpha
    this.depth = depth
    this.stencil = stencil
    this.antialias = antialias
    this.premultipliedAlpha = premultipliedAlpha
    this.preserveDrawingBuffer = preserveDrawingBuffer
    this.preferLowPowerToHighPerformance = preferLowPowerToHighPerformance
    this.failIfMajorPerformanceCaveat = failIfMajorPerformanceCaveat
    this.nativeWindow = nativeWindow
  }
}

export { WebGLContextAttributes }
