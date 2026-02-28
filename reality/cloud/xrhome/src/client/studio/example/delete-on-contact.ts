import {physics, registerComponent, World} from '@ecs/runtime'
import {createInstanced} from '@ecs/shared/instanced'
import type {Eid} from '@ecs/shared/schema'

// TODO(christoph): Improve typing
type Handler = (e: any) => void

const listenerMap = createInstanced<World, Map<Eid, Handler>>(() => new Map())

registerComponent({
  name: 'delete-on-contact',
  schema: {},
  add: (world, component) => {
    const handler = (e: any) => {
      world.deleteEntity(e.data.other)
    }
    world.events.addListener(component.eid, physics.COLLISION_START_EVENT, handler)
    listenerMap(world).set(component.eid, handler)
  },
  remove: (world, component) => {
    const handler = listenerMap(world).get(component.eid)
    if (handler) {
      world.events.removeListener(component.eid, physics.COLLISION_START_EVENT, handler)
    }
    listenerMap(world).delete(component.eid)
  },
})
