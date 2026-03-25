import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'content-handler',
  schema: {
    showDuringWorldEffects: ecs.boolean,
    showDuringFaceEffects: ecs.boolean,
  },
  schemaDefaults: {
    showDuringWorldEffects: true,
  },
  data: {
  },
  add: (world, component) => {
  },
  tick: (world, component) => {
  },
  remove: (world, component) => {
  },
})
