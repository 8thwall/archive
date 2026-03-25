import * as ecs from '@8thwall/ecs'

const EPSILON = 0.001

type QueuedEvent = {
  target: ecs.Eid;
  currentTarget: ecs.Eid;
  'name': string;
  data: any;
};

let collisionHappening = false

ecs.registerComponent({
  name: 'Bounce Pad',
  schema: {
    diameter: ecs.f32,
    jumpForce: ecs.f32,
  },
  schemaDefaults: {
    diameter: 2.5,  // meters
    jumpForce: 10.0,
  },
  data: {
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        // Set the size on creation
        const {diameter, jumpForce} = schemaAttribute.get(eid)
        const currentScale = ecs.Scale.get(world, eid)
        if (Math.abs(currentScale.x - diameter) > EPSILON || Math.abs(currentScale.z - diameter) > EPSILON) {
          const data = {x: diameter, y: currentScale.y, z: diameter}
          ecs.Scale.set(world, eid, data)
        }

        const handleCollision = (e: QueuedEvent) => {
          if (collisionHappening) {
            return
          }

          const otherEid = e.data.other
          ecs.physics.applyImpulse(world, otherEid, 0, jumpForce, 0)

          const durationMs = 2000
          collisionHappening = true

          const sound = world.createEntity()
          ecs.Audio.set(world, sound, {
            url: 'assets/audio/boing.mp3',
            paused: false,
            positional: false,
          })

          ecs.ScaleAnimation.set(world, eid, {
            fromX: diameter,
            fromY: currentScale.y,
            fromZ: diameter,
            toX: diameter + 1,
            toY: currentScale.y,
            toZ: diameter + 1,
            duration: durationMs,
            loop: false,
            easeOut: true,
            easingFunction: 'Elastic',
          })

          setTimeout(() => {
            const resturnDurationMs = 1000
            ecs.ScaleAnimation.set(world, eid, {
              autoFrom: true,
              toX: diameter,
              toY: currentScale.y,
              toZ: diameter,
              duration: resturnDurationMs,
              loop: false,
            })
            world.deleteEntity(sound)
            collisionHappening = false
          }, durationMs)
        }

        world.events.addListener(eid, ecs.physics.COLLISION_START_EVENT, handleCollision)
      })
  },
})
