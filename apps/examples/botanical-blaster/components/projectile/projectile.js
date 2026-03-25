import {ColliderData} from '../collider-data'
import * as ecs from '@8thwall/ecs'

const fps60 = 16.67
const Projectile = ecs.registerComponent({
  name: 'Projectile',
  schema: {
    lifeTime: ecs.f32,
    forceTime: ecs.f32,
    speed: ecs.f32,
    mass: ecs.f32,
    directionX: ecs.f32,
    directionY: ecs.f32,
    directionZ: ecs.f32,
  },
  schemaDefaults: {},
  data: {start: ecs.f64, last: ecs.f64},
  add: (world, component) => {
    component.data.start = world.time.absolute
    component.data.last = world.time.absolute
    const {eid} = component
    const collisionListener = (event) => {
      const colliderData = ColliderData.get(world, event.data.other)
      if (!colliderData) return
      const {despawnProjectie} = colliderData
      if (despawnProjectie) world.deleteEntity(eid)
    }

    world.events.addListener(
      component.eid,
      ecs.physics.COLLISION_START_EVENT,
      collisionListener
    )
  },
  remove: (world, component) => {},
  tick: (world, component) => {
    const delta = world.time.absolute - component.data.last
    const ratio = delta / fps60
    if (
      world.time.absolute <
      component.data.start + component.schema.forceTime
    ) {
      ecs.physics.applyForce(
        world,
        component.eid,
        component.schema.directionX * (component.schema.speed * ratio),
        component.schema.directionY * (component.schema.speed * ratio) +
          component.schema.mass * 9.81,
        component.schema.directionZ * (component.schema.speed * ratio)
      )
    }
    if (
      world.time.absolute >
      component.data.start + component.schema.lifeTime
    ) {
      world.deleteEntity(component.eid)
    }
    component.data.last = world.time.absolute
  },
})

export {Projectile}
