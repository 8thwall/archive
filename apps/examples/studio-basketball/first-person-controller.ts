import * as ecs from '@8thwall/ecs'

// Import the THREE.js library from the global window object
const {THREE} = window as any

// Pre-define vectors to avoid creating new ones every frame
const forwardDirection = new THREE.Vector3()
const rightDirection = new THREE.Vector3()

// Helper function with hardcoded threshold for game controller movements
function applyThreshold(value: number): number {
  const threshold = 0.1
  return Math.abs(value) > threshold ? value : 0
}

ecs.registerComponent({
  name: 'first-person-controller',
  schema: {
    sensitivity: ecs.f32,
    moveSpeed: ecs.f32,
    invertedYaw: ecs.boolean,
    invertedPitch: ecs.boolean,
    gameControllerAxisThreshold: ecs.f32,  // Threshold for axis movement
  },
  schemaDefaults: {
    sensitivity: 0.8,
    moveSpeed: 10.0,
    invertedYaw: false,
    invertedPitch: false,
    gameControllerAxisThreshold: 0.1,
  },
  data: {
    pitchAngle: ecs.f32,
  },
  add: (world, component) => {
    world.input.enablePointerLockRequest()
  },
  tick: (world, component) => {
    // --- Look Mechanics ---
    const lookUp = applyThreshold(world.input.getAction('lookup') - world.input.getAction('lookdown'))
    const lookRight = applyThreshold(world.input.getAction('lookright') - world.input.getAction('lookleft'))

    const {sensitivity, moveSpeed} = component.schema
    const yawInversionFactor = component.schema.invertedYaw ? 1 : -1
    const pitchInversionFactor = component.schema.invertedPitch ? 1 : -1
    const currentQuaternion = ecs.math.quat.from(
      ecs.Quaternion.get(world, component.eid)
    )
    const cameraEntityId = world.camera.getActiveEid()
    const yawRotation = ecs.math.quat.pitchYawRollDegrees(
      ecs.math.vec3.xyz(0, lookRight * sensitivity * yawInversionFactor, 0)
    )
    const updatedQuaternion = currentQuaternion.times(yawRotation)
    ecs.Quaternion.set(world, component.eid, updatedQuaternion)
    component.data.pitchAngle = Math.max(
      -89,
      Math.min(89, component.data.pitchAngle + lookUp * sensitivity * pitchInversionFactor)
    )
    const pitchRotation = ecs.math.quat.pitchYawRollDegrees(
      ecs.math.vec3.xyz(component.data.pitchAngle, 0, 0)
    )
    ecs.Quaternion.set(world, cameraEntityId, pitchRotation)

    // --- Movement Mechanics ---
    const forwardInput = applyThreshold(world.input.getAction('forward') - world.input.getAction('backward'))
    const rightInput = applyThreshold(world.input.getAction('right') - world.input.getAction('left'))

    const entityObject3D = world.three.entityToObject.get(component.eid)
    entityObject3D.getWorldDirection(forwardDirection)
    rightDirection.set(-forwardDirection.z, 0, forwardDirection.x)
    const movementVector = new THREE.Vector3()
    movementVector.addScaledVector(forwardDirection, forwardInput)
    movementVector.addScaledVector(rightDirection, rightInput)
    movementVector.normalize().multiplyScalar(moveSpeed)

    ecs.physics.setLinearVelocity(
      world,
      component.eid,
      movementVector.x,
      -9.8,
      movementVector.z
    )
  },
  remove: (world, component) => {
    world.input.disablePointerLockRequest()
  },
})
