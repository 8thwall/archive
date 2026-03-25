import * as ecs from '@8thwall/ecs'

const quatFactory = ecs.math.quat

let deviceOrientationHandler: (eventData: DeviceOrientationEvent) => any
const PlayerControllerGyro = ecs.registerComponent({
  name: 'player-controller-gyro',
  schema: {
    player: ecs.eid,
    forceMultiplier: ecs.f32,
  },
  schemaDefaults: {
    forceMultiplier: 20,
  },
  data: {
    // Add data that cannot be configured outside of the component.
  },
  add: (world, component) => {
    const {eid, schema, dataAttribute} = component

    dataAttribute.set(eid, {
      active: false,
    })

    deviceOrientationHandler = (eventData: DeviceOrientationEvent) => {
      const {beta, gamma} = eventData

      let forceX = schema.forceMultiplier * gamma
      let forceZ = schema.forceMultiplier * beta
      const magnitude = Math.sqrt(forceX * forceX + forceZ * forceZ)
      if (magnitude > 0) {
        forceX = (forceX / magnitude) * schema.forceMultiplier
        forceZ = (forceZ / magnitude) * schema.forceMultiplier
      }

      // Apply movement forces to the ball
      // ecs.physics.applyForce(world, eid, forceX, 0, forceZ)
      ecs.physics.applyTorque(world, schema.player, forceZ, 0, -forceX)
    }
    window.addEventListener('deviceorientation', deviceOrientationHandler)
  },
  tick: (world, component) => {
  },
  remove: (world, component) => {
    if (deviceOrientationHandler) {
      window.removeEventListener('deviceorientation', deviceOrientationHandler)
    }
  },
})

export {PlayerControllerGyro}
