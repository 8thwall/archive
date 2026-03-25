// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

import {Projectile} from './projectile'

ecs.registerComponent({
  name: 'turret',
  schema: {
    // Add data that can be configured on the component.
    physicalDamage: ecs.i32,
    staminaDamage: ecs.i32,
    // @enum left, right, up, down
    direction: ecs.string,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
    physicalDamage: 30,
    staminaDamage: 20,
    direction: 'left',
  },
  data: {
    // Add data that cannot be configured outside of the component.
  },
  add: (world, component) => {
    const {eid, schema} = component
    // Runs when the component is added to the world.
    world.time.setInterval(() => {
      const newProjectile = world.createEntity()
      const {x, y, z} = ecs.Position.get(world, eid)
      Projectile.set(world, newProjectile, {
        direction: schema.direction,
        x,
        y,
        z,
        physicalDamage: schema.physicalDamage,
        staminaDamage: schema.staminaDamage,
      })
    }, 2000)
  },
})
