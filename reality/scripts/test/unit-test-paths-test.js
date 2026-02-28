/* globals describe, it */
const chai = require('chai')

const {getProjectRoot, isUnitTest, fileIsTestableBy} = require('../unit-test-paths')

chai.should()
const {assert} = chai

describe('getProjectRoot', () => {
  it('retrieves the correct enclosing folder', () => {
    assert.equal(getProjectRoot('test/test-test.js'), '')
    assert.equal(getProjectRoot('reality/cloud/xrhome/test/asset-pointer-test.js'),
      'reality/cloud/xrhome/')
  })
})

describe('isUnitTest', () => {
  it('matches the correct test files', () => {
    assert.isTrue(isUnitTest('test/test-test.ts'))
    assert.isTrue(isUnitTest('test/test-test.js'))
    assert.isTrue(isUnitTest('folder/test/test-test.ts'))
    assert.isTrue(isUnitTest('folder/test/test-test.js'))
  })

  it('does not match incorrect test files', () => {
    assert.isFalse(isUnitTest('test/test-test,ts'))
    assert.isFalse(isUnitTest('test/test-test,js'))
    assert.isFalse(isUnitTest('test/test-testts'))
    assert.isFalse(isUnitTest('test/test-testjs'))
    assert.isFalse(isUnitTest('/test-test.js'))
    assert.isFalse(isUnitTest('folder/test/test.js'))
    assert.isFalse(isUnitTest('test-test/test.js'))
    assert.isFalse(isUnitTest('folder/test/test-test.txt'))
    assert.isFalse(isUnitTest('folder/tests/test-test.js'))
    assert.isFalse(isUnitTest('folder/test/test-test1.js'))
    assert.isFalse(isUnitTest('folder/test1/test-test1.js'))
  })
})

describe('fileIsTestableBy', () => {
  it('matches corresponding unit test filename', () => {
    assert.isTrue(fileIsTestableBy('test/test-test.js', 'test/test-test.js'))
    assert.isTrue(fileIsTestableBy('folder/file.js', 'test/file-test.js'))
    assert.isTrue(fileIsTestableBy('file.js', 'test/file-test.js'))
    assert.isTrue(fileIsTestableBy('folder/file.js', 'folder/test/file-test.js'))
    assert.isTrue(fileIsTestableBy('reality/cloud/xrhome/src/shared/asset-pointer.js',
      'reality/cloud/xrhome/test/asset-pointer-test.js'))
    assert.isTrue(fileIsTestableBy('test-test.js', 'test/test-test-test.js'))
  })

  it('does not match with incorrect corresponding unit test filenames', () => {
    assert.isFalse(fileIsTestableBy('test/test1-test.js', 'test/test-test.js'))
    assert.isFalse(fileIsTestableBy('file.js', 'folder/test/file-test.js'))
    assert.isFalse(fileIsTestableBy('file.js', 'test/other-test.js'))
    assert.isFalse(fileIsTestableBy('folder1/file.js', 'folder2/test/file-test.js'))
    assert.isFalse(fileIsTestableBy('reality/asset-pointer.js',
      'reality/cloud/xrhome/test/asset-pointer-test.js'))
  })

  it('allows both typescript and javascript files', () => {
    assert.isTrue(fileIsTestableBy('test-test.ts', 'test/test-test-test.ts'))
    assert.isTrue(fileIsTestableBy('test-test.js', 'test/test-test-test.js'))
    assert.isTrue(fileIsTestableBy('test-test.js', 'test/test-test-test.ts'))
    assert.isTrue(fileIsTestableBy('test-test.ts', 'test/test-test-test.js'))
  })

  it('allows paths to include the source file as a prefix', () => {
    assert.isTrue(fileIsTestableBy('my-file.ts', 'test/my-file-basic-test.ts'))
    assert.isTrue(fileIsTestableBy('my-file.ts', 'test/my-file-advanced-test.js'))

    // Prefix must be '-' separated.
    assert.isFalse(fileIsTestableBy('smart.ts', 'test/smartphone-test.js'))
  })
})
