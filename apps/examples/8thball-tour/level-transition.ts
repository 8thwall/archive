import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Level Transition',
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    const toLoaded = ecs.defineTrigger()

    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        ecs.Ui.mutate(world, eid, (cursor) => {
          cursor.backgroundOpacity = 1
        })
      })
      .onTick(() => {
        const {pending, complete} = ecs.assets.getStatistics()  // Retrieve asset loading stats
        const progress = complete / (pending + complete)  // Calculate progress as a ratio

        if (progress >= 1) {
          world.time.setTimeout(() => {
            toLoaded.trigger()
          }, 1000)
        }
      })
      .onTrigger(toLoaded, 'ready')

    ecs.defineState('ready')
      .onEnter(() => {
        world.events.dispatch(world.events.globalId, 'RESET_TIMER')
      })
      .onTick(() => {
        ecs.Ui.mutate(world, eid, (cursor) => {
          cursor.backgroundOpacity -= 0.1
        })
      })
  },
})
