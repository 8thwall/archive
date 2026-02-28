// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import {isValidTarget} from './validate-module-target'

describe('isValidTarget', () => {
  it('Returns true for valid commit targets', () => {
    assert.isTrue(isValidTarget({
      type: 'commit',
      branch: 'my-branch',
      commit: '0123456789012345678901234567890123456789',
    }))
  })
  it('Returns true for valid branch targets', () => {
    assert.isTrue(isValidTarget({type: 'branch', branch: 'my-branch'}))
  })
  it('Returns true for valid channel targets', () => {
    assert.isTrue(isValidTarget({type: 'channel', channel: 'my-channel'}))
  })
  it('Returns true for valid development targets', () => {
    assert.isTrue(isValidTarget({type: 'development', handle: 'my-handle'}))
  })
  it('Returns true for valid version targets', () => {
    assert.isTrue(isValidTarget({
      type: 'version',
      level: 'patch',
      major: 5,
      minor: 4,
      patch: 0,
    }))
    assert.isTrue(isValidTarget({
      type: 'version',
      level: 'minor',
      major: 5,
      minor: 0,
    }))
    assert.isTrue(isValidTarget({
      type: 'version',
      level: 'major',
      major: 0,
    }))
  })
  it('Returns false for invalid input', () => {
    const invalid = [
      'string', 123, {}, [], {type: 'invalid'},
      {type: 'channel'}, {type: 'channel', channel: ''}, {type: 'channel', channel: [123]},
      {type: 'branch'}, {type: 'branch', branch: ''}, {type: 'branch', branch: [123]},
      {type: 'commit'},
      {type: 'development'},
      {type: 'development', handle: false},
      {type: 'development', handle: ''},
      {
        type: 'commit',
        // missing branch
        commit: '0123456789012345678901234567890123456789',
      },
      {
        type: 'commit',
        branch: 'my-branch',
        // missing commit
      },
      {
        type: 'commit',
        branch: 'my-branch',
        commit: '01234567890',  // Shortened commits are invalid
      },
      {
        type: 'version',
        level: 'patch',
        major: 5,
        minor: 4,
        patch: '',  // bad number
      },
      {
        type: 'version',
        level: 'patch',
        major: 5,
        minor: 4,  // Not enough numbers
      },
      {
        type: 'version',
        level: 'minor',
        major: 5,
        minor: '0',  // bad numbers
      },
      {
        type: 'version',
        level: 'minor',
        major: 5,  // Not enought numbers
      },
      {
        type: 'version',
        level: 'major',
        major: 'bad',  // bad number
      },
      {
        type: 'version',
        level: 'major',
        major: -1,  // negative number
      },
      {
        type: 'version',
        level: 'major',
        major: 1.2312312,  // decimal number
      },
      {
        type: 'version',
        level: 'major',
        major: '12312333123',  // string number
      },
      {
        type: 'version',
        level: 'bad',
        major: 3,  // Invalid level
      },
      {
        type: 'version',
        pre: true,  // Pre requires all the way to patch
        level: 'major',
        major: 5,
        minor: 5,
      },
    ]

    assert.isFalse(invalid.map(v => isValidTarget(v)).some(Boolean))
  })
})
