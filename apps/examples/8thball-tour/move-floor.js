import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'move-floor',
  schema: {
    floor: ecs.eid,
    player: ecs.eid,
    level: ecs.f32,
  },
  add: (world, component) => {
    world.events.addListener(component.eid, ecs.physics.COLLISION_START_EVENT, () => {
      ecs.PositionAnimation.set(world, component.schema.floor, {
        autoFrom: true,
        toX: 0,
        toZ: 0,
        toY: component.schema.level,
        duration: 3000,
        loop: true,
        reverse: true,
        easeIn: true,
        easeOut: true,
        easingFunction: 'circular',
      })
    })
  },
})
