import * as ecs from '@8thwall/ecs'
import {PlayAudio, PauseAudio, ChangeAudio} from '../helpers/audioController'

import {Menu, getMenuConfig} from './Menu'
import {canCoverCost, makePurchase, addResources} from './ResourceManager'
import {setYAngle} from '../helpers/angle'

const menuEntitiesMap = new Map()

const addAttackEventListener = (world, componentId, currentHealth, damageAudio) => {
  const component = Structure.cursor(world, componentId)
  component.currentHealth = currentHealth
  world.events.addListener(componentId, 'enemyAttack', (e) => {
    if (!e.data) {
      console.log('Attack event was missing data')
      return
    }

    console.log(`Structure ${e.target} was attacked for ${e.data.damage} damage!`)
    // const structure = Structure.get(world, e.target)
    // console.log(structure)
    ecs.Material.set(world, componentId, {opacity: 0.5})
    setTimeout(() => {
      ecs.Material.set(world, componentId, {opacity: 0.5})
    }, 500)
    const mat = ecs.Material.get(world, componentId)
    const attackedComponent = Structure.cursor(world, e.target)
    PauseAudio(world, e.target)
    ChangeAudio(world, e.target, damageAudio)
    PlayAudio(world, e.target)
    attackedComponent.currentHealth -= e.data.damage
    console.log(`Remaining health for ${e.target} is ${attackedComponent.currentHealth}`)

    if (attackedComponent.currentHealth <= 0) {
      console.log('Health dropped below 0!')
      world.deleteEntity(e.target)
    }
  })
}

const upgradeHandler = (world, e) => {
  const componentId = e.target
  const component = Structure.cursor(world, componentId)
  console.log('Upgrading')
  console.log(component.currentLevel)
  if (component.currentLevel === 0) component.currentLevel = 1

  if (component.currentLevel >= 3) return

  console.log(`Current level ${component.currentLevel}`)
  // ecs.GltfModel.remove(world, component.eid);

  if (component.currentLevel === 1) {
    console.log('in here 2')
    if (!canCoverCost(component.levelTwoCost, world)) {
      console.log('Not enough resources')
      return
    }
    component.currentLevel += 1
    component.currentCost = component.levelTwoCost
    console.log(component.levelTwoAsset)
    component.currentHealth = component.levelTwoHealth
    ecs.GltfModel.set(world, componentId, {url: component.levelTwoAsset})
    makePurchase(component.levelTwoCost, world)
  } else if (component.currentLevel === 2) {
    console.log('in here 3')
    if (!canCoverCost(component.levelThreeCost, world)) {
      console.log('Not enough resources')
      return
    }
    component.currentLevel += 1
    console.log(component.levelThreeAsset)
    component.currentCost = component.levelThreeCost
    component.currentHealth = component.levelThreeHealth
    ecs.GltfModel.set(world, componentId, {url: component.levelThreeAsset})
    makePurchase(component.levelThreeCost, world)
  } else {
    console.log('invalid level')
  }
}

const Structure = ecs.registerComponent({
  name: 'Structure',
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
    // @condition true=false
    lastUpdate: ecs.f32,
    // @condition true=false
    rotation: ecs.f32,
  },
  schemaDefaults: {
    upgradeable: true,
    currentLevel: 1,
    scale: 1,
    rotation: 0,
  },
  data: {
    currentHealth: ecs.i32,
  },
  add: (world, component) => {
    let assetUrl
    let currentHealth
    let currentCost

    switch (component.schema.currentLevel) {
      case 1:
        assetUrl = component.schema.levelOneAsset
        currentHealth = component.schema.levelOneHealth
        currentCost = component.schema.levelOneCost
        break
      case 2:
        assetUrl = component.schema.levelTwoAsset
        currentHealth = component.schema.levelTwoHealth
        currentCost = component.schema.levelTwoCost
        break
      case 3:
        assetUrl = component.schema.levelThreeAsset
        currentHealth = component.schema.levelThreeHealth
        currentCost = component.schema.levelThreeCost
        break
      default:
        assetUrl = component.schema.levelOneAsset
        currentHealth = component.schema.levelOneHealth
        currentCost = component.schema.levelOneCost
        break
    }

    ecs.GltfModel.set(world, component.eid, {url: assetUrl})
    const audioURL = component.schema.damageAudio
    const structVolume = component.schema.volume
    ecs.Audio.set(world, component.eid, {
      url: audioURL,
      volume: structVolume,
      loop: false,
      pitch: 1.0,
      paused: true,
    })
    world.setScale(component.eid, component.schema.scale, component.schema.scale, component.schema.scale)
    component.schema.currentHealth = currentHealth
    component.schema.currentCost = currentCost
    component.schema.lastUpdate = world.time.elapsed

    console.log(`Starting health is ${component.data.currentHealth}`)

    if (component.schema.upgradeable) {
      world.events.addListener(component.eid, ecs.input.SCREEN_TOUCH_START, (e) => {
        if (menuEntitiesMap.has(component.eid)) return

        const menuSchema = getMenuConfig(world)
        const structure = Structure.get(world, e.target)
        const menuEntity = world.createEntity()
        const canUpgrade = structure.currentLevel !== 3
        Menu.set(world, menuEntity, {...menuSchema, targetId: e.target, canUpgrade})
        const structurePosition = {...ecs.Position.get(world, e.target)}
        world.setPosition(menuEntity, structurePosition.x, structurePosition.y + 3, structurePosition.z)
        world.setScale(menuEntity, 1, 1, 1)
        console.log(`MenuEntity: ${menuEntity}`)
        menuEntitiesMap.set(component.eid, menuEntity)
      })
    }

    addAttackEventListener(world, component.eid, currentHealth, component.schema.damageAudio)

    const closeMenu = () => {
      menuEntitiesMap.forEach((value, key) => {
        world.deleteEntity(value)
        menuEntitiesMap.delete(key)
      })

      // const menuEntityId = menuEntitiesMap.get(component.eid)
      // if (!menuEntityId) return

      // world.deleteEntity(menuEntityId)
      // menuEntitiesMap.delete(component.eid)
    }

    world.events.addListener(component.eid, 'menuRotate', (e) => {
      console.log('Rotating structure')
      const structure = Structure.cursor(world, e.target)
      structure.rotation += 90
      if (structure.rotation >= 360) {
        structure.rotation = 0
      }

      setYAngle(world, e.target, structure.rotation * Math.PI / 180)
    })

    world.events.addListener(component.eid, 'menuCancel', (e) => {
      closeMenu()
    })

    world.events.addListener(component.eid, 'menuDelete', (e) => {
      closeMenu()
      const componentId = e.target
      const thisComponent = Structure.get(world, componentId)
      addResources(thisComponent.currentCost, world)
      world.deleteEntity(e.target)
    })

    world.events.addListener(component.eid, 'menuUpgrade', (e) => {
      closeMenu()
      upgradeHandler(world, e)
    })
  },
  tick: (world, component) => {},
  remove: (world, component) => {
    const menuEntityId = menuEntitiesMap.get(component.eid)
    if (menuEntityId) {
      world.deleteEntity(menuEntityId)
      menuEntitiesMap.delete(component.eid)
    }
    console.log(`Deleted structure ${component.eid}`)
  },
})

export {Structure}
