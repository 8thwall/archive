// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import {parseRequestUri, makeRequestUri} from './module-file-request'

describe('parseRequestUri', () => {
  it('Returns the expected format for branch', () => {
    assert.deepEqual(
      parseRequestUri('/modules/v1/my-test-id/branch/my-branch/bundle.js'),
      {
        moduleId: 'my-test-id',
        target: {type: 'branch', branch: 'my-branch'},
        file: 'bundle.js',
      }
    )
  })
  it('Returns the expected format for commit', () => {
    assert.deepEqual(
      parseRequestUri('/modules/v1/my-test-id/commit/my-branch/my-commit/bundle.js'),
      {
        moduleId: 'my-test-id',
        target: {type: 'commit', branch: 'my-branch', commit: 'my-commit'},
        file: 'bundle.js',
      }
    )
  })
  it('Returns the expected format for channel', () => {
    assert.deepEqual(
      parseRequestUri('/modules/v1/my-test-id/channel/my-channel/bundle.js'),
      {
        moduleId: 'my-test-id',
        target: {type: 'channel', channel: 'my-channel'},
        file: 'bundle.js',
      }
    )
  })
  it('Returns the expected format for channel', () => {
    assert.deepEqual(
      parseRequestUri('/modules/v1/my-test-id/development/handle/my-handle/bundle.js'),
      {
        moduleId: 'my-test-id',
        target: {type: 'development', handle: 'my-handle'},
        file: 'bundle.js',
      }
    )
  })
  it('Can handle nested files', () => {
    assert.deepEqual(
      parseRequestUri('/modules/v1/my-test-id/branch/my-branch/path/to/file.js'),
      {
        moduleId: 'my-test-id',
        target: {type: 'branch', branch: 'my-branch'},
        file: 'path/to/file.js',
      }
    )
  })
  it('Can parse slug from query', () => {
    assert.deepEqual(
      parseRequestUri('/modules/v1/my-test-id/branch/my-branch/path/to/file.js', '?s=my-slug'),
      {
        moduleId: 'my-test-id',
        target: {type: 'branch', branch: 'my-branch'},
        file: 'path/to/file.js',
        slug: 'my-slug',
      }
    )
  })
  it('Rejects unknown paths', () => {
    const assertUnknown = (path: string, reason: string) => {
      assert.deepEqual(parseRequestUri(path), null, reason)
    }
    assertUnknown('/modules/v2/my-module/branch/x/bundle.js', 'v2')
    assertUnknown('modules/v1/my-module/branch/x/bundle.js', 'no slash')
    assertUnknown('/module/v1/my-module/branch/x/bundle.js', 'singular')
    assertUnknown('/modules/v1/my-module/branch/x', 'missing filename')
    assertUnknown('/modules/v1/my-module/branch/x/', 'empty filename')
    assertUnknown('/modules/v1/my-module/branch/x/path//file.js', 'double slash')
    assertUnknown('/modules/v1/my-module/branch//path//file.js', 'empty branch')
    assertUnknown('/modules/v1/my-module/commit/my-branch//file.js', 'empty commit')
    assertUnknown('/modules/v1/my-module/commit//commit/file.js', 'empty branch in commit')
    assertUnknown('/modules/v1/my-module/commit/x/file.js', 'missing field')
  })
})

describe('makeRequestUri', () => {
  it('Returns the expected path for branch', () => {
    assert.deepEqual(
      makeRequestUri({
        moduleId: 'my-test-id',
        target: {type: 'branch', branch: 'my-branch'},
        file: 'bundle.js',
      }),
      '/modules/v1/my-test-id/branch/my-branch/bundle.js'
    )
  })
  it('Returns the expected path for commit', () => {
    assert.deepEqual(
      makeRequestUri({
        moduleId: 'my-test-id',
        target: {type: 'commit', branch: 'my-branch', commit: 'my-commit'},
        file: 'bundle.js',
      }),
      '/modules/v1/my-test-id/commit/my-branch/my-commit/bundle.js'
    )
  })
  it('Returns the expected path for channel', () => {
    assert.deepEqual(
      makeRequestUri({
        moduleId: 'my-test-id',
        target: {type: 'channel', channel: 'my-channel'},
        file: 'bundle.js',
      }),
      '/modules/v1/my-test-id/channel/my-channel/bundle.js'
    )
  })
  it('Can handle nested files', () => {
    assert.deepEqual(
      makeRequestUri({
        moduleId: 'my-test-id',
        target: {type: 'branch', branch: 'my-branch'},
        file: 'path/to/file.js',
      }),
      '/modules/v1/my-test-id/branch/my-branch/path/to/file.js'
    )
  })
  it('Includes slug parameter', () => {
    assert.deepEqual(
      makeRequestUri({
        moduleId: 'my-test-id',
        target: {type: 'branch', branch: 'my-branch'},
        file: 'file.js',
        slug: 'my-slug',
      }),
      '/modules/v1/my-test-id/branch/my-branch/file.js?s=my-slug'
    )
  })
})
