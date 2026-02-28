// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import {isOpenForDevelopment, targetOverrideApplies} from './module-target-override'

describe('isOpenForDevelopment', () => {
  it('Returns false for no override', () => {
    assert.isFalse(isOpenForDevelopment({type: 'branch', branch: 'master'}))
  })
  it('Returns true when overriding master branch with development target', () => {
    assert.isTrue(isOpenForDevelopment(
      {type: 'branch', branch: 'master'},
      {type: 'development', handle: 'cmb'}
    ))
  })
  it('Returns false when overriding master branch with non-development target', () => {
    assert.isFalse(isOpenForDevelopment(
      {type: 'branch', branch: 'master'},
      {type: 'branch', branch: 'cmb-default'}
    ))
  })
  it('Returns false when overriding non-master branch with development target', () => {
    assert.isFalse(isOpenForDevelopment(
      {type: 'branch', branch: 'not-master'},
      {type: 'development', handle: 'cmb'}
    ))
  })
  it('Returns false when overriding release version with development target', () => {
    assert.isFalse(isOpenForDevelopment(
      {type: 'version', level: 'major', major: 1},
      {type: 'development', handle: 'cmb'}
    ))
  })
})

describe('targetOverrideApplies', () => {
  it('Returns false for no override', () => {
    assert.isFalse(targetOverrideApplies({type: 'branch', branch: 'master'}))
  })
  it('Returns true when overriding master branch with development target', () => {
    assert.isTrue(targetOverrideApplies(
      {type: 'branch', branch: 'master'},
      {type: 'development', handle: 'cmb'}
    ))
  })
  it('Returns true when overriding master branch with non-development target', () => {
    assert.isTrue(targetOverrideApplies(
      {type: 'branch', branch: 'master'},
      {type: 'branch', branch: 'cmb-default'}
    ))
  })
  it('Returns true when overriding non-master branch with non-development target', () => {
    assert.isTrue(targetOverrideApplies(
      {type: 'branch', branch: 'not-master'},
      {type: 'branch', branch: 'cmb-default'}
    ))
  })
  it('Returns false when overriding non-master branch with development target', () => {
    assert.isFalse(targetOverrideApplies(
      {type: 'branch', branch: 'not-master'},
      {type: 'development', handle: 'cmb'}
    ))
  })
  it('Returns false when overriding release version with development target', () => {
    assert.isFalse(targetOverrideApplies(
      {type: 'version', level: 'major', major: 1},
      {type: 'development', handle: 'cmb'}
    ))
  })
})
