import ecs from '@ecs/runtime'

const LoadingBar = ecs.registerComponent({
  name: 'loading-bar',
  schema: {
  },
  stateMachine: (ctx) => {
    const doneTrigger = ecs.defineTrigger()

    const update = () => {
      const {pending, complete} = ecs.assets.getStatistics()
      const progress = complete / (pending + complete)

      ecs.Scale.set(ctx.world, ctx.eid, {x: 0.05 + progress * 0.95, y: 1, z: 1})

      if (progress >= 1) {
        doneTrigger.trigger()
      }
    }

    const done = ecs.defineState('done')

    let timer = 0

    ecs.defineState('loading').initial()
      .onEnter(() => {
        update()
        timer = ctx.world.time.setInterval(update, 100)
      })
      .onExit(() => {
        ctx.world.time.clearTimeout(timer)
      })
      .onTrigger(doneTrigger, done)
  },
})

export {
  LoadingBar,
}
