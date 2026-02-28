import type {DeepReadonly} from 'ts-essentials'

import {isSameBaseVersion, isSameBaseVersionAtLevel} from './compare-module-target'
import type {ModuleTarget, ModuleVersionTarget, ModuleVersionTargetLevel} from './module-target'
import type {VersionInfo} from './module-target-api'

type VersionList = DeepReadonly<VersionInfo[] | null>

const resolveSelectedVersion = (
  target: ModuleTarget, versions?: VersionList, preVersions?: VersionList
) => {
  if (target.type !== 'version') {
    return null
  }

  if (target.pre && preVersions) {
    const selectedPre = preVersions.find(vi => isSameBaseVersion(target, vi.patchTarget))
    if (selectedPre) {
      return selectedPre
    }
  }

  if (!versions) {
    return null
  }

  return versions.find(vi => isSameBaseVersionAtLevel(target, vi.patchTarget, target.level))
}

const filterResolvableVersions = (
  level: ModuleVersionTargetLevel, versions: VersionList
) => {
  if (!versions) {
    return null
  }

  if (level === 'patch') {
    return versions
  }

  const res: DeepReadonly<VersionInfo>[] = []

  let lastSeen: ModuleVersionTarget

  versions.forEach((version) => {
    if (lastSeen && isSameBaseVersionAtLevel(version.patchTarget, lastSeen, level)) {
      return
    }
    lastSeen = version.patchTarget
    res.push(version)
  })

  return res
}

export {
  resolveSelectedVersion,
  filterResolvableVersions,
}
