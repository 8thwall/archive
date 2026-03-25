// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

import {CameraTarget} from './camera-target'
import {CharacterTag} from './tags'

const playerQuery = ecs.defineQuery([CharacterTag])
const cameraTargetQuery = ecs.defineQuery([CameraTarget])

const WarpCharacter = ecs.registerComponent({
  name: 'warp-character',
  schema: {
    player: ecs.eid,
  },
  schemaDefaults: {
  },
  data: {
    // No additional data needed for this component.
  },
  add: (world, component) => {
    const {eid, schemaAttribute} = component

    const player = playerQuery(world)
    const cameraTargets = cameraTargetQuery(world)
    const position = ecs.math.vec3.xyz(0.068, 0.5, -1)

    // Listen for collision events on the entity this component is attached to.
    world.events.addListener(eid, ecs.physics.COLLISION_START_EVENT, (event) => {
      const playerEntity = schemaAttribute.get(eid).player

      if (!playerEntity) {
        console.warn('MoveCharacterComponent: No character entity specified.')
        return  // Exit if no character is specified.
      }

      // Move the character to the target position.
      // @ts-ignore
      world.transform.setLocalPosition(playerEntity, position)
    })
  },
  tick: (world, component) => {
    // This component doesn't need to do anything on every frame.
  },
  remove: (world, component) => {
  },
})

export {
  WarpCharacter,
}
