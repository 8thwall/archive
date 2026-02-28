// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import {isValidOverrideSettings} from './validate-module-override'

describe('isValidOverrideSettings', () => {
  it('Returns true for valid override settings (.client.json)', () => {
    assert.isTrue(isValidOverrideSettings({
      moduleTargetOverrides: {
        'silly-dependency.json': {type: 'branch', branch: 'jonathan-default'},
        'sad-dependency.json': {type: 'branch', branch: 'christoph-2'},
        'angry-dependency.json': {type: 'branch', branch: 'tri-3'},
        'happy-dependency.json': {type: 'branch', branch: 'pawel-4'},
      },
    }))
  })
  it('Returns true for empty json', () => {
    assert.isTrue(isValidOverrideSettings({}))
  })
  it('Returns false when moduleTargetOverrides is set to true', () => {
    assert.isFalse(isValidOverrideSettings({
      moduleTargetOverrides: true,
    }))
  })
  it('Returns false when moduleTargetOverrides is set to false', () => {
    assert.isFalse(isValidOverrideSettings({
      moduleTargetOverrides: false,
    }))
  })
  it('Returns false when moduleTargetOverrides is set to a string', () => {
    assert.isFalse(isValidOverrideSettings({
      moduleTargetOverrides: 'Hello World',
    }))
  })
  it('Returns true when moduleTargetOverrides is a empty object', () => {
    assert.isTrue(isValidOverrideSettings({
      moduleTargetOverrides: {},
    }))
  })
  it('Returns false when moduleTargetOverrides contains an invalid target', () => {
    assert.isFalse(isValidOverrideSettings({
      moduleTargetOverrides: {
        'silly-dependency.json': {type: 'branch'},
      },
    }))
  })
  it('Returns false when moduleTargetOverrides is set to a number', () => {
    assert.isFalse(isValidOverrideSettings({
      moduleTargetOverrides: 42,
    }))
  })
  it('Returns true when moduleTargetOverrides is null', () => {
    assert.isTrue(isValidOverrideSettings({
      moduleTargetOverrides: null,
    }))
  })
  it('Returns false when moduleTargetOverrides is set to a empty string', () => {
    assert.isFalse(isValidOverrideSettings({
      moduleTargetOverrides: '',
    }))
  })
  it('Returns true when moduleTargetOverrides is undefined', () => {
    assert.isTrue(isValidOverrideSettings({
      moduleTargetOverrides: undefined,
    }))
  })
})
