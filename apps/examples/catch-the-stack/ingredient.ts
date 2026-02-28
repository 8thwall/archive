import * as ecs from '@8thwall/ecs'

import {createEntityPool} from './entity-pool'
import {GameEvents} from './event-ids'
import {GlobalStackHeight} from './global-stack-height'
import {StackItemCollider} from './stack-item-collider'
import {isMobile} from './utils'

type IngredientType = 'Patty' | 'Tomato' | 'Lettuce' | 'Cheese' | 'Onion' | 'TopBun'
const TYPES: IngredientType[] = ['Patty', 'Tomato', 'Lettuce', 'Cheese', 'Onion', 'TopBun']

type ModelsType = {
  [key in IngredientType]: string
}

const TOP_BUN_CHANCE = 0.1

const MODEL_PATHS: ModelsType = {
  Patty: 'assets/Models/patty.glb',
  Lettuce: 'assets/Models/lettuce.glb',
  Tomato: 'assets/Models/tomato.glb',
  Cheese: 'assets/Models/cheese.glb',
  Onion: 'assets/Models/onion.glb',
  TopBun: 'assets/Models/bun-top.glb',
}

const INSTANCES_PER_TYPE = [7, 7, 7, 7, 7, 3]

const getRandomIngredientType = (): IngredientType => {
  const otherTotalWeight = 1 - TOP_BUN_CHANCE
  const otherWeightAverage = otherTotalWeight / (TYPES.length - 1)

  const ingredientWeights = TYPES.map(type => (
    type === 'TopBun' ? TOP_BUN_CHANCE : otherWeightAverage
  ))
  let randomValue = Math.random()

  for (let i = 0; i < ingredientWeights.length; i++) {
    randomValue -= ingredientWeights[i]
    if (randomValue <= 0) {
      return TYPES[i]
    }
  }

  return 'Patty'
}

const getIngredientSize = (): number => (isMobile() ? 0.14 : 0.2)

const createIngredientHandler = (world: ecs.World) => {
  const ingredientSize = getIngredientSize()
  const entityInit = (entity: ecs.Eid) => {
    ecs.Scale.set(world, entity, {x: ingredientSize, y: ingredientSize, z: ingredientSize})

    ecs.Collider.set(world, entity, {
      shape: ecs.ColliderShape.Box,
      width: 2 / ingredientSize,
      height: 0.6 / ingredientSize,
      depth: 2 / ingredientSize,
      mass: 1,
      lockXAxis: true,
      lockYAxis: true,
      lockZAxis: true,
      type: ecs.ColliderType.Dynamic,
    })
  }

  const entityPool = createEntityPool(
    world,
    TYPES,
    Object.values(MODEL_PATHS),
    INSTANCES_PER_TYPE,
    entityInit,
    true
  )

  /**
   * Function to instantiate a object.
   * This creates a parent entity with a collider and a child entity for the 3D model.
   * @param {object} world - The ECS world instance.
   * @returns {number} - The entity ID of the created parent entity.
   */
  const instantiateIngredient = (bottomBun: ecs.Eid) => {
    const ingredientType = getRandomIngredientType()  // Randomly select an ingredient type
    const entity = entityPool.getEntityFromPool(ingredientType)

    const maxItemHeight = GlobalStackHeight.getStackHeight()

    ecs.Position.set(world, entity, {
      x: Math.random() * 10 - 5,
      y: maxItemHeight + 15,
      z: 0,
    })

    entityInit(entity)

    ecs.physics.setLinearVelocity(world, entity, 0, 0, 0)

    StackItemCollider.set(world, entity, {bottomBun, ingredientType})

    // In case the recycled item is in a different StackItemColliderState
    world.events.dispatch(entity, GameEvents.RESET_FALLING_STATE)

    return entity
  }

  const resetIngredients = () => {
    const entityDeinit = (entity: ecs.Eid) => {
      if (StackItemCollider.has(world, entity)) {
        StackItemCollider.remove(world, entity)
      }

      ecs.Position.set(world, entity, {
        x: -10,
        y: -10,
        z: -10,
      })
    }

    entityPool.resetEntityPool(entityDeinit)
  }

  const cleanupIngredients = () => {
    entityPool.clearEntityPool()
  }

  return {
    instantiateIngredient,
    resetIngredients,
    cleanupIngredients,
  }
}

export {createIngredientHandler, getIngredientSize}
