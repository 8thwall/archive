// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import {isUnsafeModuleTarget} from './unsafe-module-target'

describe('isUnsafeModuleTarget', () => {
  it('Unsafe, on master branch', async () => {
    assert.strictEqual(await isUnsafeModuleTarget({type: 'branch', branch: 'master'}), true)
  })
  it('Unsafe, not currently possible', async () => {
    assert.strictEqual(await isUnsafeModuleTarget({type: 'branch', branch: 'other-branch'}), true)
  })
  it('Unsafe, using a pre-release', async () => {
    assert.strictEqual(
      await isUnsafeModuleTarget({
        type: 'version', pre: true, level: 'patch', major: 2, minor: 3, patch: 4,
      }, async () => false), true
    )
  })
  it('Safe, will not get updated when new changes are landed', async () => {
    assert.strictEqual(
      await isUnsafeModuleTarget({type: 'commit', branch: 'master', commit: 'xyz'}),
      false
    )
  })
  it('Safe', async () => {
    assert.strictEqual(
      await isUnsafeModuleTarget({type: 'version', level: 'major', major: 2}), false
    )
  })
  it('Safe', async () => {
    assert.strictEqual(await
    isUnsafeModuleTarget({type: 'version', level: 'patch', major: 2, minor: 3, patch: 4}),
    false)
  })
  it('Safe, using a pre-release that has a finalized release', async () => {
    assert.strictEqual(
      await isUnsafeModuleTarget({
        type: 'version', pre: true, level: 'patch', major: 2, minor: 3, patch: 4,
      }, async () => true), false
    )
  })
})
