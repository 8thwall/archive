import ecs from '@ecs/runtime'

ecs.registerComponent({
  name: 'debug-set-world-gravity',
  schema: {
    delay: ecs.i32,
    gravity: ecs.f32,
  },
  data: {
    startTime: ecs.i32,
    isWorldGravityApplied: ecs.boolean,
  },
  tick: (world, component) => {
    if (component.data.startTime === 0) {
      component.data.startTime = world.time.elapsed
      component.data.isWorldGravityApplied = false
    }
    if (!component.data.isWorldGravityApplied &&
      world.time.elapsed - component.data.startTime > component.schema.delay) {
      ecs.physics.setWorldGravity(world, component.schema.gravity)
      component.data.isWorldGravityApplied = true
    }
  },
})
