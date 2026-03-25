import ecs from './helpers/runtime'
import {Character, CHARACTER_ACTIONS, CHARACTER_FACINGS, GetRotationForFacing} from './character'
import {Game, GetGhost} from './game'
import {GetBoardRowAndColumn} from './gameboard'

// Register the component with the ECS system
const Projectile = ecs.registerComponent({
  name: 'projectile',
  schema: {
    spinSpeed: ecs.f32,
    movementSpeed: ecs.f32,
    lifetime: ecs.i32,
    facing: ecs.string,
    prefab: ecs.boolean,
  },
  schemaDefaults: {
    prefab: false,
    spinSpeed: 480,
    movementSpeed: 0.1,
    lifetime: 10000,
  },
  data: {
    timeLastTick: ecs.i32,
    lifetimeTimer: ecs.i32,
    xRotation: ecs.f32,
  },

  add: (world, component) => {
    const {data, schema} = component
    data.lastAction = 0
    data.cooldown = schema.minActionCooldown + (Math.random() * (schema.maxActionCooldown - schema.minActionCooldown))
    data.xRotation = 0
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

    // Spin
    data.xRotation += scaledDelta * schema.spinSpeed
    const yRotation = GetRotationForFacing(schema.facing)

    // Rotation
    const qx = ecs.math.quat.xDegrees(data.xRotation)
    const qy = ecs.math.quat.yDegrees(yRotation)
    const q = qy.times(qx)
    world.setQuaternion(component.eid, q.x, q.y, q.z, q.w)

    // Move
    // TH - TODO - Clean up
    const pos = ecs.Position.get(world, eid)
    const newPos = ecs.math.vec3.xyz(pos.x, pos.y, pos.z)

    if (schema.facing === CHARACTER_FACINGS.NORTH) {
      newPos.setXyz(pos.x, pos.y, pos.z + schema.movementSpeed * scaledDelta)
    } else if (schema.facing === CHARACTER_FACINGS.SOUTH) {
      newPos.setXyz(pos.x, pos.y, pos.z - schema.movementSpeed * scaledDelta)
    } else if (schema.facing === CHARACTER_FACINGS.WEST) {
      newPos.setXyz(pos.x - (schema.movementSpeed * scaledDelta), pos.y, pos.z)
    } else if (schema.facing === CHARACTER_FACINGS.EAST) {
      newPos.setXyz(pos.x + (schema.movementSpeed * scaledDelta), pos.y, pos.z)
    } else {
      console.log('u', schema.facing)
    }

    // console.log(pos.x, pos.y, pos.z, newPos.x, newPos.y, newPos.z)
    world.setPosition(component.eid, newPos.x, newPos.y, newPos.z)

    // Check for ghost collisions
    const rc = GetBoardRowAndColumn(newPos.x, newPos.z)
    //console.log('proj', rc.column, rc.row, newPos)
    const g = GetGhost(world, rc.column, rc.row)
    if (g !== null) {
      world.events.dispatch(world.events.globalId, 'projectile_hit_ghost', {projectile: eid, ghost: g})
      world.deleteEntity(component.eid)
    } else {
      data.lifetimeTimer += delta
      if (data.lifetimeTimer >= schema.lifetime) {
        console.log('despawn')
        world.deleteEntity(component.eid)
      }
    }
  },
})

export {Projectile}
