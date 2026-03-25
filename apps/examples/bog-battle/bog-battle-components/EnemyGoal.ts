import * as ecs from '@8thwall/ecs'

import {Structure} from './Structure'
import {Enemy} from './Enemy'

const initHealth = (world, component) => {
  const structure = Structure.get(world, component.eid)
  component.schema.maxHealth = structure.levelOneHealth
  component.schema.currentHealth = structure.levelOneHealth
}

const sendHealthUpdate = (world, component) => {
  const healthPercentage = component.schema.currentHealth / component.schema.maxHealth
  // console.log(healthPercentage)
  world.events.dispatch(component.schema.progressIndicator,
    'updateProgress',
    {value: healthPercentage})
}

let indicatorId

const EnemyGoal = ecs.registerComponent({
  name: 'EnemyGoal',
  schema: {
    progressIndicator: ecs.eid,
    // @condition true=false
    maxHealth: ecs.i32,
    // @condition true=false
    currentHealth: ecs.i32,
  },
  add: (world, component) => {
    initHealth(world, component)
    sendHealthUpdate(world, component)
    indicatorId = component.schema.progressIndicator
  },
  tick: (world, component) => {
    const structure = Structure.cursor(world, component.eid)
    component.schema.currentHealth = Math.max(0, structure.currentHealth)
    sendHealthUpdate(world, component)
  },
  remove: (world, component) => {
    world.events.dispatch(indicatorId,
      'updateProgress',
      {value: 0})
    world.events.dispatch(world.events.globalId, 'stopEnemySpawnCycle', {})
    const enemyQuery = ecs.defineQuery([Enemy])
    const enemies = enemyQuery(world)
    enemies.forEach((enemy) => {
      world.deleteEntity(enemy)
    })
  },
})

export {
  EnemyGoal,
}
