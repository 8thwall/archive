import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library

// Score Collider Component
// A Component attached to Score Colliders for handling adding points to the score
ecs.registerComponent({
  name: 'scoreCollider',
  schema: {
    characterContainer: ecs.eid,  // Character Container entity reference via its entity ID
    gameManager: ecs.eid,  // Game Manager entity reference via its entity ID
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('default').initial()  // creating the initial state
      .onEnter(() => {
        // The event reference contains info about the collision
        world.events.addListener(eid, ecs.physics.COLLISION_START_EVENT, (event) => {
          // If the other entity colliding with this one is the Character Container
          if (schemaAttribute.get(eid).characterContainer === event.data.other) {
            world.events.dispatch(eid, 'point')  // Emit the 'point' event from the Game Manager
          }
        })
      })
      .onExit(() => {
        // clean event
        world.events.removeListener(eid, ecs.physics.COLLISION_START_EVENT, (event) => {
          if (schemaAttribute.get(eid).characterContainer === event.data.other) {
            world.events.dispatch(eid, 'point')
          }
        })
      })
  },
})
