/* globals THREE */
// eslint-disable-next-line import/no-unresolved
import {Constants as MotionControllerConstants} from '@webxr-input-profiles/motion-controllers'

class XRControllerModel extends window.THREE.Group {
  constructor(controller) {
    super()

    this.controller = controller
    this.motionController = null
    this.envMap = null
  }

  setEnvironmentMap(envMap) {
    if (this.envMap === envMap) {
      return this
    }

    this.envMap = envMap
    this.traverse((child) => {
      if (child.isMesh) {
        child.material.envMap = this.envMap
        child.material.needsUpdate = true
      }
    })

    return this
  }

  /**
   * Polls data from the XRInputSource and updates the model's components to match
   * the real world data
   */
  updateMatrixWorld(force) {
    super.updateMatrixWorld(force)

    if (!this.motionController) return

    // Cause the MotionController to poll the Gamepad for data
    this.motionController.updateFromGamepad()

    // Update the 3D model to reflect the button, thumbstick, and touchpad state
    Object.values(this.motionController.components).forEach((component) => {
      // Update node data based on the visual responses' current states
      Object.values(component.visualResponses).forEach((visualResponse) => {
        const {valueNode, minNode, maxNode, value, valueNodeProperty} = visualResponse

        // Skip if the visual response node is not found. No error is needed,
        // because it will have been reported at load time.
        if (!valueNode) return

        // Calculate the new properties based on the weight supplied
        if (valueNodeProperty === MotionControllerConstants.VisualResponseProperty.VISIBILITY) {
          valueNode.visible = value
        } else if (
          valueNodeProperty === MotionControllerConstants.VisualResponseProperty.TRANSFORM) {
          if (valueNode.quaternion.slerpQuaternions) {
            valueNode.quaternion.slerpQuaternions(
              minNode.quaternion,
              maxNode.quaternion,
              value
            )
          } else {
            THREE.Quaternion.slerp(
              minNode.quaternion, maxNode.quaternion, valueNode.quaternion, value
            )
          }

          valueNode.position.lerpVectors(
            minNode.position,
            maxNode.position,
            value
          )
        }
      })
    })
  }
}

export {
  XRControllerModel,
}
