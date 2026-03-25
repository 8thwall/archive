import * as ecs from '@8thwall/ecs'
import {PlayAudio} from './AudioController'

ecs.registerComponent({
  name: 'gameManager',
  data: {
    onFloor: ecs.boolean,  // boolean to tell if model is on floor
  },
  stateMachine: ({world, eid, dataAttribute}) => {
    // Here we are defining our start state and setting it to be our initial state on launch
    ecs.defineState('startGame').initial()
    // listening for interact on world.events.globalId to transition to inGame state
      .onEvent('interact', 'inGame', {target: world.events.globalId})
      .onEnter(() => {  // This occurs when we first enter the state
      // set up interaction event function
        world.events.addListener(eid, ecs.input.SCREEN_TOUCH_START, () => {
          world.events.dispatch(eid, 'interact')
        })
      })
      .onExit(() => {  // This occurs when we exit the state
        //  remove interaction event function
        world.events.removeListener(eid, ecs.input.SCREEN_TOUCH_START, () => {
          world.events.dispatch(eid, 'interact')
        })
        world.events.dispatch(eid, 'startGame')  // start game
        world.events.dispatch(eid, 'startUI')  // temp start game for bug
        world.events.dispatch(eid, 'jump')  // make user jump
      })
    ecs.defineState('inGame')  // Here we are defining our inGame state
    // listening for interact on world.events.globalId to transition to afterGame state
      .onEvent('gameOver', 'afterGame', {target: world.events.globalId})
      .onEnter(() => {  // This occurs when we first enter the state
      // listen for interact event
        world.events.addListener(world.events.globalId, 'interact', () => {
          world.events.dispatch(eid, 'jump')
        })
        // set up interaction event function
        world.events.addListener(eid, ecs.input.SCREEN_TOUCH_START, () => {
          world.events.dispatch(eid, 'interact')
        })
      })
      .onExit(() => {
        // clean up interact event
        world.events.removeListener(world.events.globalId, 'interact', () => {
          world.events.dispatch(eid, 'jump')
        })
        // clean up interaction event function
        world.events.removeListener(eid, ecs.input.SCREEN_TOUCH_START, () => {
          world.events.dispatch(eid, 'interact')
        })
      })
    ecs.defineState('afterGame')  // Here we are defining our afterGame state
    // listening for interact on world.events.globalId to transition to startGame state
      .onEvent('interact', 'startGame',
      // we are checking if for onFloor to make sure it is on the floor before we start
        {beforeTransition: () => !dataAttribute.cursor(eid).onFloor, target: world.events.globalId})
      .onEnter(() => {  // This occurs when we first enter the state
        // play Game Over Audio
        PlayAudio(world, eid)
        // Add a global event listener for an 'onFloor' game event
        world.events.addListener(world.events.globalId, 'onFloor', () => {
          dataAttribute.cursor(eid).onFloor = true
        })
        // set up interaction event function
        world.events.addListener(eid, ecs.input.SCREEN_TOUCH_START, () => {
          world.events.dispatch(eid, 'interact')
        })
      })
      .onExit(() => {
        dataAttribute.cursor(eid).onFloor = false
        world.events.dispatch(eid, 'restart')
        // Remove a global event listener for an 'offFloor' game event
        world.events.removeListener(world.events.globalId, 'onFloor', () => {
          dataAttribute.cursor(eid).onFloor = true
        })
        // clean up interaction event function
        world.events.removeListener(eid, ecs.input.SCREEN_TOUCH_START, () => {
          world.events.dispatch(eid, 'interact')
        })
      })
  },
  add: (world, component) => {
    component.dataAttribute.cursor(component.eid).onFloor = true
  },
  tick: (world, component) => {  // Lifecycle Tick - Code to run every game frame that is rendered
    // Check for user input
    if (world.input.getKeyDown('Space')) {  // If the space key is pressed down this frame...
      world.events.dispatch(component.eid, 'interact')
    }
  },
})
