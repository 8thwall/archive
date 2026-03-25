import ecs from './helpers/runtime'
import {Character, CHARACTER_ACTIONS} from './character'

// Register the component with the ECS system
const CharacterAI = ecs.registerComponent({
  name: 'character-ai',
  schema: {
    turnCCWChance: ecs.f32,
    turnCWChance: ecs.f32,
    moveForwardChance: ecs.f32,
    moveBackwardChance: ecs.f32,
    attackChance: ecs.f32,
    minActionCooldown: ecs.f32,
    maxActionCooldown: ecs.f32,
  },
  schemaDefaults: {
    turnCCWChance: 0.2,
    turnCWChance: 0.2,
    moveForwardChance: 0.3,
    moveBackwardChance: 0.1,
    attackChance: 0.2,
    minActionCooldown: 1000,
    maxActionCooldown: 4000,
  },
  data: {
    cooldown: ecs.f32,
    lastAction: ecs.f32,
  },

  add: (world, component) => {
    const {data, schema} = component
    data.lastAction = 0
    data.cooldown = schema.minActionCooldown + (Math.random() * (schema.maxActionCooldown - schema.minActionCooldown))
  },

  tick: (world, component) => {
    const {eid} = component
    const {schema} = component  // Use the keyState and schema from the component
    const {data} = component

    const nextAction = component.data.lastAction + data.cooldown
    if (world.time.elapsed > nextAction) {
      component.data.lastAction = world.time.elapsed
      data.cooldown = schema.minActionCooldown + (Math.random() * (schema.maxActionCooldown - schema.minActionCooldown))

      const rand = Math.random() * (schema.moveForwardChance + schema.moveBackwardChance +
        schema.turnCCWChance + schema.turnCWChance + schema.attackChance)

      if (rand < schema.moveForwardChance) {
        //console.log('f')
        Character.set(world, eid, {
          nextAction: CHARACTER_ACTIONS.MOVE_FORWARD,
        })
      } else if (rand < schema.moveForwardChance + schema.moveBackwardChance) {
        //console.log('b')
        Character.set(world, eid, {
          nextAction: CHARACTER_ACTIONS.MOVE_BACKWARD,
        })
      } else if (rand < schema.moveForwardChance + schema.moveBackwardChance + schema.turnCCWChance) {
        //console.log('l')
        Character.set(world, eid, {
          nextAction: CHARACTER_ACTIONS.TURN_CCW,
        })
      } else if (rand < schema.moveForwardChance + schema.moveBackwardChance + schema.turnCCWChance + schema.turnCWChance) {
        //console.log('r')
        Character.set(world, eid, {
          nextAction: CHARACTER_ACTIONS.TURN_CW,
        })
      } else {
        //console.log('attack')
        Character.set(world, eid, {
          nextAction: CHARACTER_ACTIONS.ATTACK,
        })
      }
    }
  },
})

export {CharacterAI}
