import {World} from '@8thwall/ecs'
import {logger} from '../Misc/logger'

// NOTE(christoph): See https://gitlab.nianticlabs.com/repo/niantic/-/merge_requests/31604

type BaseObject3D = ReturnType<World['three']['entityToObject']['get']>

type Object3D = BaseObject3D | {
  // eslint-disable-next-line no-restricted-globals
  parent: Object3D
  add: (child: Object3D) => void
  attach: (child: Object3D) => void
  userData: {
    eid?: BigInt
  }
}

let notifyChangedRef: (object: {}) => void

const enableManualMatrixUpdates = (world: World) => {
  const {
    // @ts-ignore - not in release yet
    setMatrixUpdateMode, notifyChanged: notifyChangedFromWorld,
  } = world.three
  if (!setMatrixUpdateMode || !notifyChangedFromWorld) {
    // eslint-disable-next-line no-console
    console.error('Cannot set matrix update mode, world.three is missing required interface')
    return
  }

  setMatrixUpdateMode('manual')

  notifyChangedRef = notifyChangedFromWorld

  // eslint-disable-next-line no-console
  logger.log('Matrix update mode set to manual')
}

const notifyChanged = (object: Object3D) => {
  if (notifyChangedRef) {
    let ancestor = object
    // TODO(christoph): This might not be necessary, there's an edge case with deeply nested
    // external objects so traverse to the direct child of an entity's object instead.
    while (ancestor.parent && !ancestor.parent.userData.eid) {
      ancestor = ancestor.parent
    }

    notifyChangedRef(ancestor)
  }
}

const addChild = (parent: Object3D, object: Object3D) => {
  parent.add(object)
  notifyChanged(object)
}

const attachChild = (parent: Object3D, object: Object3D) => {
  parent.attach(object)
  notifyChanged(object)
}

export {
  enableManualMatrixUpdates,
  notifyChanged,
  addChild,
  attachChild,
}
