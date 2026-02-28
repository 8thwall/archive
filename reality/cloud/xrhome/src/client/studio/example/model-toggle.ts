import ecs from '@ecs/runtime'

let tickCounter = 0

ecs.registerComponent({
  name: 'debug-model-toggle',
  schema: {period: ecs.f32},
  tick: (world, component) => {
    tickCounter++
    if ((tickCounter - 5) % 50 === 0) {
      // eslint-disable-next-line no-bitwise
      if ((world.time.elapsed >> 11) % 2) {
        ecs.GltfModel.set(world, component.eid,
          {
            url: 'https://static.8thwall.app/download/assets/wol-18-05.glb?name=wol.glb',
            animationClip: undefined,
          })
      } else {
        ecs.GltfModel.set(world, component.eid,
          {
            url: 'https://static.8thwall.app/download/assets/Earth-59l3h7i6f2.glb?name=Earth.glb',
            animationClip: undefined,
          })
      }
    }
  },
})
