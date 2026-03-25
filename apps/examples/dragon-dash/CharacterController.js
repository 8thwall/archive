import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library
import {PlayAudio} from './AudioController'  // Import the custom PlayAudio helper function

// Character Controller Component
// Handles control of the player character
ecs.registerComponent({
  name: 'characterController',
  schema: {
    jumpForce: ecs.f32,  // Jump Force as a 32-bit floating point number
    character: ecs.eid,  // Character Model entity reference via its entity ID
    activeGravityFactor: ecs.f32,  // A constant for the gravity factor when the player is active
  },
  schemaDefaults: {
    jumpForce: 28,
    activeGravityFactor: 8,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const {jumpForce, character, activeGravityFactor} = schemaAttribute.get(eid)
    let resetJumpTimeout
    // Jump Function for user interactivity
    const makeJump = () => {
    // sets a constant linear velocity so jump is the same every time
      ecs.physics.setLinearVelocity(world, eid, 0, jumpForce, 0)
      ecs.GltfModel.set(world, character, {  // Set Model Animation to idle as a quick reset
        animationClip: 'Flying_Idle',
      })
      resetJumpTimeout = world.time.setTimeout(() => {  // Create Timeout for the jump animation
        ecs.GltfModel.set(world, character, {  // Play jump animation
          animationClip: 'Flying_Fast',
          loop: false,
          timeScale: 2,
        })
      }, 10)
      PlayAudio(world, eid)  // Play jump audio
    }
    ecs.defineState('start').initial()  // Defining initial state
      .onEvent('startGame', 'inGame', {target: world.events.globalId})
      .onEnter(() => {
        // Setting the gravity factor to 0 so the dragon floats in his idle state
        ecs.Collider.set(world, eid, {
          gravityFactor: 0,
        })
        world.setPosition(eid, 0, 0, 0)  // Resetting Dragon to the origin for game start
        ecs.GltfModel.set(world, character, {  // Setting Dragon Idle animation
          animationClip: 'Flying_Idle',
          loop: true,
          timeScale: 1,
        })
      })
    ecs.defineState('inGame')  // Defining out inGame state
    // listening for gameOver on world.events.globalId to transition to dead state
      .onEvent('gameOver', 'dead', {target: world.events.globalId})
      .onEnter(() => {
        // Adding in Gravity to the active Gravity Factor
        ecs.Collider.set(world, eid, {
          gravityFactor: activeGravityFactor,
        })
        // adding event listener for the jump event
        world.events.addListener(world.events.globalId, 'jump', makeJump)
      })
      .onExit(() => {
        // removing our jump event listener to clean up
        world.events.removeListener(world.events.globalId, 'jump', makeJump)
        // clearing out our timeout just in case end game occurs durint the 10 ms
        world.time.clearTimeout(resetJumpTimeout)
      })
    ecs.defineState('dead')  // Defining out inGame state
      .onEvent('restart', 'start', {target: world.events.globalId})
      .onEnter(() => {
        // Setting Dragon Death animation
        ecs.GltfModel.set(world, character, {
          animationClip: 'Death',
          loop: false,
          timeScale: 0.6,
        })
      })
  },
})
