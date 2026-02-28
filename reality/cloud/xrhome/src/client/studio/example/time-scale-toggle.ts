import ecs from '@ecs/runtime'

let tickCounter = 0

ecs.registerComponent({
  name: 'debug-time-scale-toggle',
  schema: {period: ecs.f32},
  tick: (world, component) => {
    tickCounter++
    const model = ecs.GltfModel.get(world, component.eid)
    if (tickCounter % 100 === 0) {
      // eslint-disable-next-line no-bitwise
      if ((world.time.elapsed >> 11) % 2 && model.timeScale !== 3) {
        ecs.GltfModel.set(world, component.eid, {timeScale: 3})
      } else if (model.timeScale === 3) {
        ecs.GltfModel.set(world, component.eid, {timeScale: 1})
      }
    }
  },
})
