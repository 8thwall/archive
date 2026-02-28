import type {ModuleTarget} from './module-target'
import type {AccessLevelRequirement} from './validate-access-token'

const getTargetVisibility = (target: ModuleTarget): AccessLevelRequirement => {
  switch (target.type) {
    case 'branch':
    case 'commit':
    case 'development':
      return 'full'
    case 'version':
      // NOTE(christoph): In the future we may have "release candidate" versions that aren't
      // available to non-owners, so this is a safer initial state.
      return ['major', 'minor', 'patch'].includes(target.level) ? 'read' : 'full'
    case 'channel':
      return target.channel === 'beta' ? 'read' : 'full'
    default:
      throw new Error('Unexpected type in getTargetVisibility')
  }
}

export {
  getTargetVisibility,
}
