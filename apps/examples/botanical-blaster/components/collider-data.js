import * as ecs from '@8thwall/ecs'

const ColliderData = ecs.registerComponent({
  name: 'ColliderData',
  schema: {
    name: ecs.string,
    type: ecs.string,
    despawnProjectie: ecs.boolean,
  },
  schemaDefaults: {
    name: '',
    type: '',
  },
  add: (world, component) => {},
  remove: (world, component) => {},
})

export {ColliderData}
