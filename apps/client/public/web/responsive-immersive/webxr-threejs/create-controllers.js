import {XRHandModelFactory} from './xr-hand-model-factory'
import {XRControllerModelFactory} from './xr-controller-model-factory'

const CreateControllers = (renderer, scene) => {
  const handModels = {
    left: {},
    right: {},
  }

  // Factories
  const handModelFactory = new XRHandModelFactory()
  const controllerModelFactory = new XRControllerModelFactory()

  // Controllers
  const controller0 = renderer.xr.getController(0)
  const controller1 = renderer.xr.getController(1)
  scene.add(controller0)
  scene.add(controller1)
  handModels.left.controller = controller0
  handModels.right.controller = controller1

  // Hand 1 - left
  const controllerGrip1 = renderer.xr.getControllerGrip(0)
  const gripModel1 = controllerModelFactory.createControllerModel(controllerGrip1)
  controllerGrip1.add(gripModel1)
  scene.add(controllerGrip1)
  handModels.left.grip = gripModel1

  const hand1 = renderer.xr.getHand(0)
  hand1.userData.currentHandModel = 0
  scene.add(hand1)

  const leftHand = handModelFactory.createHandModel(hand1)
  leftHand.visibile = true
  hand1.add(leftHand)
  handModels.left.hand = leftHand

  // Hand 2 - right
  const controllerGrip2 = renderer.xr.getControllerGrip(1)
  const gripModel2 = controllerModelFactory.createControllerModel(controllerGrip2)
  controllerGrip2.add(gripModel2)
  scene.add(controllerGrip2)
  handModels.right.grip = gripModel2

  const hand2 = renderer.xr.getHand(1)
  hand2.userData.currentHandModel = 0
  scene.add(hand2)

  const rightHand = handModelFactory.createHandModel(hand2)
  rightHand.visible = true
  hand2.add(rightHand)
  handModels.right.hand = rightHand

  // Add tracer lines to controllers
  const geometry = new window.THREE.BufferGeometry().setFromPoints(
    [new window.THREE.Vector3(0, 0, 0), new window.THREE.Vector3(0, 0, -1)]
  )
  const line = new window.THREE.Line(geometry)
  line.name = 'tracer'
  line.scale.z = 5
  controller0.add(line.clone())
  controller1.add(line.clone())

  return handModels
}

export {
  CreateControllers,
}
