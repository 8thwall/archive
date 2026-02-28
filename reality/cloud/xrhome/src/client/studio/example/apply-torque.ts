import ecs from '@ecs/runtime'

ecs.registerComponent({
  name: 'debug-apply-torque',
  schema: {
    delay: ecs.i32,
    torqueX: ecs.f32,
    torqueY: ecs.f32,
    torqueZ: ecs.f32,
  },
  data: {
    startTime: ecs.i32,
    isTorqueApplied: ecs.boolean,
  },
  tick: (world, component) => {
    if (component.data.startTime === 0) {
      component.data.startTime = world.time.elapsed
      component.data.isTorqueApplied = false
    }
    if (!component.data.isTorqueApplied &&
      world.time.elapsed - component.data.startTime > component.schema.delay) {
      ecs.physics.applyTorque(world,
        component.eid, component.schema.torqueX, component.schema.torqueY, component.schema.torqueZ)
      component.data.isTorqueApplied = true
    }
  },
})
