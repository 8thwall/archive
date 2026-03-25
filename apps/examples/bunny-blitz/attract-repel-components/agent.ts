import * as ecs from '@8thwall/ecs'
import {clampPositionToRadius} from '../helpers/radius'
import {Influencer} from './influencer'
import {getGlobalConfig} from '../bunny-blitz-components/global-config'

const {Position, GltfModel, LookAtAnimation} = ecs
const {vec3} = ecs.math

const influencerQuery = ecs.defineQuery([Influencer])

const AGENT_BEHAVIOR = {
  SEEK: 'seek',
  AVOID: 'avoid',
}

const AGENT_STATES = {
  IDLE: 'idle',
  IDLE_MOVE: 'idle_move',
  ALERT: 'alert',
  ACTIVE: 'active',
  EVENT: 'event',
  LOST_INFLUENCER: 'lost_influencer',
}

const EPSILON = 0.1

const targetPosition = vec3.zero()
const v = vec3.zero()

const getClosestInfluencer = (world, component) => {
  let minDistance = Infinity
  let closestInfluencer = null
  const influencers = influencerQuery(world)

  influencers.forEach((influencerId) => {
    const {currentPositionX: cx, currentPositionY: cy, currentPositionZ: cz} = component.data
    targetPosition.setFrom(Position.get(world, influencerId))

    const distance = v.setXyz(cx, cy, cz).setMinus(targetPosition).length()

    if (distance < minDistance) {
      minDistance = distance
      closestInfluencer = influencerId
    }
  })

  return {closestInfluencer, distance: minDistance}
}

const influenceAgent = (world, component, closestInfluencerId, distance) => {
  let closestInfluencer = null
  try {
    closestInfluencer = Influencer.get(world, closestInfluencerId)
  } catch {
    closestInfluencer = null
  }

  if (!closestInfluencer) return

  if (distance < closestInfluencer.eventRadius) {
    component.data.state = AGENT_STATES.EVENT
  } else if (distance < closestInfluencer.activeRadius) {
    component.data.behavior = closestInfluencer.attract ? AGENT_BEHAVIOR.SEEK : AGENT_BEHAVIOR.AVOID
    component.data.state = AGENT_STATES.ACTIVE

    targetPosition.setFrom(Position.get(world, closestInfluencerId))

    // Calculate the direction vector
    const directionX = targetPosition.x - component.data.currentPositionX
    const directionZ = targetPosition.z - component.data.currentPositionZ

    // if (component.data.behavior === AGENT_BEHAVIOR.AVOID) {
    //   directionX = -directionX
    //   directionZ = -directionZ
    // }

    const targetX = component.data.currentPositionX + directionX
    const targetZ = component.data.currentPositionZ + directionZ

    const clampedPosition = clampPositionToRadius(targetX, targetZ, component.data.radius)
    component.data.targetPositionX = clampedPosition.x
    component.data.targetPositionY = component.data.currentPositionY  // Avoid vertical movement
    component.data.targetPositionZ = clampedPosition.z
  } else if (distance < closestInfluencer.alertRadius) {
    component.data.state = AGENT_STATES.ALERT
  } else if (
    component.data.previousState !== AGENT_STATES.IDLE &&
    component.data.previousState !== AGENT_STATES.IDLE_MOVE) {
    component.data.state = AGENT_STATES.IDLE_MOVE
  }
}

const randomRange = (min, max) => Math.random() * (max - min) + min

const moveAgent = (world, component) => {
  const dx = component.data.targetPositionX - component.data.currentPositionX
  const dz = component.data.targetPositionZ - component.data.currentPositionZ
  const distance = Math.sqrt(dx * dx + dz * dz)

  const directionMultiplier = component.data.behavior === AGENT_BEHAVIOR.SEEK ? 1 : -1

  if (distance > EPSILON) {
    const normX = (directionMultiplier * dx) / distance
    const normZ = (directionMultiplier * dz) / distance

    // Update position based on speed
    component.data.currentPositionX += normX * component.schema.speed
    component.data.currentPositionZ += normZ * component.schema.speed

    // Clamp position within radius
    const clampedPosition = clampPositionToRadius(
      component.data.currentPositionX, component.data.currentPositionZ, component.data.radius
    )
    component.data.currentPositionX = clampedPosition.x
    component.data.currentPositionZ = clampedPosition.z

    // Check if agent reached the boundary and stop movement if it did
    if (
      Math.sqrt(
        component.data.currentPositionX * component.data.currentPositionX +
        component.data.currentPositionZ * component.data.currentPositionZ
      ) >= component.data.radius) {
      component.data.state = AGENT_STATES.IDLE
    }

    const position = ecs.Position.cursor(world, component.eid)
    position.x = component.data.currentPositionX
    position.z = component.data.currentPositionZ
    position.y = component.data.currentPositionY  // Ensure Y position remains unchanged

    try {
      LookAtAnimation.set(world, component.eid, {
        targetX: component.data.currentPositionX + normX,
        targetY: component.data.currentPositionY,
        targetZ: component.data.currentPositionZ + normZ,
      })
    } catch (e) {
      console.log(e)
      console.log('Couldn\'t set LookAtAnimation component params')
    }
  } else {
    component.data.state = AGENT_STATES.IDLE
  }
}

