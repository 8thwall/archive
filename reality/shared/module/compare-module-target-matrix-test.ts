// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, before, assert} from 'bzl/js/chai-js'

import type {DeepReadonly as RO} from 'ts-essentials'

import {moduleTargetsEqual, moduleTargetsPartiallyEqual} from './compare-module-target'
import type {ModuleTarget} from './module-target'

const EQ = 1  // Equal
const _P = 2  // Partially equal
const __ = 3  // Not equal

const ALLOWED_STATUSES = [EQ, _P, __] as const

const TARGETS: RO<ModuleTarget[]> = [
  {type: 'branch', branch: 'master'},
  {type: 'branch', branch: 'my-client'},
  {type: 'commit', branch: 'master', commit: 'commit1'},
  {type: 'commit', branch: 'master', commit: 'commit2'},
  {type: 'commit', branch: 'my-client', commit: 'commit2'},
  {type: 'channel', channel: 'channel1'},
  {type: 'channel', channel: 'channel2'},
  {type: 'version' as const, level: 'major' as const, major: 1},
  {type: 'version' as const, level: 'major' as const, major: 1, minor: 2, patch: 3},
  {type: 'version' as const, level: 'minor' as const, major: 1, minor: 5},
  {type: 'version' as const, level: 'minor' as const, major: 1, minor: 5, patch: 6},
  {type: 'version' as const, level: 'patch' as const, major: 1, minor: 7, patch: 8},
  {type: 'version' as const, pre: true, level: 'major' as const, major: 2, minor: 0, patch: 1},
  {type: 'version' as const, pre: true, level: 'major' as const, major: 2, minor: 0, patch: 2},
  {type: 'version' as const, pre: true, level: 'minor' as const, major: 1, minor: 5, patch: 6},
  {type: 'version' as const, pre: true, level: 'minor' as const, major: 1, minor: 5, patch: 7},
  {type: 'version' as const, pre: true, level: 'patch' as const, major: 1, minor: 9, patch: 0},
  {type: 'development' as const, handle: 'my-handle-1'},
  {type: 'development' as const, handle: 'my-handle-2'},
]

// Given a matching index combination in the TARGETS array, SIMILARITY_MATRIX gives the similarity
// between the two targets.

// Adding a new target means adding a new line at the end of the array with a similarity score for
// each previous target, plus itself.
const SIMILARITY_MATRIX: RO<(typeof ALLOWED_STATUSES[number])[][]> = [
  // Branches
  [EQ],
  [__, EQ],
  // Commits
  [_P, __, EQ],
  [_P, __, _P, EQ],
  [__, _P, __, __, EQ],
  // Channels
  [__, __, __, __, __, EQ],
  [__, __, __, __, __, __, EQ],
  // Versions
  [__, __, __, __, __, __, __, EQ],
  [__, __, __, __, __, __, __, EQ, EQ],
  [__, __, __, __, __, __, __, _P, _P, EQ],
  [__, __, __, __, __, __, __, _P, _P, EQ, EQ],
  [__, __, __, __, __, __, __, _P, _P, _P, _P, EQ],
  // Pre-release versions
  [__, __, __, __, __, __, __, _P, _P, _P, _P, _P, EQ],
  [__, __, __, __, __, __, __, _P, _P, _P, _P, _P, _P, EQ],
  [__, __, __, __, __, __, __, _P, _P, _P, _P, _P, _P, _P, EQ],
  [__, __, __, __, __, __, __, _P, _P, _P, _P, _P, _P, _P, _P, EQ],
  [__, __, __, __, __, __, __, _P, _P, _P, _P, _P, _P, _P, _P, _P, EQ],
  // Developer versions
  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, EQ],
  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, EQ],
]

describe('moduleTargetsEqual', () => {
  before(() => {
    const isProper = TARGETS.length === SIMILARITY_MATRIX.length &&
                     SIMILARITY_MATRIX.every((e, i) => e.length === i + 1) &&
                     SIMILARITY_MATRIX.every(e => e.every(v => ALLOWED_STATUSES.includes(v)))
    if (!isProper) {
      throw new Error('SIMILARITY_MATRIX and TARGETS are mismatched')
    }
  })

  it('Returns correct equality values according to similarity matrix', () => {
    TARGETS.forEach((left, i) => {
      TARGETS.forEach((right, j) => {
        const leftClone = JSON.parse(JSON.stringify(left))
        const rightClone = JSON.parse(JSON.stringify(right))

        const v = SIMILARITY_MATRIX[Math.max(i, j)][Math.min(i, j)]
        const expectedEqual = v === EQ

        const message = `${JSON.stringify(left)} and ${JSON.stringify(right)} \
should be ${expectedEqual ? 'equal' : 'non-equal'}`

        assert.equal(moduleTargetsEqual(leftClone, rightClone), expectedEqual, message)
      })
    })
  })
})

describe('moduleTargetsPartiallyEqual', () => {
  it('Returns correct partial equality values according to similarity matrix', () => {
    TARGETS.forEach((left, i) => {
      TARGETS.forEach((right, j) => {
        const leftClone = JSON.parse(JSON.stringify(left))
        const rightClone = JSON.parse(JSON.stringify(right))

        const v = SIMILARITY_MATRIX[Math.max(i, j)][Math.min(i, j)]
        const expectedPartial = v === EQ || v === _P

        const message = `${JSON.stringify(left)} and ${JSON.stringify(right)} \
should be ${expectedPartial ? 'partially equal' : 'non-equal'}`

        assert.equal(moduleTargetsPartiallyEqual(leftClone, rightClone), expectedPartial, message)
      })
    })
  })
})
