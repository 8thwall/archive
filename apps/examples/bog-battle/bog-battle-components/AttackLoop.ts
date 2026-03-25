import * as ecs from '@8thwall/ecs'

import {Structure} from './Structure'
import {Enemy, ENEMY_STATES} from './Enemy'
import {Projectile} from './Projectile'

const enemyQuery = ecs.defineQuery([Enemy])
const structureQuery = ecs.defineQuery([Structure])

const {Position} = ecs
const {vec3} = ecs.math

const getStructureAttackParams = (component) => {
  switch (component.currentLevel) {
    case 1:
      return {
        attack: component.levelOneAttack,
        range: component.levelOneAttackRange,
        rate: component.levelOneAttackRate,
      }
    case 2:
      return {
        attack: component.levelTwoAttack,
        range: component.levelTwoAttackRange,
        rate: component.levelTwoAttackRate,
      }
    case 3:
      return {
        attack: component.levelThreeAttack,
        range: component.levelThreeAttackRange,
        rate: component.levelThreeAttackRate,
      }
    default:
      return {attack: 0, range: 0, rate: 0}
  }
}

const currentPosition = vec3.zero()
const targetPosition = vec3.zero()

const getClosestEnemyWithinRange = (world, structure, range, enemies) => {
  let closestEnemy = null
  currentPosition.setFrom(Position.get(world, structure))
  let minDistance = 9999999
  enemies.forEach((enemy) => {
    targetPosition.setFrom(Position.get(world, enemy))
    const dist = targetPosition.setMinus(currentPosition).length()
    const enemyComponent = Enemy.get(world, enemy)
    if (dist < minDistance && dist < range && enemyComponent.state !== ENEMY_STATES.DEFEAT) {
      closestEnemy = enemy
      minDistance = dist
    }
  })

  return closestEnemy
}

const getClosestStructureWithinRange = (world, enemyId, attackRange, structures) => {
  let closestStructure = null
  currentPosition.setFrom(Position.get(world, enemyId))
  let minDistance = 9999999
  structures.forEach((structure) => {
    targetPosition.setFrom(Position.get(world, structure))
    const distance = targetPosition.setMinus(currentPosition).length()
    if (distance < minDistance && distance < attackRange) {
      closestStructure = structure
      minDistance = distance
    }
  })
  return closestStructure
}

const doStructureAttacks = (world, structures, enemies, currentTime) => {
  structures.forEach((structureId) => {
    const structure = Structure.get(world, structureId)
    const {attack, rate, range} = getStructureAttackParams(structure)

    if (currentTime - structure.lastUpdate > 1000 / rate) {
      const closestEnemy = getClosestEnemyWithinRange(world, structureId, range, enemies)
      if (closestEnemy) {
        console.log(`Structure ${structureId} attacking ${closestEnemy}`)

        const projectile = world.createEntity()
        currentPosition.setFrom(Position.get(world, structureId))
        targetPosition.setFrom(Position.get(world, closestEnemy))
        const projectileDuration = 2000

        Projectile.set(world, projectile, {
          startX: currentPosition.x,
          startY: currentPosition.y + 2,
          startZ: currentPosition.z,
          endX: targetPosition.x,
          endY: targetPosition.y,
          endZ: targetPosition.z,
          maxHeight: 3,
          duration: projectileDuration,
        })

        setTimeout(() => {
          world.events.dispatch(closestEnemy, 'attack', {amount: attack})
        }, projectileDuration)
      }
      structure.lastUpdate = currentTime
    }
  })
}

const doEnemyAttacks = (world, structures, enemies, currentTime) => {
  enemies.forEach((enemyId) => {
    const enemy = Enemy.get(world, enemyId)
    const {attackStrength, attackRange, attackInterval} = enemy

    if (currentTime - enemy.lastUpdate > attackInterval) {
      enemy.lastUpdate = currentTime
      const closestStructure = getClosestStructureWithinRange(world, enemyId, attackRange, structures)
      if (closestStructure) {
        console.log(`Enemy ${enemy} attacking Structure ${closestStructure}`)
        world.events.dispatch(closestStructure, 'enemyAttack', {damage: attackStrength})
        world.events.dispatch(enemyId, 'performAttack', {})
      } else {
        world.events.dispatch(enemyId, 'disengage', {})
      }
    }
  })
}

const AttackLoop = ecs.registerComponent({
  name: 'AttackLoop',
  tick: (world, component) => {
    const currentTime = world.time.elapsed
    const structures = structureQuery(world)
    const enemies = enemyQuery(world)

    doStructureAttacks(world, structures, enemies, currentTime)
    doEnemyAttacks(world, structures, enemies, currentTime)
  },
})

export {AttackLoop}
