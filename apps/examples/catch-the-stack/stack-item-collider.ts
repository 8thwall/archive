import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

import {GameEvents} from './event-ids'
import {GlobalStackHeight} from './global-stack-height'

const StackItemCollider = ecs.registerComponent({
  name: 'StackItemCollider',
  schema: {
    bottomBun: ecs.eid,
    // @enum Patty, Tomato, Lettuce, Cheese, TopBun
    ingredientType: ecs.string,
  },
  data: {},
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    if (!dataAttribute) {
      return
    }
    const stackTopTrigger = ecs.defineTrigger()
    const handleStackTopTrigger = () => {
      stackTopTrigger.trigger()
    }

    const stackBelowTrigger = ecs.defineTrigger()

    const handleCollide = (event: any) => {
      world.events.dispatch(event.data.other, 'hit', {fallingEid: eid})
    }

    const handleHit = (event: any) => {
      const {fallingEid} = event.data
      const topPos = ecs.Position.get(world, eid)
      const height = 2  // Hardcoded ingredient height?
      ecs.Collider.set(world, fallingEid, {
        type: ecs.ColliderType.Static,
      })

      const {bottomBun} = schemaAttribute.cursor(eid)
      const newStackHeightLocal = topPos.y + height
      const newStackHeight = newStackHeightLocal * ecs.Scale.get(world, bottomBun).x
      const randomXOffset = Math.random() * 0.5
      const randomZOffset = Math.random() * 0.5

      ecs.Position.set(world, fallingEid, {
        x: randomXOffset,
        y: newStackHeightLocal,
        z: randomZOffset,
      })
      ecs.Scale.set(world, fallingEid, {x: 1, y: 1, z: 1})  // Reset scale to avoid scaling issues

      GlobalStackHeight.updateStackHeight(newStackHeight)

      // This is so the ingredients are anchored to the bun
      world.setParent(fallingEid, bottomBun)

      world.events.dispatch(fallingEid, 'stack top')
      if (StackItemCollider.get(world, fallingEid).ingredientType === 'TopBun') {
        world.events.dispatch(world.events.globalId, 'TopBunCaught')
      } else {
        world.events.dispatch(world.events.globalId, GameEvents.INGREDIENT_CAUGHT,
          {item: StackItemCollider.get(world, fallingEid).ingredientType})
      }

      stackBelowTrigger.trigger()
    }

    const fallingState = ecs.defineState('falling')
      .listen(eid, ecs.physics.COLLISION_START_EVENT, handleCollide)
      .listen(eid, 'stack top', handleStackTopTrigger)
      .onTrigger(stackTopTrigger, 'stackTop')

    const stackTopState = ecs.defineState('stackTop')
      .listen(eid, 'hit', handleHit)
      .onTrigger(stackBelowTrigger, 'stackBelow')
      .onEvent(GameEvents.RESET_FALLING_STATE, 'falling')

    const stackBelowState = ecs.defineState('stackBelow')
      .onEnter(() => {
        ecs.Collider.set(world, eid, {
          eventOnly: true,  // Only trigger events, no physics
        })
      })
      .onExit(() => {
        // do something?
      })
      .onEvent(GameEvents.RESET_BASE_OF_STACK, 'stackTop')  // only for bottom bun
      .onEvent(GameEvents.RESET_FALLING_STATE, 'falling')

    // Only bottom bun starts from the stackTopState as it's never falling.
    if (eid === schemaAttribute.cursor(eid).bottomBun) {
      stackTopState.initial()
    } else {
      fallingState.initial()
    }

    const deleteSelf = () => {
      world.deleteEntity(eid)
      world.events.removeListener(eid, GameEvents.GO_BACK_TO_MAIN_MENU, deleteSelf)
    }

    ecs.defineStateGroup().listen(world.events.globalId, GameEvents.GO_BACK_TO_MAIN_MENU, deleteSelf)
  },
  add: (world, component) => {
  },
  remove: (world, component) => {
  },
})

export {StackItemCollider}
