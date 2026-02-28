// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import {parseModuleTarget, getModuleTargetParts} from './module-target'

describe('parseModuleTarget', () => {
  it('Properly parses branch targets', () => {
    assert.deepEqual(
      parseModuleTarget(['branch', 'my-branch', 'extra', 'stuff']),
      {
        target: {type: 'branch', branch: 'my-branch'},
        remainder: ['extra', 'stuff'],
      }
    )
  })
  it('Properly parses commit targets', () => {
    assert.deepEqual(
      parseModuleTarget(['commit', 'my-branch', 'my-commit', 'extra', 'stuff']),
      {
        target: {type: 'commit', branch: 'my-branch', commit: 'my-commit'},
        remainder: ['extra', 'stuff'],
      }
    )
  })
  it('Properly parses channel targets', () => {
    assert.deepEqual(
      parseModuleTarget(['channel', 'my-channel', 'extra', 'stuff']),
      {
        target: {type: 'channel', channel: 'my-channel'},
        remainder: ['extra', 'stuff'],
      }
    )
  })
  it('Properly parses patch version targets', () => {
    assert.deepEqual(
      parseModuleTarget(['version', 'patch', '12', '5', '3', 'extra', 'stuff']),
      {
        target: {type: 'version', level: 'patch', major: 12, minor: 5, patch: 3},
        remainder: ['extra', 'stuff'],
      }
    )
  })
  it('Properly parses patch version targets with zeros', () => {
    assert.deepEqual(
      parseModuleTarget(['version', 'patch', '5', '0', '0', 'extra', 'stuff']),
      {
        target: {type: 'version', level: 'patch', major: 5, minor: 0, patch: 0},
        remainder: ['extra', 'stuff'],
      }
    )
  })
  it('Properly parses minor version targets', () => {
    assert.deepEqual(
      parseModuleTarget(['version', 'minor', '12', '0', 'extra', 'stuff']),
      {
        target: {type: 'version', level: 'minor', major: 12, minor: 0},
        remainder: ['extra', 'stuff'],
      }
    )
  })
  it('Properly parses major version targets', () => {
    assert.deepEqual(
      parseModuleTarget(['version', 'major', '0', 'extra', 'stuff']),
      {
        target: {type: 'version', level: 'major', major: 0},
        remainder: ['extra', 'stuff'],
      }
    )
  })
  it('Properly parses handle targets', () => {
    assert.deepEqual(
      parseModuleTarget(['development', 'handle', 'my-handle', 'extra', 'stuff']),
      {
        target: {type: 'development', handle: 'my-handle'},
        remainder: ['extra', 'stuff'],
      }
    )
  })
  it('Properly parses pre-release targets', () => {
    assert.deepEqual(
      parseModuleTarget(['version', 'pre', 'major', '1', '5', '9', 'extra', 'stuff']),
      {
        target: {type: 'version', level: 'major', major: 1, minor: 5, patch: 9, pre: true},
        remainder: ['extra', 'stuff'],
      }
    )
    assert.deepEqual(
      parseModuleTarget(['version', 'pre', 'minor', '1', '5', '9', 'extra', 'stuff']),
      {
        target: {type: 'version', level: 'minor', major: 1, minor: 5, patch: 9, pre: true},
        remainder: ['extra', 'stuff'],
      }
    )
    assert.deepEqual(
      parseModuleTarget(['version', 'pre', 'patch', '1', '5', '9', 'extra', 'stuff']),
      {
        target: {type: 'version', level: 'patch', major: 1, minor: 5, patch: 9, pre: true},
        remainder: ['extra', 'stuff'],
      }
    )
  })
  it('Returns null for invalid input', () => {
    assert.isNull(parseModuleTarget(['branch']), 'Missing branch specifier')
    assert.isNull(parseModuleTarget(['commit']), 'Missing branch specifier in commit')
    assert.isNull(parseModuleTarget(['commit', 'my-branch']), 'Missing commit specifier')
    assert.isNull(parseModuleTarget(['channel']), 'Missing channel specifier')
    assert.isNull(parseModuleTarget(['wrongchannel', 'my-channel']), 'Invalid target type')
    assert.isNull(parseModuleTarget([]), 'No parts')
    assert.isNull(parseModuleTarget(['version']), 'Missing version specifier')
    assert.isNull(parseModuleTarget(['version', 'sillyGoose']), 'Invalid version specifier')
    assert.isNull(parseModuleTarget(['version', 'patch', '5', '4', 'bad']), '[patch] Bad number')
    assert.isNull(parseModuleTarget(['version', 'patch', '5', '4']), '[patch] Not enough numbers')
    assert.isNull(parseModuleTarget(['version', 'minor', '5', 'bad']), '[minor] Bad number')
    assert.isNull(parseModuleTarget(['version', 'minor', '5']), '[minor] Not enough numbers')
    assert.isNull(parseModuleTarget(['version', 'major', 'bad']), '[major] Bad number')
    assert.isNull(parseModuleTarget(['version', 'major']), '[major] Not enough numbers')
    assert.isNull(parseModuleTarget(['version', 'major', '-0.5']), '[major] negative number')
    assert.isNull(parseModuleTarget(['version', 'major', '-5']), '[major] negative integer number')
    assert.isNull(parseModuleTarget(['version', 'major', '0.005']), '[major] decimal number')
    assert.isNull(parseModuleTarget(['version', 'major', '0000001']), '[major] 000 number')
    assert.isNull(parseModuleTarget(['version', 'major', '']), '[major] empty string')
    assert.isNull(parseModuleTarget(['version', 'major', '0x1']), '[major] char in number')
    assert.isNull(parseModuleTarget(['version', 'major', 'x01']), '[major] char at start')
    assert.isNull(parseModuleTarget(['version', 'major', '01x']), '[major] char at end')
    assert.isNull(parseModuleTarget(['version', 'major', '!@#$']), '[major] special symbols')
    assert.isNull(parseModuleTarget(['version', 'major', '1.2.3']), '[major] multiple .')
    assert.isNull(parseModuleTarget(['version', 'pre', 'major', '1']), 'missing patch for pre')
    assert.isNull(parseModuleTarget(['version', 'pre', 'minor', '1', '2']), 'missing patch for pre')
    assert.isNull(parseModuleTarget(['version', 'pre', 'patch', '1', '2']), 'missing patch for pre')
    assert.isNull(parseModuleTarget(['version', 'pre', 'pre', 'patch', '1', '2', '3']), 'pre x2')
    assert.isNull(parseModuleTarget(['development', 'handle', '']), 'Empty handle')
    assert.isNull(parseModuleTarget(['development', 'nothandle', 'my-handle']), 'Invalid prefix')
    assert.isNull(parseModuleTarget(['development', '']), 'Missing prefix')
  })
})

