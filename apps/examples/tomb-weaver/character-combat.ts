import * as ecs from '@8thwall/ecs'

import {Attack} from './attack'
import {Defense} from './defense'
import {CharacterAttributes, characterLevel} from './character-attributes'
import {CharacterStats} from './character-stats'

// The base amount of stamina points that the character regenerates per second.
const CHARACTER_BASE_STAMINA_REGEN = 50
const CHARACTER_BASE_POISE_REGEN_TIME = 5000
const CHARACTER_BASE_DEFENSE = 50

// The amount of additional scaling damage done at each level.
// Note the soft caps and hard caps.
// const strengthSaturation = {
//  // The first 10 levels increase stat by 4% of scaling
//  0: 0.04,
//  // The next 15 levels increase stat by 2.5% of scaling
//  10: 0.025,
//  // The next 25 levels increase stat by 0.9% of scaling
//  25: 0.009,
//  // Attribute is capped at 50.
//  50: 0,
// }

// The amount of additional scaling damage done at each level.
// Note the soft caps and hard caps.
const defenseSaturation = {
  // The first 10 levels increase stat by 4% of scaling
  0: 0.04,
  // The next 15 levels increase stat by 2.5% of scaling
  10: 0.025,
  // The next 25 levels increase stat by 0.9% of scaling
  25: 0.009,
  // Attribute is capped at 50.
  50: 0,
}

const characterAttacks: Readonly<Record<string, Readonly<Attack>>> = {
  Character_StandardBite: {
    physical: 35,
    poise: 20,
  },
}

const generateCharacterAttack = (
  // attribs: Readonly<typeof CharacterAttributes.defaults>,
  attribs: ecs.ReadData<ecs.SchemaOf<typeof CharacterAttributes>>,
  attackName: string
): Readonly<Attack> => {
  const baseAttack = characterAttacks[attackName]
  if (!baseAttack) {
    throw Error(`Unknown character attack ${attackName}`)
  }
  return {
    physical: Math.floor(baseAttack.physical * (1.0 + attribs.strength / 10)),
    poise: Math.floor(baseAttack.poise),
  }
}

// Each level gains additional defense, then slows at a soft cap.
const DEFENSE_POINTS_PER_LEVEL = 2
const DEFENSE_SOFT_CAP = 100

// Endurance levels gain additional defense, with a separate cap.
const DEFENSE_POINTS_PER_ENDURANCE = 0.25
const DEFENSE_ENDURANCE_SOFT_CAP = 25

const levelDefenseBuff = (level: number) => (
  // Gain DEFENSE_POINTS_PER_LEVEL points per level up to soft cap, then 1 point per level.
  (level < DEFENSE_SOFT_CAP)
    ? DEFENSE_POINTS_PER_LEVEL * level
    : (DEFENSE_POINTS_PER_LEVEL * DEFENSE_SOFT_CAP) + (level - DEFENSE_SOFT_CAP)
)

const enduranceDefenseBuff = (endurance: number) => (
  // Gain DEFENSE_POINTS_PER_ENDURANCE points per endurance attrib up to soft cap, then 0.25 points
  // per additional endurance value.
  (endurance < DEFENSE_ENDURANCE_SOFT_CAP)
    ? DEFENSE_POINTS_PER_ENDURANCE * endurance
    : (DEFENSE_POINTS_PER_ENDURANCE * DEFENSE_ENDURANCE_SOFT_CAP) +
      0.25 * (endurance - DEFENSE_ENDURANCE_SOFT_CAP)
)

const generateCharacterDefense = (
  attribs: ecs.ReadData<ecs.SchemaOf<typeof CharacterAttributes>>,
  stats: ecs.ReadData<ecs.SchemaOf<typeof CharacterStats>>
): Defense => ({
  // Physical defense scales with level and a little more with endurance.
  physicalDefense: CHARACTER_BASE_DEFENSE +
    levelDefenseBuff(characterLevel(attribs)) + enduranceDefenseBuff(attribs.endurance),
  // Guard stamina is the current stamina value for the character.
  guardStamina: stats.stamina,
})

export {generateCharacterAttack, generateCharacterDefense}
