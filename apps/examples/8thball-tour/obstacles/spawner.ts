import * as ecs from '@8thwall/ecs'
import {deepCopyEntity} from './prefab-util'

const EPSILON = 0.001
const FROM_MILLI = 1 / 1000
const DEG_2_RAD = Math.PI / 180

const BIG_MASS = 100000
const TORQUE_FACTOR = 10 * BIG_MASS

let objectPoolSize: number

let objectPool: Array<ecs.Eid>

const allocatePool = (
  world: ecs.World,
  poolSize: number,
  parent: ecs.Eid,
  templateObject: ecs.Eid
) => {
  objectPoolSize = poolSize
  objectPool = new Array(objectPoolSize)
  for (let i = 0; i < objectPoolSize; ++i) {
    const newObject = deepCopyEntity(world, templateObject)
    world.setParent(newObject, parent)
    ecs.Hidden.remove(world, newObject)
    objectPool[i] = newObject
  }
}

ecs.registerComponent({
  name: 'Spawner',
  schema: {
    frequency: ecs.f32,
    poolSize: ecs.i32,
    entity: ecs.eid,
  },
  schemaDefaults: {
    frequency: 2.0,  // Hz
    poolSize: 100,
  },
  data: {
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        const {poolSize, entity} = schemaAttribute.acquire(eid)
        allocatePool(world, poolSize, eid, entity)
      })
      .onTick(() => {
        const {frequency} = schemaAttribute.acquire(eid)

        const spawnObject = () => {
          console.log('spawing object')
        }

        setInterval(spawnObject, 1 / frequency)
      })
  },
})
