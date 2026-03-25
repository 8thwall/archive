import * as ecs from '@8thwall/ecs'
import type {ScreenTouchMoveEvent} from '@8thwall/ecs'

import {addCleanup, doCleanup} from '../helpers/cleanup'

import {WALK_REQUEST_EVENT} from './walk-to-click'

// TODO (christoph): Improve typing
type Listener = (e: any) => void

const tempMatrix = ecs.math.mat4.i()

const tempTrs = {
  t: ecs.math.vec3.zero(),
  r: ecs.math.quat.zero(),
  s: ecs.math.vec3.zero(),
}

ecs.registerComponent({
  name: 'hold-drag',
  schema: {
    factor: ecs.f32,
  },
  add: (world, component) => {
    const {eid} = component

    let r = 0
    let g = 0
    let b = 0

    try {
      ({r, g, b} = ecs.Material.get(world, eid))
    } catch (err) {
      //
    }

    const handleStart: Listener = () => {
      ecs.Material.set(world, eid, {r: 255, g: 0, b: 0})

      world.getWorldTransform(eid, tempMatrix)
      tempMatrix.decomposeTrs(tempTrs)
      console.log('Emitting walk request', tempTrs.t.x, tempTrs.t.z)
      world.events.dispatch(world.events.globalId, WALK_REQUEST_EVENT, {
        target: eid,
        x: tempTrs.t.x,
        z: tempTrs.t.z,
      })
    }

    const handleEnd: Listener = () => {
      ecs.Material.set(world, eid, {r, g, b})
    }

    const handleMove: Listener = (e: {data: ScreenTouchMoveEvent}) => {
      const position = ecs.Position.cursor(world, eid)
      const {factor} = component.schema

      // Adjust movement to account for 45-degree angle
      const dx = e.data.change.x * factor
      const dy = e.data.change.y * factor

      const cos45 = Math.cos(Math.PI / 4)
      const sin45 = Math.sin(Math.PI / 4)

      // Apply 45-degree rotation to the movement, swap x and z movements, and invert left-to-right
      // movement
      position.x += (dy * cos45 + dx * sin45)
      position.z += (dy * sin45 - dx * cos45)
    }

    world.events.addListener(world.events.globalId, ecs.input.SCREEN_TOUCH_START, handleStart)
    world.events.addListener(world.events.globalId, ecs.input.SCREEN_TOUCH_MOVE, handleMove)
    world.events.addListener(world.events.globalId, ecs.input.SCREEN_TOUCH_END, handleEnd)

    const cleanup = () => {
      world.events.removeListener(world.events.globalId, ecs.input.SCREEN_TOUCH_START, handleStart)
      world.events.removeListener(world.events.globalId, ecs.input.SCREEN_TOUCH_MOVE, handleMove)
      world.events.removeListener(world.events.globalId, ecs.input.SCREEN_TOUCH_END, handleEnd)
    }
    addCleanup(component, cleanup)
  },
  remove: (world, component) => {
    doCleanup(component)
  },
})
