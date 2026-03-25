import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Timer',
  schema: {
    startingTime: ecs.i32,
    timerText: ecs.eid,
    timerIcon: ecs.eid,
    isDisabled: ecs.boolean,
  },
  schemaDefaults: {
    startingTime: 60,
    isDisabled: false,
  },
  data: {
    timeLeft: ecs.i32,
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    const pause = ecs.defineState('pause')
      .initial()
      .listen(world.events.globalId, 'RESET_TIMER', () => {
        const {startingTime} = schemaAttribute.get(eid)
        dataAttribute.set(eid, {timeLeft: startingTime})
      })
      .onEvent('UNPAUSE_TIMER', 'ticking', {
        target: world.events.globalId,
      })

    ecs.defineState('ticking')
      .onEnter(() => {
        const {timerText, timerIcon, isDisabled} = schemaAttribute.get(eid)

        dataAttribute.set(eid, {
          timeLeft: schemaAttribute.get(eid).startingTime,
        })

        ecs.Ui.set(world, timerText, {
          text: `${dataAttribute.get(eid).timeLeft}`,
        })

        world.time.setInterval(() => {
          if (isDisabled) {
            return
          }

          const {timeLeft} = dataAttribute.get(eid)

          if (timeLeft > 0) {
            dataAttribute.mutate(eid, (cursor) => {
              cursor.timeLeft -= 1
            })

            ecs.Ui.set(world, timerText, {
              color: '#FFFFFF',
              text: `${dataAttribute.get(eid).timeLeft}`,
            })

            ecs.Ui.set(world, timerIcon, {
              image: 'assets/textures/icons/hourglass.png',
            })

            if (timeLeft <= 10) {
              ecs.Ui.set(world, timerText, {
                color: '#EE4B2B',
              })

              ecs.Ui.set(world, timerIcon, {
                image: 'assets/textures/icons/skull.png',
              })

              if (timeLeft <= 0) {
                ecs.Ui.set(world, timerText, {
                  color: '#EE4B2B',
                })
              }
            }
          } else {
            world.events.dispatch(world.events.globalId, 'PLAYER_DIED')
          }
        }, 1000)
      })
      .onEvent('PAUSE_TIMER', pause, {
        target: world.events.globalId,
      })
      .listen(world.events.globalId, 'RESET_TIMER', () => {
        const {startingTime} = schemaAttribute.get(eid)
        dataAttribute.set(eid, {timeLeft: startingTime})
        world.events.dispatch(world.events.globalId, 'PLAYER_RESPAWN')
      })
      .listen(world.events.globalId, 'ADD_TIMER', () => {
        dataAttribute.mutate(eid, (cursor) => {
          cursor.timeLeft += 10
        })
      })
  },
})
