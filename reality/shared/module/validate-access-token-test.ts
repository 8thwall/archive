// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import {validateAccessLevel, ValidationRequest} from './validate-access-token'
import type {DependencyTokenPayload} from './dependency-token-payload'

const BASE_TOKEN: DependencyTokenPayload = {
  version: 1,
  sub: 'dep',
  moduleId: 'my-module',
  accessLevel: 'owned',
  iat: 1,
  accountUuid: 'my-account',
  appUuid: 'my-app',
} as const

const assertValid = (request: ValidationRequest) => {
  assert.isTrue(validateAccessLevel(request))
}

const assertInvalid = (request: ValidationRequest) => {
  assert.isFalse(validateAccessLevel(request))
}

describe('validateAccessLevel', () => {
  it('Owners have full access', () => {
    assertValid({
      moduleId: 'my-module',
      payload: BASE_TOKEN,
      requiredLevel: 'full',
    })
  })
  it('Owners have read access', () => {
    assertValid({
      moduleId: 'my-module',
      payload: BASE_TOKEN,
      requiredLevel: 'read',
    })
  })
  it('Public tokens don\'t have full access', () => {
    assertInvalid({
      moduleId: 'my-module',
      payload: {...BASE_TOKEN, accessLevel: 'public'},
      requiredLevel: 'full',
    })
  })
  it('Public tokens have read access', () => {
    assertValid({
      moduleId: 'my-module',
      payload: {...BASE_TOKEN, accessLevel: 'public'},
      requiredLevel: 'read',
    })
  })
  it('Purchased tokens don\'t have full access', () => {
    assertInvalid({
      moduleId: 'my-module',
      payload: {...BASE_TOKEN, accessLevel: 'purchased'},
      requiredLevel: 'full',
    })
  })
  it('Purchased tokens have read access', () => {
    assertValid({
      moduleId: 'my-module',
      payload: {...BASE_TOKEN, accessLevel: 'purchased'},
      requiredLevel: 'read',
    })
  })
  it('Tokens only apply to a specific module', () => {
    assertInvalid({
      moduleId: 'my-other-module',
      payload: BASE_TOKEN,
      requiredLevel: 'full',
    })
  })
  it('Tokens have to include dep: "sub"', () => {
    assertInvalid({
      moduleId: 'my-module',
      payload: {...BASE_TOKEN, sub: 'other' as any},
      requiredLevel: 'full',
    })
  })
})
