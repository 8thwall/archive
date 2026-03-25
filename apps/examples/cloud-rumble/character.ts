import ecs from './helpers/runtime'
import {GetCoin, GetGhost} from './game'
import {GameBoard, GetPillarPos, IsOnBoard} from './gameboard'
import {Projectile} from './projectile'
import {cloneComponents, setComponent} from './helpers/clone-tools'

const CHARACTER_FACINGS = {
  NORTH: 'north',
  WEST: 'west',
  EAST: 'east',
  SOUTH: 'south',
}

const CHARACTER_ACTIONS = {
  NOT_SET: 'not_set',
  TURN_CCW: 'turn_ccw',
  TURN_CW: 'turn_cw',
  MOVE_FORWARD: 'move_forward',
  MOVE_BACKWARD: 'move_backward',
  ATTACK: 'attack',
}

const CHARACTER_STATES = {
  NOT_SET: 'not_set',
  IDLE: 'idle',
  TURNING_1: 'turning_1',
  TURNING_2: 'turning_2',
  TURNING_3: 'turning_3',
  MOVING_1: 'moving_1',
  MOVING_2: 'moving_2',
  MOVING_3: 'moving_3',
  BUMP_REACT: 'bump_react',
  ATTACK_1: 'attack_1',
  ATTACK_2: 'attack_2',
  DYING: 'dying',
  DEAD: 'dead',
}

function GetRotationForFacing(facing) {
  // console.log('f', facing)
  if (facing === CHARACTER_FACINGS.NORTH) {
    return 0
  } else if (facing === CHARACTER_FACINGS.WEST) {
    return 270
  } else if (facing === CHARACTER_FACINGS.EAST) {
    return 90
  } else if (facing === CHARACTER_FACINGS.SOUTH) {
    return 180
  } else {
    console.log('error')
  }
}

function GetCCWRotation(facing) {
  // console.log('ccw', facing)
  if (facing === CHARACTER_FACINGS.NORTH) {
    return CHARACTER_FACINGS.WEST
  } else if (facing === CHARACTER_FACINGS.WEST) {
    return CHARACTER_FACINGS.SOUTH
  } else if (facing === CHARACTER_FACINGS.EAST) {
    return CHARACTER_FACINGS.NORTH
  } else if (facing === CHARACTER_FACINGS.SOUTH) {
    return CHARACTER_FACINGS.EAST
  } else {
    console.log('error')
  }
}

function GetCWRotation(facing) {
  // console.log('cw', facing)
  if (facing === CHARACTER_FACINGS.NORTH) {
    return CHARACTER_FACINGS.EAST
  } else if (facing === CHARACTER_FACINGS.WEST) {
    return CHARACTER_FACINGS.NORTH
  } else if (facing === CHARACTER_FACINGS.EAST) {
    return CHARACTER_FACINGS.SOUTH
  } else if (facing === CHARACTER_FACINGS.SOUTH) {
    return CHARACTER_FACINGS.WEST
  } else {
    console.log('error')
  }
}

function GetDestinationForward(column, row, facing) {
  // console.log('for', facing, row, column)
  if (facing === CHARACTER_FACINGS.NORTH) {
    return {newColumn: column, newRow: row + 1}
  } else if (facing === CHARACTER_FACINGS.WEST) {
    return {newColumn: column - 1, newRow: row}
  } else if (facing === CHARACTER_FACINGS.EAST) {
    return {newColumn: column + 1, newRow: row}
  } else if (facing === CHARACTER_FACINGS.SOUTH) {
    return {newColumn: column, newRow: row - 1}
  } else {
    console.log('error')
  }
}

function GetDestinationBack(column, row, facing) {
  // console.log('back', facing, row, column)
  if (facing === CHARACTER_FACINGS.NORTH) {
    return {newColumn: column, newRow: row - 1}
  } else if (facing === CHARACTER_FACINGS.WEST) {
    return {newColumn: column + 1, newRow: row}
  } else if (facing === CHARACTER_FACINGS.EAST) {
    return {newColumn: column - 1, newRow: row}
  } else if (facing === CHARACTER_FACINGS.SOUTH) {
    return {newColumn: column, newRow: row + 1}
  } else {
    console.log('error')
  }
}

function lerp(x, y, a) {
  return x * (1 - a) + y * a
}

function LaunchProjectile(world, component) {
  // TH - Note the clone is required here (or we move the 'get') since creating new entities
  // messes with the return reference we get from ecs.Position.get, changing the values
  const pos = ecs.math.vec3.from(ecs.Position.get(world, component.eid))
  const newProjectile = world.createEntity()
  cloneComponents(component.schema.projectilePrefab, newProjectile, world)
  world.setPosition(newProjectile, pos.x, pos.y + component.schema.projectileOffsetY, pos.z)
  Projectile.set(world, newProjectile, {
    prefab: false,
    facing: component.data.currentFacing,
  })
}

