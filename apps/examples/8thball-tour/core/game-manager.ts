import * as ecs from '@8thwall/ecs'
import {Version} from '../app-version'
import {PlayerControllerGyro} from '../player-controller-gyro'

const LEVEL_NAMES = [
  'L0 - Start Screen',
  'L1 - Pirate Cove',
  'Level 2',
  'Level 3',
  'L4 - Space',
  'END LEVEL',
]

ecs.registerComponent({
  name: 'Game Manager',
  schema: {
    gameoverUi: ecs.eid,
    initialUi: ecs.eid,
    player: ecs.eid,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const handleLevelUp = () => {
      const currentSpace = world.spaces.getActiveSpace()
      const idx = LEVEL_NAMES.indexOf(currentSpace.name)
      if (idx >= 0 && idx <= LEVEL_NAMES.length) {
        world.spaces.loadSpace(LEVEL_NAMES[idx + 1])
        world.events.dispatch(world.events.globalId, 'LEVEL_START')
      } else {
        console.warn('no next stage', world.spaces.getActiveSpace().name, idx)
      }
    }
    ecs.defineState('initial')
      .onEnter(() => {
        const {initialUi} = schemaAttribute.get(eid)
        ecs.Hidden.remove(world, initialUi)
      })
      .onExit(() => {
        const {initialUi} = schemaAttribute.get(eid)
        ecs.Hidden.set(world, initialUi)
        world.events.dispatch(world.events.globalId, 'RESET_TIMER')
        world.events.dispatch(world.events.globalId, 'UNPAUSE_TIMER')
      })
      .listen(world.events.globalId, 'LEVEL_FINISHED', handleLevelUp)
      .onEvent(ecs.input.SCREEN_TOUCH_START, 'running', {
        target: world.events.globalId,
      })

    const running = ecs.defineState('running').initial()
      .onEnter(() => {
        document.body.addEventListener('click', () => {
          const requestOrientationPermission = () => {
            // @ts-ignore
            if (DeviceOrientationEvent.requestPermission) {
              // @ts-ignore
              DeviceOrientationEvent.requestPermission()
                .then((permissionState) => {
                  if (permissionState === 'granted') {
                    const {player} = schemaAttribute.get(eid)
                    PlayerControllerGyro.set(world, eid, {player, forceMultiplier: 20})
                  } else {
                    console.log('DeviceMotionEvent permission denied.')
                  }
                })
                .catch((err) => {
                  console.error('Error requesting DeviceMotionEvent permission:', err)
                })
            }

            requestOrientationPermission()
          }
        })
      })
      .listen(world.events.globalId, 'LEVEL_FINISHED', handleLevelUp)
      .onTick(() => {
        // Dev Options
        if (Version.buildType !== 'dev') {
          return
        }

        const currentSpace = world.spaces.getActiveSpace()
        const debugLevel = 'Obstacle Playground (Test)'
        if (currentSpace.name !== debugLevel &&
          world.input.getKeyDown('Digit0')) {
          console.log('digit0 down')
          world.events.dispatch(world.events.globalId, 'LEVEL_FINISHED')
        }

        let i = 1
        while (i <= LEVEL_NAMES.length) {
          const key = `Digit${i}`
          const levelName = LEVEL_NAMES[i]
          if (currentSpace.name !== levelName &&
            world.input.getKeyDown(key)) {
            console.log(`digit${i} down`)
            world.spaces.loadSpace(levelName)
            world.events.dispatch(world.events.globalId, 'LEVEL_START')
          }
          i++
        }
      })
      .onEvent('PAUSE', 'paused')
      .onEvent('PLAYER_DIED', 'gameover', {
        target: world.events.globalId,
      })

    ecs.defineState('paused')
      .onEvent('UNPAUSE_TIMER', running)

    ecs.defineState('gameover')
      .onEnter(() => {
        const {gameoverUi} = schemaAttribute.get(eid)
        ecs.Hidden.remove(world, gameoverUi)
      })
      .onExit(() => {
        const {gameoverUi} = schemaAttribute.get(eid)
        ecs.Hidden.set(world, gameoverUi)
        // TODO (Tri) add game restart handling here
        world.events.dispatch(world.events.globalId, 'RESET_TIMER')
        world.events.dispatch(world.events.globalId, 'UNPAUSE_TIMER')
      })
      .onEvent(ecs.input.SCREEN_TOUCH_START, running, {
        target: world.events.globalId,
      })
  },
})
