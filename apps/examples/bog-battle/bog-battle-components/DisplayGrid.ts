import * as ecs from '@8thwall/ecs'

import {getGlobalConfig} from '../bog-battle-components/GlobalConfig'
import {rotateEntity90} from '../helpers/angle'

let gridEntities = []

const destroyGrid = (world) => {
  for (let i = 0; i < gridEntities.length; i++) {
    world.deleteEntity(gridEntities[i])
  }

  gridEntities = []
}

const createGrid = (world, parent, rows, columns, textureUrl) => {
  destroyGrid(world)  // Clear any existing grid

  const startX = -columns / 2 + 1
  const startY = -rows / 2 + 1

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const eid = world.createEntity()
      const x = Math.floor(startX + j)
      const y = Math.floor(startY + i)
      ecs.Position.set(world, eid, {x, y: 0.02, z: y})
      ecs.PlaneGeometry.set(world, eid, {width: 1, height: 1})
      ecs.Material.set(world, eid, {
        r: 255,
        g: 255,
        b: 255,
        opacity: 0.999,
        textureSrc: textureUrl,
      })
      gridItem.set(world, eid, {x, z: y})
      world.setParent(eid, parent)
      rotateEntity90(world, eid)
      gridEntities.push(eid)
    }
  }
}

const handleGridItemTap = (world, e) => {
  const tappedGridItem = gridItem.get(world, e.target)
  console.log(`Tapped grid at ${tappedGridItem.x}, ${tappedGridItem.z}`)
  world.events.dispatch(
    world.events.globalId, 'gridItemTouch',
    {x: tappedGridItem.x, z: tappedGridItem.z}
  )
}

const gridItem = ecs.registerComponent({
  name: 'gridItem',
  schema: {
    x: ecs.i32,
    z: ecs.i32,
  },
  add: (world, component) => {
    world.events.addListener(component.eid, ecs.input.SCREEN_TOUCH_START, (e) => {
      handleGridItemTap(world, e)
    })
  },
})

const createGridComponent = ecs.registerComponent({
  name: 'createGridComponent',
  schema: {
    rows: ecs.ui32,
    columns: ecs.ui32,
    // @asset
    textureUrl: ecs.string,
    parent: ecs.eid,
  },
  add: (world, component) => {
    gridEntities = []

    const {textureUrl} = component.schema
    // const {xSize, zSize} = getGlobalConfig(world)
    // createGrid(world, component.schema.parent, xSize, zSize, textureUrl)

    // Listen for createGrid event
    world.events.addListener(world.events.globalId, 'createGrid', (e) => {
      const {xSize, zSize} = getGlobalConfig(world)
      createGrid(world, component.schema.parent, xSize, zSize, textureUrl)
    })

    // Listen for destroyGrid event
    world.events.addListener(world.events.globalId, 'destroyGrid', () => {
      destroyGrid(world)
    })
  },
  remove: (world, component) => {
    destroyGrid(world)
  },
})

export {
  createGridComponent,
  gridItem,
}
