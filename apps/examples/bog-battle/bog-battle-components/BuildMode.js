import * as ecs from '@8thwall/ecs'

import {Structure} from './Structure'
import {StructureConfig} from './StructureConfig'
import {canCoverCost, makePurchase} from './ResourceManager'

let activeObject = null

const BuildMode = ecs.registerComponent({
  name: 'BuildMode',
  schema: {
    structure1Config: ecs.eid,
    structure2Config: ecs.eid,
    structure3Config: ecs.eid,
  },
  add: (world, component) => {
    console.log('Creating build mode!')
    const {structure1Config, structure2Config, structure3Config} = component.schema

    world.events.addListener(world.events.globalId, 'setStructure1', (e) => {
      console.log('Setting structure 1')
      activeObject = structure1Config
    })
    world.events.addListener(world.events.globalId, 'setStructure2', (e) => {
      activeObject = structure2Config
    })
    world.events.addListener(world.events.globalId, 'setStructure3', (e) => {
      activeObject = structure3Config
    })

    world.events.addListener(world.events.globalId, 'gridItemTouch', (e) => {
      if (!activeObject) return

      const {x, z} = e.data

      console.log('Building structure')
      const structureSchema = StructureConfig.get(world, activeObject)

      let currentCost
      switch (structureSchema.currentLevel) {
        case 1:
          currentCost = structureSchema.levelOneCost
          break
        case 2:
          currentCost = structureSchema.levelTwoCost
          break
        case 3:
          currentCost = structureSchema.levelThreeCost
          break
        default:
          currentCost = structureSchema.levelOneCost
          break
      }

      if (!canCoverCost(currentCost, world)) {
        console.log('Not enough resources')
        return
      }

      const structure = world.createEntity()
      Structure.set(world, structure, {...structureSchema, x, z})
      world.setPosition(structure, x, 0, z)
      makePurchase(currentCost, world)
    })
  },
})

export {BuildMode}
