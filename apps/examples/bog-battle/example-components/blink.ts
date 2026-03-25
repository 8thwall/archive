import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'blink',
  schema: {period: ecs.f32},
  tick: (world, component) => {
    const brightness = Math.sin(world.time.elapsed / component.schema.period) > 0.5 ? 255 : 0
    ecs.Material.set(world, component.id, {
      r: brightness,
      g: brightness,
      b: brightness,
    })
  },
})
