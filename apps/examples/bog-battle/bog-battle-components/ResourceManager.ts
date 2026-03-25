import * as ecs from '@8thwall/ecs'

import {Resource} from './Resource'
import {Structure} from './Structure'
import {getGlobalConfig} from './GlobalConfig'
import {InfoBadge} from './InfoBadge'
import {Spin} from '../example-components/spin'

const disambiguateComponent = (world, eid) => {
  if (Resource.has(world, eid)) {
    return Resource.get(world, eid)
  }
  if (Structure.has(world, eid)) {
    return Structure.get(world, eid)
  }

  return null
}

const createGridList = (xSize, zSize) => {
  const startX = -xSize / 2 + 1
  const startZ = -zSize / 2 + 1

  const gridSpaces = []

  for (let i = 0; i < xSize; i++) {
    for (let j = 0; j < zSize; j++) {
      const x = Math.floor(startX + j)
      const z = Math.floor(startZ + i)
      gridSpaces.push({x, z})
    }
  }
  return gridSpaces
}

const getItemsOnMap = (world) => {
  let itemsOnMap = []
  const resourceQuery = ecs.defineQuery([Resource])
  try {
    const items = resourceQuery(world)
    itemsOnMap = [...itemsOnMap, ...items]
  } catch (err) {
    console.log('Couldn\'t query resource', err)
  }

  const structureQuery = ecs.defineQuery([Structure])
  try {
    const items = structureQuery(world)
    itemsOnMap = [...itemsOnMap, ...items]
  } catch (err) {
    console.log('Couldn\'t query structure', err)
  }

  return itemsOnMap
}

const spawnResource = (world, interval, unitAmount, model, scale) => {
  // console.log(world)
  // console.log(interval)
  // console.log(unitAmount)
  // console.log(model)

  const {xSize, zSize} = getGlobalConfig(world)
  const gridList = createGridList(xSize, zSize)

  const itemsOnMap = getItemsOnMap(world)
  const occupiedSpaces = itemsOnMap.filter(item => !!item).map((item) => {
    const itemAsComponent = disambiguateComponent(world, item)
    return {
      x: itemAsComponent.x,
      z: itemAsComponent.z,
    }
  })
  occupiedSpaces.push({x: 0, z: 0})  // The goal object doesn't get picked up by the query for some reason

  // const occupiedSpaces = []

  const occupiedSet = new Set(occupiedSpaces.map(pos => `${pos.x},${pos.z}`))
  const freeSpaces = gridList.filter(pos => !occupiedSet.has(`${pos.x},${pos.z}`))

  if (freeSpaces.length > 0) {
    const randomIndex = Math.floor(Math.random() * freeSpaces.length)
    const randomSpot = freeSpaces[randomIndex]

    const newResource = world.createEntity()
    world.setPosition(newResource, randomSpot.x, 0, randomSpot.z)
    world.setScale(newResource, scale, scale, scale)
    ecs.Material.set(world, newResource, {r: 255, g: 255, b: 60})
    Resource.set(world, newResource, {x: randomSpot.x, z: randomSpot.z, amount: unitAmount, model})
    Spin.set(world, newResource, {x: 0, y: 0.2, z: 0, speed: 1})
  }
  setTimeout(() => {
    spawnResource(world, interval, unitAmount, model, scale)
  }, interval)
}

const ResourceManager = ecs.registerComponent({
  name: 'ResourceManager',
  schema: {
    resources: ecs.i32,
    spawnInterval: ecs.i32,
    multiplier: ecs.i32,
    resourcesUnitAmount: ecs.i32,
    // @asset
    model: ecs.string,
    infoBadge: ecs.eid,
    scale: ecs.f32,
  },
  schemaDefaults: {
    resources: 20,
    spawnInterval: 1000,
    multiplier: 1,
    resourcesUnitAmount: 2,
    scale: 1,
  },
  add: (world, component) => {
    console.log(`Added resource manager ${component.eid}`)
    addResources(0, world)
    spawnResource(world, component.schema.spawnInterval, component.schema.resourcesUnitAmount, component.schema.model, component.schema.scale)
  },
})

const resourceManagerQuery = ecs.defineQuery([ResourceManager])

const updateDisplayCount = (world, resourceManager) => {
  world.events.dispatch(resourceManager.infoBadge, 'updateText', {value: resourceManager.resources})
}

const getResourceManager = (world) => {
  console.log('Getting resource manager')
  const configs = resourceManagerQuery(world)
  const resourceManager = ResourceManager.get(world, configs[0])
  console.log(resourceManager)
  return resourceManager
}

const getMutableResourceManager = (world) => {
  console.log('Getting resource manager')
  const configs = resourceManagerQuery(world)
  const resourceManager = ResourceManager.cursor(world, configs[0])
  console.log(resourceManager)
  return resourceManager
}

const canCoverCost = (cost, world) => {
  const resourceManager = getResourceManager(world)
  return resourceManager.resources - cost >= 0
}

const makePurchase = (cost, world) => {
  let status = 'error'
  const resourceManager = getMutableResourceManager(world)
  if (canCoverCost(cost, world)) {
    resourceManager.resources -= cost
    status = 'success'
  }
  console.log(`Current resources: ${resourceManager.resources}`)
  updateDisplayCount(world, resourceManager)
  return {status}
}

const addResources = (amount, world) => {
  const resourceManager = getMutableResourceManager(world)
  resourceManager.resources += amount
  updateDisplayCount(world, resourceManager)
  console.log(`Received ${amount} resources`)
  console.log(`Current resources: ${resourceManager.resources}`)
}

export {ResourceManager, addResources, canCoverCost, getResourceManager, makePurchase}
