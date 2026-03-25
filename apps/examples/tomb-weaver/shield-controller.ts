// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

import {Action} from './input-controller'
import {ShieldStaminaModifier} from './stamina-modifiers'

const ShieldUp = ecs.registerComponent({name: 'shield-up'})

const ShieldController = ecs.registerComponent({
  name: 'shield-controller',
  schema: {
    // Add data that can be configured on the component.
    shield: ecs.eid,
    staminaModifier: ecs.f32,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
    staminaModifier: 0.2,
  },
  data: {
    // Add data that cannot be configured outside of the component.
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const shieldDown = ecs.defineState('shieldDown').initial()
    const shieldUp = ecs.defineState('shieldUp')

    shieldDown.onEnter(() => {
      const schema = schemaAttribute.cursor(eid)
      // ShieldUp.remove(world, schema.shieldHitbox)
      ShieldUp.remove(world, eid)
      // ecs.Disabled.set(world, schema.shield, {})
      // ecs.Hidden.set(world, schema.shieldModel, {})
      ecs.Position.set(world, schema.shield, {x: 0, y: 10, z: 0})
      // Needed to workaround issue where disabled leaves collider
      // ecs.Collider.remove(world, schema.shield)
    }).onEvent('actionStart', shieldUp, {
      where: ev => (ev.data as any).action === Action.Shield,
    })

    shieldUp.onEnter(() => {
      const schema = schemaAttribute.cursor(eid)

      // Regen slower when the shield is up.
      ShieldStaminaModifier.set(world, eid, {value: schema.staminaModifier})
      ecs.Position.set(world, schema.shield, {x: 0, y: -0.3, z: 0.34})
      // ShieldUp.set(world, schema.shieldHitbox)
      ShieldUp.set(world, eid)
      // ecs.Disabled.remove(world, schema.shield)
      // ecs.Hidden.remove(world, schema.shieldModel)
      // Needed to workaround issue where disabled leaves collider.
      //
      // ecs.Collider.set(world, schema.shield, {
      //   shape: ecs.ColliderShape.Box,
      //   width: 0.9,
      //   height: 0.5,
      //   depth: 0.3,
      //   eventOnly: true,
      // })
      //
    }).onExit(() => {
      // Remove sheild stamina regen modifier.
      ShieldStaminaModifier.set(world, eid, {value: 1.0})
      // ecs.Collider.remove(world, schema.shield)
    })
      .onEvent('actionEnd', shieldDown, {
        where: ev => (ev.data as any).action === Action.Shield,
      })
  },
  // add: (world, component) => {
  //   // Runs when the component is added to the world.
  // },
  // tick: (world, component) => {
  //   // Runs every frame.
  // },
  // remove: (world, component) => {
  //   // Runs when the component is removed from the world.
  // },
})

export {ShieldController, ShieldUp}
