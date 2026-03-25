import ecs from './helpers/runtime'
import {GameBoard, GetPillarPos, IsOnBoard} from './gameboard'

// Register the component with the ECS system
const Coin = ecs.registerComponent({
  name: 'coin',
  schema: {
    hoverHeight: ecs.f32,
    rotationX: ecs.f32,
    rotationY: ecs.f32,
    rotationZ: ecs.f32,
    spinSpeedX: ecs.f32,
    spinSpeedY: ecs.f32,
    spinSpeedZ: ecs.f32,
    prefab: ecs.boolean,
    currentColumn: ecs.i32,
    currentRow: ecs.i32,
  },
  schemaDefaults: {
    hoverHeight: 0.02,
    rotationX: 45.0,
    rotationY: 0.0,
    rotationZ: 45.0,
    spinSpeedX: 0,
    spinSpeedY: 180,
    spinSpeedZ: 0,
  },
  data: {
    xRotation: ecs.f32,
    yRotation: ecs.f32,
    zRotation: ecs.f32,
    timeLastTick: ecs.i32,
  },

  add: (world, component) => {
    const {data, schema} = component
    data.xRotation = schema.rotationX + (schema.spinSpeedX * Math.random())
    data.yRotation = schema.rotationY + (schema.spinSpeedY * Math.random())
    data.zRotation = schema.rotationZ + (schema.spinSpeedZ * Math.random())
    data.timeLastTick = world.time.elapsed
  },

  tick: (world, component) => {
    const {eid} = component
    const {schema} = component  // Use the keyState and schema from the component
    const {data} = component

    if (schema.prefab) {
      return
    }

    const timeThisTick = world.time.elapsed
    const delta = timeThisTick - data.timeLastTick
    const scaledDelta = delta / 1000
    data.timeLastTick = world.time.elapsed

    // Position
    const pillarPos = GetPillarPos(world, schema.currentColumn, schema.currentRow)
    world.setPosition(component.eid, pillarPos.x, pillarPos.y + schema.hoverHeight, pillarPos.z)

    // Spin
    data.xRotation += scaledDelta * schema.spinSpeedX
    data.yRotation += scaledDelta * schema.spinSpeedY
    data.zRotation += scaledDelta * schema.spinSpeedZ

    const qx = ecs.math.quat.xDegrees(data.xRotation)
    const qy = ecs.math.quat.yDegrees(data.yRotation)
    const qz = ecs.math.quat.yDegrees(data.zRotation)
    const q = qy.times(qx).times(qz)
    world.setQuaternion(component.eid, q.x, q.y, q.z, q.w)
  },
})

export {Coin}
