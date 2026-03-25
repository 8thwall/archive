import ecs from './helpers/runtime'
import {Pillar} from './pillar'
import {cloneComponents, setComponent} from './helpers/clone-tools'

const pillars: ecs.eid[] = []

let boardWidth: ecs.f32
let boardDepth: ecs.f32
let boardPillarWidth: ecs.f32
let boardCols: ecs.i32
let boardRows: ecs.i32

function GetPillarStartingCenter(component, x, y) {
  const c = ecs.math.vec3.xyz(
    boardWidth * -0.5 + ((x + 0.5) * boardPillarWidth),
    0.0,
    boardDepth * -0.5 + ((y + 0.5) * boardPillarWidth)
  )
  return c
}

function GetPillar(column, row) {
  // console.log('getpillar', column, row)
  return pillars[(row * boardCols) + column]
}

function GetPillarPos(world, column, row) {
  // console.log('getpillarpos', column, row)
  const pillar = GetPillar(column, row)
  const pos = ecs.Position.get(world, pillar)
  // console.log('getpillarpos', column, row, pos.x, pos.y, pos.z)
  return ecs.math.vec3.xyz(pos.x, pos.y, pos.z)
}

function GetRandomBoardPos() {
  return {
    x: Math.round(Math.random() * (boardCols - 1)),
    y: Math.round(Math.random() * (boardRows - 1)),
  }
}

function GetBoardRowAndColumn(x, y) {
  const c = Math.round((x - (boardWidth * -0.5 + boardPillarWidth * 0.5)) / boardPillarWidth)
  const r = Math.round((y - (boardDepth * -0.5 + boardPillarWidth * 0.5)) / boardPillarWidth)
  return {
    column: c,
    row: r,
  }
}

function IsOnBoard(column, row) {
  return column >= 0 && column < boardCols && row >= 0 && row < boardRows
}

function RandomizePillars(world, component) {
  console.log('randomize pillars')
  const {eid, schema} = component

  for (let column = 0; column < schema.boardColumns; column++) {
    for (let row = 0; row < schema.boardRows; row++) {
      const newHeight = Math.random() * schema.maxPillarHeight
      const peid = GetPillar(column, row)
      Pillar.set(world, peid, {
        targetHeight: newHeight,
      })
    }
  }
}

const GameBoard = ecs.registerComponent({
  name: 'gameBoard',
  schema: {
    pillarWidth: ecs.f32,
    pillarHeight: ecs.f32,
    maxPillarHeight: ecs.f32,
    boardChangePeriod: ecs.f32,
    boardRows: ecs.i32,
    boardColumns: ecs.i32,
    pillarPrefab: ecs.eid,
    boardChangeInterval: ecs.i32,
  },
  schemaDefaults: {
    pillarWidth: 0.05,
    pillarHeight: 0.2,
    maxPillarHeight: 0.05,
    boardChangePeriod: 10.0,
    boardRows: 10,
    boardColumns: 10,
    boardChangeInterval: 10000,
  },
  data: {
    lastSpawn: ecs.f32,
  },
  add: (world, component) => {
    const {eid, schema, data} = component

    // TH - I assume I'm committing some sort of cardinal sin here but it currently works
    boardCols = schema.boardColumns
    boardRows = schema.boardRows
    boardWidth = schema.boardColumns * schema.pillarWidth
    boardDepth = schema.boardRows * schema.pillarWidth
    boardPillarWidth = schema.pillarWidth

    // Create pillars
    for (let row = 0; row < schema.boardColumns; row++) {
      for (let column = 0; column < schema.boardRows; column++) {
        const center = GetPillarStartingCenter(component, column, row)
        const newPillar = world.createEntity()
        cloneComponents(schema.pillarPrefab, newPillar, world)
        setComponent(newPillar, 'Position', {x: center.x, y: center.y, z: center.z}, world)

        pillars.push(newPillar)
      }
    }

    RandomizePillars(world, component)
  },
  tick: (world, component) => {
    const nextSpawn = component.data.lastSpawn + component.schema.boardChangeInterval
    if (world.time.elapsed > nextSpawn) {
      component.data.lastSpawn = world.time.elapsed
      RandomizePillars(world, component)
    }
  },
})

export {GameBoard, GetPillar, GetPillarPos, IsOnBoard, GetRandomBoardPos, GetBoardRowAndColumn}
