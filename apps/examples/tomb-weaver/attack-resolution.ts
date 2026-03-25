import * as ecs from '@8thwall/ecs'

import type {Hit} from './hit'
import {generateEnemyAttack, generateEnemyDefense} from './enemy/enemy-combat'
import {Attack} from './attack'
import {Defense} from './defense'
import {Shield} from './shield'
import {Enemy} from './enemy'
import {generateCharacterAttack, generateCharacterDefense} from './character-combat'
import {CharacterAttributes} from './character-attributes'
import {CharacterStats, adjustStat} from './character-stats'

type ResolveHitParams = {
  hitbox: ecs.Eid
  hitboxOwner: ecs.Eid,
  hit: Hit
}

const resolveHit = (world: ecs.World, params: ResolveHitParams) => {
  const {hitbox, hitboxOwner, hit} = params
  const {attack: attackName} = hit

  const attackerIsCharacter = attackName.startsWith('Character')
  const targetIsCharacter = CharacterAttributes.has(world, hit.target)

  const attack: Readonly<Attack> = attackerIsCharacter
    ? generateCharacterAttack(CharacterAttributes.get(world, hitboxOwner), attackName)
    : generateEnemyAttack(attackName)

  let defense: Readonly<Defense>

  if (Enemy.has(world, hit.target)) {
    // This is an attack against an enemy.
    const enemy = Enemy.get(world, hit.target)
    const {enemyType} = enemy

    defense = generateEnemyDefense(enemyType)
  } else if (targetIsCharacter) {
    // This is an attack against the character.
    defense = generateCharacterDefense(
      CharacterAttributes.get(world, hit.target),
      CharacterStats.get(world, hit.target)
    )
  } else {
    // We should not end up here, all hit targets should be enemies or the character.
    throw Error('Hit is not on Character or an Enemy')
  }

  // Now finish the attack.
  const healthDamage = attack.physical * (100 / (100 + defense.physicalDefense))

  if (Shield.has(world, hit.hitTarget)) {
    // This attack hit a shield, so convert it to stamina damage.
    const shield = Shield.get(world, hit.hitTarget)
    const staminaDamageModifier = 0.75
    const staminaDamage = attack.physical * staminaDamageModifier * (shield.stability / 100)

    // Receive the stamina damage.
    adjustStat(world, hit.target, 'stamina', -staminaDamage)

    // Did this staminaDamage equal or exceed the guard stamina?
    if (staminaDamage >= defense.guardStamina) {
      // This was a block break. Take half damage and receive a shield stun.
      const halfHealthDamage = 0.5 * healthDamage
      adjustStat(world, hit.target, 'health', -halfHealthDamage)
    }
  } else {
    // Take the healthDamage.
    adjustStat(world, hit.target, 'health', -healthDamage)

    const poiseDamage = attack.poise

    // Take the poiseDamage.
    adjustStat(world, hit.target, 'poise', -poiseDamage)
  }
}

export {resolveHit}
