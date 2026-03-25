import * as ecs from '@8thwall/ecs'
import {ScreenTouchMoveEvent} from '@8thwall/ecs'
import {addCleanup, doCleanup} from '../helpers/cleanup'

// TODO: Improve typing
type Listener = (e: any) => void;

const {Position, Quaternion} = ecs
const {SCREEN_TOUCH_END, SCREEN_TOUCH_MOVE, SCREEN_TOUCH_START} = ecs.input
const {mat4, quat, vec3} = ecs.math

const tempVec = vec3.zero()
const tempMatrix = mat4.i()

const tempTrs = {
  t: vec3.zero(),
  r: quat.zero(),
  s: vec3.zero(),
}

const calculateDistance = (pointA, pointB) => tempVec.setFrom(pointA).minus(pointB).length()

const calculateAverage = distances => distances.reduce((acc, distance) => acc + distance, 0)

const HoldDrag = ecs.registerComponent({
  name: 'hold-drag',
  schema: {
    factor: ecs.f32,
    lag: ecs.f32,
    distanceThreshold: ecs.f32,
  },
  add: (world, component) => {
    let moving = false
    const {eid} = component

    let r = 0
    let g = 0
    let b = 0

    try {
      ({r, g, b} = ecs.Material.get(world, eid))
    } catch (err) {
      //
    }

    const targetPosition = vec3.zero()
    const currentPosition = vec3.zero()
    const targetQuaternion = quat.zero()
    const currentQuaternion = quat.zero()

    world.getWorldTransform(eid, tempMatrix)
    tempMatrix.decomposeTrs(tempTrs)

    targetPosition.setFrom(tempTrs.t)
    currentPosition.setFrom(tempTrs.t)
    currentQuaternion.setFrom(tempTrs.r)

    let smoothedDistance = 0

    const handleStart: Listener = () => {
      world.getWorldTransform(eid, tempMatrix)
      tempMatrix.decomposeTrs(tempTrs)

      targetPosition.setFrom(tempTrs.t)
      currentPosition.setFrom(tempTrs.t)
      currentQuaternion.setFrom(tempTrs.r)
      // world.events.dispatch(eid, 'moveStart', {})
    }

    const handleEnd: Listener = () => {
      // world.events.dispatch(eid, 'moveEnd', {})
    }

    const {factor} = component.schema

    const handleMove: Listener = (e: { data: ScreenTouchMoveEvent }) => {
      tempVec.setXyz(e.data.change.x * factor, 0, e.data.change.y * factor)

      targetPosition.setPlus(tempVec)

      if (tempVec.length() > 0.01) {
        const angle = Math.atan2(-tempVec.z, tempVec.x)
        targetQuaternion.makePitchYawRollRadians(tempVec.setXyz(0, angle, 0))
      }
    }

    const distances = []

    const tick = () => {
      const distance = calculateDistance(targetPosition, currentPosition)
      distances.push(distance)

      while (distances.length > 5) {
        distances.shift()
      }

      // Calculate the exponential moving average for the distance
      smoothedDistance = calculateAverage(distances)

      const threshold = component?.schema?.distanceThreshold || 0.1

      if (smoothedDistance < threshold) {
        if (moving) {
          world.events.dispatch(eid, 'moveEnd', {})
          moving = false
          console.log('Stopping influencer')
        }
      } else if (!moving) {
        world.events.dispatch(eid, 'moveStart', {})
        moving = true
        console.log('Moving influencer')
      }

      const lag = component?.schema?.lag || 0.5
      currentPosition.setMix(targetPosition, lag)
      Position.set(world, eid, currentPosition)

      currentQuaternion.setSlerp(targetQuaternion, lag / 2)
      Quaternion.set(world, eid, currentQuaternion)
    }

    world.events.addListener(eid, SCREEN_TOUCH_START, handleStart)
    world.events.addListener(eid, SCREEN_TOUCH_MOVE, handleMove)
    world.events.addListener(eid, SCREEN_TOUCH_END, handleEnd)

    ecs.registerBehavior(tick)

    addCleanup(component, () => {
      world.events.removeListener(eid, SCREEN_TOUCH_START, handleStart)
      world.events.removeListener(eid, SCREEN_TOUCH_MOVE, handleMove)
      world.events.removeListener(eid, SCREEN_TOUCH_END, handleEnd)
      ecs.unregisterBehavior(tick)
    })
  },
  remove: (world, component) => {
    doCleanup(component)
  },
})

export {HoldDrag}
