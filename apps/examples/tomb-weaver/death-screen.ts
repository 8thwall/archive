// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

let fadeDirection = 0
let deathTimer = 0.0
let hasDied = false

ecs.registerComponent({
  name: 'death-screen',
  schema: {
    resetButton: ecs.eid,
  },
  schemaDefaults: {
  },
  data: {
  },
  add: (world, component) => {
    const {schemaAttribute, eid} = component
    world.events.addListener(world.events.globalId, 'playerDie', () => {
      hasDied = true
      world.transform.setLocalPosition(eid, {x: 0, y: 0, z: 4})
    })
    world.events.addListener(schemaAttribute.get(eid).resetButton, ecs.input.UI_CLICK, () => {
      hasDied = false
      fadeDirection = -1
      world.events.dispatch(world.events.globalId, 'resetGame')
    })
    world.transform.setLocalPosition(eid, {x: 0, y: 0, z: -1})
    ecs.Ui.set(world, eid, {opacity: 0.0})
  },
  tick: (world, component) => {
    if (hasDied) {
      deathTimer += world.time.delta
      if (deathTimer > 1500.0) {
        fadeDirection = 1
      }
    }
    const currentOpacity = ecs.Ui.get(world, component.eid).opacity
    const newOpacity = Math.min(1.0, Math.max(0, currentOpacity + 0.01 * fadeDirection))
    ecs.Ui.set(world, component.eid, {
      opacity: newOpacity,
    })
    if (newOpacity === 1 && fadeDirection === 1) {
      fadeDirection = 0
      world.events.dispatch(world.events.globalId, 'finishedFadeIn')
    }
    if (newOpacity === 0 && fadeDirection === -1) {
      fadeDirection = 0
      world.transform.setLocalPosition(component.eid, {x: 0, y: 0, z: -1})
    }
  },
  remove: (world, component) => {
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    ecs.defineState('default').initial()
  },
})
