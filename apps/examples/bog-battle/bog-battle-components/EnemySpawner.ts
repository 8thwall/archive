import * as ecs from '@8thwall/ecs'

import {Enemy, EnemyConfig} from './Enemy'
import {getGlobalConfig} from './GlobalConfig'
import {addCleanup, doCleanup} from '../helpers/cleanup'

const EnemySpawner = ecs.registerComponent({
  name: 'EnemySpawner',
  schema: {
    // @asset
    enemyAudio: ecs.string,
    damageVolume: ecs.f32,
    parent: ecs.eid,
    enemyTarget: ecs.eid,
    spawnRate: ecs.f32,
    isActive: ecs.boolean,
    // @asset
    enemyAsset1: ecs.string,
    enemyConfig1: ecs.eid,
    spawnWeight1: ecs.f32,
    // @asset
    enemyAsset2: ecs.string,
    enemyConfig2: ecs.eid,
    spawnWeight2: ecs.f32,
  },
  schemaDefaults: {
    spawnRate: 1,
    isActive: true,
    spawnWeight1: 1,
    spawnWeight2: 1,
  },
  add: (world, component) => {
    const {spawnWeight1, spawnWeight2, enemyConfig1, enemyConfig2, enemyAsset1, enemyAsset2, enemyTarget} = component.schema
    const {xSize, zSize} = getGlobalConfig(world)

    let intervalId = null

    const spawnEnemy = () => {
      if (!component.schema.isActive) return

      // Randomly choose between enemyConfig1 and enemyConfig2 based on their weights
      const totalWeight = spawnWeight1 + spawnWeight2
      const randomValue = Math.random() * totalWeight
      const chosenConfig = randomValue < spawnWeight1 ? enemyConfig1 : enemyConfig2
      const chosenAsset = randomValue < spawnWeight1 ? enemyAsset1 : enemyAsset2

      // Random x, z around a square
      const spawnerPosition = {...ecs.Position.cursor(world, component.eid)}
      const offset = 1.5  // Define the offset
      const side = Math.floor(Math.random() * 4)  // Choose a side: 0 = top, 1 = right, 2 = bottom, 3 = left
      let x
      let z

      switch (side) {
        case 0:  // Top side
          x = (Math.random() * 2 - 1) * xSize + spawnerPosition.x
          z = spawnerPosition.z + zSize + offset
          break
        case 1:  // Right side
          x = spawnerPosition.x + xSize + offset
          z = (Math.random() * 2 - 1) * zSize + spawnerPosition.z
          break
        case 2:  // Bottom side
          x = (Math.random() * 2 - 1) * xSize + spawnerPosition.x
          z = spawnerPosition.z - zSize - offset
          break
        case 3:  // Left side
          x = spawnerPosition.x - xSize - offset
          z = (Math.random() * 2 - 1) * zSize + spawnerPosition.z
          break
        default:
          x = 0
          z = 0
          break
      }

      // Create the enemy entity and set its properties
      const enemy = world.createEntity()
      const enemyConfig = EnemyConfig.get(world, chosenConfig)
      // console.log(enemyConfig)
      const audioURL = component.schema.enemyAudio
      const enemyVolume = component.schema.damageVolume
      ecs.GltfModel.set(world, enemy, {url: chosenAsset, animationClip: enemyConfig.moveAnimation, loop: true})
      ecs.Audio.set(world, enemy, {
        url: audioURL,
        volume: enemyVolume,
        loop: false,
        pitch: 1.0,
        paused: true,
      })
      world.setParent(component.eid, component.schema.parent)
      Enemy.set(world, enemy, {...enemyConfig, target: enemyTarget})
      world.setPosition(enemy, x, 0, z)
    }

    const startSpawning = () => {
      if (intervalId === null) {
        component.schema.spawnRate *= 1.1
        intervalId = setInterval(spawnEnemy, 1000 / component.schema.spawnRate)
      }
    }

    const stopSpawning = () => {
      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    const startSpawnListener = () => {
      component.schema.isActive = true
      startSpawning()
    }

    // Handle the activation/deactivation through events
    world.events.addListener(world.events.globalId, 'activateSpawner', startSpawnListener)

    const stopSpawnListener = () => {
      component.schema.isActive = false
      stopSpawning()
    }
    world.events.addListener(world.events.globalId, 'deactivateSpawner', stopSpawnListener)

    // Start spawning if isActive is true initially
    if (component.schema.isActive) {
      startSpawning()
    }

    // Clean up when the component is removed
    addCleanup( component, () => {
      stopSpawning()
      world.events.removeListener(world.events.globalId, 'activateSpawner', startSpawnListener)
      world.events.removeListener(world.events.globalId, 'deactivateSpawner', stopSpawnListener)
    })
  },
  remove: (world, component) => {
    doCleanup( component)
  },
})

export {EnemySpawner}
