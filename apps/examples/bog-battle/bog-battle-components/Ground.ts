import * as ecs from '@8thwall/ecs'

import {getGlobalConfig} from './GlobalConfig'
import {rotateEntity90} from '../helpers/angle'

let gridEntities = []
const edgeBuffer = 8

const destroyGrid = (world) => {
  for (let i = 0; i < gridEntities.length; i++) {
    world.deleteEntity(gridEntities[i])
  }

  gridEntities = []
}

const createGrid = (world, parent, rows, columns, color1, color2) => {
  destroyGrid(world)  // Clear any existing grid

  const startX = -columns / 2 + 1
  const startY = -rows / 2 + 1

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const eid = world.createEntity()
      const x = Math.floor(startX + j)
      const y = Math.floor(startY + i)
      ecs.Position.set(world, eid, {x, y: 0, z: y})
      ecs.PlaneGeometry.set(world, eid, {width: 1, height: 1})

      // Determine the color based on the checkerboard pattern
      const isEven = (i + j) % 2 === 0
      const color = isEven ? color1 : color2

      ecs.Material.set(world, eid, {
        r: color.r,
        g: color.g,
        b: color.b,
        opacity: 0.999,
      })
      world.setParent(eid, parent)
      rotateEntity90(world, eid)
      gridEntities.push(eid)
    }
  }
}

const GroundItem = ecs.registerComponent({
  name: 'GroundItem',
  schema: {
    x: ecs.i32,
    z: ecs.i32,
  },
  add: (world, component) => {

  },
})

const Ground = ecs.registerComponent({
  name: 'Ground',
  schema: {
    rows: ecs.ui32,
    columns: ecs.ui32,
    parent: ecs.eid,
    // @group start color1:color
    r1: ecs.f32,
    g1: ecs.f32,
    b1: ecs.f32,
    // @group end
    // @group start color2:color
    r2: ecs.f32,
    g2: ecs.f32,
    b2: ecs.f32,
    // @group end
  },
  add: (world, component) => {
    gridEntities = []

    const color1 = {
      r: component.schema.r1,
      g: component.schema.g1,
      b: component.schema.b1,
    }

    const color2 = {
      r: component.schema.r2,
      g: component.schema.g2,
      b: component.schema.b2,
    }

    const {parent} = component.schema
    const {xSize, zSize} = getGlobalConfig(world)
    createGrid(world, parent, xSize + 2 * edgeBuffer, zSize + 2 * edgeBuffer, color1, color2)
  },
  remove: (world, component) => {
    destroyGrid(world)
  },
})

export {
  Ground,
}
