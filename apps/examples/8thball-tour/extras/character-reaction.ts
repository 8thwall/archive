import * as ecs from '@8thwall/ecs'

type QueuedEvent = {
  target: ecs.Eid;
  currentTarget: ecs.Eid;
  'name': string;
  data: any;
};

ecs.registerComponent({
  name: 'Character React',
  schema: {
  },
  schemaDefaults: {
  },
  data: {
    isReacting: ecs.boolean,
  },
  stateMachine: ({world, eid, dataAttribute}) => {
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        const handleCollision = (e: QueuedEvent) => {
          ecs.GltfModel.set(world, eid, {
            animationClip: 'HitReact',
            loop: false,
          })
        }

        const handleCollisionEnd = (e: QueuedEvent) => {
          world.time.setInterval(() => {
            ecs.GltfModel.set(world, eid, {
              animationClip: 'Idle',
              loop: true,
            })
          }, 1000)
        }

        world.events.addListener(eid, ecs.physics.COLLISION_START_EVENT, handleCollision)
        world.events.addListener(eid, ecs.physics.COLLISION_END_EVENT, handleCollisionEnd)
      })
  },
})
