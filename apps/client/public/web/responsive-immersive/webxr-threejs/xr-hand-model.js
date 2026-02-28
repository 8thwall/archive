class XRHandModel extends window.THREE.Group {
  constructor(controller) {
    super()

    this.controller = controller
    this.motionController = null
    this.envMap = null
    this.mesh = null
  }

  updateMatrixWorld(force) {
    super.updateMatrixWorld(force)

    if (this.motionController) {
      this.motionController.updateMesh()
    }
  }
}

export {
  XRHandModel,
}
