import * as ecs from '@8thwall/ecs'

const AudioClipComponent = ecs.registerComponent({
  name: 'AudioClip',
  schema: {
    name: ecs.string,
    length: ecs.f32,
  },
  schemaDefaults: {
    name: 'sound',
    length: 1000,
  },
  add: (world, component) => {},
  remove: (world, component) => {},
})

export {AudioClipComponent}
