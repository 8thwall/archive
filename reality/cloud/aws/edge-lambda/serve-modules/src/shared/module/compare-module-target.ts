import type {DeepReadonly} from 'ts-essentials'

import type {ModuleTarget, ModuleVersionTarget, ModuleVersionTargetLevel} from './module-target'
import type {BuildInfo, VersionInfo} from './module-target-api'

const moduleTargetsEqual = (left: ModuleTarget, right: ModuleTarget) => {
  switch (left.type) {
    case 'branch':
      return right.type === 'branch' && left.branch === right.branch
    case 'channel':
      return right.type === 'channel' && left.channel === right.channel
    case 'commit':
      return right.type === 'commit' && left.branch === right.branch && left.commit === right.commit
    case 'version': {
      if (right.type !== 'version') { return false }
      if (left.pre !== right.pre) { return false }
      if (left.pre) {
        return left.level === right.level && left.major === right.major &&
                 left.minor === right.minor && left.patch === right.patch
      }
      switch (left.level) {
        case 'major':
          return right.level === 'major' && left.major === right.major
        case 'minor':
          return right.level === 'minor' && left.major === right.major &&
                 left.minor === right.minor
        case 'patch':
          return right.level === 'patch' && left.major === right.major &&
                 left.minor === right.minor && left.patch === right.patch
        default:
          throw new Error('Encountered unexpected level in moduleTargetsEqual')
      }
    }
    case 'development':
      return right.type === 'development' && left.handle === right.handle
    default:
      throw new Error('Encountered unexpected target in moduleTargetsEqual')
  }
}

const moduleTargetOrSymbolEqual = (left: ModuleTarget | Symbol, right: ModuleTarget | Symbol) => {
  if (typeof left === 'symbol' || typeof right === 'symbol') {
    return left === right
  }
  return moduleTargetsEqual(left as ModuleTarget, right as ModuleTarget)
}

const moduleTargetsPartiallyEqual = (left: ModuleTarget, right: ModuleTarget) => {
  if (!left || !right) {
    return false
  }
  switch (left.type) {
    case 'branch':
      return (right.type === 'branch' && left.branch === right.branch) ||
        (right.type === 'commit' && left.branch === right.branch)
    case 'channel':
      return right.type === 'channel' && left.channel === right.channel
    case 'commit':
      return (right.type === 'commit' && left.branch === right.branch) ||
        (right.type === 'branch' && left.branch === right.branch)
    case 'version':
      return right.type === 'version'
    case 'development':
      return right.type === 'development' && left.handle === right.handle
    default:
      throw new Error('Encountered unexpected target in moduleTargetsEqual')
  }
}

const isGreaterPatchVersion = (
  left: DeepReadonly<ModuleTarget>, right: DeepReadonly<ModuleTarget>
) => {
  if (left.type !== 'version' || right.type !== 'version') {
    throw new Error('Encountered unexpected type in isGreaterPatchVersion')
  }
  if (left.level !== 'patch' || right.level !== 'patch') {
    throw new Error('Encountered unexpected level in isGreaterPatchVersion')
  }

  return left.major > right.major ||
         (left.major === right.major && left.minor > right.minor) ||
         (left.major === right.major && left.minor === right.minor && left.patch > right.patch)
}

const comparePatchVersions = (
  left: DeepReadonly<ModuleTarget>, right: DeepReadonly<ModuleTarget>
) => {
  if (moduleTargetsEqual(left, right)) {
    return 0
  } else {
    return isGreaterPatchVersion(left, right) ? -1 : 1
  }
}

const compareVersionInfo = (
  left: DeepReadonly<VersionInfo>, right: DeepReadonly<VersionInfo>
) => comparePatchVersions(left.patchTarget, right.patchTarget)

const compareBuildInfo = (
  left: DeepReadonly<BuildInfo>, right: DeepReadonly<BuildInfo>
) => right.buildTime - left.buildTime

const isSameBaseVersion = (left: ModuleTarget, right: ModuleTarget) => (
  left.type === 'version' &&
  right.type === 'version' &&
  (left.major === right.major && left.minor === right.minor && left.patch === right.patch)
)

const isPreForPatch = (left: ModuleVersionTarget, right: ModuleVersionTarget) => (
  isSameBaseVersion(left, right) &&
  left.level === 'patch' &&
  right.level === 'patch' &&
  !!left.pre &&
  !right.pre
)

const isSameBaseVersionAtLevel = (
  left: ModuleVersionTarget, right: ModuleVersionTarget, level: ModuleVersionTargetLevel
) => {
  switch (level) {
    case 'major':
      return left.major === right.major
    case 'minor':
      return left.major === right.major && left.minor === right.minor
    case 'patch':
      return left.major === right.major && left.minor === right.minor && left.patch === right.patch
    default:
      throw new Error('Encountered unexpected level in isSameBaseVersionAtLevel')
  }
}

export {
  moduleTargetsEqual,
  moduleTargetsPartiallyEqual,
  isGreaterPatchVersion,
  comparePatchVersions,
  compareVersionInfo,
  compareBuildInfo,
  isSameBaseVersion,
  isPreForPatch,
  moduleTargetOrSymbolEqual,
  isSameBaseVersionAtLevel,
}
