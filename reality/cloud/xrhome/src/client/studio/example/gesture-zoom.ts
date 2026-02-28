import ecs from '@ecs/runtime'
import {createInstanced} from '@ecs/shared/instanced'
import type {Eid} from '@ecs/shared/schema'

// TODO(christoph): Improve typing
type Listener = (e: any) => void
type Cleanup = () => void

const cleanups = createInstanced<ecs.World, Map<Eid, Cleanup>>(() => new Map())

ecs.registerComponent({
  name: 'gesture-zoom',
  schema: {
    baseScale: ecs.f32,
  },
  schemaDefaults: {
    baseScale: 1,
  },
  add: (world, component) => {
    const {globalId} = world.events
    const {eid} = component
    const {baseScale} = component.schema

    const handleMove: Listener = (e: {data: ecs.GestureMoveEvent}) => {
      if (e.data.touchCount !== 2) {
        return
      }
      const cursor = ecs.Scale.cursor(world, eid)
      const newZoom = e.data.spread * baseScale
      cursor.x = newZoom
      cursor.y = newZoom
      cursor.z = newZoom
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
