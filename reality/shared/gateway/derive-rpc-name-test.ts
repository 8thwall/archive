// @attr(npm_rule = "@npm-lambda//:npm-lambda")

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import {describe, it, assert} from 'bzl/js/chai-js'

import {deriveRpcNameFromFileName} from './derive-rpc-name'

describe('deriveRpcNameFromFileName', () => {
  it('should replace hyphenated lowercase letters with uppercase', () => {
    assert.equal(
      deriveRpcNameFromFileName('test-file-name'),
      'testFileName'
    )
  })
  it('should return the same string if there are no hyphenated lowercase letters', () => {
    assert.equal(
      deriveRpcNameFromFileName('testFileName'),
      'testFileName'
    )
  })
  it('should remove leading non-alpha characters', () => {
    assert.equal(
      deriveRpcNameFromFileName('123-test-file-name'),
      'testFileName'
    )
  })
  it('should remove trailing hypens', () => {
    assert.equal(
      deriveRpcNameFromFileName('test-file-name----'),
      'testFileName'
    )
  })
  it('should remove trailing underscores', () => {
    assert.equal(
      deriveRpcNameFromFileName('test-file-name____'),
      'testFileName'
    )
  })
  it('should remove trailing hyphens and underscores', () => {
    assert.equal(
      deriveRpcNameFromFileName('test-file-name_-_-_'),
      'testFileName'
    )
  })
  it('should keep non-leading numbers', () => {
    assert.equal(
      deriveRpcNameFromFileName('test--__-file---123---name_-_-_'),
      'testFile123Name'
    )
  })
  it('should lower the first character', () => {
    assert.equal(
      deriveRpcNameFromFileName('Test-File_Name'),
      'testFileName'
    )
  })
})
