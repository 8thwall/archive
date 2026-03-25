import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

ecs.registerComponent({
  name: 'Return to Main',
  schema: {},
  schemaDefaults: {},
  data: {},
  stateMachine: ({world, eid}) => {
    ecs.defineState('default').initial().listen(eid, ecs.input.UI_CLICK, () => {
      world.spaces.loadSpace('Default')
    })
  },
})
