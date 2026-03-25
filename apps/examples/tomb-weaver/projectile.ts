// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.
// @ts-ignore

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

import {Damage} from './damage'

const Projectile = ecs.registerComponent({
  name: 'projectile',
  schema: {
    // Add data that can be configured on the component.
    // @enum left, right, up, down
    direction: ecs.string,
    speed: ecs.f32,
    physicalDamage: ecs.i32,
    staminaDamage: ecs.i32,
    x: ecs.f32,
    y: ecs.f32,
    z: ecs.f32,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
    speed: 0.01,
    physicalDamage: 0,
    staminaDamage: 0,
  },
  data: {
    // Add data that cannot be configured outside of the component.
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('flying')
      .initial().onEnter(() => {
        const {x, y, z, physicalDamage, staminaDamage} = schemaAttribute.get(eid)
        ecs.Position.set(world, eid, {x, y, z})
        // Runs when the component is added to the world.
        ecs.Material.set(world, eid, {r: 255, b: 255})
        ecs.BoxGeometry.set(world, eid, {width: 0.25, height: 0.25, depth: 0.25})
        ecs.Collider.set(world, eid, {
          eventOnly: true,
          shape: ecs.ColliderShape.Box,
          width: 0.25,
          height: 0.25,
          depth: 0.25,
        })
        Damage.set(world, eid, {
          physical: physicalDamage,
          stamina: staminaDamage,
        })
      })
      .onTick(() => {
        const {direction, speed} = schemaAttribute.get(eid)
        const delta = world.time.delta * 0.12
        const move = delta * speed
        ecs.Position.mutate(world, eid, (cursor) => {
          switch (direction) {
            case ('left'): {
              cursor.x -= move
              break
            }
            case ('right'): {
              cursor.x += move
              break
            }
            case ('up'): {
              cursor.z -= move
              break
            }
            case ('down'): {
              cursor.z += move
              break
            }
            default: {
              break
            }
          }
        })
      })
  },
})

export {
  Projectile,
}
