import * as ecs from '@8thwall/ecs'

function applyThreshold(value: number): number {
  const threshold = 0.1
  return Math.abs(value) > threshold ? value : 0
}

ecs.registerComponent({
  name: 'First Person Character',
  schema: {
    sensitivity: ecs.f32,
    moveSpeed: ecs.f32,
    invertedYaw: ecs.boolean,
    invertedPitch: ecs.boolean,
  },
  schemaDefaults: {
    sensitivity: 0.8,
    moveSpeed: 10.0,
    invertedYaw: false,
    invertedPitch: false,
  },
  data: {
    pitchAngle: ecs.f32,
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    const {THREE} = window as any

    const forwardDirection = new THREE.Vector3()
    const rightDirection = new THREE.Vector3()
    const movementVector = new THREE.Vector3()

    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        world.input.enablePointerLockRequest()
      })
      .onTick(() => {
        const {sensitivity, moveSpeed, invertedYaw, invertedPitch} = schemaAttribute.get(eid)
        const lookUp = applyThreshold(world.input.getAction('lookup') - world.input.getAction('lookdown'))
        const lookRight = applyThreshold(world.input.getAction('lookright') - world.input.getAction('lookleft'))
        const yawInversionFactor = invertedYaw ? 1 : -1
        const pitchInversionFactor = invertedPitch ? 1 : -1
        const yawRotation = ecs.math.quat.pitchYawRollDegrees(ecs.math.vec3.xyz(0, lookRight * sensitivity * yawInversionFactor, 0))

        ecs.Quaternion.set(world, eid, ecs.math.quat.from(ecs.Quaternion.get(world, eid)).times(yawRotation))
        ecs.Quaternion.set(world, world.camera.getActiveEid(), ecs.math.quat.pitchYawRollDegrees(ecs.math.vec3.xyz(dataAttribute.get(eid).pitchAngle, 0, 0)))

        dataAttribute.set(eid, {
          pitchAngle: Math.max(-89, Math.min(89, dataAttribute.get(eid).pitchAngle + lookUp * sensitivity * pitchInversionFactor)),
        })

        const forwardInput = applyThreshold(world.input.getAction('forward') - world.input.getAction('backward'))
        const rightInput = applyThreshold(world.input.getAction('right') - world.input.getAction('left'))

        const entityObject3D = world.three.entityToObject.get(eid)
        entityObject3D.getWorldDirection(forwardDirection)
        rightDirection.set(-forwardDirection.z, 0, forwardDirection.x)

        movementVector.set(0, 0, 0)
        movementVector.addScaledVector(forwardDirection, forwardInput)
        movementVector.addScaledVector(rightDirection, rightInput)
        movementVector.normalize().multiplyScalar(moveSpeed)

        // world.transform.translateWorld(eid, ecs.math.vec3.xyz(movementVector.x, ecs.physics.getWorldGravity(world) * 0.001, movementVector.z))
        ecs.physics.setLinearVelocity(world, eid, movementVector.x, ecs.physics.getWorldGravity(world), movementVector.z)
      })
      .onExit(() => {
        world.input.disablePointerLockRequest()
      })
  },
})
