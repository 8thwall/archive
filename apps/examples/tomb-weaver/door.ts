// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

import type {ActionEvent} from './input-controller'

ecs.registerComponent({
  name: 'door',
  schema: {
    // Add data that can be configured on the component.
    room: ecs.eid,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
  },
  data: {
    // Add data that cannot be configured outside of the component.
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    const {room: roomEid} = schemaAttribute.get(eid)

    const toUnlock = ecs.defineTrigger()
    const toLock = ecs.defineTrigger()

    const locked = ecs.defineState('locked')
    const unlocked = ecs.defineState('unlocked')

    const unlockDoor = () => {
      // @ts-ignore
      const startPosition = world.transform.getLocalPosition(eid)
      ecs.PositionAnimation.set(world, eid, {
        fromX: startPosition.x,
        fromY: startPosition.y,
        fromZ: startPosition.z,
        toX: startPosition.x,
        toY: startPosition.y + 0.85,
        toZ: startPosition.z,
        loop: false,
      })
      toUnlock.trigger()
    }

    const lockDoor = () => {
      // @ts-ignore
      const startPosition = world.transform.getLocalPosition(eid)
      ecs.PositionAnimation.set(world, eid, {
        fromX: startPosition.x,
        fromY: startPosition.y,
        fromZ: startPosition.z,
        toX: startPosition.x,
        toY: startPosition.y - 0.85,
        toZ: startPosition.z,
        loop: false,
        autoFrom: true,
      })
      toLock.trigger()
    }

    locked
      .onTrigger(toUnlock, 'unlocked')
      .listen(eid, 'doorUnlock', unlockDoor)

    unlocked.initial()
      .onTrigger(toLock, 'locked')
      .listen(eid, 'doorLock', lockDoor)

    locked.listen(world.events.globalId, 'exitRoom', (event) => {
      const {targetId} = event.data as any
      // A testing failsafe in case the enemies don't spawn or we want to test
      // if (world.input.getMouseDown(0)) {
      //   unlockDoor()
      // }
      if (targetId === roomEid) {
        unlockDoor()
      }
    })

    // locked.listen(world.events.globalId, 'actionStart', (e) => {
    //   const data = e.data as ActionEvent
    //   if (data.action === 'attack') {
    //     unlockDoor()
    //   }
    // })

    unlocked.listen(world.events.globalId, 'enterRoom', (event) => {
      const {targetId} = event.data as any
      if (targetId === roomEid) {
        lockDoor()
      }
    })
  },
})
