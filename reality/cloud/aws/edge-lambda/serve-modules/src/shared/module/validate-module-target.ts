import type {ModuleTarget} from './module-target'

// NOTE(christoph): To allow a direct lookup for a commit, we need an exact match for the stored
// value, so we can't use truncated commit IDs.
const isValidCommit = (t: any) => typeof t === 'string' && t.length === 40

const isFilledString = (t: any) => typeof t === 'string' && t.length > 0

const isValidVersionNumber = (t: any) => Number.isInteger(t) && t >= 0

const isValidTarget = (target: ModuleTarget | any): target is ModuleTarget => {
  if (!target || typeof target !== 'object') {
    return false
  }

  switch (target.type) {
    case 'branch':
      return isFilledString(target.branch)
    case 'channel':
      return isFilledString(target.channel)
    case 'commit':
      return isFilledString(target.branch) && isValidCommit(target.commit)
    case 'development':
      return isFilledString(target.handle)
    case 'version':
      if (target.pre !== undefined && target.pre !== true) {
        return false
      }
      if (target.pre) {
        return ['major', 'minor', 'patch'].includes(target.level) &&
               isValidVersionNumber(target.major) &&
               isValidVersionNumber(target.minor) &&
               isValidVersionNumber(target.patch)
      }
      switch (target.level) {
        case 'major':
          return isValidVersionNumber(target.major)
        case 'minor':
          return isValidVersionNumber(target.major) &&
          isValidVersionNumber(target.minor)
        case 'patch':
          return isValidVersionNumber(target.major) &&
          isValidVersionNumber(target.minor) &&
          isValidVersionNumber(target.patch)
        default:
          return false
      }
    default:
      return false
  }
}

export {
  isValidTarget,
}
