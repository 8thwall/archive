// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import {validateRequest} from './validate'
import {register as registerDdb} from './dynamodb'
import {toAttributes} from '@nia/reality/shared/typed-attributes'

describe('validateRequest', () => {
  it('Approves valid slug', async () => {
    let args: any
    registerDdb({
      getItem: async (...args_) => {
        args = args_
        return {Item: toAttributes({status: 'ACTIVE'})} as any
      },
    })
    assert.isTrue(await validateRequest({
      moduleId: '<my-module>',
      target: {type: 'branch', branch: '<my-branch>'},
      file: 'module.js',
      slug: 'my-slug',
    }))
    assert.deepEqual(args, [{
      TableName: 'studio-global',
      Key: {
        pk: {S: 'module:<my-module>'},
        sk: {S: 'slug:branch:<my-branch>:my-slug'},
      },
    }])
  })
  it('Approves deprecated slug', async () => {
    let args: any
    registerDdb({
      getItem: async (...args_) => {
        args = args_
        return {Item: toAttributes({status: 'DEPRECATED'})} as any
      },
    })
    assert.isTrue(await validateRequest({
      moduleId: '<my-module>',
      target: {type: 'branch', branch: '<my-branch>'},
      file: 'module.js',
      slug: 'my-slug',
    }))
    assert.deepEqual(args, [{
      TableName: 'studio-global',
      Key: {
        pk: {S: 'module:<my-module>'},
        sk: {S: 'slug:branch:<my-branch>:my-slug'},
      },
    }])
  })
  it('Rejects missing slug', async () => {
    assert.isFalse(await validateRequest({
      moduleId: '<my-module>',
      target: {type: 'branch', branch: '<my-branch>'},
      file: 'module.js',
      slug: '',
    }))
  })
  it('Rejects wrong slug', async () => {
    registerDdb({
      getItem: async () => ({Item: null} as any),
    })
    assert.isFalse(await validateRequest({
      moduleId: '<my-module>',
      target: {type: 'branch', branch: '<my-branch>'},
      file: 'module.js',
      slug: 'wrong-slug',
    }))
  })
  it('Rejects unexpected slug status', async () => {
    let args: any
    registerDdb({
      getItem: async (...args_) => {
        args = args_
        return {Item: toAttributes({status: 'SOME_OTHER_STATUS'})} as any
      },
    })
    assert.isFalse(await validateRequest({
      moduleId: '<my-module>',
      target: {type: 'branch', branch: '<my-branch>'},
      file: 'module.js',
      slug: 'my-slug',
    }))
    assert.deepEqual(args, [{
      TableName: 'studio-global',
      Key: {
        pk: {S: 'module:<my-module>'},
        sk: {S: 'slug:branch:<my-branch>:my-slug'},
      },
    }])
  })
})
