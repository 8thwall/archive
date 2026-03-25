import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library

// UI Controller Component
// A Component attached to Score Colliders for handling adding points to the score
ecs.registerComponent({
  name: 'UIController',
  schema: {
    spaceTitle: ecs.eid,  // Space Title entity reference via its entity ID
    spaceRestart: ecs.eid,  // Space Restart entity reference via its entity ID
    tapTitle: ecs.eid,  // Tap Title entity reference via its entity ID
    tapRestart: ecs.eid,  // Tap Restart entity reference via its entity ID
    pointTitle: ecs.eid,  // Point Title entity reference via its entity ID
    pointValue: ecs.eid,  // Point Value entity reference via its entity ID
  },
  data: {
    isDesktop: ecs.boolean,  // Flag for whether the platform is computer desktop or mobile
    isFirstTime: ecs.boolean,  // Flag for whether it is the first jump input for the current game
    score: ecs.i32,  // Score as 32-bit integer
  },

  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    // create a point score function
    const scorePoint = () => {
      // Update the score value
      dataAttribute.cursor(eid).score += 1
      // And then the UI
      ecs.Ui.set(world, schemaAttribute.get(eid).pointValue,
        {text: dataAttribute.cursor(eid).score.toString()})
    }
    ecs.defineState('initialize').initial()  // creating the initial state
      .onEvent('startUI', 'inGame', {target: world.events.globalId})
      .onEnter(() => {
        // Add a global event listener for an 'isDesktop' event
        world.events.addListener(world.events.globalId, 'isDesktop', () => {
        // Show keyboard input for desktop and touch input for mobile
          dataAttribute.cursor(eid).isDesktop = true
          ecs.Ui.set(world, schemaAttribute.get(eid).tapTitle, {left: '-5000'})
          ecs.Ui.set(world, schemaAttribute.get(eid).spaceTitle, {left: '15'})
        })
        // Reset the score shown
        ecs.Ui.set(world, schemaAttribute.get(eid).pointValue, {text: '0'})
        dataAttribute.cursor(eid).score = 0
        dataAttribute.cursor(eid).isFirstTime = true
        // Hide the score
        ecs.Ui.set(world, schemaAttribute.get(eid).pointValue, {left: '-5000'})
        ecs.Ui.set(world, schemaAttribute.get(eid).pointTitle, {left: '-5000'})

        // Show keyboard input for desktop and touch input for mobile
        if (dataAttribute.cursor(eid).isDesktop) {
          ecs.Ui.set(world, schemaAttribute.get(eid).spaceTitle, {left: '15'})
          ecs.Ui.set(world, schemaAttribute.get(eid).spaceRestart, {right: '-5000'})
        } else {
          ecs.Ui.set(world, schemaAttribute.get(eid).tapTitle, {left: '15'})
          ecs.Ui.set(world, schemaAttribute.get(eid).tapRestart, {right: '-5000'})
        }
      })
      .onExit(() => {
        world.events.removeListener(world.events.globalId, 'isDesktop', () => {  // clean event
          dataAttribute.cursor(eid).isDesktop = true
          ecs.Ui.set(world, schemaAttribute.get(eid).tapTitle, {left: '-5000'})
          ecs.Ui.set(world, schemaAttribute.get(eid).spaceTitle, {left: '15'})
        })
        if (dataAttribute.cursor(eid).isFirstTime) {  // If it is the first jump...
        // Show the score
          ecs.Ui.set(world, schemaAttribute.get(eid).pointValue, {left: '32'})
          ecs.Ui.set(world, schemaAttribute.get(eid).pointTitle, {left: '16'})

          // Show keyboard input for desktop and touch input for mobile
          if (dataAttribute.cursor(eid).isDesktop) {
            ecs.Ui.set(world, schemaAttribute.get(eid).spaceTitle, {left: '-5000'})
          } else {
            ecs.Ui.set(world, schemaAttribute.get(eid).tapTitle, {left: '-5000'})
          }
          // Set the flag to false until game restarts
          dataAttribute.cursor(eid).isFirstTime = false
        }
      })
    ecs.defineState('inGame')
      .onEvent('gameOver', 'endGame', {target: world.events.globalId})
      .onEnter(() => {
        // Add a global event listener for a gain a 'point' event
        world.events.addListener(world.events.globalId, 'point', scorePoint)
      })
      .onExit(() => {
        world.events.removeListener(world.events.globalId, 'isDesktop', () => {  // clean event
          dataAttribute.cursor(eid).isDesktop = true
          ecs.Ui.set(world, schemaAttribute.get(eid).tapTitle, {left: '-5000'})
          ecs.Ui.set(world, schemaAttribute.get(eid).spaceTitle, {left: '15'})
        })
        world.events.removeListener(world.events.globalId, 'point', scorePoint)
      })
    ecs.defineState('endGame')
      .onEvent('restart', 'initialize', {target: world.events.globalId})
      .onEnter(() => {
        // Show keyboard input for desktop and touch input for mobile
        if (dataAttribute.cursor(eid).isDesktop) {
          ecs.Ui.set(world, schemaAttribute.get(eid).spaceRestart, {right: '15'})
        } else {
          ecs.Ui.set(world, schemaAttribute.get(eid).tapRestart, {right: '15'})
        }
      })
  },
  add: (world, component) => {
    // Initialize Data
    component.dataAttribute.cursor(component.eid).isDesktop = false
    component.dataAttribute.cursor(component.eid).isFirstTime = true
    component.dataAttribute.cursor(component.eid).score = 0
  },
})
