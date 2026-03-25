// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

type QueuedEvent = {
  target: ecs.Eid;
  currentTarget: ecs.Eid;
  'name': string;
  data: any;
};

ecs.registerComponent({
  name: 'static-to-dynamic-collider',
  schema: {
  },
  schemaDefaults: {
  },
  data: {
  },
  stateMachine: ({world, eid, dataAttribute}) => {
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        const handleCollision = (e: QueuedEvent) => {
          ecs.Collider.set(world, eid, {
            mass: 1,
          })

          ecs.physics.setLinearVelocity(world, eid, 0, 3, -25)

          ecs.PositionAnimation.remove(world, eid)

          const sound = world.createEntity()
          ecs.Audio.set(world, sound, {
            url: 'assets/oof1.mp3',
            paused: false,
            positional: false,
          })
        }

        world.events.addListener(eid, ecs.physics.COLLISION_START_EVENT, handleCollision)
      })
  },
})