// Register the component with the ECS system
const Character = ecs.registerComponent({
  name: 'character',
  schema: {
    prefab: ecs.boolean,
    player: ecs.boolean,
    board: ecs.eid,
    maxJumpHeight: ecs.f32,
    preJumpPeriod: ecs.i32,
    movementPeriod: ecs.i32,
    postJumpPeriod: ecs.i32,
    preTurnPeriod: ecs.i32,
    turnPeriod: ecs.i32,
    postTurnPeriod: ecs.i32,
    preAttackPeriod: ecs.i32,
    attackPeriod: ecs.i32,
    dyingPeriod: ecs.i32,
    projectilePrefab: ecs.eid,
    projectileOffsetY: ecs.f32,
    currentColumn: ecs.i32,
    currentRow: ecs.i32,
    nextAction: ecs.string,
    idleAnim: ecs.string,
    turningAnim: ecs.string,
    movingForwardAnim: ecs.string,
    movingBackwardAnim: ecs.string,
    bumpAnim: ecs.string,
    attackAnim: ecs.string,
    dyingAnim: ecs.string,
    deadAnim: ecs.string,
    dying: ecs.boolean,
    revive: ecs.boolean,
  },
  schemaDefaults: {
    prefab: false,
    player: false,
    maxJumpHeight: 0.2,
    preJumpPeriod: 150,
    movementPeriod: 200,
    postJumpPeriod: 600,
    preTurnPeriod: 150,
    turnPeriod: 150,
    postTurnPeriod: 600,
    preAttackPeriod: 200,
    attackPeriod: 500,
    dyingPeriod: 500,
    projectileOffsetY: 0.05,
    dying: false,
    revive: false,
  },
  data: {
    state: ecs.string,
    movementTimer: ecs.i32,
    currentFacing: ecs.string,
    targetFacing: ecs.string,
    startRotation: ecs.f32,
    targetRotation: ecs.f32,
    targetColumn: ecs.i32,
    targetRow: ecs.i32,
    timeElapsedLast: ecs.i32,
  },

  add: (world, component) => {
    const {data, schema} = component
    data.state = CHARACTER_STATES.IDLE
    data.currentFacing = CHARACTER_FACINGS.NORTH
    data.timeElapsedLast = 0
    if (schema.idleAnim !== '') {
      ecs.GltfModel.set(world, component.eid, {
        animationClip: schema.idleAnim,
        loop: true,
      })
    }
  },

  tick: (world, component) => {
    const {eid} = component
    const {schema} = component  // Use the keyState and schema from the component
    const {data} = component

    if (schema.prefab) {
      return
    }

    if (schema.revive) {
      console.log('reviving')
      schema.revive = false
      schema.dying = false
      data.state = CHARACTER_STATES.IDLE
      data.currentFacing = CHARACTER_FACINGS.NORTH
      data.timeElapsedLast = 0
      if (schema.idleAnim !== '') {
        ecs.GltfModel.set(world, component.eid, {
          animationClip: schema.idleAnim,
          loop: true,
        })
      }
      return
    }
    // console.log('state', data.state, 'time', world.time.elapsed)

    const timeDelta = world.time.elapsed - data.timeElapsedLast
    data.timeElapsedLast = world.time.elapsed

    const pillarPos = GetPillarPos(world, schema.currentColumn, schema.currentRow)

    switch (data.state) {
      case CHARACTER_STATES.IDLE:
        {
          world.setPosition(component.eid, pillarPos.x, pillarPos.y, pillarPos.z)

          if (schema.player) {
          // See if a ghost has shown up and killed us
            const g = GetGhost(world, schema.currentColumn, schema.currentRow)
            if (g != null) {
              world.events.dispatch(world.events.globalId, 'ghost_hit_player', {player: eid, ghost: g})
            }
          }
        }
        break

      case CHARACTER_STATES.BUMP_REACT:
        // TH - TODO - Time anim
        world.setPosition(component.eid, pillarPos.x, pillarPos.y, pillarPos.z)
        break

      case CHARACTER_STATES.MOVING_1:
        world.setPosition(component.eid, pillarPos.x, pillarPos.y, pillarPos.z)
        data.movementTimer += timeDelta
        if (data.movementTimer >= schema.preJumpPeriod) {
          data.movementTimer = 0
          data.state = CHARACTER_STATES.MOVING_2
          return
        }
        break

      case CHARACTER_STATES.MOVING_2:
        {
          data.movementTimer += timeDelta
          const destPos = GetPillarPos(world, data.targetColumn, data.targetRow)
          if (data.movementTimer >= schema.movementPeriod) {
            world.setPosition(component.eid, destPos.x, destPos.y, destPos.z)
            schema.currentColumn = data.targetColumn
            schema.currentRow = data.targetRow
            data.movementTimer = 0
            data.state = CHARACTER_STATES.MOVING_3
            return
          } else {
            const c = ecs.math.vec3.xyz(pillarPos.x, pillarPos.y, pillarPos.z)
            const d = ecs.math.vec3.xyz(destPos.x, destPos.y, destPos.z)
            const newPos = c.mix(d, data.movementTimer / schema.movementPeriod)
            world.setPosition(component.eid, newPos.x, newPos.y, newPos.z)
          }
        }
        break

      case CHARACTER_STATES.MOVING_3:
        world.setPosition(component.eid, pillarPos.x, pillarPos.y, pillarPos.z)
        data.movementTimer += timeDelta
        if (data.movementTimer >= schema.postJumpPeriod) {
          if (schema.idleAnim !== '') {
            ecs.GltfModel.set(world, component.eid, {
              animationClip: schema.idleAnim,
              loop: true,
            })
          }

          if (schema.player) {
            const c = GetCoin(world, schema.currentColumn, schema.currentRow)
            if (c != null) {
              world.events.dispatch(world.events.globalId, 'player_collected_coin', {player: eid, coin: c})
            }

            const g = GetGhost(world, schema.currentColumn, schema.currentRow)
            if (g != null) {
              world.events.dispatch(world.events.globalId, 'ghost_hit_player', {player: eid, ghost: g})
            }
          } else {
            // Test for player collision

          }

          data.state = CHARACTER_STATES.IDLE
          return
        }

        break

      case CHARACTER_STATES.TURNING_1:
        world.setPosition(component.eid, pillarPos.x, pillarPos.y, pillarPos.z)
        data.movementTimer += timeDelta
        if (data.movementTimer >= schema.preTurnPeriod) {
          data.movementTimer = 0
          data.state = CHARACTER_STATES.TURNING_2
          return
        }
        break

      case CHARACTER_STATES.TURNING_2:
        world.setPosition(component.eid, pillarPos.x, pillarPos.y, pillarPos.z)
        data.movementTimer += timeDelta
        if (data.movementTimer >= schema.turnPeriod) {
          data.currentFacing = data.targetFacing
          data.movementTimer = 0
          data.state = CHARACTER_STATES.TURNING_3
          return
        } else {
          // console.log(data.movementTimer / schema.turnPeriod, data.startRotation, data.targetRotation)
          const q1 = ecs.math.quat.zero()
          const q2 = ecs.math.quat.zero()
          q1.makeYDegrees(data.startRotation)
          q2.makeYDegrees(data.targetRotation)
          const q3 = q1.slerp(q2, data.movementTimer / schema.turnPeriod)
          world.setQuaternion(component.eid, q3.x, q3.y, q3.z, q3.w)
        }
        break

      case CHARACTER_STATES.TURNING_3:
        world.setPosition(component.eid, pillarPos.x, pillarPos.y, pillarPos.z)
        data.movementTimer += timeDelta
        if (data.movementTimer >= schema.postTurnPeriod) {
          if (schema.idleAnim !== '') {
            ecs.GltfModel.set(world, component.eid, {
              animationClip: schema.idleAnim,
              loop: true,
            })
          }
          data.state = CHARACTER_STATES.IDLE
          return
        }
        break

      case CHARACTER_STATES.ATTACK_1:
        world.setPosition(component.eid, pillarPos.x, pillarPos.y, pillarPos.z)
        data.movementTimer += timeDelta
        if (data.movementTimer >= schema.preAttackPeriod) {
          LaunchProjectile(world, component)
          data.movementTimer = 0
          data.state = CHARACTER_STATES.ATTACK_2
          return
        }
        break

      case CHARACTER_STATES.ATTACK_2:
        world.setPosition(component.eid, pillarPos.x, pillarPos.y, pillarPos.z)
        data.movementTimer += timeDelta
        if (data.movementTimer >= schema.attackPeriod) {
          if (schema.idleAnim !== '') {
            ecs.GltfModel.set(world, component.eid, {
              animationClip: schema.idleAnim,
              loop: true,
            })
          }
          data.state = CHARACTER_STATES.IDLE
          return
        }
        break

      case CHARACTER_STATES.DYING:
        world.setPosition(component.eid, pillarPos.x, pillarPos.y, pillarPos.z)
        data.movementTimer += timeDelta
        if (data.movementTimer >= schema.dyingPeriod) {
          if (schema.deadAnim !== '') {
            ecs.GltfModel.set(world, component.eid, {
              animationClip: schema.deadAnim,
              loop: true,
            })
          }
          data.movementTimer = 0
          data.state = CHARACTER_STATES.DEAD
          world.events.dispatch(world.events.globalId, 'game_over', {})
          return
        }
        break

      case CHARACTER_STATES.DEAD:
        world.setPosition(component.eid, pillarPos.x, pillarPos.y, pillarPos.z)
        break

      default:
        break
    }

    if (data.state === CHARACTER_STATES.IDLE) {
      if (schema.dying) {
        data.movementTimer = 0
        data.state = CHARACTER_STATES.DYING
        if (schema.dyingAnim !== '') {
          ecs.GltfModel.set(world, component.eid, {
            animationClip: schema.dyingAnim,
            loop: false,
          })
        }
      } else if (schema.nextAction !== CHARACTER_ACTIONS.NOT_SET) {
      // Start new action
        switch (schema.nextAction) {
          case CHARACTER_ACTIONS.TURN_CCW:
            data.movementTimer = 0
            data.targetFacing = GetCCWRotation(data.currentFacing)
            data.startRotation = GetRotationForFacing(data.currentFacing)
            data.targetRotation = GetRotationForFacing(data.targetFacing)
            data.state = CHARACTER_STATES.TURNING_1
            if (schema.turningAnim !== '') {
              ecs.GltfModel.set(world, component.eid, {
                animationClip: schema.turningAnim,
                loop: false,
              })
            }
            break

          case CHARACTER_ACTIONS.TURN_CW:
            data.movementTimer = 0
            data.targetFacing = GetCWRotation(data.currentFacing)
            data.startRotation = GetRotationForFacing(data.currentFacing)
            data.targetRotation = GetRotationForFacing(data.targetFacing)
            data.state = CHARACTER_STATES.TURNING_1
            if (schema.turningAnim !== '') {
              ecs.GltfModel.set(world, component.eid, {
                animationClip: schema.turningAnim,
                loop: false,
              })
            }
            break

          case CHARACTER_ACTIONS.MOVE_FORWARD:
            {
              const dest = GetDestinationForward(schema.currentColumn, schema.currentRow, data.currentFacing)

              // See if we can move forward
              if (!IsOnBoard(dest.newColumn, dest.newRow)) {
              // TODO: Bump anim
                console.log('cant move forward - off board', dest.newColumn, dest.newRow)
              } else {
                // Check height
                const targetPillarPos = GetPillarPos(world, dest.newColumn, dest.newRow)
                const diff = targetPillarPos.y - pillarPos.y
                if (diff > schema.maxJumpHeight) {
                  // TODO: Bump anim
                  console.log('cant move forward - too high', diff, schema.maxJumpHeight)
                } else {
                  data.movementTimer = 0
                  data.targetColumn = dest.newColumn
                  data.targetRow = dest.newRow
                  data.state = CHARACTER_STATES.MOVING_1
                  if (schema.movingForwardAnim !== '') {
                    ecs.GltfModel.set(world, component.eid, {
                      animationClip: schema.movingForwardAnim,
                      loop: false,
                    })
                  }
                }
              }
            }
            break

          case CHARACTER_ACTIONS.MOVE_BACKWARD:
            {
              const dest = GetDestinationBack(schema.currentColumn, schema.currentRow, data.currentFacing)
              // See if we can move forward
              if (!IsOnBoard(dest.newColumn, dest.newRow)) {
              // TODDO: Bump anim
                console.log('cant move back - off board', dest.newColumn, dest.newRow)
              } else {
                // Check height
                const targetPillarPos = GetPillarPos(world, dest.newColumn, dest.newRow)
                const diff = targetPillarPos.y - pillarPos.y
                if (diff > schema.maxJumpHeight) {
                  // TODO: Bump anim
                  console.log('cant move back - too high', diff, schema.maxJumpHeight)
                } else {
                  data.movementTimer = 0
                  data.targetColumn = dest.newColumn
                  data.targetRow = dest.newRow
                  data.state = CHARACTER_STATES.MOVING_1
                  if (schema.movingBackwardAnim !== '') {
                    ecs.GltfModel.set(world, component.eid, {
                      animationClip: schema.movingBackwardAnim,
                      loop: false,
                    })
                  }
                }
              }
            }
            break

          case CHARACTER_ACTIONS.ATTACK:
            data.movementTimer = 0
            data.state = CHARACTER_STATES.ATTACK_1
            if (schema.attackAnim !== '') {
              ecs.GltfModel.set(world, component.eid, {
                animationClip: schema.attackAnim,
                loop: false,
              })
            }
            break

          default:
            break
        }

        schema.nextAction = CHARACTER_ACTIONS.NOT_SET
      }
    }
  },
})

export {Character, CHARACTER_ACTIONS, CHARACTER_FACINGS, GetRotationForFacing}
