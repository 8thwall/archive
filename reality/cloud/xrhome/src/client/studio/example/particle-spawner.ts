import ecs from '@ecs/runtime'

import {DeleteAfter} from './delete-after'
import {DisplayContact} from './display-contact'

const tempMatrix = ecs.math.mat4.i()

ecs.registerComponent({
  name: 'particle-spawner',
  schema: {
    interval: ecs.i32,
    radius: ecs.f32,
    physics: ecs.boolean,
    disablePhysicsAfter: ecs.i32,
  },
  data: {lastParticle: ecs.f32},
  tick: (world, component) => {
    const nextParticle = component.data.lastParticle + component.schema.interval
    if (world.time.elapsed > nextParticle) {
      component.data.lastParticle = world.time.elapsed
      const newEntity = world.createEntity()
      const radius = component.schema.radius || 0.5
      ecs.SphereGeometry.set(world, newEntity, {
        radius,
      })
      ecs.Material.set(world, newEntity, {r: 255, g: 255, b: 255, textureSrc: ''})
      DeleteAfter.set(world, newEntity, {ms: 10 * 1000})
      world.getWorldTransform(component.eid, tempMatrix)
      world.setTransform(newEntity, tempMatrix)
      world.setScale(newEntity, 1, 1, 1)

      if (component.schema.physics) {
        DisplayContact.reset(world, newEntity)
        ecs.Collider.set(world, newEntity, {
          radius,
          mass: 1.55,
          shape: ecs.physics.ColliderShape.Sphere,
        })

        if (component.schema.disablePhysicsAfter) {
          world.time.setTimeout(() => {
            ecs.Collider.remove(world, newEntity)
          }, component.schema.disablePhysicsAfter)
        }
      }
    }
  },
})
