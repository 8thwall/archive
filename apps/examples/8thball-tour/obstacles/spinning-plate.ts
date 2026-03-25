import * as ecs from '@8thwall/ecs'

const EPSILON = 0.001
const FROM_MILLI = 1 / 1000
const DEG_2_RAD = Math.PI / 180

const BIG_MASS = 100000
const TORQUE_FACTOR = 10 * BIG_MASS

ecs.registerComponent({
  name: 'Spinning Plate',
  schema: {
    diameter: ecs.f32,
    rotationVelocity: ecs.f32,
  },
  schemaDefaults: {
    diameter: 2.5,  // meters
    rotationVelocity: 10.5,  // degrees / s
  },
  data: {
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        // Set the size on creation
        const {diameter} = schemaAttribute.get(eid)
        const currentScale = ecs.Scale.get(world, eid)
        if (Math.abs(currentScale.x - diameter) > EPSILON || Math.abs(currentScale.z - diameter) > EPSILON) {
          const data = {x: diameter, y: currentScale.y, z: diameter}
          ecs.Scale.set(world, eid, data)
        }

        // Have to manually set collider since the studio client isn't updated
        ecs.Collider.set(world, eid, {
          shape: ecs.ColliderShape.Cylinder,
          mass: BIG_MASS,  // We don't want collisions to slow down the spinning
          radius: 0.5,  // Note: This is 0.5 relative to the scale
          eventOnly: false,
          lockXPosition: true,
          lockYPosition: true,
          lockZPosition: true,
          lockXAxis: true,
          lockYAxis: false,
          lockZAxis: true,
          friction: 0.5,
          restitution: 0.5,
          linearDamping: 0,
          angularDamping: 0,
          rollingFriction: 0.1,
          spinningFriction: 0.1,
        })
      })
      .onTick(() => {
        const {rotationVelocity} = schemaAttribute.get(eid)
        const deltaDegrees = rotationVelocity * world.time.delta * FROM_MILLI
        const deltaRad = deltaDegrees * DEG_2_RAD
        ecs.physics.applyTorque(world, eid, 0, TORQUE_FACTOR * deltaRad, 0)
      })
  },
})
