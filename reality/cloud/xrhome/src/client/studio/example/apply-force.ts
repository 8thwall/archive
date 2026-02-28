import ecs from '@ecs/runtime'

ecs.registerComponent({
  name: 'debug-apply-force',
  schema: {
    delay: ecs.i32,
    forceX: ecs.f32,
    forceY: ecs.f32,
    forceZ: ecs.f32,
  },
  data: {
    startTime: ecs.i32,
    isForceApplied: ecs.boolean,
  },
  tick: (world, component) => {
    if (component.data.startTime === 0) {
      component.data.startTime = world.time.elapsed
      component.data.isForceApplied = false
    }
    if (!component.data.isForceApplied &&
      world.time.elapsed - component.data.startTime > component.schema.delay) {
      ecs.physics.applyForce(world,
        component.eid, component.schema.forceX, component.schema.forceY, component.schema.forceZ)
      component.data.isForceApplied = true
    }
  },
})
