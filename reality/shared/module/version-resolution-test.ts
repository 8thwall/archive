// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import {
  filterResolvableVersions, resolveSelectedVersion,
} from './version-resolution'
import type {VersionInfo} from './module-target-api'
import type {ModuleVersionTarget} from './module-target'

const toPre = (target: ModuleVersionTarget): ModuleVersionTarget => ({
  patch: 0, minor: 0, ...target, pre: true,
})

const makePatch = (
  major: number, minor: number, patch: number
): ModuleVersionTarget => ({
  type: 'version', level: 'patch', major, minor, patch,
})

const makeMinor = (major: number, minor: number, patch?: number): ModuleVersionTarget => ({
  type: 'version', level: 'minor', major, minor, patch,
})

const makeMajor = (major: number, minor?: number, patch?: number): ModuleVersionTarget => ({
  type: 'version', level: 'major', major, minor, patch,
})

const makeVersionInfo = (target: ModuleVersionTarget): VersionInfo => ({
  patchTarget: target,
  buildTime: 1,
  publishTime: 2,
  commitId: 'xxx',
  versionMessage: 'xxx',
  versionDescription: 'xxx',
})

const VERSIONS = [
  makeVersionInfo(makePatch(3, 0, 1)),
  makeVersionInfo(makePatch(3, 0, 0)),
  makeVersionInfo(makePatch(2, 2, 1)),
  makeVersionInfo(makePatch(2, 2, 0)),
  makeVersionInfo(makePatch(2, 1, 0)),
  makeVersionInfo(makePatch(2, 0, 1)),
  makeVersionInfo(makePatch(2, 0, 0)),
  makeVersionInfo(makePatch(1, 0, 1)),
  makeVersionInfo(makePatch(1, 0, 0)),
]

const PRE_VERSIONS = [
  makeVersionInfo(toPre(makePatch(3, 0, 2))),
  // This pre-release was abandoned without releasing an official 2.0.2.
  {...makeVersionInfo(toPre(makePatch(2, 0, 2))), deprecated: true},
]

describe('resolveSelectedVersion', () => {
  it('Returns null if target is not a version', () => {
    assert.deepEqual(
      resolveSelectedVersion({type: 'branch', branch: 'master'}, VERSIONS, PRE_VERSIONS),
      null
    )
  })

  it('Returns an exact version for patch', () => {
    assert.deepEqual(
      resolveSelectedVersion(makePatch(2, 0, 1), VERSIONS, PRE_VERSIONS).patchTarget,
      makePatch(2, 0, 1)
    )
  })

  it('Returns the latest on a minor', () => {
    assert.deepEqual(
      resolveSelectedVersion(makeMinor(2, 0, 0), VERSIONS, PRE_VERSIONS).patchTarget,
      makePatch(2, 0, 1)
    )
  })

  it('Returns the latest on a major', () => {
    assert.deepEqual(
      resolveSelectedVersion(makeMajor(2, 0, 1), VERSIONS, PRE_VERSIONS).patchTarget,
      makePatch(2, 2, 1)
    )
  })

  it('Returns a pre-release version if selected', () => {
    assert.deepEqual(
      resolveSelectedVersion(toPre(makePatch(3, 0, 2)), VERSIONS, PRE_VERSIONS).patchTarget,
      toPre(makePatch(3, 0, 2))
    )
  })

  it('Returns the latest on a minor when pre-release was specified', () => {
    assert.deepEqual(
      resolveSelectedVersion(toPre(makeMinor(2, 0, 0)), VERSIONS, PRE_VERSIONS).patchTarget,
      makePatch(2, 0, 1)
    )
  })

  it('Returns and abandoned pre-release', () => {
    assert.deepEqual(
      resolveSelectedVersion(toPre(makeMajor(2, 0, 2)), VERSIONS, PRE_VERSIONS).patchTarget,
      toPre(makePatch(2, 0, 2))
    )
  })

  // In this example the user selected pre-release while 3.0.0 was a pre-release, but after 3.0.0
  // came out, studio-api no longer returns the pre-release in the response, so we just need to
  // make sure the 3.0.2 pre-release does not get opted into.
  it('Does not return a newer pre-release version when a different one was specified', () => {
    assert.deepEqual(
      resolveSelectedVersion(toPre(makeMajor(3, 0, 0)), VERSIONS, PRE_VERSIONS).patchTarget,
      makePatch(3, 0, 1)
    )
  })

  it('Pre-release versions are optional', () => {
    assert.deepEqual(
      resolveSelectedVersion(makePatch(2, 0, 1), VERSIONS, null).patchTarget,
      makePatch(2, 0, 1)
    )
  })

  it('Versions are optional', () => {
    assert.deepEqual(
      resolveSelectedVersion(toPre(makePatch(2, 0, 2)), null, PRE_VERSIONS).patchTarget,
      toPre(makePatch(2, 0, 2))
    )
  })

  it('Versions and Pre-release versions are optional', () => {
    assert.deepEqual(
      resolveSelectedVersion(toPre(makePatch(2, 0, 2)), null, null),
      null
    )
  })
})

describe('filterResolvableVersions', () => {
  it('Returns exact array if patch', () => {
    assert.strictEqual(filterResolvableVersions('patch', VERSIONS), VERSIONS)
  })

  it('Leaves out old patches for minor', () => {
    assert.deepEqual(filterResolvableVersions('minor', VERSIONS), [
      makeVersionInfo(makePatch(3, 0, 1)),
      makeVersionInfo(makePatch(2, 2, 1)),
      makeVersionInfo(makePatch(2, 1, 0)),
      makeVersionInfo(makePatch(2, 0, 1)),
      makeVersionInfo(makePatch(1, 0, 1)),
    ])
  })

  it('Only includes latest on major for major', () => {
    assert.deepEqual(filterResolvableVersions('major', VERSIONS), [
      makeVersionInfo(makePatch(3, 0, 1)),
      makeVersionInfo(makePatch(2, 2, 1)),
      makeVersionInfo(makePatch(1, 0, 1)),
    ])
  })

  it('Versions are optional', () => {
    assert.deepEqual(filterResolvableVersions('major', null), null)
  })
})
