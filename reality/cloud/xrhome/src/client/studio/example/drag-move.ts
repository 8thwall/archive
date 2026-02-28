import ecs from '@ecs/runtime'
import {createInstanced} from '@ecs/shared/instanced'
import type {Eid} from '@ecs/shared/schema'

// TODO(christoph): Improve typing
type Listener = (e: any) => void
type Cleanup = () => void

const cleanups = createInstanced<ecs.World, Map<Eid, Cleanup>>(() => new Map())

ecs.registerComponent({
  name: 'drag-move',
  schema: {
    factor: ecs.f32,
  },
  add: (world, component) => {
    const {globalId} = world.events
    const {eid} = component
    const handleStart: Listener = () => {
      ecs.Material.set(world, eid, {r: 255, g: 0, b: 0, textureSrc: ''})
    }
    const handleEnd: Listener = () => {
      ecs.Material.set(world, eid, {r: 255, g: 255, b: 255, textureSrc: ''})
    }

    const handleMove: Listener = (e: {data: ecs.ScreenTouchMoveEvent}) => {
      ecs.Position.mutate(world, eid, (position) => {
        position.x += e.data.change.x * component.schema.factor
        position.y -= e.data.change.y * component.schema.factor
      })
    }

    world.events.addListener(globalId, ecs.input.SCREEN_TOUCH_START, handleStart)
    world.events.addListener(globalId, ecs.input.SCREEN_TOUCH_MOVE, handleMove)
    world.events.addListener(globalId, ecs.input.SCREEN_TOUCH_END, handleEnd)

    const cleanup = () => {
      world.events.removeListener(globalId, ecs.input.SCREEN_TOUCH_START, handleStart)
      world.events.removeListener(globalId, ecs.input.SCREEN_TOUCH_MOVE, handleMove)
      world.events.removeListener(globalId, ecs.input.SCREEN_TOUCH_END, handleEnd)
    }
    cleanups(world).set(component.eid, cleanup)
  },
  remove: (world, component) => {
    cleanups(world).get(component.eid)?.()
    cleanups(world).delete(component.eid)
  },
})
