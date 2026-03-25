import * as ecs from '@8thwall/ecs'

const MyComponent = ecs.registerComponent({
  name: 'my-component',
  schema: {},
  add: (world, component) => {
    console.log(world, component.eid, component.schema)
  },
})