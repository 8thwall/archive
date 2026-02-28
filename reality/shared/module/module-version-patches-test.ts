// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import type {ModuleVersionTarget} from './module-target'
import {
  createNewVersionTarget, getNewestPatch, getNewVersionSpecifier,
  getVersionSpecifier, getVersionSpecifierAtLevel, hasDeprecatedPatchAbove,
} from './module-version-patches'
import type {VersionInfo} from './module-target-api'

const dummyTarget: ModuleVersionTarget = {
  type: 'version',
  level: 'patch',
  major: 4,
  minor: 2,
  patch: 13,
}

describe('getNewestPatch', () => {
  it('Returns 0.0.0 target with undefined version list', () => {
    assert.deepEqual(getNewestPatch(null), null)
  })
  it('Returns 0.0.0 target with undefined version list', () => {
    assert.deepEqual(getNewestPatch(undefined), null)
  })
  it('Returns 0.0.0 target with empty version list', () => {
    assert.deepEqual(getNewestPatch([]), null)
  })
  it('Returns expected version with one version in list', () => {
    const expectedTarget: ModuleVersionTarget = {
      type: 'version',
      level: 'patch',
      major: 4,
      minor: 2,
      patch: 13,
    }
    assert.deepEqual(getNewestPatch([dummyTarget]), expectedTarget)
  })
  it('Returns expected version with multiple versions in list', () => {
    const expectedTarget: ModuleVersionTarget = {
      type: 'version',
      level: 'patch',
      major: 5,
      minor: 0,
      patch: 0,
    }
    const versionList: ModuleVersionTarget[] = [
      {
        type: 'version',
        level: 'patch',
        major: 5,
        minor: 0,
        patch: 0,
      }, {
        type: 'version',
        level: 'patch',
        major: 0,
        minor: 0,
        patch: 100,
      }, {
        type: 'version',
        level: 'patch',
        major: 0,
        minor: 100,
        patch: 0,
      }, {
        type: 'version',
        level: 'patch',
        major: 4,
        minor: 99,
        patch: 999,
      },
    ]
    assert.deepEqual(getNewestPatch(versionList), expectedTarget)
  })
})
describe('getVersionSpecifier', () => {
  it('Returns expected string with major level', () => {
    assert.equal(getVersionSpecifier({...dummyTarget, level: 'major'}), '4.2.13')
  })
  it('Returns expected string with minor level', () => {
    assert.equal(getVersionSpecifier({...dummyTarget, level: 'minor'}), '4.2.13')
  })
  it('Returns expected string with patch level', () => {
    assert.equal(getVersionSpecifier(dummyTarget), '4.2.13')
  })
  it('Returns expected string with only major number', () => {
    const target: ModuleVersionTarget = {
      type: 'version',
      level: 'major',
      major: 0,
    }
    assert.equal(getVersionSpecifier(target), '0.x.x')
  })
  it('Returns expected string with only minor numbers', () => {
    const target: ModuleVersionTarget = {
      type: 'version',
      level: 'minor',
      major: 5,
      minor: 0,
    }
    assert.equal(getVersionSpecifier(target), '5.0.x')
  })
})
describe('getNewVersionSpecifier', () => {
  it('Returns expected string with major level', () => {
    assert.equal(getNewVersionSpecifier(dummyTarget, 'major'), '5.0.0')
  })
  it('Returns expected string with minor level', () => {
    assert.equal(getNewVersionSpecifier(dummyTarget, 'minor'), '4.3.0')
  })
  it('Returns expected string with patch level', () => {
    assert.equal(getNewVersionSpecifier(dummyTarget, 'patch'), '4.2.14')
  })
  it('Returns expected string with bad level', () => {
    assert.equal(getNewVersionSpecifier(dummyTarget, 'bad'), '4.2.13')
  })
})
describe('createNewVersionTarget', () => {
  it('Returns expected target with major level', () => {
    const expectedTarget: ModuleVersionTarget = {
      type: 'version',
      level: 'patch',
      major: 5,
      minor: 0,
      patch: 0,
    }
    assert.deepEqual(createNewVersionTarget(dummyTarget, 'major'), expectedTarget)
  })
  it('Returns expected target with minor level', () => {
    const expectedTarget: ModuleVersionTarget = {
      type: 'version',
      level: 'patch',
      major: 4,
      minor: 3,
      patch: 0,
    }
    assert.deepEqual(createNewVersionTarget(dummyTarget, 'minor'), expectedTarget)
  })
  it('Returns expected target with patch level', () => {
    const expectedTarget: ModuleVersionTarget = {
      type: 'version',
      level: 'patch',
      major: 4,
      minor: 2,
      patch: 14,
    }
    assert.deepEqual(createNewVersionTarget(dummyTarget, 'patch'), expectedTarget)
  })
  it('Returns expected target with bad level', () => {
    const expectedTarget: ModuleVersionTarget = {
      type: 'version',
      level: 'patch',
      major: 4,
      minor: 2,
      patch: 13,
    }
    assert.deepEqual(createNewVersionTarget(dummyTarget, 'bad'), expectedTarget)
  })
})
describe('hasDeprecatedPatchAbove', () => {
  const makeVersionInfo = (major: number, minor: number, patch: number): VersionInfo => ({
    publishTime: 0,
    buildTime: 0,
    commitId: ''.padEnd(40),
    deprecated: false,
    patchTarget: {
      type: 'version',
      level: 'patch',
      major,
      minor,
      patch,
    },
    versionDescription: 'verDesc',
    versionMessage: 'verMsg',
  })

  const makeTestVersionList = (): VersionInfo[] => ([
    makeVersionInfo(1, 0, 0),  // 0
    makeVersionInfo(1, 0, 1),  // 1
    makeVersionInfo(1, 0, 2),  // 2
    makeVersionInfo(1, 0, 3),  // 3
    makeVersionInfo(1, 1, 0),  // 4
    makeVersionInfo(1, 1, 1),  // 5
    makeVersionInfo(1, 2, 0),  // 6
    makeVersionInfo(1, 3, 0),  // 7
    makeVersionInfo(2, 0, 0),  // 8
  ])

  it('Return true for all patches in minor if newest minor is deprecated', () => {
    const versionList = makeTestVersionList()
    versionList[3].deprecated = true  // Deprecating 1.0.3 (Newest minor for 1.0.x)
    assert.isTrue(hasDeprecatedPatchAbove(versionList, versionList[0].patchTarget))
    assert.isTrue(hasDeprecatedPatchAbove(versionList, versionList[1].patchTarget))
    assert.isTrue(hasDeprecatedPatchAbove(versionList, versionList[2].patchTarget))
    assert.isFalse(hasDeprecatedPatchAbove(versionList, versionList[3].patchTarget))
    assert.isFalse(hasDeprecatedPatchAbove(versionList, versionList[4].patchTarget))
    assert.isFalse(hasDeprecatedPatchAbove(versionList, versionList[5].patchTarget))
    assert.isFalse(hasDeprecatedPatchAbove(versionList, versionList[6].patchTarget))
    assert.isFalse(hasDeprecatedPatchAbove(versionList, versionList[7].patchTarget))
    assert.isFalse(hasDeprecatedPatchAbove(versionList, versionList[8].patchTarget))
  })

  it('Returns true all patches in major if newest major is deprecated', () => {
    const versionList = makeTestVersionList()
    versionList[3].deprecated = true  // Deprecating 1.0.3 to test edge case
    versionList[7].deprecated = true  // Deprecating 1.3.0 (Newest major for 1.x.x)
    assert.isTrue(hasDeprecatedPatchAbove(versionList, versionList[0].patchTarget))
    assert.isTrue(hasDeprecatedPatchAbove(versionList, versionList[1].patchTarget))
    assert.isTrue(hasDeprecatedPatchAbove(versionList, versionList[2].patchTarget))
    assert.isTrue(hasDeprecatedPatchAbove(versionList, versionList[3].patchTarget))
    assert.isTrue(hasDeprecatedPatchAbove(versionList, versionList[4].patchTarget))
    assert.isTrue(hasDeprecatedPatchAbove(versionList, versionList[5].patchTarget))
    assert.isTrue(hasDeprecatedPatchAbove(versionList, versionList[6].patchTarget))
    assert.isFalse(hasDeprecatedPatchAbove(versionList, versionList[7].patchTarget))
    assert.isFalse(hasDeprecatedPatchAbove(versionList, versionList[8].patchTarget))
  })

  it('Returns false for no other patches if non new patch is deprecated', () => {
    const versionList = makeTestVersionList()
    versionList[2].deprecated = true  // Deprecating 1.0.2
    versionList[6].deprecated = true  // Deprecating 1.2.0
    assert.isFalse(hasDeprecatedPatchAbove(versionList, versionList[0].patchTarget))
    assert.isFalse(hasDeprecatedPatchAbove(versionList, versionList[1].patchTarget))
    assert.isFalse(hasDeprecatedPatchAbove(versionList, versionList[2].patchTarget))
    assert.isFalse(hasDeprecatedPatchAbove(versionList, versionList[3].patchTarget))
    assert.isFalse(hasDeprecatedPatchAbove(versionList, versionList[4].patchTarget))
    assert.isFalse(hasDeprecatedPatchAbove(versionList, versionList[5].patchTarget))
    assert.isFalse(hasDeprecatedPatchAbove(versionList, versionList[6].patchTarget))
    assert.isFalse(hasDeprecatedPatchAbove(versionList, versionList[7].patchTarget))
    assert.isFalse(hasDeprecatedPatchAbove(versionList, versionList[8].patchTarget))
  })

  it('Returns false for empty/undefined inputs', () => {
    const versionList = makeTestVersionList()
    assert.isFalse(hasDeprecatedPatchAbove(versionList, undefined))
    assert.isFalse(hasDeprecatedPatchAbove([], versionList[0].patchTarget))
    assert.isFalse(hasDeprecatedPatchAbove(undefined, versionList[0].patchTarget))
  })
})

describe('getVersionSpecifierAtLevel', () => {
  it('Returns normal specifier for patch', () => {
    assert.equal(getVersionSpecifierAtLevel({...dummyTarget}, 'patch'), '4.2.13')
  })
  it('Returns truncated specifier for minor', () => {
    assert.equal(getVersionSpecifierAtLevel({...dummyTarget}, 'minor'), '4.2.x')
  })
  it('Returns more truncated specifier for major', () => {
    assert.equal(getVersionSpecifierAtLevel({...dummyTarget}, 'major'), '4.x.x')
  })
  it('Requires that target is a patch', () => {
    assert.throws(() => (
      getVersionSpecifierAtLevel({...dummyTarget, level: 'major'}, 'patch')
    ))
  })
})