describe('getModuleTargetParts', () => {
  it('Properly returns branch parts', () => {
    assert.deepEqual(
      getModuleTargetParts({type: 'branch', branch: 'my-branch'}),
      ['branch', 'my-branch']
    )
  })
  it('Properly returns commit parts', () => {
    assert.deepEqual(
      getModuleTargetParts({type: 'commit', branch: 'my-branch', commit: 'my-commit'}),
      ['commit', 'my-branch', 'my-commit']
    )
  })
  it('Properly returns channel parts', () => {
    assert.deepEqual(
      getModuleTargetParts({type: 'channel', channel: 'my-channel'}),
      ['channel', 'my-channel']
    )
  })
  it('Properly returns major version parts', () => {
    assert.deepEqual(
      getModuleTargetParts({type: 'version', level: 'major', major: 4}),
      ['version', 'major', '4']
    )
  })
  it('Properly returns minor version parts', () => {
    assert.deepEqual(
      getModuleTargetParts({type: 'version', level: 'minor', major: 4, minor: 3}),
      ['version', 'minor', '4', '3']
    )
  })
  it('Properly returns patch version parts', () => {
    assert.deepEqual(
      getModuleTargetParts({type: 'version', level: 'patch', major: 4, minor: 3, patch: 2}),
      ['version', 'patch', '4', '3', '2']
    )
  })
  it('Properly returns pre-release version parts', () => {
    const baseTarget = {
      type: 'version', major: 4, minor: 3, patch: 2, pre: true,
    } as const
    assert.deepEqual(
      getModuleTargetParts({...baseTarget, level: 'patch'}),
      ['version', 'pre', 'patch', '4', '3', '2']
    )
    assert.deepEqual(
      getModuleTargetParts({...baseTarget, level: 'minor'}),
      ['version', 'pre', 'minor', '4', '3', '2']
    )
    assert.deepEqual(
      getModuleTargetParts({...baseTarget, level: 'major'}),
      ['version', 'pre', 'major', '4', '3', '2']
    )
  })
  it('Properly returns handle parts', () => {
    assert.deepEqual(
      getModuleTargetParts({type: 'development', handle: 'my-handle'}),
      ['development', 'handle', 'my-handle']
    )
  })
})
