import ecs from '@ecs/runtime'

ecs.registerComponent({
  name: 'debug-set-linear-velocity',
  schema: {
    delay: ecs.i32,
    velX: ecs.f32,
    velY: ecs.f32,
    velZ: ecs.f32,
  },
  data: {
    startTime: ecs.i32,
    isVelocityApplied: ecs.boolean,
  },
  tick: (world, component) => {
    if (component.data.startTime === 0) {
      component.data.startTime = world.time.elapsed
      component.data.isVelocityApplied = false
    }
    if (!component.data.isVelocityApplied &&
      world.time.elapsed - component.data.startTime > component.schema.delay) {
      ecs.physics.setLinearVelocity(world,
        component.eid, component.schema.velX, component.schema.velY, component.schema.velZ)
      component.data.isVelocityApplied = true
    }
  },
})
