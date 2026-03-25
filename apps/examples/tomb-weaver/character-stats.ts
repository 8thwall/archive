// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

import {getStaminaRegenModifier} from './stamina-modifiers'

const CharacterStats = ecs.registerComponent({
  name: 'character-stats',
  schema: {
    // Add data that can be configured on the component.
    maxHealth: ecs.i32,
    health: ecs.i32,
    maxStamina: ecs.i32,
    minStamina: ecs.i32,
    stamina: ecs.i32,
    staminaRegen: ecs.i32,
    maxPoise: ecs.i32,
    poise: ecs.i32,
    level: ecs.i32,
    speed: ecs.f32,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
    maxHealth: 100,
    health: 100,
    maxStamina: 80,
    minStamina: -50,
    stamina: 80,
    staminaRegen: 45,
    maxPoise: 100,
    poise: 100,
    level: 1,
    speed: 1.0,
  },
  data: {
    // Add data that cannot be configured outside of the component.
    staminaResidual: ecs.f32,
  },
  add: (world, component) => {
    // Runs when the component is added to the world.
  },
  tick: (world, component) => {
    const {eid, schema, data} = component

    const staminaRegenModifier = getStaminaRegenModifier(world, eid)
    const staminaRegen =
      data.staminaResidual + (staminaRegenModifier *
      schema.staminaRegen * world.time.delta) / 1000.0
    const staminaRegenInt = Math.floor(staminaRegen)
    if (staminaRegenInt > 0) {
      adjustStat(world, eid, 'stamina', staminaRegenInt)
    }
    data.staminaResidual = (staminaRegen - staminaRegenInt)
  },
  remove: (world, component) => {
    // Runs when the component is removed from the world.
  },
})

const maxStat = (stat: string) => `max${stat ? stat[0].toUpperCase() + stat.slice(1) : ''}`

const minStat = (stat: string) => `min${stat ? stat[0].toUpperCase() + stat.slice(1) : ''}`

const adjustStat = (world: ecs.World, eid: ecs.Eid, stat: string, value: number, set?: boolean) => {
  if (!CharacterStats.has(world, eid)) {
    return
  }
  CharacterStats.mutate(world, eid, (data) => {
    if (!(stat in data)) {
      console.error(`Unknown stat ${stat}`)  // eslint-disable-line
      return
    }
    if (set) {
      data[stat] = value
      return
    } else {
      data[stat] += value
    }
    if (!(stat.startsWith('max') || stat.startsWith('min'))) {
      data[stat] = Math.min(Math.max(data[stat], data[minStat(stat)] || 0), data[maxStat(stat)])
    }
  })
}

export {CharacterStats, adjustStat}
