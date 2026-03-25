// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

import {Action, ActionEvent} from './input-controller'
import {ShieldUp} from './shield-controller'
import {CharacterStats, adjustStat} from './character-stats'

import {AttackStaminaModifier} from './stamina-modifiers'

enum Direction {
  Down = 0,
  Right = 1,
  Up = 2,
  Left = 3,
}

const MovementController = ecs.registerComponent({
  name: 'movement-controller',
  schema: {
    // Add data that can be configured on the component.
    speed: ecs.f32,
    shieldSpeed: ecs.f32,
    player: ecs.eid,
    characterModel: ecs.eid,
    teeth: ecs.eid,
    attackStaminaCost: ecs.i32,
    hitBox: ecs.eid,
    attackSpeed: ecs.f32,
    attackDamage: ecs.i32,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
    speed: 4.5,
    // Speed when shield is up.
    shieldSpeed: 2.5,
    attackStaminaCost: 55,

    attackSpeed: 0.8,
    attackDamage: 35,
  },
  data: {
    // Add data that cannot be configured outside of the component.
    direction: ecs.ui8,
    desiredDirection: ecs.ui8,
    desiredOffset: ecs.f32,
    horizontalMove: ecs.i32,
    verticalMove: ecs.i32,
  },
  add: (world, component) => {
    // Runs when the component is added to the world.
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    const toIdle = ecs.defineTrigger()
    const toWalking = ecs.defineTrigger()

    const toAttackStart = ecs.defineTrigger()
    const toAttackHit = ecs.defineTrigger()
    const toAttackFinish = ecs.defineTrigger()
    const toDead = ecs.defineTrigger()

    const idle = ecs.defineState('idle').initial()
    const walking = ecs.defineState('walking')
    const attackStart = ecs.defineState('attackStart')
    const attackHit = ecs.defineState('attackHit')
    const attackFinish = ecs.defineState('attackFinish')
    const dead = ecs.defineState('dead')

    const dieableStates = ecs.defineStateGroup(
      [idle, walking, attackStart, attackHit, attackFinish]
    )
    dieableStates.onTrigger(toDead, dead)
    dieableStates.onTick(() => {
      const stats = CharacterStats.get(world, eid)
      const {health} = stats
      if (health <= 0) {
        toDead.trigger()
        world.events.dispatch(world.events.globalId, 'playerDie')
      }
    })

    const rotateToDirection = (direction: Direction) => {
      const radians = 90 * direction * (Math.PI / 180)
      const rotation = ecs.math.quat.yRadians(radians)
      ecs.Quaternion.set(world, eid, rotation)
    }

    const setDirection = (position: {x: number, z: number}, tolerance: number = 0.1) => {
      const data = dataAttribute.cursor(eid)
      if (data.direction === data.desiredDirection) {
        rotateToDirection(data.direction)
        return
      }

      const desiredIsVertical =
        (data.desiredDirection === Direction.Up || data.desiredDirection === Direction.Down)
      const offset = desiredIsVertical ? position.x : position.z

      const delta = data.desiredOffset - offset

      let rotateRight = delta > 0
      if (data.desiredDirection === Direction.Up || data.desiredDirection === Direction.Right) {
        rotateRight = !rotateRight
      }

      if (Math.abs(delta) < tolerance) {
        data.direction = data.desiredDirection
      } else if (rotateRight) {
        data.direction = (data.desiredDirection + 1) % 4
      } else {
        data.direction = (data.desiredDirection + 3) % 4
      }
      rotateToDirection(data.direction)
    }

    const handleAttackStart = (ev) => {
      const {action} = ev.data as ActionEvent
      if (action === Action.Attack) {
        // If stamina is greater than zero
        if (CharacterStats.get(world, eid).stamina > 0) {
          toAttackStart.trigger()
        }
      }
    }

    const updateDesiredDirection = () => {
      // const radians = 90 * data.direction * (Math.PI / 180)
      // const x = Math.sin(radians)
      // const z = Math.cos(radians)
      const data = dataAttribute.cursor(eid)
      const pos = ecs.Position.cursor(world, eid)

      if (data.verticalMove === 1 && data.direction !== Direction.Up) {
        data.desiredDirection = Direction.Up
        data.desiredOffset = 0.5 * Math.round(2 * pos.x)
      } else if (data.verticalMove === -1 && data.direction !== Direction.Down) {
        data.desiredDirection = Direction.Down
        data.desiredOffset = 0.5 * Math.round(2 * pos.x)
      } else if (data.horizontalMove === 1 && data.direction !== Direction.Right) {
        data.desiredDirection = Direction.Right
        data.desiredOffset = 0.5 * Math.round(2 * pos.z)
      } else if (data.horizontalMove === -1 && data.direction !== Direction.Left) {
        data.desiredDirection = Direction.Left
        data.desiredOffset = 0.5 * Math.round(2 * pos.z)
      }

      //
      // const nearestHalf =
      //
      // const compareToNearestHalf = (x: number, tolerance = 1e-4): -1 | 0 | 1 => {
      // const nearestHalf = Math.round(x * 2) / 2
      // const diff = nearestHalf - x
      //
      // if (Math.abs(diff) < tolerance) return 0
      // return diff < 0 ? -1 : 1
      // }
      //
    }

    const handleMoveStart = (ev) => {
      const data = dataAttribute.cursor(eid)
      const {action} = ev.data as ActionEvent
      switch (action) {
        case Action.MoveUp:
          data.verticalMove += 1
          break
        case Action.MoveDown:
          data.verticalMove -= 1
          break
        case Action.MoveLeft:
          data.horizontalMove -= 1
          break
        case Action.MoveRight:
          data.horizontalMove += 1
          break
        default:
          // Exit early.
          return
      }
      updateDesiredDirection()
    }

    const handleMoveEnd = (ev) => {
      const {action} = ev.data as ActionEvent
      const data = dataAttribute.cursor(eid)
      switch (action) {
        case Action.MoveUp:
          data.verticalMove -= 1
          break
        case Action.MoveDown:
          data.verticalMove += 1
          break
        case Action.MoveLeft:
          data.horizontalMove += 1
          break
        case Action.MoveRight:
          data.horizontalMove -= 1
          break
        default:
          // Exit early
          return
      }
      updateDesiredDirection()
    }

    const notAttackingStates = ecs.defineStateGroup([idle, walking])

    const listeningStates = ecs.defineStateGroup([
      idle, walking, attackStart, attackHit, attackFinish, dead])

    notAttackingStates.onTrigger(toIdle, 'idle')
    notAttackingStates.onTrigger(toWalking, 'walking')
    notAttackingStates.onTrigger(toAttackStart, 'attackStart')

    attackStart.onTrigger(toAttackHit, 'attackHit')
    attackHit.onTrigger(toAttackFinish, 'attackFinish')

    listeningStates.listen(eid, 'actionStart', handleMoveStart)
    listeningStates.listen(eid, 'actionEnd', handleMoveEnd)
    listeningStates.listen(eid, 'actionStart', handleAttackStart)

    const {characterModel: modelEid, teeth: teethEid} = schemaAttribute.get(eid)

    idle.onEnter(() => {
      ecs.GltfModel.set(world, modelEid, {
        animationClip: 'Armature|idle',
        crossFadeDuration: 0.1,
        timeScale: 1.0,
        loop: true,
      })
    }).onTick(() => {
      const pos = ecs.Position.cursor(world, eid)
      const data = dataAttribute.cursor(eid)

      setDirection(pos)
      ecs.physics.setLinearVelocity(world, eid, 0, 0, 0)

      if (data.horizontalMove !== 0 || data.verticalMove !== 0) {
        toWalking.trigger()
      }
    })

    walking.onEnter(() => {
      ecs.GltfModel.set(world, modelEid, {
        animationClip: 'Armature|run',
        crossFadeDuration: 0.1,
        timeScale: 1.0,
        loop: true,
      })
    }).onTick(() => {
      const data = dataAttribute.cursor(eid)
      const pos = ecs.Position.cursor(world, eid)
      setDirection(pos)

      const radians = 90 * data.direction * (Math.PI / 180)
      const x = Math.sin(radians)
      const z = Math.cos(radians)

      // Force grid alignment on the perpindicular direction.
      if (data.direction === Direction.Up || data.direction === Direction.Down) {
        pos.x = Math.round(pos.x * 2) * 0.5
      } else {
        pos.z = Math.round(pos.z * 2) * 0.5
      }

      const schema = schemaAttribute.cursor(eid)

      const speed = ShieldUp.has(world, eid) ? schema.shieldSpeed : schema.speed

      ecs.physics.setLinearVelocity(world, eid, x * speed, 0, z * speed)

      if (data.horizontalMove === 0 && data.verticalMove === 0) {
        toIdle.trigger()
      }
    })

    const ATTACK_START_TIME = 600
    const ATTACK_HIT_TIME = 150
    const ATTACK_FINISH_TIME = 250

    attackStart.onEnter(() => {
      ecs.GltfModel.set(world, modelEid, {
        animationClip: 'Armature|attack',
        crossFadeDuration: 0.1,
        timeScale: 1.0,
        loop: false,
      })
      const schema = schemaAttribute.get(eid)
      const data = dataAttribute.cursor(eid)

      adjustStat(world, eid, 'stamina', -schema.attackStaminaCost)

      // Don't regenerate stamina while attacking.
      AttackStaminaModifier.set(world, eid, {value: 0.0})
    }).onTick(() => {
      const data = dataAttribute.cursor(eid)
      const pos = ecs.Position.cursor(world, eid)
      data.direction = data.desiredDirection
      setDirection(pos)
      ecs.physics.setLinearVelocity(world, eid, 0, 0, 0)
    }).wait(ATTACK_START_TIME, attackHit)

    attackHit.onEnter(() => {
      const schema = schemaAttribute.get(eid)
      // Activate the hitbox.
      world.events.dispatch(schema.hitBox, 'activate')
    }).onTick(() => {
      const data = dataAttribute.cursor(eid)
      const schema = schemaAttribute.cursor(eid)

      const radians = 90 * data.direction * (Math.PI / 180)
      const x = Math.sin(radians)
      const z = Math.cos(radians)

      const pos = ecs.Position.cursor(world, eid)
      data.direction = data.desiredDirection
      setDirection(pos)

      const stats = CharacterStats.get(world, eid)
      const {speed} = stats

      ecs.physics.setLinearVelocity(
        world, eid, schema.attackSpeed * x * speed, 0, schema.attackSpeed * z * speed
      )
    }).onExit(() => {
      const schema = schemaAttribute.cursor(eid)
      // Deactivate the hitbox.
      world.events.dispatch(schema.hitBox, 'deactivate')
    }).wait(ATTACK_HIT_TIME, attackFinish)

    attackFinish.onExit(() => {
      const schema = schemaAttribute.cursor(eid)
      // Resume stamina regeneration.
      AttackStaminaModifier.set(world, eid, {value: 1.0})
    }).wait(ATTACK_FINISH_TIME, 'idle')

    dead.onEnter(() => {
      ecs.GltfModel.set(world, modelEid, {
        animationClip: 'Armature|die',
        crossFadeDuration: 0.1,
        timeScale: 1.0,
        loop: false,
      })
      ecs.physics.setLinearVelocity(world, eid, 0, 0, 0)
    }).onTick(() => {
      ecs.physics.setLinearVelocity(world, eid, 0, 0, 0)
    }).listen(world.events.globalId, 'resetGame', () => {
      const stats = CharacterStats.get(world, eid)
      const {maxHealth} = stats
      adjustStat(world, eid, 'health', maxHealth)
      ecs.Position.set(world, eid, {x: 0, y: 0, z: 0})
      toIdle.trigger()
    }).onTrigger(toIdle, 'idle')
  },
})

export {Direction, MovementController}
