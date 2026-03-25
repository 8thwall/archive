// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.
import {createInstanced} from '../../helpers/instanced'

type Cleanup = () => void
const cleanups = createInstanced<ecs.World, Map<BigInt, Cleanup>>(() => new Map())

ecs.registerComponent({
  name: 'navigation',
  schema: {},
  schemaDefaults: {},
  data: {},
  add: (world: ecs.World, component) => {
    const loadSpace = (space: string) => (event: CustomEvent<{mainPage: HTMLDivElement}>) => {
      event.detail.mainPage.remove()
      world.spaces.loadSpace(space)
    }

    const loadSlam = loadSpace('world-tracking')
    const loadImageTarget = loadSpace('image-targets')
    document.addEventListener('world-effects', loadSlam)
    document.addEventListener('image-targets', loadImageTarget)

    const loadFace = loadSpace('face-effects')
    const loadMultiFace = loadSpace('multi-face')
    document.addEventListener('face-effects', loadFace)
    document.addEventListener('multi-face-effects', loadMultiFace)

    const cleanup = () => {
      document.removeEventListener('face-effects', loadFace)
      document.removeEventListener('multi-face-effects', loadMultiFace)
    }
    cleanups(world).set(component.eid, cleanup)
  },
  remove: (world: ecs.World, component) => {
    cleanups(world).get(component.eid)?.()
    cleanups(world).delete(component.eid)
  },
})
