// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

const ShieldStaminaModifier = ecs.registerComponent({
  name: 'shield-stamina-modifier',
  schema: {
    // Add data that can be configured on the component.
    value: ecs.f32,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
    value: 1.0,
  },
})

const AttackStaminaModifier = ecs.registerComponent({
  name: 'attack-stamina-modifier',
  schema: {
    // Add data that can be configured on the component.
    value: ecs.f32,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
    value: 1.0,
  },
})

const getStaminaRegenModifier = (world: ecs.World, eid: ecs.Eid) => (
  (ShieldStaminaModifier.has(world, eid) ? ShieldStaminaModifier.get(world, eid).value : 1.0) *
  (AttackStaminaModifier.has(world, eid) ? AttackStaminaModifier.get(world, eid).value : 1.0)
)

export {
  ShieldStaminaModifier,
  AttackStaminaModifier,
  getStaminaRegenModifier,
}
