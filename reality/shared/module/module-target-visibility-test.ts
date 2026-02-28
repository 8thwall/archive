// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import {getTargetVisibility} from './module-target-visibility'

describe('getTargetVisibility', () => {
  it('Master branch requires full access', () => {
    assert.strictEqual(getTargetVisibility({type: 'branch', branch: 'master'}), 'full')
  })
  it('Client branch requires full access', () => {
    assert.strictEqual(getTargetVisibility({type: 'branch', branch: 'cmb-default'}), 'full')
  })
  it('Master commits require full access', () => {
    assert.strictEqual(
      getTargetVisibility({type: 'commit', branch: 'master', commit: 'commit'}),
      'full'
    )
  })
  it('Dev builds require full access', () => {
    assert.strictEqual(getTargetVisibility({type: 'development', handle: 'cmb'}), 'full')
  })
  it('Beta channel requires read access', () => {
    assert.strictEqual(getTargetVisibility({type: 'channel', channel: 'beta'}), 'read')
  })
  it('Other channels require full access', () => {
    assert.strictEqual(getTargetVisibility({type: 'channel', channel: 'other'}), 'full')
  })
  it('Numbered versions require read access', () => {
    assert.strictEqual(
      getTargetVisibility({type: 'version', level: 'major', major: 3}),
      'read'
    )
    assert.strictEqual(
      getTargetVisibility({type: 'version', level: 'minor', major: 3, minor: 3}),
      'read'
    )
    assert.strictEqual(
      getTargetVisibility({type: 'version', level: 'patch', major: 3, minor: 3, patch: 3}),
      'read'
    )
  })
  it('Pre-release versions require read access', () => {
    assert.strictEqual(
      getTargetVisibility({
        type: 'version',
        pre: true,
        level: 'patch',
        major: 3,
        minor: 3,
        patch: 3,
      }),
      'read'
    )
  })
})
