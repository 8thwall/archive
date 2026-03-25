// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

import {getData} from './local-storage'
import {adjustStat, CharacterStats} from './character-stats'
import {MovementController} from './movement-controller'

ecs.registerComponent({
  name: 'inventory-controller',
  schema: {
    // Add data that can be configured on the component.
    goldUi: ecs.eid,
    character: ecs.eid,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
  },
  data: {
    // Add data that cannot be configured outside of the component.
  },
  add: (world) => {
    world.events.dispatch(world.events.globalId, 'DATA_CHANGED')
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('initial').initial().listen(world.events.globalId, 'DATA_CHANGED', () => {
      const schema = schemaAttribute.get(eid)
      const {goldUi, character} = schema
      const stats = CharacterStats.get(world, character)
      const {maxHealth} = stats
      const data = getData()
      world.time.setTimeout(() => { ecs.Ui.set(world, goldUi, {text: data.gold.toString()}) }, 300)
      const savedHealth = data.health ? data.health + 100 : 100
      if (savedHealth !== maxHealth) {
        adjustStat(world, schemaAttribute.get(eid).character, 'maxHealth', savedHealth, true)
        adjustStat(world, schemaAttribute.get(eid).character, 'health', savedHealth)
      }
      const {attackDamage} = MovementController.get(world, character)
      if (data.attack + 35 !== attackDamage) {
        MovementController.set(world, character, {attackDamage: data.attack + 35})
      }
    })
  },
})
