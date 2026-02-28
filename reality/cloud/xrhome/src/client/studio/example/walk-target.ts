import ecs from '@ecs/runtime'
import {createInstanced} from '@ecs/shared/instanced'

import {WALK_REQUEST_EVENT} from './walk-to-click'

// TODO(christoph): Improve typing
type Listener = (e: any) => void
type Cleanup = () => void

const cleanups = createInstanced<ecs.World, Map<BigInt, Cleanup>>(() => new Map())

const tempTrs = {
  t: ecs.math.vec3.zero(),
  r: ecs.math.quat.zero(),
  s: ecs.math.vec3.zero(),
}
const tempMatrix = ecs.math.mat4.i()

ecs.registerComponent({
  name: 'walk-target',
  add: (world, component) => {
    const {eid} = component

    let r = 0
    let g = 0
    let b = 0

    const hasMaterial = ecs.Material.has(world, eid)

    if (hasMaterial) {
      ({r, g, b} = ecs.Material.get(world, eid))
    }

    const handleStart: Listener = () => {
      ecs.Material.set(world, eid, {r: 255, g: 0, b: 0})

      world.getWorldTransform(eid, tempMatrix)
      tempMatrix.decomposeTrs(tempTrs)
      world.events.dispatch(world.events.globalId, WALK_REQUEST_EVENT, {
        source: eid,
        x: tempTrs.t.x,
        z: tempTrs.t.z,
      })
    }
    const handleEnd: Listener = () => {
      if (hasMaterial) {
        ecs.Material.set(world, eid, {r, g, b})
      }
    }

    world.events.addListener(eid, ecs.input.SCREEN_TOUCH_START, handleStart)
    world.events.addListener(eid, ecs.input.SCREEN_TOUCH_END, handleEnd)

    const cleanup = () => {
      world.events.removeListener(eid, ecs.input.SCREEN_TOUCH_START, handleStart)
      world.events.removeListener(eid, ecs.input.SCREEN_TOUCH_END, handleEnd)
    }
    cleanups(world).set(component.eid, cleanup)
  },
  remove: (world, component) => {
    cleanups(world).get(component.eid)?.()
    cleanups(world).delete(component.eid)
  },
})
