// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import {moduleTargetsPartiallyEqual, isSameBaseVersionAtLevel} from './compare-module-target'

describe('moduleTargetsPartiallyEqual', () => {
  describe('branch target', () => {
    const left = {type: 'branch' as const, branch: 'test-24910'}

    it('Should be true if completely same', () => {
      const right = {type: 'branch' as const, branch: 'test-24910'}
      assert.isTrue(moduleTargetsPartiallyEqual(left, right))
    })

    it('Should be true if same branch commit', () => {
      const right = {type: 'commit' as const, branch: 'test-24910', commit: 'test-commit-6912306'}
      assert.isTrue(moduleTargetsPartiallyEqual(left, right))
    })

    it('Should be false different branch', () => {
      const right = {type: 'branch' as const, branch: 'test-91029'}
      assert.isFalse(moduleTargetsPartiallyEqual(left, right))
    })

    it('Should be false different branch commit', () => {
      const right = {type: 'commit' as const, branch: 'test-91029', commit: 'test-commit-6912306'}
      assert.isFalse(moduleTargetsPartiallyEqual(left, right))
    })

    it('Should be false on channel type', () => {
      assert.isFalse(moduleTargetsPartiallyEqual(left, {
        type: 'channel' as const, channel: 'test-channel-1',
      }))
    })

    it('Should be false on version type', () => {
      assert.isFalse(moduleTargetsPartiallyEqual(left, {
        type: 'version' as const, level: 'major' as const, major: 1,
      }))
    })
  })

  describe('channel target', () => {
    const left = {type: 'channel' as const, channel: 'test-24910'}

    it('Should be true if completely same', () => {
      const right = {...left}
      assert.isTrue(moduleTargetsPartiallyEqual(left, right))
    })

    it('Should be false if not same channel', () => {
      const right = {...left, channel: 'test-1025015'}
      assert.isFalse(moduleTargetsPartiallyEqual(left, right))
    })

    it('Should be false on branch type', () => {
      assert.isFalse(moduleTargetsPartiallyEqual(left, {
        type: 'branch' as const, branch: 'test-24910',
      }))
    })

    it('Should be false on commit type', () => {
      assert.isFalse(moduleTargetsPartiallyEqual(left, {
        type: 'commit' as const, branch: 'test-24910', commit: 'test-commit-6912306',
      }))
    })

    it('Should be false on version type', () => {
      assert.isFalse(moduleTargetsPartiallyEqual(left, {
        type: 'version' as const, level: 'major' as const, major: 1,
      }))
    })
  })

  describe('commit target', () => {
    const left = {type: 'commit' as const, branch: 'test-24910', commit: 'test-commit-6912306'}

    it('Should be true if completely same', () => {
      const right = {...left}
      assert.isTrue(moduleTargetsPartiallyEqual(left, right))
    })

    it('Should be true if same branch target', () => {
      const right = {...left, commit: 'test-commit-2'}
      assert.isTrue(moduleTargetsPartiallyEqual(left, right))
    })

    it('Should be true if branch target with same branch', () => {
      const right = {type: 'branch' as const, branch: 'test-24910'}
      assert.isTrue(moduleTargetsPartiallyEqual(left, right))
    })

    it('Should be false on channel type', () => {
      assert.isFalse(moduleTargetsPartiallyEqual(left, {
        type: 'channel' as const, channel: 'test-channel-1',
      }))
    })

    it('Should be false on version type', () => {
      assert.isFalse(moduleTargetsPartiallyEqual(left, {
        type: 'version' as const, level: 'major' as const, major: 1,
      }))
    })
  })

  describe('version target', () => {
    describe('level major', () => {
      const left = {type: 'version' as const, level: 'major' as const, major: 1}
      it('Should be true if same major', () => {
        const right = {...left}
        assert.isTrue(moduleTargetsPartiallyEqual(left, right))
      })

      it('Should be true if switch to minor', () => {
        const right = {type: 'version' as const, level: 'minor' as const, major: 2, minor: 0}
        assert.isTrue(moduleTargetsPartiallyEqual(left, right))
      })

      it('Should be true if switch to patch', () => {
        const levels = {major: 12, minor: 1, patch: 291}
        const right = {type: 'version' as const, level: 'patch' as const, ...levels}
        assert.isTrue(moduleTargetsPartiallyEqual(left, right))
      })

      it('Should be false if different type', () => {
        assert.isFalse(moduleTargetsPartiallyEqual(left, {
          type: 'branch' as const, branch: 'test-branch-1',
        }))
        assert.isFalse(moduleTargetsPartiallyEqual(left, {
          type: 'channel' as const, channel: 'test-channel-1',
        }))
        assert.isFalse(moduleTargetsPartiallyEqual(left, {
          type: 'commit' as const, branch: 'test-branch-1', commit: 'commit-test-1',
        }))
      })
    })

    describe('level minor', () => {
      const levels = {major: 12, minor: 1, patch: 291}
      const left = {type: 'version' as const, level: 'minor' as const, ...levels}
      it('Should be true if same major minor', () => {
        const right = {...left}
        assert.isTrue(moduleTargetsPartiallyEqual(left, right))
      })

      it('Should be true if switch to major', () => {
        const right = {type: 'version' as const, level: 'major' as const, ...levels}
        assert.isTrue(moduleTargetsPartiallyEqual(left, right))
      })

      it('Should be true if switch to patch', () => {
        const right = {type: 'version' as const, level: 'patch' as const, ...levels}
        assert.isTrue(moduleTargetsPartiallyEqual(left, right))
      })

      it('Should be false if different type', () => {
        assert.isFalse(moduleTargetsPartiallyEqual(left, {
          type: 'branch' as const, branch: 'test-branch-1',
        }))
        assert.isFalse(moduleTargetsPartiallyEqual(left, {
          type: 'channel' as const, channel: 'test-channel-1',
        }))
        assert.isFalse(moduleTargetsPartiallyEqual(left, {
          type: 'commit' as const, branch: 'test-branch-1', commit: 'commit-test-1',
        }))
      })
    })

    describe('level patch', () => {
      const levels = {major: 12, minor: 1, patch: 291}
      const left = {type: 'version' as const, level: 'patch' as const, ...levels}

      it('Should be true if same major minor patch', () => {
        const right = {...left}
        assert.isTrue(moduleTargetsPartiallyEqual(left, right))
      })

      it('Should be true if switch to major', () => {
        const right = {type: 'version' as const, level: 'major' as const, ...levels}
        assert.isTrue(moduleTargetsPartiallyEqual(left, right))
      })

      it('Should be true if switch to minor', () => {
        const right = {type: 'version' as const, level: 'minor' as const, ...levels}
        assert.isTrue(moduleTargetsPartiallyEqual(left, right))
      })

      it('Should be false if different type', () => {
        assert.isFalse(moduleTargetsPartiallyEqual(left, {
          type: 'branch' as const, branch: 'test-branch-1',
        }))
        assert.isFalse(moduleTargetsPartiallyEqual(left, {
          type: 'channel' as const, channel: 'test-channel-1',
        }))
        assert.isFalse(moduleTargetsPartiallyEqual(left, {
          type: 'commit' as const, branch: 'test-branch-1', commit: 'commit-test-1',
        }))
      })
    })
  })
})

