import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Click To Reveal',
  schema: {
    model: ecs.eid,
  },
  schemaDefaults: {
  },
  data: {
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const toHidden = ecs.defineTrigger()

    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        const {model} = schemaAttribute.get(eid)

        ecs.Hidden.set(world, model)
      })
      .listen(eid, ecs.input.UI_CLICK, () => {
        const {model} = schemaAttribute.get(eid)

        ecs.Hidden.set(world, eid)
        ecs.Hidden.remove(world, model)
        ecs.ScaleAnimation.set(world, model, {
          toX: 0.5,
          toY: 0.5,
          toZ: 0.5,
          loop: false,
          easeOut: true,
          easingFunction: 'Elastic',
          duration: 1200,
        })

        toHidden.trigger()
      })
      .onTrigger(toHidden, 'hidden')
    ecs.defineState('hidden')
  },
})
