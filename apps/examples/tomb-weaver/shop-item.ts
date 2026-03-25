// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

import {getData, saveData} from './local-storage'
import type {ActionEvent} from './input-controller'

ecs.registerComponent({
  name: 'shop-item',
  schema: {
    // Add data that can be configured on the component.
    // @enum health, damage
    upgrade: ecs.string,
    itemLabel: ecs.eid,
    itemCost: ecs.eid,
    notEnoughGold: ecs.eid,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
    upgrade: 'health',
  },
  data: {
    // Add data that cannot be configured outside of the component.
  },
  add: (world, component) => {
    const {schema} = component
    const {notEnoughGold} = schema
    ecs.Hidden.set(world, notEnoughGold, {})
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const activateItem = ecs.defineTrigger()
    const disableItem = ecs.defineTrigger()
    const inactive = ecs.defineState('inactive').initial().onTrigger(activateItem, 'active')
    const active = ecs.defineState('active')
      .onTrigger(disableItem, 'inactive')
      .onEnter(() => {
        const schema = schemaAttribute.get(eid)
        const {itemLabel, itemCost, notEnoughGold} = schema
        ecs.Ui.set(world, itemLabel, {color: '#ffff00'})
        ecs.Ui.set(world, itemCost, {color: '#ffff00'})
        const {gold} = getData()
        if (gold < 100) {
          ecs.Hidden.remove(world, notEnoughGold)
        }
      }).onExit(() => {
        const schema = schemaAttribute.get(eid)
        const {itemLabel, itemCost, notEnoughGold} = schema
        ecs.Ui.set(world, itemLabel, {color: '#ffffff'})
        ecs.Ui.set(world, itemCost, {color: '#ffffff'})
        ecs.Hidden.set(world, notEnoughGold, {})
      })
      .listen(world.events.globalId, 'actionStart', (e) => {
        const schema = schemaAttribute.get(eid)
        const {upgrade} = schema
        const {gold} = getData()
        const data = e.data as ActionEvent
        if (data.action === 'attack' && gold >= 100) {
          if (upgrade === 'health') {
            console.log('buying health')
            saveData({gold: -100, health: 10}, true)
          } else if (upgrade === 'damage') {
            saveData({gold: -100, attack: 1}, true)
          }
          world.events.dispatch(world.events.globalId, 'DATA_CHANGED')
        }
      })

    inactive.listen(eid, ecs.physics.COLLISION_START_EVENT, () => {
      activateItem.trigger()
    })

    active.listen(eid, ecs.physics.COLLISION_END_EVENT, () => {
      disableItem.trigger()
    })
  },
})
