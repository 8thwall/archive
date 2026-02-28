// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @dep(//third_party/headless-gl)

/* eslint-disable max-classes-per-file */
import {describe, it, assert, beforeEach} from '@nia/bzl/js/chai-js'

import type {DOMString} from './strings'
import {Node} from './node'
import {Document} from './document'
import {CharacterData} from './character-data'

const doc = new Document()

class TestCharacterData extends CharacterData {
  constructor(
    data: DOMString,
    nodeName: DOMString = '#characterData',
    nodeType: number = Node.TEXT_NODE
  ) {
    super(doc, nodeName, nodeType, data)
  }

  protected _newFromString(data: string): TestCharacterData {
    return new TestCharacterData(data, this.nodeName, this.nodeType)
  }
}

class TestNode extends Node {
  constructor(
    nodeName: DOMString = 'name',
    nodeType: number = Node.ELEMENT_NODE
  ) {
    super(doc, nodeName, nodeType)
  }
}

describe('ChildNode tests', () => {
  let characterData: TestCharacterData
  let root: TestNode

  beforeEach(() => {
    root = new TestNode('root', Node.ELEMENT_NODE)
    root.appendChild(new TestNode('firstChild', Node.ELEMENT_NODE))
    characterData = new TestCharacterData('Some data')
    root.appendChild(characterData)
    root.appendChild(new TestNode('lastChild', Node.ELEMENT_NODE))
  })

  it('should have expected properties', () => {
    assert.isFunction(characterData.after)
    assert.isFunction(characterData.before)
    assert.isFunction(characterData.remove)
    assert.isFunction(characterData.replaceWith)
  })

  it('should have expected behavior for after and before', () => {
    characterData.after(' after', new TestCharacterData(' after2'))
    characterData.before('before ', new TestCharacterData('before2 '))

    assert.strictEqual(root.childNodes.length, 7)
    assert.strictEqual((root.childNodes[1] as CharacterData).data, 'before ')
    assert.strictEqual((root.childNodes[2] as CharacterData).data, 'before2 ')
    assert.strictEqual((root.childNodes[3] as CharacterData).data, 'Some data')
    assert.strictEqual((root.childNodes[4] as CharacterData).data, ' after')
    assert.strictEqual((root.childNodes[5] as CharacterData).data, ' after2')

    assert.strictEqual(characterData.previousSibling, root.childNodes[2])
    assert.strictEqual(characterData.nextSibling, root.childNodes[4])

    assert.strictEqual(characterData.previousElementSibling, root.childNodes[0])
    assert.strictEqual(characterData.nextElementSibling, root.childNodes[6])
  })

  it('should have expected behavior for remove', () => {
    characterData.remove()
    assert.strictEqual(root.childNodes.length, 2)
    assert.isNull(characterData.parentNode)
  })

  it('should have expected behavior for replaceWith', () => {
    characterData.replaceWith(characterData, 'additional')
    assert.strictEqual(root.childNodes.length, 4)
    assert.strictEqual((root.childNodes[1] as CharacterData).data, 'Some data')
    assert.strictEqual((root.childNodes[2] as CharacterData).data, 'additional')

    characterData.replaceWith('replaced', new TestCharacterData('replaced2'))
    assert.strictEqual(root.childNodes.length, 5)
    assert.strictEqual((root.childNodes[1] as CharacterData).data, 'replaced')
    assert.strictEqual((root.childNodes[2] as CharacterData).data, 'replaced2')
    assert.strictEqual((root.childNodes[3] as CharacterData).data, 'additional')
    assert.isNull(characterData.parentNode)
  })
})
