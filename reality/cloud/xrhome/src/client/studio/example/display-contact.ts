import ecs from '@ecs/runtime'
import {createInstanced} from '@ecs/shared/instanced'
import type {Eid} from '@ecs/shared/schema'

// TODO(christoph): Improve typing
type Handler = (e: any) => void

const listenerMap = createInstanced<ecs.World, Map<Eid, Handler>>(() => new Map())

const ContactCount = ecs.registerComponent({
  name: 'contact-count',
  schema: {
    count: ecs.ui32,
  },
})

const NEGATIVE_COLOR = [255, 0, 255]

const RAINBOW_COLORS = [
  [68, 221, 136],
  [34, 204, 187],
  [17, 187, 204],
  [0, 153, 204],
  [51, 102, 187],
  [102, 51, 153],
  [136, 17, 221],
  [170, 51, 85],
  [204, 102, 102],
  [238, 153, 68],
  [238, 221, 0],
  [153, 221, 85],
].sort(() => Math.random() - 0.5)

const DisplayContact = ecs.registerComponent({
  name: 'display-contact',
  add: (world, component) => {
    ContactCount.set(world, component.eid, {count: 0})

    const handleStart: Handler = (e) => {
      ContactCount.mutate(world, e.target, (cursor) => {
        cursor.count++
      })
    }

    world.events.addListener(component.eid, ecs.physics.COLLISION_START_EVENT, handleStart)
    listenerMap(world).set(component.eid, handleStart)
  },
  remove: (world, component) => {
    const handleStart = listenerMap(world).get(component.eid)

    if (handleStart) {
      world.events.removeListener(component.eid, ecs.physics.COLLISION_START_EVENT, handleStart)
    }

    listenerMap(world).delete(component.eid)
    ContactCount.remove(world, component.eid)
  },
})

ecs.registerBehavior(ecs.defineSystem<[typeof ContactCount, typeof ecs.Material]>(
  [ContactCount, ecs.Material],
  (world, eid, [contactCount, material]) => {
    const {count} = contactCount

    let color: number[]
    if (count < 0) {
      color = NEGATIVE_COLOR
    } else if (count > 0) {
      color = RAINBOW_COLORS[count % RAINBOW_COLORS.length]
    } else {
      return
    }

    [material.r, material.g, material.b] = color
    ecs.Material.dirty(world, eid)
  }
))

export {
  DisplayContact,
}
