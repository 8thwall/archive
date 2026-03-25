import * as ecs from '@8thwall/ecs'

import {Structure} from './Structure'
import {DeleteAfter} from '../example-components/delete-after'
import {BurstParticles} from '../helpers/particleSpawner'
import {PlayAudio, PauseAudio, ChangeAudio} from '../helpers/audioController'

const structureQuery = ecs.defineQuery([Structure])

const EPSILON = 1.04
const COLLISION_COOLDOWN_TIME = 1000  // Cooldown time in milliseconds

const ENEMY_STATES = {
  MOVE: 'move',
  ATTACK: 'attack',
  DEFEAT: 'defeat',
  HIT: 'hit',
}

const enemyAgents = new Map()

class EnemyAgent {
  constructor(world, schema, eid) {
    this.world = world
    this.schema = {...schema}  // Copy schema values
    this.data = {
      targetPositionX: schema.targetPositionX,
      targetPositionY: schema.targetPositionY,
      targetPositionZ: schema.targetPositionZ,
      lastCollisionTime: 0,
      collisionCooldown: COLLISION_COOLDOWN_TIME,
      hitTime: 0,
      attackTarget: null,
      state: ENEMY_STATES.MOVE,
      previousState: '',
      behavior: '',
      lastUpdate: world.time.elapsed,
    }
    this.eid = eid

    this.setTargetPosition()
    this.schema.lastUpdate = this.world.time.elapsed
    this.data.lastCollisionTime = 0
    this.data.collisionCooldown = COLLISION_COOLDOWN_TIME
    this.world.setScale(this.eid, this.schema.scale, this.schema.scale, this.schema.scale)
    ecs.LookAtAnimation.set(this.world, this.eid, {targetX: this.data.targetPositionX, targetY: this.data.targetPositionY, targetZ: this.data.targetPositionZ})
  }

