import * as ecs from '@8thwall/ecs'

const DeleteAfter = ecs.registerComponent({
  name: 'delete-after',
  schema: {ms: ecs.f64},
  schemaDefaults: {ms: 10000},
  data: {start: ecs.f64},
  add: (world, component) => {
    component.data.start = world.time.absolute
  },
  tick: (world, component) => {
    if (world.time.absolute > (component.data.start + component.schema.ms)) {
      world.deleteEntity(component.eid)
    }
  },
})

export {
  DeleteAfter,
}
