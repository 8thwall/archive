// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

import {GameEvents} from './event-ids'

ecs.registerComponent({
  name: 'audio-controller',
  schema: {
    // Schema for configuring audio clips for different game sounds
    itemCollectedSound: ecs.eid,
    streakBonusSound: ecs.eid,
    gameOverSound: ecs.eid,
    bgMusic: ecs.eid,
    introMusic: ecs.eid,
  },

  // Define the state machine for managing object-related audio events
  stateMachine: ({world, eid, schemaAttribute}) => {
    // Function to play a specific audio clip for the provided entity
    const PlayAudio = (entity: ecs.Eid) => {
      ecs.Audio.cursor(world, entity).paused = false  // Unpause the audio to play it
    }
    const StopAudio = (entity: ecs.Eid) => {
      ecs.Audio.cursor(world, entity).paused = true  // Unpause the audio to play it
    }

    // Functions to play specific sound effects
    const ItemCollectedSound = () => PlayAudio(schemaAttribute.cursor(eid).itemCollectedSound)
    const StreakBonusSound = () => PlayAudio(schemaAttribute.cursor(eid).streakBonusSound)
    const GameOverSound = () => PlayAudio(schemaAttribute.cursor(eid).gameOverSound)

    // Define the states of the game and transitions
    ecs.defineState('mainMenu')
      .initial()
      .onEvent('StartGame', 'mainScene', {target: world.events.globalId})
      .onEnter(() => {
        PlayAudio(schemaAttribute.cursor(eid).introMusic)
      })
      .onExit(() => {
        try {
          StopAudio(schemaAttribute.cursor(eid).introMusic)
        } catch (error) {
          // Ignore error.
        }
      })

    ecs.defineState('mainScene')
      .onEvent(GameEvents.GO_BACK_TO_MAIN_MENU, 'mainMenu', {target: world.events.globalId})
      .listen(world.events.globalId, 'ItemCollected', ItemCollectedSound)
      .listen(world.events.globalId, 'StreakBonus', StreakBonusSound)
      .listen(world.events.globalId, 'TopBunCaught', GameOverSound)
      .onEnter(() => {
        PlayAudio(schemaAttribute.cursor(eid).bgMusic)
      })
      .onExit(() => {
        StopAudio(schemaAttribute.cursor(eid).bgMusic)
      })
  },
})
