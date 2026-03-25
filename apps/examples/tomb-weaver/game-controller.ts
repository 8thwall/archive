// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

import {CharacterStats} from './character-stats'
import {StatBarController} from './stat-bar-controller'

import {StatBars} from './stat-bars'

const statBarSystem = ecs.defineSystem([CharacterStats, StatBars],
  (world, eid, [stats, statBars]) => {
    if (statBars.health !== BigInt(0)) {
      StatBarController.mutate(world, (statBars as any).health, (data) => {
        data.value = Math.max(0, (stats as any).health)
        data.maxValue = (stats as any).maxHealth
      })
    }

    if (statBars.stamina !== BigInt(0)) {
      StatBarController.mutate(world, (statBars as any).stamina, (data) => {
        data.value = Math.max(0, (stats as any).stamina)
        data.maxValue = (stats as any).maxStamina
      })
    }
  })

ecs.registerBehavior(statBarSystem)

ecs.registerComponent({
  name: 'game-controller',
  schema: {
    // Add data that can be configured on the component.
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
  },
  data: {
    // Add data that cannot be configured outside of the component.
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
