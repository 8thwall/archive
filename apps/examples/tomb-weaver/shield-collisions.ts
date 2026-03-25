// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

import {Damage} from './damage'
import {Shield} from './shield'
import {CharacterStats, adjustStat} from './character-stats'
import {Projectile} from './projectile'

ecs.registerComponent({
  name: 'shield-collisions',
  schema: {
    // Add data that can be configured on the component.
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
  },
  data: {
    // Add data that cannot be configured outside of the component.
  },
  stateMachine: ({world, eid, dataAttribute, schemaAttribute}) => {
    const active = ecs.defineState('active')

    active.initial()

    active.listen(eid, ecs.physics.COLLISION_START_EVENT, (ev) => {
      const otherEid: ecs.Eid = (ev.data as any).other
      if (ev.target !== ev.currentTarget) {
        // Only consider events on the current target.
        return
      }
      if (Damage.has(world, otherEid) && world.getParent(otherEid) !== eid) {
        // TODO: this is the base damage, but should apply any modifiers.
        const {physical: physicalDamage, stamina: staminaDamage} = Damage.get(world, otherEid)

        // Assume the parent of a shield is the character holding the shield
        const shield = Shield.get(world, eid)
        const target = shield.owner
        const stabilityPct = shield.stability / 100.0
        const staminaDrain = Math.round(stabilityPct * staminaDamage)

        adjustStat(world, target, 'stamina', -staminaDrain)

        const stats = CharacterStats.get(world, target)

        let shieldBreak = 1.0
        if (stats.stamina <= 0) {
          // Shield had insufficient stamina.
          shieldBreak = 0.5
          Damage.set(world, otherEid, {
            // Set future damage to zero. We'll handle the partial damage below.
            physical: 0,
            stamina: 0,
            blocked: true,
            blockBroken: true,
          })
        } else {
          Damage.set(world, otherEid, {
            physical: 0,
            stamina: 0,
            blocked: true,
          })
        }

        const physicalBlockPct = (shieldBreak * shield.physicalBlock) / 100.0

        const damage = (1 - physicalBlockPct) * physicalDamage

        adjustStat(world, target, 'health', -damage)

        if (Projectile.has(world, otherEid)) {
          // TODO: reparent to character if you want things like arrows sticking to the target they hit.
          world.deleteEntity(otherEid)
        }
      }
    })
  },
  add: (world, component) => {
    // Runs when the component is added to the world.
  },
  tick: (world, component) => {
    // Runs every frame.
  },
  remove: (world, component) => {
    // Runs when the component is removed from the world.
  },
})
