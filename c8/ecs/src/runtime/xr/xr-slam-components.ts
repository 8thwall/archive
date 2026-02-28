import type {World} from '../world'
import {registerComponent} from '../registry'
import {Hidden, Location} from '../components'
import {createInstanced} from '../../shared/instanced'
import type {Eid} from '../../shared/schema'
import {events} from '../event-ids'

type Cleanup = () => void
const cleanups = createInstanced<World, Map<Eid, Cleanup>>(() => new Map())
const activeAnchors = createInstanced<World, Set<string>>(() => new Set())

const LocationAnchor = registerComponent({
  name: 'location-anchor',
  add: (world: World, component) => {
    const camEid = world.camera.getActiveEid()

    const show = (eid: Eid) => (event: any) => {
      if (!Location.has(world, eid)) {
        return
      }
      const {position, rotation, name} = event.data
      if (name && name !== Location.get(world, eid).name) {
        return
      }
      // Set it's children to be shown, but not the Location itself.
      for (const child of world.getChildren(eid)) {
        if (Hidden.has(world, child)) {
          Hidden.remove(world, child)
        }
      }

      // Update the position and rotation of the location anchor.
      world.setPosition(eid, position.x, position.y, position.z)
      world.setQuaternion(eid, rotation.x, rotation.y, rotation.z, rotation.w)
      world.setScale(eid, 1, 1, 1)  // all content should be at metric scale
    }

    const hide = (eid: Eid) => (event: any) => {
      if (!Location.has(world, eid)) {
        return
      }
      if (event.data.name && event.data.name !== Location.get(world, eid).name) {
        return
      }
      // Set it's children to be hidden, but not the Location itself.
      for (const child of world.getChildren(eid)) {
        if (!Hidden.has(world, child)) {
          Hidden.set(world, child)
        }
      }
    }

    const showFunc = show(component.eid)
    const hideFunc = hide(component.eid)

    if (Location.has(world, component.eid)) {
      const {poiId} = Location.get(world, component.eid)
      if (activeAnchors(world).has(poiId)) {
        // eslint-disable-next-line no-console
        console.warn('Duplicate locations found in project. Only one will appear on localization.')
      } else {
        activeAnchors(world).add(poiId)
        world.events.addListener(camEid, events.REALITY_LOCATION_FOUND, showFunc)
        world.events.addListener(camEid, events.REALITY_LOCATION_UPDATED, showFunc)
        world.events.addListener(camEid, events.REALITY_LOCATION_LOST, hideFunc)

        const cleanup = () => {
          activeAnchors(world).delete(poiId)
          world.events.removeListener(camEid, events.REALITY_LOCATION_FOUND, showFunc)
          world.events.removeListener(camEid, events.REALITY_LOCATION_UPDATED, showFunc)
          world.events.removeListener(camEid, events.REALITY_LOCATION_LOST, hideFunc)
        }
        cleanups(world).set(component.eid, cleanup)
      }
    }

    if (Location.has(world, component.eid)) {
      // Set it's children to be hidden, but not the Location itself.
      for (const child of world.getChildren(component.eid)) {
        if (!Hidden.has(world, child)) {
          Hidden.set(world, child)
        }
      }
    }
  },
  remove: (world: World, component) => {
    cleanups(world).get(component.eid)?.()
    cleanups(world).delete(component.eid)
  },
})

export {
  LocationAnchor,
}
