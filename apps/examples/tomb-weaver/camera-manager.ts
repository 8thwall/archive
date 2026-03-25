// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

import {CameraTarget} from './camera-target'
import {CharacterTag} from './tags'

// const playerQuery = ecs.defineQuery([CharacterTag])
// const cameraTargetQuery = ecs.defineQuery([CameraTarget])

// const triggerRoom = (world) => {
//   const player = playerQuery(world)
//   const cameraTargets = cameraTargetQuery(world)

//   if (player[0]) {
//     for (let i = 0; i < cameraTargets.length; i++) {
//       CameraTarget.set(world, cameraTargets[i], {player: player[0]})
//     }
//   }
// }

// ecs.registerBehavior(triggerRoom)

ecs.registerComponent({
  name: 'camera-manager',
  schema: {
    // Add data that can be configured on the component.
    currentRoom: ecs.eid,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
  },
  data: {
    // Add data that cannot be configured outside of the component.
  },
  add: (world, component) => {
    // Runs when the component is added to the world.
    const {schemaAttribute} = component
    const enterRoomHandler = (event) => {
      if (event.data.targetId === schemaAttribute.get(component.eid).currentRoom) {
        return
      }

      if (event.data.lockDoors) {
        world.events.dispatch(world.events.globalId, 'enterRoom', {targetId: event.data.targetId})
      }

      schemaAttribute.set(component.eid, {currentRoom: event.data.targetId})

      // @ts-ignore
      const startPosition = world.transform.getWorldPosition(component.eid)
      // @ts-ignore
      const targetPosition = world.transform.getWorldPosition(
        schemaAttribute.get(component.eid).currentRoom
      )

      ecs.PositionAnimation.set(world, component.eid, {
        toX: targetPosition.x,
        toY: startPosition.y,
        toZ: targetPosition.z,
        loop: false,
        duration: 500,
        autoFrom: true,
      })
    }
    world.events.addListener(world.events.globalId, 'attemptEnterRoom', enterRoomHandler)
  },
})
