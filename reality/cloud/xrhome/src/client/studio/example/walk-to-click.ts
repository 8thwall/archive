import ecs, {World} from '@ecs/runtime'
import {createInstanced} from '@ecs/shared/instanced'
import type {Eid} from '@ecs/shared/schema'

// TODO(christoph): Improve typing
type Listener = (e: any) => void
type Cleanup = () => void

const WALK_REQUEST_EVENT = 'walk-request'

type WalkRequest = {
  x: number
  z: number
}

const cleanups = createInstanced<ecs.World, Map<BigInt, Cleanup>>(() => new Map())

const setYAngle = (world: World, eid: Eid, angle: number) => {
  const a = angle / 2
  const sin = Math.sin(a)
  const cos = Math.cos(a)

  const baseX = 0 * sin
  const baseY = 1 * sin
  const baseZ = 0 * sin
  const baseW = cos

  const mag = Math.sqrt(
    baseX ** 2 +
    baseY ** 2 +
    baseZ ** 2 +
    baseW ** 2
  )

  world.setQuaternion(
    eid,
    baseX / mag,
    baseY / mag,
    baseZ / mag,
    baseW / mag
  )
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

      ecs.PositionAnimation.remove(world, eid)
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

      const walkToClick = WalkToClick.cursor(world, eid)

      world.time.clearTimeout(walkToClick.timeout)

      walkToClick.timeout = world.time.setTimeout(() => {
        ecs.GltfModel.set(world, eid, {animationClip: 'Idle'})
      }, duration)
    }

    world.events.addListener(world.events.globalId, WALK_REQUEST_EVENT, handleRequest)

    const cleanup = () => {
      world.events.removeListener(world.events.globalId, WALK_REQUEST_EVENT, handleRequest)
    }
    cleanups(world).set(component.eid, cleanup)
  },
  remove: (world, component) => {
    cleanups(world).get(component.eid)?.()
    cleanups(world).delete(component.eid)
  },
})

export {
  WalkToClick,
  WALK_REQUEST_EVENT,
  WalkRequest,
}
