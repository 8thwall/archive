import * as ecs from '@8thwall/ecs'

const Spin = ecs.registerComponent({
  name: 'spin',
  schema: {
    x: ecs.f32,
    y: ecs.f32,
    z: ecs.f32,
    speed: ecs.f32,
  },
  tick: (world, component) => {
    const a = (world.time.elapsed * component.schema.speed) / 1000

    const sin = Math.sin(a)
    const cos = Math.cos(a)

    world.setQuaternion(
      component.eid,
      component.schema.x * sin,
      component.schema.y * sin,
      component.schema.z * sin,
      cos
    )
    world.normalizeQuaternion(component.eid)
  },
})

export {Spin}
