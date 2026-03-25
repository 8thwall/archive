import * as ecs from '@8thwall/ecs'

import {addCleanup, doCleanup} from '../helpers/cleanup'
import {setYAngle} from '../helpers/angle'

// TODO(christoph): Improve typing
type Listener = (e: any) => void

const WALK_REQUEST_EVENT = 'walk-request'
type WalkRequest = {
  x: number
  z: number
}

const WalkToClick = ecs.registerComponent({
  name: 'walk-to-click',
  schema: {
    timeout: ecs.f32,

  },
  add: (world, component) => {
    const {eid} = component
    const handleRequest: Listener = (e: {data: WalkRequest}) => {
      const position = {...ecs.Position.get(world, eid)}
      const currentX = position.x
      const currentY = position.y
      const currentZ = position.z
      const distance = ((currentX - e.data.x) ** 2 + (currentZ - e.data.z) ** 2) ** 0.5
      const duration = distance * 1000
      const angle = -Math.atan2(e.data.z - currentZ, e.data.x - currentX) + Math.PI / 2
      console.log('handleRequest', Math.round((angle * 180) / Math.PI))

      // ecs.PositionAnimation.remove(world, eid)

      ecs.PositionAnimation.set(world, eid, {
        fromX: currentX,
        fromY: currentY,
        fromZ: currentZ,
        toX: e.data.x,
        toY: currentY,
        toZ: e.data.z,
        duration,
        easeIn: false,
        easeOut: false,
      })

      setYAngle(world, eid, angle)

      ecs.GltfModel.set(world, eid, {animationClip: 'Walking'})

      world.time.clearTimeout(WalkToClick.get(world, eid).timeout)

      WalkToClick.cursor(world, eid).timeout = world.time.setTimeout(() => {
        ecs.GltfModel.set(world, eid, {animationClip: 'Idle'})
      }, duration)
    }

    world.events.addListener(world.events.globalId, WALK_REQUEST_EVENT, handleRequest)

    const cleanup = () => {
      // world.time.clearTimeout(WalkToClick.get(world, eid).timeout)
      world.events.removeListener(world.events.globalId, WALK_REQUEST_EVENT, handleRequest)
    }
    addCleanup(component, cleanup)
  },
  remove: (world, component) => {
    doCleanup(component)
  },
})

export {
  WalkToClick,
  WALK_REQUEST_EVENT,
  WalkRequest,
}
