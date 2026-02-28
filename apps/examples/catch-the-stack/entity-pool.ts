import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

// Entities will be off by default when instantiated
const instantiateEntity = (
  world: ecs.World,
  parent: ecs.Eid,
  modelUrl: string,
  entityInit: (entity: ecs.Eid) => void
): ecs.Eid => {
  const entity = world.createEntity()
  world.setParent(entity, parent)

  ecs.GltfModel.set(world, entity, {
    url: modelUrl,
  })

  ecs.Disabled.set(world, entity)

  entityInit(entity)

  return entity
}

type EntityPool = {
  getEntityFromPool: (key: string) => ecs.Eid,
  resetEntityPool: (entityDeinit: (entity: ecs.Eid) => void) => void,
  clearEntityPool: () => void,
}

const createEntityPool = (
  world: ecs.World,
  keys: string[],
  models: string[],
  instances: number[],
  entityInit: (entity: ecs.Eid) => void,
  instantiateDynamically: boolean
): EntityPool => {
  // NOTE(lreyna): Could dispatch a entity pool loading started event

  // Key to Entity Queue Mapping
  const __entityMap = new Map<string, ecs.Eid[]>()
  const __entityInstancesMap = new Map<string, number>()
  const __entityModelsMap = new Map<string, string>()

  if (keys.length !== models.length) {
    // eslint-disable-next-line max-len
    throw new Error(`[enitity-pool] Number of keys: ${keys.length} does not match number of models ${models.length}`)
  }

  if (keys.length !== instances.length) {
    // eslint-disable-next-line max-len
    throw new Error(`[enitity-pool] Number of keys: ${keys.length} does not match length of instances ${instances.length}`)
  }

  const __entityPoolParent = world.createEntity()
  const __entityKeyParents = new Map<string, ecs.Eid>()
  for (let i = 0; i < keys.length; i++) {
    const enitityKeyParent = world.createEntity()
    __entityKeyParents.set(keys[i], enitityKeyParent)
    world.setParent(enitityKeyParent, __entityPoolParent)

    const modelForKey = models[i]
    const instancesForKey = instances[i]
    __entityMap.set(keys[i], [])
    __entityInstancesMap.set(keys[i], instancesForKey)
    __entityModelsMap.set(keys[i], modelForKey)
    if (!instantiateDynamically) {
      for (let j = 0; j < instancesForKey; j++) {
        const entity = instantiateEntity(world, enitityKeyParent, modelForKey, entityInit)
        __entityMap.get(keys[i]).push(entity)
      }
    }
  }

  // NOTE(lreyna): Could dispatch a entity pool loading finished event

  // Turns entity back on by default
  const getEntityFromPool = (key: string): ecs.Eid => {
    let recycledEntity: ecs.Eid

    if (!__entityMap.has(key)) {
      throw new Error(`[entity-pool] Invalid key ${key} for enitity pool`)
    }

    const currentEntityQueue = __entityMap.get(key)
    const numInstancesForKey = __entityInstancesMap.get(key)
    const entityKeyParent = __entityKeyParents.get(key)

    // If we didn't pre-allocate, we need to check if we reached our max
    if (instantiateDynamically && currentEntityQueue.length < numInstancesForKey) {
      const modelForKey = __entityModelsMap.get(key)
      recycledEntity = instantiateEntity(world, entityKeyParent, modelForKey, entityInit)
    } else {
      recycledEntity = currentEntityQueue.shift()

      // Want to reset any potential parent relationship (could be an option)
      world.setParent(recycledEntity, entityKeyParent)
    }

    ecs.Disabled.remove(world, recycledEntity)

    // Put the recycledEntity at the end of the queue
    currentEntityQueue.push(recycledEntity)

    return recycledEntity
  }

  const resetEntityPool = (entityDeinit: (entity: ecs.Eid) => void) => {
    for (const [key, entityQueue] of __entityMap.entries()) {
      for (const entity of entityQueue) {
        world.setParent(entity, __entityKeyParents.get(key))

        entityDeinit(entity)

        ecs.Disabled.set(world, entity)
      }
    }
  }

  const clearEntityPool = () => {
    for (const entityQueue of __entityMap.values()) {
      for (const entity of entityQueue) {
        world.deleteEntity(entity)
      }
      entityQueue.length = 0
    }
    __entityMap.clear()
    __entityInstancesMap.clear()
    __entityModelsMap.clear()
    __entityKeyParents.clear()
  }

  return {
    getEntityFromPool,
    resetEntityPool,
    clearEntityPool,
  }
}

export {
  createEntityPool,
}
