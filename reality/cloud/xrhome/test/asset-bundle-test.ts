import {describe, it} from 'mocha'
import {assert} from 'chai'
import sinon from 'sinon'

import {
  assetBundleParamsEqual, assetBundleParamsToFileList, upsertAssetBundle,
} from '../src/shared/asset-bundle'

describe('assetBundleParamsEqual', () => {
  it('returns true for equal bundle params', () => {
    assert.isTrue(assetBundleParamsEqual({files: {}}, {files: {}}))
    const withExtraProperty = {files: {}, extraProperty: 1}
    assert.isTrue(assetBundleParamsEqual({files: {}}, withExtraProperty))

    assert.isTrue(assetBundleParamsEqual({files: {a: 'b'}}, {files: {a: 'b'}}))
    assert.isTrue(assetBundleParamsEqual(
      {files: {a: 'b', c: 'd'}},
      {files: {c: 'd', a: 'b'}}
    ))
  })

  it('returns false for differing file contents', () => {
    assert.isFalse(assetBundleParamsEqual({files: {a: '1'}}, {files: {a: '2'}}))
    assert.isFalse(assetBundleParamsEqual({files: {a: '1'}}, {files: {b: '2'}}))
    assert.isFalse(assetBundleParamsEqual({files: {a: '1'}}, {files: {a: '1', b: '2'}}))
  })
})

const crash = (): never => {
  const error = new Error('Crashing from asset-bundle-test')
  // eslint-disable-next-line no-console
  console.error(error)
  process.exit(1)
}

describe('upsertAssetBundle', () => {
  it('is a noop if the bundle is empty', async () => {
    const res = await upsertAssetBundle({
      base: {files: {a: '1', b: '2'}},
      paths: [],
      actions: {
        getRemoteAssetHash: crash,
        getFileHash: crash,
        upload: crash,
      },
    })

    assert.deepStrictEqual(res, {
      files: {},
    })
  })

  it('can add paths', async () => {
    const uploadSpy = sinon.spy(async (path: string) => {
      if (path !== 'd') {
        crash()
      }
      return '4'
    })

    const res = await upsertAssetBundle({
      base: {files: {a: '1', b: '2', c: '3'}},
      paths: ['d'],
      actions: {
        getRemoteAssetHash: crash,
        getFileHash: crash,
        upload: uploadSpy,
      },
    })

    assert.isTrue(uploadSpy.calledOnceWithExactly('d'))

    assert.deepStrictEqual(res, {
      files: {
        d: '4',
      },
    })
  })

  it('can replace paths', async () => {
    const getFileHashSpy = sinon.spy(async (path: string) => {
      if (path !== 'c') {
        crash()
      }
      return 'newHash'
    })

    const getRemoteAssetHashSpy = sinon.spy(async (path: string) => {
      if (path !== '3') {
        crash()
      }
      return 'oldHash'
    })

    const uploadSpy = sinon.spy(async (path: string) => {
      if (path !== 'c') {
        crash()
      }
      return '4'
    })

    const res = await upsertAssetBundle({
      base: {files: {a: '1', b: '2', c: '3'}},
      paths: ['c'],
      actions: {
        getRemoteAssetHash: getRemoteAssetHashSpy,
        getFileHash: getFileHashSpy,
        upload: uploadSpy,
      },
    })

    assert.isTrue(getFileHashSpy.calledOnceWithExactly('c'))
    assert.isTrue(getRemoteAssetHashSpy.calledOnceWithExactly('3'))

    assert.deepStrictEqual(res, {
      files: {
        c: '4',
      },
    })
  })

  it('does not modify if hashes match', async () => {
    const getFileHashSpy = sinon.spy(async (path: string) => {
      if (path !== 'c') {
        crash()
      }
      return 'hash3'
    })

    const getRemoteAssetHashSpy = sinon.spy(async (path: string) => {
      if (path !== '3') {
        crash()
      }
      return 'hash3'
    })

    const res = await upsertAssetBundle({
      base: {files: {a: '1', b: '2', c: '3'}},
      paths: ['c'],
      actions: {
        getRemoteAssetHash: getRemoteAssetHashSpy,
        getFileHash: getFileHashSpy,
        upload: crash,
      },
    })

    assert.isTrue(getFileHashSpy.calledOnceWithExactly('c'))
    assert.isTrue(getRemoteAssetHashSpy.calledOnceWithExactly('3'))

    assert.deepStrictEqual(res, {
      files: {
        c: '3',
      },
    })
  })
})

describe('assetBundleParamsToFileList', () => {
  it('converts asset bundle params to file list', () => {
    const input = {
      files: {
        a: '1',
        b: '2',
        c: '3',
      },
    }

    const expected = [
      {filePath: 'a', assetPath: '1'},
      {filePath: 'b', assetPath: '2'},
      {filePath: 'c', assetPath: '3'},
    ]

    assert.deepStrictEqual(assetBundleParamsToFileList(input), expected)
  })
})
