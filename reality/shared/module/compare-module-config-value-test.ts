// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import {moduleConfigValueEqual} from './compare-module-config-value'

describe('moduleConfigValueEqual', () => {
  describe('handles null and undefined', () => {
    it('should know null === null', () => {
      assert.isTrue(moduleConfigValueEqual(null, null))
    })
    it('should return false when one side is null or undefined', () => {
      assert.isFalse(moduleConfigValueEqual(null, 'test'))
      assert.isFalse(moduleConfigValueEqual(34, null))
      assert.isFalse(moduleConfigValueEqual(undefined, null))
      assert.isFalse(moduleConfigValueEqual(34, undefined))
      assert.isFalse(moduleConfigValueEqual({type: 'asset', asset: 'test'}, undefined))
      assert.isFalse(moduleConfigValueEqual(undefined, {type: 'asset', asset: 'test'}))
    })
    it('compares primitives', () => {
      assert.isTrue(moduleConfigValueEqual(0, 0))
      assert.isTrue(moduleConfigValueEqual(123, 123))
      assert.isFalse(moduleConfigValueEqual(1, 2))

      assert.isTrue(moduleConfigValueEqual(true, true))
      assert.isTrue(moduleConfigValueEqual(false, false))
      assert.isFalse(moduleConfigValueEqual(true, false))

      assert.isTrue(moduleConfigValueEqual('asdf', 'asdf'))
      assert.isFalse(moduleConfigValueEqual('asdf', 'wer'))
    })
    it('compares objects', () => {
      const url1 = {type: 'url', url: 'thing1'} as const
      const url2 = {type: 'url', url: 'thing2'} as const
      const asset1 = {type: 'asset', asset: 'thing1'} as const
      const asset2 = {type: 'asset', asset: 'thing2'} as const

      assert.isTrue(moduleConfigValueEqual(url1, url1))
      assert.isTrue(moduleConfigValueEqual(asset1, asset1))

      assert.isFalse(moduleConfigValueEqual(url1, url2))
      assert.isFalse(moduleConfigValueEqual(asset1, asset2))

      assert.isFalse(moduleConfigValueEqual(url1, asset1))
    })
  })
})
