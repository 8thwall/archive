import {registerComponent, f64} from '@ecs/runtime'

const DeleteAfter = registerComponent({
  name: 'delete-after',
  schema: {ms: f64},
  data: {start: f64},
  add: (world, component) => {
    component.data.start = world.time.absolute
  },
  tick: (world, component) => {
    const timeLeft = component.schema.ms - (world.time.absolute - component.data.start)
    if (timeLeft <= 0) {
      world.deleteEntity(component.eid)
    }
  },
})

export {
  DeleteAfter,
}
