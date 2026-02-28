// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import {getCacheDurationInSeconds} from './module-target-caching'

const VERSION_BASE = {type: 'version', major: 3, minor: 2, patch: 1} as const

describe('getCacheDurationInSeconds', () => {
  it('Returns short cache duration for the master branch', () => {
    assert.strictEqual(getCacheDurationInSeconds({type: 'branch', branch: 'master'}), 60)
  })
  it('Returns zero caching for a client branch', () => {
    assert.strictEqual(getCacheDurationInSeconds({type: 'branch', branch: 'cmb-default'}), 0)
  })
  it('Returns zero caching for a development build', () => {
    assert.strictEqual(getCacheDurationInSeconds({type: 'development', handle: 'cmb'}), 0)
  })
  it('Returns short cache duration for channels', () => {
    assert.strictEqual(getCacheDurationInSeconds({type: 'channel', channel: 'release'}), 60)
  })
  it('Returns very long cache duration for commits', () => {
    assert.strictEqual(
      getCacheDurationInSeconds({type: 'commit', branch: 'master', commit: 'commit'}),
      31536000
    )
  })
  it('Returns short cache duration for dynamic version targets', () => {
    assert.strictEqual(getCacheDurationInSeconds({...VERSION_BASE, level: 'major'}), 60)
    assert.strictEqual(getCacheDurationInSeconds({...VERSION_BASE, level: 'minor'}), 60)
    assert.strictEqual(getCacheDurationInSeconds({...VERSION_BASE, level: 'major', pre: true}), 60)
    assert.strictEqual(getCacheDurationInSeconds({...VERSION_BASE, level: 'minor', pre: true}), 60)
    assert.strictEqual(getCacheDurationInSeconds({...VERSION_BASE, level: 'patch', pre: true}), 60)
  })
  it('Returns very long cache duration for fixed patch', () => {
    assert.strictEqual(getCacheDurationInSeconds({...VERSION_BASE, level: 'patch'}), 31536000)
  })
})
