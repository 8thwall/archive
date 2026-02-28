// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import {isValidDependency} from './validate-module-dependency'

const VALID_DEPENDENCY = {
  type: 'module',
  dependencyId: 'my-dependency',
  moduleId: 'my-module',
  alias: 'my-module',
  target: {
    type: 'commit',
    branch: 'my-branch',
    commit: '0123456789012345678901234567890123456789',
  },
  accessToken: 'my-access-token',
} as const

describe('isValidDependency', () => {
  it('Returns true for a valid dependency', () => {
    assert.isTrue(isValidDependency(VALID_DEPENDENCY))
    assert.isTrue(isValidDependency({...VALID_DEPENDENCY, alias: 'with-dash'}))
    assert.isTrue(isValidDependency({...VALID_DEPENDENCY, alias: 'with_underscore'}))
  })
  it('Returns false for invalid input', () => {
    assert.isFalse(isValidDependency({}))
    assert.isFalse(isValidDependency(undefined))
    assert.isFalse(isValidDependency(null))
    assert.isFalse(isValidDependency('not-a-dependency'))
    assert.isFalse(isValidDependency(42))
  })
  it('Returns false for incorrect type', () => {
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, type: 'not-module'}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, type: undefined}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, type: null}))
  })
  it('Returns false for invalid dependencyId', () => {
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, dependencyId: ''}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, dependencyId: null}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, dependencyId: undefined}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, dependencyId: 42}))
  })
  it('Returns false for invalid moduleId', () => {
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, moduleId: ''}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, moduleId: null}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, moduleId: undefined}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, moduleId: 42}))
  })
  it('Returns false for invalid alias', () => {
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, alias: ''}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, alias: null}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, alias: undefined}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, alias: 42}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, alias: 'special&character'}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, alias: 'new\nline'}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, alias: '🪲'}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, alias: []}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, alias: ''.padStart(100, 'verylong')}))
  })
  it('Returns false for invalid target', () => {
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, target: ''}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, target: null}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, target: undefined}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, target: 42}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, target: {}}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, target: {type: 'not a type'}}))
    assert.isFalse(isValidDependency({
      ...VALID_DEPENDENCY,
      target: {type: 'commit', branch: 'branch', commit: 'invalid'},
    }))
  })
  // TODO(christoph): Make accessToken required once we add support for it
  it('Returns true for undefined access target', () => {
    assert.isTrue(isValidDependency({...VALID_DEPENDENCY, accessToken: undefined}))
  })
  it('Returns false for invalid access token', () => {
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, accessToken: ''}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, accessToken: null}))
    assert.isFalse(isValidDependency({...VALID_DEPENDENCY, accessToken: 42}))
  })
})
