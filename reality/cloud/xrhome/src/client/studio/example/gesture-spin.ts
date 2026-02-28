import ecs from '@ecs/runtime'
import {createInstanced} from '@ecs/shared/instanced'
import type {Eid} from '@ecs/shared/schema'

// TODO(christoph): Improve typing
type Listener = (e: any) => void
type Cleanup = () => void

const cleanups = createInstanced<ecs.World, Map<Eid, Cleanup>>(() => new Map())

ecs.registerComponent({
  name: 'gesture-spin',
  schema: {
    touchCount: ecs.ui32,
    factor: ecs.f32,
  },
  schemaDefaults: {
    factor: 1,
  },
  add: (world, component) => {
    const {globalId} = world.events
    const {eid} = component
    const {touchCount} = component.schema

    const handleMove: Listener = (e: {data: ecs.GestureMoveEvent}) => {
      if (e.data.touchCount !== touchCount) {
        return
      }
      const quaternion = ecs.Quaternion.acquire(world, eid)

      const a = e.data.position.x * component.schema.factor

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

      quaternion.x = baseX / mag
      quaternion.y = baseY / mag
      quaternion.z = baseZ / mag
      quaternion.w = baseW / mag

      ecs.Quaternion.commit(world, eid)
    }

    world.events.addListener(globalId, ecs.input.GESTURE_MOVE, handleMove)

    const cleanup = () => {
      world.events.removeListener(globalId, ecs.input.SCREEN_TOUCH_START, handleMove)
    }
    cleanups(world).set(component.eid, cleanup)
  },
  remove: (world, component) => {
    cleanups(world).get(component.eid)?.()
    cleanups(world).delete(component.eid)
  },
})
