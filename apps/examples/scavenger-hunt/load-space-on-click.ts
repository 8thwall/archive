import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Load Space on Click',
  schema: {
    spaceName: ecs.string,
  },
  schemaDefaults: {
    spaceName: 'World Map',
  },
  data: {
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('default')
      .initial()
      .listen(eid, ecs.input.UI_CLICK, () => {
        const {spaceName} = schemaAttribute.get(eid)

        try {
          world.spaces.loadSpace(`${spaceName}`)
        } catch (e) {
          console.error(e)
        }
      })
  },
})
