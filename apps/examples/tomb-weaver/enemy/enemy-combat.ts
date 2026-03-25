import {Attack} from '../attack'
import {Defense} from '../defense'

// The amount of guardStamina points that enemies regenerate per second.
const GUARD_STAMINA_REGEN = 50

interface EnemyStats extends Defense {
  // Integer number of hit points.
  health: number,
  // Integer number of poise points.
  poise: number,
  // Time in milliseconds until poise is reset.
  poiseResetTime: number
}

const enemyAttacks: Readonly<Record<string, Readonly<Attack>>> = {
  BlightBug_Bite: {
    physical: 40,
    poise: 15,
  },
  BlightBoss_Bite: {
    physical: 200,
    poise: 40,
  },
}

const generateEnemyAttack = (attackName: string): Readonly<Attack> => {
  const baseAttack = enemyAttacks[attackName]
  if (!baseAttack) {
    throw Error(`Unknown enemy attack ${attackName}`)
  }
  return baseAttack
}

const enemies: Readonly<Record<string, Readonly<EnemyStats>>> = {
  BlightBug: {
    health: 100,
    poise: 15,
    guardStamina: 50,
    poiseResetTime: 700,
    physicalDefense: 25,
  },
  BlightBoss: {
    health: 1500,
    poise: 100,
    guardStamina: 100,
    poiseResetTime: 1000,
    physicalDefense: 100,
  },
}

const generateEnemyDefense = (enemyType: string): Readonly<Defense> => {
  const baseDefense = enemies[enemyType]
  if (!baseDefense) {
    throw Error(`Unknown enemy type ${enemyType}`)
  }
  return baseDefense
}

export {generateEnemyAttack, generateEnemyDefense, enemies}
