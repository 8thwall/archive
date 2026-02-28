// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import {getStaticPath, getUriForFile} from './module-static-paths'

describe('getStaticPath', () => {
  it('Returns the expected path on S3 for a valid request URI', () => {
    assert.strictEqual(
      getStaticPath('/modules/v1/static/module-id/remaining/part/of/path.js'),
      '/code/dist/module/module-id/remaining/part/of/path.js'
    )
  })
  it('Returns null for non-static prefixes', () => {
    assert.strictEqual(
      getStaticPath('/modules/v1/module-id/channel/release/module.js'),
      null
    )
  })
})

describe('getUriForFile', () => {
  it('Returns the correct URI for a given file', () => {
    assert.strictEqual(
      getUriForFile('code/dist/module/module-id/build/path', 'example/file.js'),
      '/modules/v1/static/module-id/build/path/example/file.js'
    )
  })
  it('Returns null for unexpected build prefixes', () => {
    assert.strictEqual(
      getUriForFile('code/not-dist/module-id/build/path', 'example/file.js'),
      null
    )
  })
})