  calculateDistance(pointA, pointB) {
    const dx = pointA.x - pointB.x
    const dy = pointA.y - pointB.y
    const dz = pointA.z - pointB.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  checkForCollision() {
    let collisionDetected = false
    const currentPosition = {...ecs.Position.get(this.world, this.eid)}
    const self = this
    try {
      const structures = structureQuery(this.world)
      structures.forEach((structure) => {
        const structurePosition = {...ecs.Position.get(this.world, structure)}
        const distance = self.calculateDistance(currentPosition, structurePosition)
        // console.log(distance)
        if (distance < EPSILON) {
          console.log(`Collided with ${structure}`)
          this.data.attackTarget = structure
          collisionDetected = true
        }
      })
    } catch (e) {
      // console.log('Error getting structures')
      // console.log(e)
    }
    return collisionDetected
  }

  setTargetPosition() {
    try {
      const targetPosition = {...ecs.Position.get(this.world, this.schema.target)}
      this.data.targetPositionX = targetPosition.x
      this.data.targetPositionY = targetPosition.y
      this.data.targetPositionZ = targetPosition.z
    } catch (e) {
      // console.log('Target object doesn\'t exist!')
    }
  }

  getNewTargetPosition(currentPos, targetPos) {
    const targetCandidates = this.calculateTangentVectors(currentPos, targetPos)
    const index = Math.floor(Math.random() * targetCandidates.length)
    return targetCandidates[index]
  }

  calculateTangentVectors(currentPos, targetPos) {
  // Calculate the movement vector in the xz plane
    const movementVector = {
      x: targetPos.x - currentPos.x,
      z: targetPos.z - currentPos.z,
    }

    // Normalize the movement vector
    const magnitude = Math.sqrt(movementVector.x ** 2 + movementVector.z ** 2)
    const movementDirection = {
      x: movementVector.x / magnitude,
      z: movementVector.z / magnitude,
    }

    // Find a tangent vector (rotating the direction vector by 90 degrees)
    const tangentVector1 = {
      x: -3.5 * movementDirection.z,
      z: 3.5 * movementDirection.x,
    }

    const tangentVector2 = {
      x: 3.5 * movementDirection.z,
      z: -3.5 * movementDirection.x,
    }

    // Calculate the new target positions
    const newTargetPos1 = {
      x: currentPos.x + tangentVector1.x,
      y: currentPos.y,  // y remains unchanged
      z: currentPos.z + tangentVector1.z,
    }

    const newTargetPos2 = {
      x: currentPos.x + tangentVector2.x,
      y: currentPos.y,  // y remains unchanged
      z: currentPos.z + tangentVector2.z,
    }

    return [newTargetPos1, newTargetPos2]
  }

  setDetour() {
    const currentPosition = ecs.Position.cursor(this.world, this.eid)
    const targetPosition = {x: this.data.targetPositionX, y: this.data.targetPositionY, z: this.data.targetPositionZ}

    const newTargetPosition = this.getNewTargetPosition(currentPosition, targetPosition)
    console.log(newTargetPosition)
    this.data.targetPositionX = newTargetPosition.x
    this.data.targetPositionY = newTargetPosition.y
    this.data.targetPositionZ = newTargetPosition.z
    ecs.LookAtAnimation.set(this.world, this.eid, {targetX: this.data.targetPositionX, targetY: this.data.targetPositionY, targetZ: this.data.targetPositionZ})
  }

  move(currentTime) {
    if (currentTime - this.data.lastCollisionTime > this.data.collisionCooldown) {
      const collisionDetected = this.checkForCollision()
      if (collisionDetected && this.data.attackTarget !== this.schema.target) {
        if (Math.random() < this.schema.targetFocus) {
          this.setDetour()
          this.data.lastCollisionTime = currentTime
        } else {
          this.setState(ENEMY_STATES.ATTACK)
          return
        }
      } else if (collisionDetected && this.data.attackTarget === this.schema.target) {
        this.setState(ENEMY_STATES.ATTACK)
      }
    }

    const currentPosition = ecs.Position.cursor(this.world, this.eid)
    const dx = this.data.targetPositionX - currentPosition.x
    const dy = this.data.targetPositionY - currentPosition.y
    const dz = this.data.targetPositionZ - currentPosition.z
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

    const normX = dx / distance
    const normY = dy / distance
    const normZ = dz / distance

    if (distance > EPSILON) {
      const x = currentPosition.x + normX * this.schema.speed
      const y = currentPosition.y + normY * this.schema.speed
      const z = currentPosition.z + normZ * this.schema.speed
      this.world.setPosition(this.eid, x, y, z)
    } else {
      this.setTargetPosition(this.schema.target)
      ecs.LookAtAnimation.set(this.world, this.eid, {
        targetX: this.data.targetPositionX,
        targetY: this.data.targetPositionY,
        targetZ: this.data.targetPositionZ,
      })
    }
  }

  handleDefeat() {
    if (this.data.defeatActive) return

    console.log(`Enemy ${this.eid} defeated`)
    ecs.GltfModel.set(this.world, this.eid, {
      animationClip: this.schema.idleAnimation,
      timeScale: this.schema.idleAnimationSpeedScale,
    })
    this.data.defeatActive = true
    this.data.state = ENEMY_STATES.DEFEAT

    // const poof = this.world.createEntity()
    // const enemyPosition = ecs.Position.get(this.world, this.eid)
    // this.world.setPosition(poof, enemyPosition.x, enemyPosition.y + 1, enemyPosition.z)
    // ecs.PlaneGeometry.set(this.world, poof, {width: 1, height: 1})
    // ecs.Material.set(this.world, poof, {
    //   side: 'double',
    //   opacity: 0.999,
    //   r: 255,
    //   g: 255,
    //   b: 255,
    //   textureSrc: this.schema.poofTexture,
    // })
    // DeleteAfter.set(this.world, poof, {ms: 300})
    this.world.setScale(this.eid, 0, 0, 0)
    this.world.time.setTimeout(() => {
      this.world.deleteEntity(this.eid)
    }, 500)
  }

  setState(state) {
    if (this.data.state === state) return
    this.data.state = state
    switch (state) {
      case ENEMY_STATES.MOVE:
        this.onEnterMove()
        break
      case ENEMY_STATES.ATTACK:
        this.onEnterAttack()
        break
      case ENEMY_STATES.HIT:
        this.onEnterHit()
        break
      case ENEMY_STATES.DEFEAT:
        this.onEnterDefeat()
        break
      default:
        break
    }
  }

  onHit() {
    this.onAttack(1)
  }

  onAttack(amount) {
    this.schema.health -= amount
    if (this.schema.health > 0) {
      this.setState(ENEMY_STATES.HIT)
    } else {
      this.setState(ENEMY_STATES.DEFEAT)
    }
  }

  onEnterMove() {
    ecs.GltfModel.set(this.world, this.eid, {
      animationClip: this.schema.moveAnimation,
      loop: true,
      timeScale: this.schema.moveAnimationSpeedScale,
    })
    console.log('Entering MOVE state, playing move animation')
    this.schema.state = ENEMY_STATES.MOVE
  }

  onEnterAttack() {
    console.log('Entering ATTACK state, playing attack animation')
    ecs.GltfModel.set(this.world, this.eid, {
      animationClip: this.schema.attackAnimation,
      loop: true,
      timeScale: this.schema.attackAnimationSpeedScale,
    })
    this.schema.state = ENEMY_STATES.ATTACK
    this.setTargetPosition()
    ecs.LookAtAnimation.set(this.world, this.eid, {
      targetX: this.data.targetPositionX,
      targetY: this.data.targetPositionY,
      targetZ: this.data.targetPositionZ,
    })
  }

  onEnterHit() {
    ecs.GltfModel.set(this.world, this.eid, {
      animationClip: this.schema.hitAnimation,
      timeScale: this.schema.hitAnimationSpeedScale,
    })
    PauseAudio(this.world, this.eid)
    PlayAudio(this.world, this.eid)
    console.log('Entering HIT state, playing hit animation')
    this.data.hitTime = this.world.time.elapsed
    this.schema.state = ENEMY_STATES.HIT
    BurstParticles(this.world, this.eid, null)
  }

  onEnterDefeat() {
    PauseAudio(this.world, this.eid)
    ChangeAudio(this.world, this.eid, this.schema.deathAudio)
    PlayAudio(this.world, this.eid)
    console.log('Entering DEFEAT state')
    this.schema.state = ENEMY_STATES.DEFEAT
    this.handleDefeat()
  }

  onDisengage() {
    if (this.schema.state !== ENEMY_STATES.HIT) {
      this.onEnterMove()
    }
  }

  update() {
    switch (this.schema.state) {
      case ENEMY_STATES.MOVE:
        this.move(this.world.time.elapsed)
        break
      case ENEMY_STATES.HIT:
        if (this.world.time.elapsed - this.data.hitTime > this.schema.hitAnimationLength) {
          this.setState(ENEMY_STATES.MOVE)
        }
        break
      case ENEMY_STATES.ATTACK:
        // ecs.LookAtAnimation.set(this.world, this.eid, {
        //   targetX: this.data.targetPositionX,
        //   targetY: this.data.targetPositionY,
        //   targetZ: this.data.targetPositionZ,
        // })
        break
      default:
        break
    }
  }
}

const Enemy = ecs.registerComponent({
  name: 'Enemy',
  schema: {
    // @asset
    deathAudio: ecs.string,
    target: ecs.eid,
    speed: ecs.f32,
    health: ecs.i32,
    attackStrength: ecs.i32,
    attackRange: ecs.f32,
    attackInterval: ecs.f32,
    targetFocus: ecs.f32,
    poofTexture: ecs.string,
    scale: ecs.f32,
    idleAnimation: ecs.string,
    idleAnimationSpeedScale: ecs.f32,
    moveAnimation: ecs.string,
    moveAnimationSpeedScale: ecs.f32,
    hitAnimation: ecs.string,
    hitAnimationSpeedScale: ecs.f32,
    hitAnimationLength: ecs.f32,
    attackAnimation: ecs.string,
    attackAnimationSpeedScale: ecs.f32,
    state: ecs.string,
    defeatActive: ecs.boolean,
    lastUpdate: ecs.f32,
  },
  schemaDefaults: {
    speed: 1.0,
    attackStrength: 10,
    health: 10,
    attackInterval: 1.0,
    targetFocus: 1,
    scale: 1,
    state: '',
    defeatActive: false,
    idleAnimationSpeedScale: 1,
    moveAnimationSpeedScale: 1,
    hitAnimationSpeedScale: 1,
    attackAnimationSpeedScale: 1,
    hitAnimationLength: 1000,
  },
  add: (world, component) => {
    console.log(`Added Enemy Component ${component.eid}`)
    const enemyAgent = new EnemyAgent(world, component.schema, component.eid)
    enemyAgents.set(component.eid, enemyAgent)

    world.events.addListener(component.eid, ecs.input.SCREEN_TOUCH_START, (e) => {
      const agent = enemyAgents.get(e.target)
      agent.onHit()
    })

    world.events.addListener(component.eid, 'attack', (e) => {
      const agent = enemyAgents.get(e.target)
      if (agent) {
        agent.onAttack(e.data.amount)
      }
    })

    world.events.addListener(component.eid, 'performAttack', (e) => {
      const agent = enemyAgents.get(e.target)
      if (agent) {
        agent.setState(ENEMY_STATES.ATTACK)
      }
    })

    world.events.addListener(component.eid, 'disengage', (e) => {
      const agent = enemyAgents.get(e.target)
      if (agent) {
        agent.onDisengage()
      }
    })

    // TODO: Add cleanup for event listeners.

    enemyAgent.setState(ENEMY_STATES.MOVE)
  },
  tick: (world, component) => {
    const agent = enemyAgents.get(component.eid)
    if (agent && !agent.schema.defeatActive) {
      agent.update()
    }
  },
  remove: (world, component) => {
    enemyAgents.delete(component.eid)
  },
})

const EnemyConfig = ecs.registerComponent({
  name: 'EnemyConfig',
  schema: {
    // @asset
    deathAudio: ecs.string,
    target: ecs.eid,  // Target entity ID
    speed: ecs.f32,  // Movement speed
    health: ecs.i32,  // Health
    attackStrength: ecs.i32,  // Attack strength
    attackRange: ecs.f32,
    attackInterval: ecs.f32,  // Attack interval
    targetFocus: ecs.f32,
    // @asset
    poofTexture: ecs.string,
    scale: ecs.f32,
    idleAnimation: ecs.string,
    idleAnimationSpeedScale: ecs.f32,
    moveAnimation: ecs.string,
    moveAnimationSpeedScale: ecs.f32,
    hitAnimation: ecs.string,
    hitAnimationSpeedScale: ecs.f32,
    hitAnimationLength: ecs.f32,
    attackAnimation: ecs.string,
    attackAnimationSpeedScale: ecs.f32,
    // @condition true=false
    state: ecs.string,
    // @condition true=false
    defeatActive: ecs.boolean,
  },
  schemaDefaults: {
    speed: 1.0,
    attackStrength: 10,
    health: 10,
    attackInterval: 1.0,
    targetFocus: 1,
    scale: 1,
    defeatActive: false,
    idleAnimationSpeedScale: 1,
    moveAnimationSpeedScale: 1,
    hitAnimationSpeedScale: 1,
    attackAnimationSpeedScale: 1,
    hitAnimationLength: 1000,
  },
})

export {Enemy, EnemyConfig, ENEMY_STATES}
