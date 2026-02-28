// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @dep(//third_party/headless-gl)

/* eslint-disable  max-classes-per-file */
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

describe('CharacterData tests', () => {
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
    assert.isString(characterData.data)
    assert.isNumber(characterData.length)
    assert.instanceOf(characterData.nextElementSibling, Node)
    assert.instanceOf(characterData.previousElementSibling, Node)
    assert.isFunction(characterData.appendData)
    assert.isFunction(characterData.deleteData)
    assert.isFunction(characterData.insertData)
    assert.isFunction(characterData.replaceData)
    assert.isFunction(characterData.substringData)
  })

  it('should have expected propery values', () => {
    assert.strictEqual(characterData.data, 'Some data')
    assert.strictEqual(characterData.nodeValue, 'Some data')
    assert.strictEqual(characterData.length, 9)
    assert.strictEqual(characterData.nextElementSibling, root.lastChild)
    assert.strictEqual(characterData.previousElementSibling, root.firstChild)

    characterData.data = 'New data'
    assert.strictEqual(characterData.data, 'New data')
    assert.strictEqual(characterData.nodeValue, 'New data')

    characterData.nodeValue = 'Newer data'
    assert.strictEqual(characterData.data, 'Newer data')
    assert.strictEqual(characterData.nodeValue, 'Newer data')
  })

  it('should have correct value if there are no element siblings', () => {
    characterData.parentNode?.removeChild(characterData.previousElementSibling!)
    assert.isNull(characterData.previousElementSibling)
    characterData.parentNode?.removeChild(characterData.nextElementSibling!)
    assert.isNull(characterData.nextElementSibling)
  })

  it('should have expected behavior for data manipulation', () => {
    characterData.appendData(' appended')
    assert.strictEqual(characterData.data, 'Some data appended')

    characterData.deleteData(0, 5)
    assert.strictEqual(characterData.data, 'data appended')

    characterData.insertData(5, 'was ')
    assert.strictEqual(characterData.data, 'data was appended')

    characterData.replaceData(1, 3, 'elightful')
    assert.strictEqual(characterData.data, 'delightful was appended')

    assert.strictEqual(characterData.substringData(0, 4), 'deli')
  })
})
