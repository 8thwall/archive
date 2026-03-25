import {XRControllerModelFactory} from './controller-model-factory.js'
import {addChild, notifyChanged} from '../Rendering/manual-matrix-update'

const assignedControllers = []
const xrInputSources = []

const controllers = []
const unorderedControllers = []

export default function XRControllerManager(renderer, onLoad) {
  const controllerModelFactory = new XRControllerModelFactory(null, onLoad)

  /// /////////////
  // Controllers
  /// /////////////
  const controllerDisconnected = (event, controllerName) => {
    const xrInputSource = event.data

    if (!xrInputSource) return

    if (xrInputSource.targetRayMode !== 'tracked-pointer' || !xrInputSource.gamepad) return

    // force no generic hand thing
    if (xrInputSource.profiles.includes('generic-fixed-hand')) return

    const checkingSide = xrInputSource.handedness === 'left' ? 0 : 1

    if (controllerName === assignedControllers[checkingSide]) {
      xrInputSources[checkingSide] = null
    }
  }

  const controllerConnected = (event, controller) => {
    const xrInputSource = event.data

    if (xrInputSource.targetRayMode !== 'tracked-pointer' || !xrInputSource.gamepad) return

    // force no generic hand thing
    if (xrInputSource.profiles.includes('generic-fixed-hand')) return

    let checkingSide = 0  // Handedness = 'left'
    let otherSide = 1

    if (xrInputSource.handedness === 'right') {
      checkingSide = 1
      otherSide = 0
    }

    if (assignedControllers[checkingSide] === controller.name) {
      xrInputSources[checkingSide] = xrInputSource
      return
    }

    // If the controller that just connected is currently at the opposite element,
    // switch them over
    if (controllers[otherSide].controller.name === controller.name) {
      controllers[otherSide] = controllers[checkingSide]
      xrInputSources[otherSide] = xrInputSources[checkingSide]
      assignedControllers[otherSide] = controllers[checkingSide].controller.name
    }

    xrInputSources[checkingSide] = xrInputSource
    controllers[checkingSide] = unorderedControllers.find(found => found.controller === controller)

    assignedControllers[checkingSide] = controller.name
  }

  const setupController = (controllerIndex, controllerName) => {
    const controller = renderer.xr.getController(controllerIndex)
    if (controller) {
      controller.name = controllerName
      controller.addEventListener('connected', (event) => {
        controllerConnected(event, controller)
      })
      controller.addEventListener('disconnected', (event) => {
        controllerDisconnected(event, controller.name)
      })
    }

    const controllerGrip = renderer.xr.getControllerGrip(controllerIndex)
    let controllerModel
    if (controllerGrip) {
      controllerModel = controllerModelFactory.createControllerModel(controllerGrip)
      addChild(controllerGrip, controllerModel)
    }

    const inputs = () => controllerModel?.motionController
    return {controllerIndex, controllerName, controller, controllerGrip, controllerModel, inputs}
  }

  const leftController = setupController(0, 'first-controller')
  const rightController = setupController(1, 'second-controller')

  unorderedControllers.push(leftController)
  unorderedControllers.push(rightController)

  assignedControllers[0] = 'first-controller'
  assignedControllers[1] = 'second-controller'
  controllers[0] = leftController
  controllers[1] = rightController

  /// ///////////
  // Functions
  /// ///////////

  const dummyMatrix = new window.THREE.Matrix4()

  // Set the passed ray to match the given controller pointing direction

  function setFromController(controllerID, ray) {
    const {controller} = unorderedControllers[controllerID]

    // Position the intersection ray

    dummyMatrix.identity().extractRotation(controller.matrixWorld)

    ray.origin.setFromMatrixPosition(controller.matrixWorld)
    ray.direction.set(0, 0, -1).applyMatrix4(dummyMatrix)
  }

  // Position the chosen controller's pointer at the given point in space.
  // Should be called after raycaster.intersectObject() found an intersection point.

  function setPointerAt(controllerID, vec) {
    const {controller, controllerModel} = unorderedControllers[controllerID]
    if (!controller || !controllerModel?.motionController || !controller.point) return
    if (vec) {
      const localVec = controller.worldToLocal(vec.clone())

      controller.point.position.copy(localVec)
      controller.point.visible = true
      notifyChanged(controller.point)
    } else {
      controller.point.visible = false
    }
  }

  return {
    unorderedControllers,
    controllers,
    setFromController,
    setPointerAt,
  }
}

const getSideAtUnorderedIndex = (index) => {
  if (xrInputSources[index] && xrInputSources[index].handedness === 'left') return 0

  return 1
}

const getXRInputSourceForSide = side => xrInputSources[side]
const getInputsForSide = side => controllers[side]

export {getXRInputSourceForSide, getInputsForSide, getSideAtUnorderedIndex}
