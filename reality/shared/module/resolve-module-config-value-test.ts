// @attr(npm_rule = "@npm-lambda//:npm-lambda")
// @attr(commonjs = 1)
import {describe, it, assert} from 'bzl/js/chai-js'

import {resolveModuleConfigValue} from './resolve-module-config-value'

describe('ResolveModuleConfigValue Test', () => {
  const getFileContents = (s: string) => Promise.resolve(`/assets/foo-${s}`)

  it('Return string value', async () => {
    const result = await resolveModuleConfigValue('testString', getFileContents)
    assert.equal(result, 'testString')
  })

  it('Return number value', async () => {
    const result = await resolveModuleConfigValue(22, getFileContents)
    assert.equal(result, 22)
  })

  it('Return bool value', async () => {
    assert.equal(await resolveModuleConfigValue(true, getFileContents), true)
    assert.equal(await resolveModuleConfigValue(false, getFileContents), false)
  })

  it('Return null on undefined value', async () => {
    assert.isNull(await resolveModuleConfigValue(undefined, getFileContents))
  })

  describe('Resource value', () => {
    it('Return asset value as string', async () => {
      assert.equal(
        await resolveModuleConfigValue({type: 'asset', asset: 'nyancat.gif'}, getFileContents),
        '/assets/foo-nyancat.gif'
      )
    })

    it('Return asset bundle without main path', async () => {
      const testFileContent = () => (JSON.stringify({
        'type': 'bundle',
        'path': '/assets/bundles/bundle-ueo96bofca/',
        'files': {
          'test4.txt': '/assets/test4-tmqk5ic7yg.txt',
          'test3.txt': '/assets/test3-eqt9qlo8v8.txt',
        },
      }))
      assert.equal(
        await resolveModuleConfigValue({type: 'asset', asset: 'nyancat.gif'}, testFileContent),
        '/assets/bundles/bundle-ueo96bofca/'
      )
    })

    it('Returns null for nullish asset values', async () => {
      const nullishAssets = [
        {type: 'asset', asset: null},
        {type: 'asset', asset: ''},
        {type: 'asset', asset: undefined},
      ] as const

      await Promise.all(nullishAssets.map(async (value) => {
        assert.isNull(await resolveModuleConfigValue(value, getFileContents))
      }))
    })

    it('Return asset bundle with main path', async () => {
      const testFileContent = () => (JSON.stringify({
        'type': 'bundle',
        'path': '/assets/bundles/bundle-e7j4a5uc55/',
        'main': 'samplescript.js',
        'files': {'samplescript.js': '/assets/samplescript-xi5mxf01jj.js'},
      }))
      assert.equal(
        await resolveModuleConfigValue({type: 'asset', asset: 'nyancat.gif'}, testFileContent),
        '/assets/bundles/bundle-e7j4a5uc55/samplescript.js'
      )
    })

    it('Supports a custom assetBase', async () => {
      const testFileContent = () => (JSON.stringify({
        'type': 'bundle',
        'path': '/assets/bundles/bundle-e7j4a5uc55/',
        'main': 'samplescript.js',
        'files': {'samplescript.js': '/assets/samplescript-xi5mxf01jj.js'},
      }))
      assert.equal(
        await resolveModuleConfigValue({type: 'asset', asset: 'nyancat.gif'}, testFileContent,
          'https://my-custom-asset-base.com'),
        'https://my-custom-asset-base.com/assets/bundles/bundle-e7j4a5uc55/samplescript.js'
      )
    })

    it('Return url value as string', async () => {
      assert.equal(
        await resolveModuleConfigValue({type: 'url', url: 'https://test.com/b'}, getFileContents),
        'https://test.com/b'
      )
    })
  })

  it('Return null on null', async () => {
    const res = await resolveModuleConfigValue(null, getFileContents)
    assert.isNull(res)
  })
})
