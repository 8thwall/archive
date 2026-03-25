import * as ecs from '@8thwall/ecs'

const FROM_MILLI = 1 / 1000

type QueuedEvent = {
  target: ecs.Eid;
  currentTarget: ecs.Eid;
  'name': string;
  data: any;
};

const collisionSet = new Set<ecs.Eid>()

const handleCollisionStart = (e: QueuedEvent) => {
  const otherEid = e.data.other
  collisionSet.add(otherEid)
}

const handleCollisionEnd = (e: QueuedEvent) => {
  const otherEid = e.data.other
  collisionSet.delete(otherEid)
}

ecs.registerComponent({
  name: 'Conveyor Belt',
  schema: {
    direction: ecs.string,
    force: ecs.f32,
  },
  schemaDefaults: {
    direction: 'forwards',
    force: 5,  // N
  },
  data: {
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        world.events.addListener(eid, ecs.physics.COLLISION_START_EVENT, handleCollisionStart)
        world.events.addListener(eid, ecs.physics.COLLISION_END_EVENT, handleCollisionEnd)
      })
      .onTick(() => {
        const {force, direction} = schemaAttribute.get(eid)

        // Default to forwards
        const directionVal = (direction === 'backwards') ? -1 : 1

        const {offsetX} = ecs.Material.get(world, eid)
        const animationMultiplier = 0.1
        const deltaOffset = animationMultiplier * -directionVal * force * world.time.delta * FROM_MILLI

        ecs.Material.set(world, eid, {offsetX: offsetX + deltaOffset})

        const updateCollisions = () => {
          collisionSet.forEach((item) => {
            ecs.physics.applyForce(world, item, force * directionVal, 0, 0)
          })
        }

        updateCollisions()
      })
      .onExit(() => {
        world.events.removeListener(eid, ecs.physics.COLLISION_START_EVENT, handleCollisionStart)
        world.events.removeListener(eid, ecs.physics.COLLISION_END_EVENT, handleCollisionEnd)
      })
  },
})
