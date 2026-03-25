// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.
import {SimpleButton} from './ui/simple-button'

const GameUI = ecs.registerComponent({
  name: 'game-ui',
  schema: {
    // Add data that can be configured on the component.
    logo: ecs.eid,
    startButton: ecs.eid,
    restartButton: ecs.eid,
    turnCCWButton: ecs.eid,
    turnCWButton: ecs.eid,
    moveForwardButton: ecs.eid,
    moveBackwardButton: ecs.eid,
    attackButton: ecs.eid,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
  },
  data: {
    // Add data that cannot be configured outside of the component.
  },
  add: (world, component) => {
    // Runs when the component is added to the world.
    const {eid, schema} = component

    // Disable game UI buttons
    SimpleButton.set(world, schema.turnCCWButton, {toDisable: true})
    SimpleButton.set(world, schema.turnCWButton, {toDisable: true})
    SimpleButton.set(world, schema.moveForwardButton, {toDisable: true})
    SimpleButton.set(world, schema.moveBackwardButton, {toDisable: true})
    SimpleButton.set(world, schema.attackButton, {toDisable: true})

    SimpleButton.set(world, schema.startButton, {toEnable: true})
    SimpleButton.set(world, schema.restartButton, {toDisable: true})

    world.events.addListener(world.events.globalId, 'start_game', (e) => {
      // Hide logo
      const {logo, startButton, restartButton} = GameUI.get(world, eid)
      ecs.Ui.set(world, logo, {opacity: 0})

      // Disable start buttons
      SimpleButton.set(world, startButton, {toDisable: true})
      SimpleButton.set(world, restartButton, {toDisable: true})

      // Enable game UI buttons
      SimpleButton.set(world, schema.turnCCWButton, {toEnable: true})
      SimpleButton.set(world, schema.turnCWButton, {toEnable: true})
      SimpleButton.set(world, schema.moveForwardButton, {toEnable: true})
      SimpleButton.set(world, schema.moveBackwardButton, {toEnable: true})
      SimpleButton.set(world, schema.attackButton, {toEnable: true})
    })

    world.events.addListener(world.events.globalId, 'game_over', (e) => {
    // Disable game UI buttons
      SimpleButton.set(world, schema.turnCCWButton, {toDisable: true})
      SimpleButton.set(world, schema.turnCWButton, {toDisable: true})
      SimpleButton.set(world, schema.moveForwardButton, {toDisable: true})
      SimpleButton.set(world, schema.moveBackwardButton, {toDisable: true})
      SimpleButton.set(world, schema.attackButton, {toDisable: true})

      SimpleButton.set(world, schema.restartButton, {toEnable: true})
    })

    world.events.addListener(world.events.globalId, 'victory', (e) => {
    // Disable game UI buttons
      SimpleButton.set(world, schema.turnCCWButton, {toDisable: true})
      SimpleButton.set(world, schema.turnCWButton, {toDisable: true})
      SimpleButton.set(world, schema.moveForwardButton, {toDisable: true})
      SimpleButton.set(world, schema.moveBackwardButton, {toDisable: true})
      SimpleButton.set(world, schema.attackButton, {toDisable: true})

      SimpleButton.set(world, schema.restartButton, {toEnable: true})
    })
  },
  tick: (world, component) => {
    // Runs every frame.
  },
  remove: (world, component) => {
    // Runs when the component is removed from the world.
  },
})

export {GameUI}
