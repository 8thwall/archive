import * as ecs from '@8thwall/ecs'

import {getGlobalConfig} from './GlobalConfig'
import {Menu} from './Menu'
import {canCoverCost, makePurchase, addResources} from './ResourceManager'

const StructureConfig = ecs.registerComponent({
  name: 'StructureConfig',
  schema: {
    // @asset
    volume: ecs.f32,
    // @asset
    damageAudio: ecs.string,
    // @asset
    fireAudio: ecs.string,
    upgradeable: ecs.boolean,
    currentLevel: ecs.i32,
    scale: ecs.f32,
    // @asset
    levelOneAsset: ecs.string,
    levelOneCost: ecs.i32,
    levelOneHealth: ecs.i32,
    levelOneAttack: ecs.i32,
    levelOneAttackRate: ecs.f32,
    levelOneAttackRange: ecs.f32,
    // @condition upgradeable=true
    // @asset
    levelTwoAsset: ecs.string,
    // @condition upgradeable=true
    levelTwoCost: ecs.i32,
    // @condition upgradeable=true
    levelTwoHealth: ecs.i32,
    // @condition upgradeable=true
    levelTwoAttack: ecs.i32,
    // @condition upgradeable=true
    levelTwoAttackRate: ecs.f32,
    // @condition upgradeable=true
    levelTwoAttackRange: ecs.f32,
    // @condition upgradeable=true
    // @asset
    levelThreeAsset: ecs.string,
    // @condition upgradeable=true
    levelThreeCost: ecs.i32,
    // @condition upgradeable=true
    levelThreeHealth: ecs.i32,
    // @condition upgradeable=true
    levelThreeAttack: ecs.i32,
    // @condition upgradeable=true
    levelThreeAttackRate: ecs.f32,
    // @condition upgradeable=true
    levelThreeAttackRange: ecs.f32,
    // @condition true=false
    x: ecs.i32,
    // @condition true=false
    z: ecs.i32,
    // @condition true=false
    currentHealth: ecs.i32,
    // @condition true=false
    currentCost: ecs.i32,
  },
  schemaDefaults: {
    upgradeable: true,
    currentLevel: 1,
    scale: 1,
  },
  add: (world, component) => {

  },
  tick: (world, component) => {

  },
  remove: (world, component) => {
  },
})

export {StructureConfig}