describe('isSameBaseVersionAtLevel', () => {
  it('Returns true for equivalent target at all levels', () => {
    const target = {type: 'version', level: 'patch', major: 1, minor: 2, patch: 3} as const
    assert.isTrue(isSameBaseVersionAtLevel(target, target, 'patch'))
    assert.isTrue(isSameBaseVersionAtLevel(target, target, 'minor'))
    assert.isTrue(isSameBaseVersionAtLevel(target, target, 'major'))
  })

  it('Different patch targets are equal at major and minor levels', () => {
    const targetA = {type: 'version', level: 'patch', major: 1, minor: 2, patch: 3} as const
    const targetB = {type: 'version', level: 'patch', major: 1, minor: 2, patch: 4} as const
    assert.isFalse(isSameBaseVersionAtLevel(targetA, targetB, 'patch'))
    assert.isTrue(isSameBaseVersionAtLevel(targetA, targetB, 'minor'))
    assert.isTrue(isSameBaseVersionAtLevel(targetA, targetB, 'major'))
  })

  it('Different minor targets are equal at major level', () => {
    const targetA = {type: 'version', level: 'patch', major: 1, minor: 2, patch: 3} as const
    const targetB = {type: 'version', level: 'patch', major: 1, minor: 4, patch: 3} as const
    assert.isFalse(isSameBaseVersionAtLevel(targetA, targetB, 'patch'))
    assert.isFalse(isSameBaseVersionAtLevel(targetA, targetB, 'minor'))
    assert.isTrue(isSameBaseVersionAtLevel(targetA, targetB, 'major'))
  })

  it('Different major targets are not equal at any level', () => {
    const targetA = {type: 'version', level: 'patch', major: 1, minor: 2, patch: 3} as const
    const targetB = {type: 'version', level: 'patch', major: 2, minor: 2, patch: 3} as const
    assert.isFalse(isSameBaseVersionAtLevel(targetA, targetB, 'patch'))
    assert.isFalse(isSameBaseVersionAtLevel(targetA, targetB, 'minor'))
    assert.isFalse(isSameBaseVersionAtLevel(targetA, targetB, 'major'))
  })

  it('Pre-release targets are compared equivalently', () => {
    const targetA = {type: 'version', level: 'patch', major: 1, minor: 2, patch: 3} as const
    const targetB = {type: 'version', level: 'patch', major: 1, minor: 4, patch: 3} as const
    assert.isFalse(isSameBaseVersionAtLevel(targetA, {...targetB, pre: true}, 'patch'))
    assert.isFalse(isSameBaseVersionAtLevel(targetA, {...targetB, pre: true}, 'minor'))
    assert.isTrue(isSameBaseVersionAtLevel(targetA, {...targetB, pre: true}, 'major'))
  })
})