const Agent = ecs.registerComponent({
  name: 'agent',
  schema: {
    speed: ecs.f32,
    rotationOffset: ecs.f32,
    yOffset: ecs.f32,
    idleUpdateInterval: ecs.f32,
    eventUpdateInterval: ecs.f32,
    animated: ecs.boolean,
    // @condition animated=true
    idleAnimation: ecs.string,
    // @condition animated=true
    idleMovementAnimation: ecs.string,
    // @condition animated=true
    alertAnimation: ecs.string,
    // @condition animated=true
    activeAnimation: ecs.string,
    // @condition animated=true
    eventAnimation: ecs.string,
  },
  schemaDefaults: {
    speed: 0.1,
    rotationOffset: 0,
    idleUpdateInterval: 2000,
    eventUpdateInterval: 1000,
    yOffset: 0,
  },
  data: {
    currentPositionX: ecs.f32,
    currentPositionY: ecs.f32,
    currentPositionZ: ecs.f32,
    targetPositionX: ecs.f32,
    targetPositionY: ecs.f32,
    targetPositionZ: ecs.f32,
    state: ecs.string,
    previousState: ecs.string,
    behavior: ecs.string,
    lastUpdate: ecs.f32,
    lastEventUpdate: ecs.f32,
    radius: ecs.f32,
  },
  add: (world, component) => {
    const position = ecs.Position.get(world, component.eid)
    component.data.currentPositionX = position.x
    component.data.currentPositionY = position.y + component.schema.yOffset
    component.data.currentPositionZ = position.z

    component.data.state = AGENT_STATES.IDLE
    component.data.previousState = AGENT_STATES.IDLE
    component.data.behavior = AGENT_BEHAVIOR.SEEK
    component.data.lastUpdate = 0
    component.data.lastEventUpdate = 0

    const globalConfig = getGlobalConfig(world)
    component.data.radius = globalConfig.radius
  },
  tick: (world, component) => {
    const currentTime = world.time.elapsed

    const {closestInfluencer, distance} = getClosestInfluencer(world, component)
    influenceAgent(world, component, closestInfluencer, distance)

    if (component.data.state !== component.data.previousState) {
      component.data.previousState = component.data.state
      component.data.lastUpdate = currentTime

      if (component.schema.animated) {
        let animationName = ''
        let shouldLoop = true

        switch (component.data.state) {
          case AGENT_STATES.IDLE:
            shouldLoop = true
            animationName = component.schema.idleAnimation
            break
          case AGENT_STATES.IDLE_MOVE:
            shouldLoop = true
            animationName = component.schema.idleMovementAnimation
            break
          case AGENT_STATES.ALERT:
            shouldLoop = true
            animationName = component.schema.alertAnimation
            break
          case AGENT_STATES.ACTIVE:
            shouldLoop = true
            animationName = component.schema.activeAnimation
            break
          case AGENT_STATES.EVENT:
            shouldLoop = true
            animationName = component.schema.eventAnimation
            break
          default:
            break
        }

        if (animationName) {
          GltfModel.set(world, component.eid, {
            animationClip: animationName,
            loop: shouldLoop,
            paused: false,
          })
        }
      }
    }

    if (component.data.state === AGENT_STATES.EVENT &&
      currentTime - component.data.lastEventUpdate > component.schema.eventUpdateInterval
    ) {
      component.data.lastEventUpdate = currentTime
      const eventPayload = {
        behavior: component.data.behavior,
        influencer: closestInfluencer,
      }
      world.events.dispatch(component.eid, 'agentInfluencerEvent', eventPayload)
    }

    if ((component.data.state === AGENT_STATES.IDLE) &&
      currentTime - component.data.lastUpdate > component.schema.idleUpdateInterval
    ) {
      // Define the movement range
      const movementRange = 3

      // Generate random offsets within ±movementRange
      const offsetX = randomRange(-movementRange, movementRange)
      const offsetZ = randomRange(-movementRange, movementRange)

      // Calculate new target positions
      const targetX = component.data.currentPositionX + offsetX
      const targetZ = component.data.currentPositionZ + offsetZ

      // Clamp the new position to ensure it stays within the circle radius
      const clampedPosition = clampPositionToRadius(targetX, targetZ, component.data.radius)

      // Update target positions
      component.data.targetPositionX = clampedPosition.x
      component.data.targetPositionY = component.data.currentPositionY  // Avoid vertical movement
      component.data.targetPositionZ = clampedPosition.z

      component.data.lastUpdate = currentTime
      component.schema.idleUpdateInterval = randomRange(500, 3000)
      component.data.state = AGENT_STATES.IDLE_MOVE
    }

    if (component.data.state === AGENT_STATES.ACTIVE ||
      component.data.state === AGENT_STATES.IDLE_MOVE
    ) {
      moveAgent(world, component)
    }
  },
  remove: (world, component) => {
    console.log(`Agent removed with EID: ${component.eid}`)
  },
})

export {
  Agent,
  AGENT_BEHAVIOR,
  AGENT_STATES,
}
