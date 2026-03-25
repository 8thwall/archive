// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

import {saveData} from '../local-storage'
import {Direction} from '../movement-controller'
import {adjustStat, CharacterStats} from '../character-stats'
import {CharacterTag} from '../tags'
import {Damage} from '../damage'

const BlightEnemyController = ecs.registerComponent({
  name: 'blight-enemy-controller',
  schema: {
    // Probability in of changing direction when close to a perpindicular grid line.
    pChangeDirection: ecs.f32,
    direction: ecs.ui8,
    minimumGridMoves: ecs.ui8,
    targetEid: ecs.eid,  // Can be empoty

    // Distance where enemy will attack character.
    attackDistance: ecs.f32,

    // Distance where enemy will target character.
    visionDistance: ecs.f32,

    // Distance where enemy will forget character.
    lostDistance: ecs.f32,

    // Minimum times between attacks in MS
    attackCooldown: ecs.i32,

    attackSpeed: ecs.f32,

    physicalDamage: ecs.i32,
    staminaDamage: ecs.i32,

    hitEid: ecs.eid,
    isDead: ecs.boolean,
    isBoss: ecs.boolean,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
    pChangeDirection: 0.5,
    direction: 0,
    minimumGridMoves: 2,
    attackDistance: 1.0,
    visionDistance: 4.0,
    lostDistance: 6.0,
    attackCooldown: 1200,

    attackSpeed: 4.0,

    physicalDamage: 35,
    staminaDamage: 100,
  },
  data: {
    // Add data that cannot be configured outside of the component.
    currentGridX: ecs.i32,
    currentGridZ: ecs.i32,
    gridsSinceLastDirectionChange: ecs.i32,
    timeSinceLastAttack: ecs.i32,
    startX: ecs.f32,
    startY: ecs.f32,
    startZ: ecs.f32,
  },
  add: (world, component) => {
    const {data} = component
    const {x, y, z} = ecs.Position.get(world, component.eid)
    data.startX = x
    data.startY = y
    data.startZ = z
  },
  stateMachine: ({world, eid, dataAttribute, schemaAttribute}) => {
    ecs.defineState('inactive').initial().onEnter(() => {
      const {startX, startY, startZ} = dataAttribute.get(eid)
      ecs.Position.set(world, eid, {x: startX, y: startY, z: startZ})
    }).onEvent('activate', 'patrolling')
    const patrolling = ecs.defineState('patrolling')
    const targeting = ecs.defineState('targeting')
    const attackStart = ecs.defineState('attackStart')
    const attackHit = ecs.defineState('attackHit')
    const attackFinish = ecs.defineState('attackFinish')
    const attackBlocked = ecs.defineState('attackBlocked')
    const dead = ecs.defineState('dead')

    const toPatrolling = ecs.defineTrigger()
    const toTargeting = ecs.defineTrigger()
    const toAttackStart = ecs.defineTrigger()
    const toAttackHit = ecs.defineTrigger()
    const toAttackFinish = ecs.defineTrigger()
    const toAttackBlocked = ecs.defineTrigger()
    const toDead = ecs.defineTrigger()

    // TODO: Add a stagger state, that could prevent attackStart from moving to attackFinish.

    attackFinish.onTrigger(toTargeting, 'targeting')

    patrolling.onTrigger(toTargeting, 'targeting')

    targeting.onTrigger(toPatrolling, 'patrolling')
    targeting.onTrigger(toAttackStart, 'attackStart')

    attackStart.onTrigger(toAttackHit, 'attackHit')
    attackHit.onTrigger(toAttackBlocked, 'attackBlocked')
    attackHit.onTrigger(toAttackFinish, 'attackFinish')

    const allStates = ecs.defineStateGroup(
      [patrolling, targeting, attackStart, attackHit, attackFinish, attackBlocked, dead]
    )

    const dieableStates = ecs.defineStateGroup(
      [patrolling, targeting, attackStart, attackHit, attackFinish, attackBlocked]
    )

    dieableStates.onTrigger(toDead, dead)

    dieableStates.onTick(() => {
      const stats = CharacterStats.get(world, eid)
      const {health} = stats
      if (health <= 0) {
        toDead.trigger()
        if (schemaAttribute.get(eid).isBoss) {
          world.events.dispatch(world.events.globalId, 'bossDied')
        }
      }
    })

    const findCharacterSystem = ecs.defineSystem([CharacterTag, ecs.Position],
      (charWorld, charEid, [_, charPos]) => {
        const schema = schemaAttribute.cursor(eid)
        const charPosVec = ecs.math.vec3.from(charPos as any)
        const enemyPos = ecs.math.vec3.from(ecs.Position.get(world, eid))
        const dx = (charPosVec.x as number) - enemyPos.x
        const dz = (charPosVec.z as number) - enemyPos.z
        const dist = Math.sqrt(dx * dx + dz * dz)
        if (dist <= schema.visionDistance) {
          // Only consider targeting if character is close enough.
          let shouldTarget = false
          switch (schema.direction) {
            case Direction.Up:
              if (charPosVec.z < enemyPos.z) {
                shouldTarget = true
              }
              break
            case Direction.Down:
              if (charPosVec.z > enemyPos.z) {
                shouldTarget = true
              }
              break
            case Direction.Left:
              if (charPosVec.x < enemyPos.x) {
                shouldTarget = true
              }
              break
            case Direction.Right:
              if (charPosVec.x > enemyPos.x) {
                shouldTarget = true
              }
              break
            default:
          }
          if (shouldTarget) {
            // TODO: Raycast against any colliders to prevent looking through walls.
            schema.targetEid = charEid
            toTargeting.trigger()
          }
        }
      })

    patrolling.onEnter(() => {
      const data = dataAttribute.cursor(eid)
      const schema = schemaAttribute.cursor(eid)
      const pos = ecs.Position.get(world, eid)

      data.currentGridX = pos.x
      data.currentGridZ = pos.z
      data.gridsSinceLastDirectionChange = 0

      ecs.GltfModel.set(world, eid, {
        animationClip: 'Walk Cycle Loop',
        crossFadeDuration: 0.1,
        timeScale: 1.0,
        loop: true,
      })

      ecs.registerBehavior(findCharacterSystem)
    }).onTick(() => {
      const data = dataAttribute.cursor(eid)
      const schema = schemaAttribute.cursor(eid)

      if (schema.isBoss) {
        toTargeting.trigger()
        return
      }

      const pos = ecs.Position.cursor(world, eid)
      const stats = CharacterStats.get(world, eid)
      const {speed} = stats

      const rotateToDirection = (direction: Direction) => {
        const radians = 90 * direction * (Math.PI / 180)
        const rotation = ecs.math.quat.yRadians(radians)
        ecs.Quaternion.set(world, eid, rotation)
      }

      const posX = Math.round(pos.x)
      const posZ = Math.round(pos.z)

      let changedGrid = false

      if (data.currentGridX !== posX) {
        data.currentGridX = posX
        data.gridsSinceLastDirectionChange += 1
        changedGrid = true
      }

      if (data.currentGridZ !== posZ) {
        data.currentGridZ = posZ
        data.gridsSinceLastDirectionChange += 1
        changedGrid = true
      }

      if (changedGrid && data.gridsSinceLastDirectionChange > schema.minimumGridMoves) {
        if (schema.pChangeDirection < Math.random()) {
          schema.direction = Math.floor(Math.random() * 4)
          data.gridsSinceLastDirectionChange = 0
        }
      } else {
        const {x: vx, z: vz} = ecs.physics.getLinearVelocity(world, eid)
        if (Math.abs(vx) < 0.0001 && Math.abs(vz) < 0.0001) {
          schema.direction = Math.floor(Math.random() * 4)
          data.gridsSinceLastDirectionChange = 0
        }
      }

      const radians = 90 * schema.direction * (Math.PI / 180)
      const x = Math.sin(radians)
      const z = Math.cos(radians)

      // Force grid alignment on the perpindicular direction.
      if (schema.direction === Direction.Up || schema.direction === Direction.Down) {
        pos.x = Math.round(pos.x * 2) * 0.5
      } else {
        pos.z = Math.round(pos.z * 2) * 0.5
      }

      rotateToDirection(schema.direction)
      ecs.physics.setLinearVelocity(world, eid, x * speed, 0, z * speed)
    }).onExit(() => {
      ecs.unregisterBehavior(findCharacterSystem)
    })

    targeting.onEnter(() => {
      const data = dataAttribute.cursor(eid)
      const pos = ecs.Position.get(world, eid)

      ecs.GltfModel.set(world, eid, {
        animationClip: 'Walk Cycle Loop',
        crossFadeDuration: 0.1,
        timeScale: 1.0,
        loop: true,
      })
    }).onTick(() => {
      const data = dataAttribute.cursor(eid)
      const schema = schemaAttribute.cursor(eid)

      data.timeSinceLastAttack += world.time.delta

      const pos = ecs.math.vec3.from(ecs.Position.cursor(world, eid))
      const stats = CharacterStats.get(world, eid)
      const {speed} = stats

      const rotateToDirection = (direction: Direction) => {
        const radians = 90 * direction * (Math.PI / 180)
        const rotation = ecs.math.quat.yRadians(radians)
        ecs.Quaternion.set(world, eid, rotation)
      }

      const posX = Math.round(pos.x)
      const posZ = Math.round(pos.z)

      const charPos = ecs.Position.get(world, schema.targetEid)
      const dx = charPos.x - pos.x
      const dz = charPos.z - pos.z
      const dist = Math.max(Math.abs(dx), Math.abs(dz))

      let changedGrid = false

      if (data.currentGridX !== posX) {
        data.currentGridX = posX
        data.gridsSinceLastDirectionChange += 1
        changedGrid = true
      }

      if (data.currentGridZ !== posZ) {
        data.currentGridZ = posZ
        data.gridsSinceLastDirectionChange += 1
        changedGrid = true
      }

      if (changedGrid) {
        if (Math.abs(dx) > Math.abs(dz)) {
          if (dx < 0) {
            schema.direction = Direction.Left
          } else {
            schema.direction = Direction.Right
          }
        } else if (dz < 0) {
          schema.direction = Direction.Up
        } else {
          schema.direction = Direction.Down
        }
        data.gridsSinceLastDirectionChange = 0
      }

      const radians = 90 * schema.direction * (Math.PI / 180)
      const x = Math.sin(radians)
      const z = Math.cos(radians)

      // Force grid alignment on the perpindicular direction.
      if (schema.direction === Direction.Up || schema.direction === Direction.Down) {
        ecs.Position.set(world, eid, {x: Math.round(pos.x * 2) * 0.5})
      } else {
        ecs.Position.set(world, eid, {z: Math.round(pos.z * 2) * 0.5})
      }

      rotateToDirection(schema.direction)

      ecs.physics.setLinearVelocity(world, eid, x * speed, 0, z * speed)

      const ad = schema.isBoss ? 4 : schema.attackDistance

      if (dist > schema.lostDistance) {
        toPatrolling.trigger()
      } else if (dist < ad && data.timeSinceLastAttack > schema.attackCooldown) {
        toAttackStart.trigger()
      }
    }).onExit(() => {
    })

    const ATTACK_START_TIME = 600
    const ATTACK_HIT_TIME = 100
    const ATTACK_FINISH_TIME = 500

    attackStart.onEnter(() => {
      ecs.GltfModel.set(world, eid, {
        animationClip: 'Light Attack',
        crossFadeDuration: 0.1,
        timeScale: 1.0,
        loop: false,
      })
      ecs.physics.setLinearVelocity(world, eid, 0, 0, 0)
      const data = dataAttribute.cursor(eid)
      data.timeSinceLastAttack = 0
    }).onTick(() => {
      const data = dataAttribute.cursor(eid)
      data.timeSinceLastAttack += world.time.delta
    }).wait(ATTACK_START_TIME, 'attackHit')

    attackHit.onEnter(() => {
      const schema = schemaAttribute.cursor(eid)
      // Activate the hitbox.
      world.events.dispatch(schema.hitEid, 'activate')
    }).onTick(() => {
      const schema = schemaAttribute.cursor(eid)
      const radians = 90 * schema.direction * (Math.PI / 180)
      const x = Math.sin(radians)
      const z = Math.cos(radians)

      const stats = CharacterStats.get(world, eid)
      const {speed} = stats

      // If attack blocked, transition to attack blocked.
      if (Damage.get(world, schema.hitEid).blocked) {
        toAttackBlocked.trigger()
        return
      }

      ecs.physics.setLinearVelocity(
        world, eid, schema.attackSpeed * x * speed, 0, schema.attackSpeed * z * speed
      )
      const data = dataAttribute.cursor(eid)
      data.timeSinceLastAttack += world.time.delta
    }).onExit(() => {
      const schema = schemaAttribute.cursor(eid)
      // Deactivate the hitbox.
      world.events.dispatch(schema.hitEid, 'deactivate')
    }).wait(ATTACK_HIT_TIME, 'attackFinish')

    attackFinish.onEnter(() => {
      ecs.physics.setLinearVelocity(world, eid, 0, 0, 0)
    }).wait(ATTACK_FINISH_TIME, 'targeting')

    attackBlocked.onEnter(() => {
      ecs.GltfModel.set(world, eid, {
        animationClip: 'Light Attack',
        crossFadeDuration: 0.1,
        timeScale: -1.0,
        loop: false,
      })
      ecs.physics.setLinearVelocity(world, eid, 0, 0, 0)
    }).wait(ATTACK_START_TIME, 'targeting')

    dead.onEnter(() => {
      ecs.GltfModel.set(world, eid, {
        animationClip: undefined,
        crossFadeDuration: 0.1,
        timeScale: 1.0,
        loop: false,
      })
      schemaAttribute.set(eid, {
        isDead: true,
      })
      const schema = schemaAttribute.cursor(eid)
      if (schema.isBoss) {
        world.events.dispatch(world.events.globalId, 'bossDied')
      }
      saveData({gold: 50}, true)
      world.events.dispatch(world.events.globalId, 'DATA_CHANGED')
      ecs.physics.setLinearVelocity(world, eid, 0, 0, 0)
      ecs.Quaternion.set(world, eid, {x: 0.0, y: 0.0, z: 1.0, w: 0.0})
    }).onExit(() => {
      schemaAttribute.set(eid, {
        isDead: false,
      })
    })

    const inactive = ecs.defineTrigger()
    allStates.listen(world.events.globalId, 'resetGame', () => {
      const stats = CharacterStats.get(world, eid)
      const {maxHealth} = stats
      adjustStat(world, eid, 'health', maxHealth)
      inactive.trigger()
    }).onTrigger(inactive, 'inactive')
  },
})

export {BlightEnemyController}
