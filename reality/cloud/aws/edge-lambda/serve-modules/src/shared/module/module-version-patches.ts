import type {DeepReadonly} from 'ts-essentials'

import {isGreaterPatchVersion, moduleTargetsEqual} from './compare-module-target'
import type {ModuleVersionTarget, ModuleVersionTargetLevel} from './module-target'
import type {VersionInfo} from './module-target-api'

const createNewVersionTarget = (
  version: ModuleVersionTarget, level: string
): ModuleVersionTarget => {
  switch (level) {
    case ('major'):
      return {...version, major: version.major + 1, minor: 0, patch: 0}
    case ('minor'):
      return {...version, major: version.major, minor: version.minor + 1, patch: 0}
    case ('patch'):
      return {...version, major: version.major, minor: version.minor, patch: version.patch + 1}
    default:
      return version
  }
}

const getNewestPatch = (versions: DeepReadonly<ModuleVersionTarget[]>): ModuleVersionTarget => {
  if (!versions || versions.length === 0) {
    return null
  }
  return versions.reduce((prev, next) => ((
    isGreaterPatchVersion(next, prev)) ? next : prev
  ))
}

const getNewestVersionInfo = (versions: DeepReadonly<VersionInfo[]>): VersionInfo => {
  if (!versions || versions.length === 0) {
    return null
  }
  return versions.reduce((prev, next) => ((
    isGreaterPatchVersion(next.patchTarget, prev.patchTarget)) ? next : prev
  ))
}

const hasDeprecatedPatchAbove = (
  versions: DeepReadonly<VersionInfo[]>, patch: ModuleVersionTarget
): boolean => {
  if (!patch || !versions || versions.length === 0) {
    return false
  }

  const newestMajorVersionInfo = getNewestVersionInfo(
    versions.filter(vi => vi.patchTarget.major === patch.major)
  )

  // Priority 1: If newest major version is deprecated,
  // every patch under it in the same major is deprecated except itself
  if (newestMajorVersionInfo.deprecated) {
    return !moduleTargetsEqual(newestMajorVersionInfo.patchTarget, patch)
  }

  const newestMinorVersionInfo = getNewestVersionInfo(
    versions.filter(
      vi => vi.patchTarget.major === patch.major &&
      vi.patchTarget.minor === patch.minor
    )
  )

  // Priority 2: If newest minor version is deprecated,
  // every patch under it in the same minor is deprecated except itself
  if (newestMinorVersionInfo.deprecated) {
    return !moduleTargetsEqual(newestMinorVersionInfo.patchTarget, patch)
  }

  return false
}

const getVersionSpecifier = (version: ModuleVersionTarget): string => {
  const numbers: number[] = [version.major, version.minor, version.patch]
  const specifier = numbers.map(n => (Number.isInteger(n) ? n : 'x'))
  return specifier.join('.')
}

const getNewVersionSpecifier = (patch: ModuleVersionTarget, level: string): string => {
  const newVersion = createNewVersionTarget(patch, level)
  return getVersionSpecifier(newVersion)
}

const getVersionSpecifierAtLevel = (
  version: ModuleVersionTarget, level: ModuleVersionTargetLevel
): string => {
  if (version.level !== 'patch') {
    throw new Error('getVersionSpecifierAtLevel expected patch target')
  }
  switch (level) {
    case 'major':
      return `${version.major}.x.x`
    case 'minor':
      return `${version.major}.${version.minor}.x`
    case 'patch':
      return `${version.major}.${version.minor}.${version.patch}`
    default:
      throw new Error('Encountered unexpected level in isSameBaseVersionAtLevel')
  }
}

export {
  getVersionSpecifier,
  getNewestPatch,
  getNewestVersionInfo,
  getNewVersionSpecifier,
  createNewVersionTarget,
  hasDeprecatedPatchAbove,
  getVersionSpecifierAtLevel,
}
