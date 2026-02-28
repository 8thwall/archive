import {should, assert} from 'chai'

import {getDraggedFilePath, getRenamedFilePath} from '../src/client/common/editor-files'

import {
  isFolderPath, isMainPath, isTextPath, isAssetPath, validatePath, validateFile,
} from '../src/client/common/editor-files'

should()

describe('isFolderPath', () => {
  it('Should be true for folders', () => {
    assert.isTrue(isFolderPath('folder'))
    assert.isTrue(isFolderPath('path/to/folder'))
    assert.isTrue(isFolderPath('/absolute-path/to/folder'))
  })

  it('Should be false for non-folders', () => {
    assert.isFalse(isFolderPath(''))
    assert.isFalse(isFolderPath('LICENSE'))
    assert.isFalse(isFolderPath('file.txt'))
    assert.isFalse(isFolderPath('path/to/file.txt'))
    assert.isFalse(isFolderPath('/absolute-path/to/file.txt'))
  })
})

describe('isMainPath/isAssetPath/isTextPath', () => {
  const mains = ['head.html', 'body.html', 'app.js']
  const assets = ['assets/folder', 'assets', 'assets/file.glb']
  const texts = ['LICENSE', 'file.js', 'frag.txt', 'folder/file.css', 'random/folder']

  it('Main files should only be main paths', () => {
    mains.forEach((filename) => {
      assert.isTrue(isMainPath(filename))
      assert.isFalse(isAssetPath(filename))
      assert.isFalse(isTextPath(filename, isMainPath))
    })
  })

  it('Asset files should only be assets paths', () => {
    assets.forEach((filename) => {
      assert.isFalse(isMainPath(filename))
      assert.isTrue(isAssetPath(filename))
      assert.isFalse(isTextPath(filename, isMainPath))
    })
  })

  it('Text files should only be text paths', () => {
    texts.forEach((filename) => {
      assert.isFalse(isMainPath(filename))
      assert.isFalse(isAssetPath(filename))
      assert.isTrue(isTextPath(filename, isMainPath))
    })
  })
})

describe('validatePath', () => {
  it('Should be true for valid paths', () => {
    assert.isTrue(validatePath('folder'))
    assert.isTrue(validatePath('folder-with-hyphen'))
    assert.isTrue(validatePath('folder_with_underscores/folder-with-hyphen'))
    assert.isTrue(validatePath('abcABC1234567890'))
  })

  it('Should be false for invalid paths', () => {
    assert.isFalse(validatePath(''))
    assert.isFalse(validatePath('f*f'))
    assert.isFalse(validatePath('f&f'))
    assert.isFalse(validatePath('f(f'))
    assert.isFalse(validatePath('f)f'))
    assert.isFalse(validatePath('f//f'))
  })
})

describe('validateFile', () => {
  it('Should be true for valid filenames', () => {
    assert.isTrue(validateFile('file.txt'))
    assert.isTrue(validateFile('LICENSE'))
    assert.isTrue(validateFile('file-with-hyphen.txt'))
    assert.isTrue(validateFile('folder_with_underscores/file-with-hyphen.css'))
    assert.isTrue(validateFile('abcABC1234567890.md'))
    assert.isTrue(validateFile('assets/file-with-hyphen.glb'))
    assert.isTrue(validateFile('assets/folder123/file-with-hyphen.glb'))
  })

  it('Should be false for invalid filenames', () => {
    assert.isFalse(validateFile(''))
    assert.isFalse(validateFile('file-with-double-period..txt'))
    assert.isFalse(validateFile('file-with-unknown-extension.blah'))
    assert.isFalse(validateFile('assets/file-not-asset.txt'))
    assert.isFalse(validateFile('asset-not-in-asset.glb'))
    assert.isFalse(validateFile('noextension'))
    assert.isFalse(validateFile('subfolder/special/LICENSE'))
  })

  it('Should be false for missing required asset content', () => {
    assert.isFalse(validateFile('assets/file.glb', {requireAssetContent: true, content: null}))
  })

  it('Should allow a move/rename preserving an unknown extension', () => {
    assert.isTrue(validateFile('assets/file/file.foo', {previousExtension: 'foo'}))
  })
})

describe('getDraggedFilePath', () => {
  it('Can move a file into a folder', () => {
    assert.strictEqual(getDraggedFilePath('example.txt', 'folder'), 'folder/example.txt')
  })
  it('Can move a file between folders', () => {
    assert.strictEqual(getDraggedFilePath('in-folder/example.txt', 'folder'), 'folder/example.txt')
  })
  it('Can move a file out a folder', () => {
    assert.strictEqual(getDraggedFilePath('in-folder/example.txt', ''), 'example.txt')
  })
  it('Keeps asset files within the assets folder when dragging to the top level', () => {
    assert.strictEqual(getDraggedFilePath('assets/folder/example.jpg', ''), 'assets/example.jpg')
  })
  it('Can move to the top level', () => {
    assert.strictEqual(getDraggedFilePath('in-folder/example.txt'), 'example.txt')
  })
  it('Can move folders', () => {
    assert.strictEqual(getDraggedFilePath('in-folder/test', 'other/folder'), 'other/folder/test')
  })
  it('Interprets false folderPath as top level', () => {
    assert.strictEqual(getDraggedFilePath('in-folder/example.txt', null), 'example.txt')
  })
})

describe('getRenamedFilePath', () => {
  it('Can rename a file', () => {
    assert.strictEqual(getRenamedFilePath('after.txt', 'before.txt'), 'after.txt')
  })
  it('Should preserve the enclosing folder', () => {
    assert.strictEqual(getRenamedFilePath('after.txt', 'folder/before.txt'), 'folder/after.txt')
  })
  // NOTE(christoph): This is kind of a secret "pro" behavior but it's the current state.
  it('Handle a subfolder in the new name', () => {
    assert.strictEqual(
      getRenamedFilePath('extra/after.txt', 'folder/before.txt'),
      'folder/extra/after.txt'
    )
  })
})
