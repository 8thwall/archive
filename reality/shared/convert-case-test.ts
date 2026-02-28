// @ts-ignore
import {describe, it, assert} from '@nia/bzl/js/chai-js'

import {camelToSnakeCase} from './convert-case'

describe('camelToSnakeCase', () => {
  it('should convert camelCase keys to snake_case', () => {
    const input = {
      fooBar: 'baz',
      quxQuux: 'corgeGrault',
    }
    const expected = {
      foo_bar: 'baz',
      qux_quux: 'corgeGrault',
    }
    assert.deepEqual(camelToSnakeCase(input), expected)
  })
  it('should not convert keys in nested objects', () => {
    const input = {
      fooBar: 'baz',
      nested: {
        quxQuux: 'corgeGrault',
      },
    }
    const expected = {
      foo_bar: 'baz',
      nested: {
        quxQuux: 'corgeGrault',
      },
    }
    assert.deepEqual(camelToSnakeCase(input), expected)
  })
})
