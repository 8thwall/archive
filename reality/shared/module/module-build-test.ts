// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import {keyForBuild, pkForModule, skForTarget} from './module-build'

describe('pkForModule', () => {
  it('Returns the expected pk for a module', () => {
    assert.strictEqual(pkForModule('my-module'), 'module:my-module')
  })
})

describe('skForTarget', () => {
  it('Returns the expected format for branch target', () => {
    assert.strictEqual(
      skForTarget({type: 'branch', branch: 'my-branch'}),
      'target:branch:my-branch'
    )
  })
  it('Returns the expected format for commit target', () => {
    assert.strictEqual(
      skForTarget({type: 'commit', branch: 'my-branch', commit: 'my-commit'}),
      'target:commit:my-branch:my-commit'
    )
  })
  it('Returns the expected format for channel target', () => {
    assert.strictEqual(
      skForTarget({type: 'channel', channel: 'my-channel'}),
      'target:channel:my-channel'
    )
  })
})

describe('keyForBuild', () => {
  it('Returns the expected format', () => {
    assert.deepEqual(
      keyForBuild('my-module', {type: 'branch', branch: 'my-branch'}),
      {
        pk: {S: 'module:my-module'},
        sk: {S: 'target:branch:my-branch'},
      }
    )
  })
})
