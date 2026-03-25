import ecs from './helpers/runtime'
import {Character, CHARACTER_ACTIONS} from './character'

// Register the component with the ECS system
const CharacterControl = ecs.registerComponent({
  name: 'character-control',
  schema: {
    keyTurnCCW: ecs.string,
    keyTurnCW: ecs.string,
    keyMoveForward: ecs.string,
    keyMoveBackward: ecs.string,
    keyAttack: ecs.string,
    keyDie: ecs.string,
    keyReleasedTurnCCW: ecs.boolean,
    keyReleasedTurnCW: ecs.boolean,
    keyReleasedMoveForward: ecs.boolean,
    keyReleasedMoveBackward: ecs.boolean,
    keyReleasedAttack: ecs.boolean,
    keyReleasedDie: ecs.boolean,
    eventIDTurnCCW: ecs.string,
    eventIDTurnCW: ecs.string,
    eventIDMoveForward: ecs.string,
    eventIDMoveBackward: ecs.string,
    eventIDAttack: ecs.string,
    eventIDDie: ecs.string,
  },

  add: (world, component) => {
    const {eid, schema} = component

    const updateKeyState = (event, isPressed) => {
      // console.log(event.code, isPressed)
      const {keyTurnCCW, keyTurnCW, keyMoveForward, keyMoveBackward, keyAttack, keyDie} = CharacterControl.get(world, eid)
      if (isPressed) {
        return
      }

      switch (event.code) {
        case keyTurnCCW:
          CharacterControl.set(world, eid, {
            keyReleasedTurnCCW: true,
          })
          break

        case keyTurnCW:
          CharacterControl.set(world, eid, {
            keyReleasedTurnCW: true,
          })
          break

        case keyMoveForward:
          CharacterControl.set(world, eid, {
            keyReleasedMoveForward: true,
          })
          break

        case keyMoveBackward:
          CharacterControl.set(world, eid, {
            keyReleasedMoveBackward: true,
          })
          break

        case keyAttack:
          CharacterControl.set(world, eid, {
            keyReleasedAttack: true,
          })
          break

        case keyDie:
          CharacterControl.set(world, eid, {
            keyReleasedDie: true,
          })
          break

        default:
          break
      }
    }

    window.addEventListener('keydown', event => updateKeyState(event, true))
    window.addEventListener('keyup', event => updateKeyState(event, false))

    world.events.addListener(world.events.globalId, schema.eventIDTurnCCW, (e) => {
      Character.set(world, eid, {
        nextAction: CHARACTER_ACTIONS.TURN_CCW,
      })
    })

    world.events.addListener(world.events.globalId, schema.eventIDTurnCW, (e) => {
      Character.set(world, eid, {
        nextAction: CHARACTER_ACTIONS.TURN_CW,
      })
    })

    world.events.addListener(world.events.globalId, schema.eventIDMoveForward, (e) => {
      Character.set(world, eid, {
        nextAction: CHARACTER_ACTIONS.MOVE_FORWARD,
      })
    })

    world.events.addListener(world.events.globalId, schema.eventIDMoveBackward, (e) => {
      Character.set(world, eid, {
        nextAction: CHARACTER_ACTIONS.MOVE_BACKWARD,
      })
    })

    world.events.addListener(world.events.globalId, schema.eventIDAttack, (e) => {
      Character.set(world, eid, {
        nextAction: CHARACTER_ACTIONS.ATTACK,
      })
    })

    world.events.addListener(world.events.globalId, schema.eventIDDie, (e) => {
      Character.set(world, eid, {
        dying: true,
      })
    })
  },

  tick: (world, component) => {
    const {schema, eid} = component

    if (schema.keyReleasedTurnCCW) {
      Character.set(world, eid, {
        nextAction: CHARACTER_ACTIONS.TURN_CCW,
      })
    } else if (schema.keyReleasedTurnCW) {
      Character.set(world, eid, {
        nextAction: CHARACTER_ACTIONS.TURN_CW,
      })
    } else if (schema.keyReleasedMoveForward) {
      Character.set(world, eid, {
        nextAction: CHARACTER_ACTIONS.MOVE_FORWARD,
      })
    } else if (schema.keyReleasedMoveBackward) {
      Character.set(world, eid, {
        nextAction: CHARACTER_ACTIONS.MOVE_BACKWARD,
      })
    } else if (schema.keyReleasedAttack) {
      Character.set(world, eid, {
        nextAction: CHARACTER_ACTIONS.ATTACK,
      })
    } else if (schema.keyReleasedDie) {
      Character.set(world, eid, {
        dying: true,
      })
    }

    schema.keyReleasedTurnCCW = false
    schema.keyReleasedTurnCW = false
    schema.keyReleasedMoveForward = false
    schema.keyReleasedMoveBackward = false
    schema.keyReleasedAttack = false
    schema.keyReleasedDie = false
  },
})

export {CharacterControl}
