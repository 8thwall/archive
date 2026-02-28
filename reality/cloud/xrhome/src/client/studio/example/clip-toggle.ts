import ecs from '@ecs/runtime'

let tickCounter = 0

ecs.registerComponent({
  name: 'debug-clip-toggle',
  schema: {period: ecs.f32},
  tick: (world, component) => {
    tickCounter++
    const model = ecs.GltfModel.get(world, component.eid)
    if (tickCounter % 50 === 0 && model.url.includes('wol')) {
      // eslint-disable-next-line no-bitwise
      if ((world.time.elapsed >> 11) % 2 && model.animationClip !== 'wol_idle_001') {
        ecs.GltfModel.set(world, component.eid, {animationClip: 'wol_idle_001'})
      } else if (model.animationClip !== 'wol_celebration_001') {
        ecs.GltfModel.set(world, component.eid, {animationClip: 'wol_celebration_001'})
      }
    }
  },
})
