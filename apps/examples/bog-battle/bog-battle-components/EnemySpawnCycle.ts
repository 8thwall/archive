import * as ecs from '@8thwall/ecs'

import {EndGameOverlay} from './EndGameOverlay'
import {addCleanup, doCleanup} from '../helpers/cleanup'

let spawningActive = false
let img
let flashCount = 0
let flashStartTime = 0

const EnemySpawnCycle = ecs.registerComponent({
  name: 'EnemySpawnCycle',
  schema: {
    cycleDuration: ecs.f32,
    isActive: ecs.boolean,
    // @condition true=false
    spawningActive: ecs.boolean,
    // @asset
    icon: ecs.string,
    top: ecs.string,
    right: ecs.string,
    blinkPeriod: ecs.f32,
  },
  schemaDefaults: {
    cycleDuration: 10,
    isActive: false,
    top: '120px',
    right: '10px',
    blinkPeriod: 500,
  },
  add: (world, component) => {
    let cycleCount = 1

    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.top = component.schema.top
    container.style.right = component.schema.right
    container.style.display = 'flex'
    container.style.flexDirection = 'column'
    container.style.alignItems = 'center'
    container.style.overflow = 'hidden'  // Ensures content fits within the dimensions
    document.body.append(container)

    img = document.createElement('img')
    img.src = component.schema.icon
    img.style.height = '48px'  // Set height to 48px
    img.style.width = '48px'  // Set width to 48px

    container.append(img)

    const {cycleDuration, blinkPeriod} = component.schema

    let intervalId = null

    const startCycle = () => {
      flashCount = 0
      flashStartTime = world.time.elapsed
      spawningActive = true

      const toggleSpawning = () => {
        if (spawningActive) {
          cycleCount += 1
          spawningActive = false
          console.log('Deactivating spawning')
          world.events.dispatch(world.events.globalId, 'deactivateSpawner')
        } else {
          spawningActive = true
          console.log('Activating spawning')
          world.events.dispatch(world.events.globalId, 'activateSpawner')
          flashCount = 0
          flashStartTime = world.time.elapsed
        }
      }

      toggleSpawning()  // Initial toggle to activate spawner
      intervalId = setInterval(toggleSpawning, cycleDuration * 1000)
    }

    const stopCycle = () => {
      if (intervalId !== null) {
        spawningActive = false
        clearInterval(intervalId)
        intervalId = null
        world.events.dispatch(world.events.globalId, 'deactivateSpawner')  // Ensure spawner is deactivated when stopping the cycle
      }
    }

    // Handle the activation/deactivation of the cycle
    if (component.schema.isActive) {
      startCycle()
    }

    const startSpawnListener = () => {
      component.schema.isActive = true
      startCycle()
    }

    world.events.addListener(world.events.globalId, 'startEnemySpawnCycle', startSpawnListener)

    const stopSpawnListener = () => {
      component.schema.isActive = false
      stopCycle()
      const endGameOverlay = world.createEntity()
      EndGameOverlay.set(world, endGameOverlay, {level: cycleCount})
    }
    world.events.addListener(world.events.globalId, 'stopEnemySpawnCycle', stopSpawnListener)

    // Clean up when the component is removed
    addCleanup(component, () => {
      stopCycle()
      world.events.removeListener(world.events.globalId, 'startEnemySpawnCycle', startSpawnListener)
      world.events.removeListener(world.events.globalId, 'stopEnemySpawnCycle', stopSpawnListener)
    })
  },
  tick: (world, component) => {
    let brightness = 0

    if (spawningActive) {
      const currentTime = world.time.elapsed
      const elapsedTimeSinceStart = currentTime - flashStartTime
      const flashPeriod = component.schema.blinkPeriod

      if (flashCount < 3) {
        const flashCycle = Math.floor(elapsedTimeSinceStart / flashPeriod)
        if (flashCycle > flashCount) {
          flashCount = flashCycle
          brightness = 1
        } else {
          brightness = (elapsedTimeSinceStart % flashPeriod) < (flashPeriod / 2) ? 1 : 0
        }
      } else {
        brightness = 1  // Keep the icon on after flashing 3 times
      }
    }

    img.style.opacity = brightness
  },
  remove: (world, component) => {
    doCleanup(component)
  },
})

export {EnemySpawnCycle}
