import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'VPS Logger',
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    ecs.defineState('default')
      .initial()
      .listen(world.events.globalId, ecs.events.REALITY_LOCATION_FOUND, (e) => {
        const {name} = e.data as any

        console.log(`Location Found: ${name}`)
      })
      .listen(world.events.globalId, ecs.events.REALITY_LOCATION_LOST, (e) => {
        const {name} = e.data as any

        console.log(`Location Lost: ${name}`)
      })
  },
})
