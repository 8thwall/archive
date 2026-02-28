// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

/* eslint-disable max-classes-per-file */
import {describe, it, assert, beforeEach} from '@nia/bzl/js/chai-js'

import type {DOMString} from './strings'
import {Node} from './node'
import {Text} from './text'
import type {Document} from './document'

class TestNode extends Node {
  constructor(
    nodeName: DOMString = 'name',
    nodeType: number = Node.ELEMENT_NODE
  ) {
    super(null as unknown as Document, nodeName, nodeType)
  }
}

describe('Text tests', () => {
  let text: Text
  let root: TestNode

  beforeEach(() => {
    root = new TestNode('root', Node.ELEMENT_NODE)
    text = new Text('main text')
    root.appendChild(text)
  })

  it('should have expected properties', () => {
    assert.isString(text.wholeText)
    assert.isFunction(text.splitText)
    assert.isFunction(text.after)
    assert.isFunction(text.before)
    assert.isFunction(text.remove)
    assert.isFunction(text.replaceWith)
  })

  it('should have expected propery values', () => {
    assert.strictEqual(text.data, 'main text')
    assert.strictEqual(text.wholeText, 'main text')
    assert.strictEqual((new Text('foo')).wholeText, 'foo')
  })

  it('should find all text for wholeText', () => {
    const text2 = new Text(' after')
    root.appendChild(text2)
    assert.strictEqual(text.wholeText, 'main text after')
    root.insertBefore(new TestNode('skip', Node.DOCUMENT_FRAGMENT_NODE), text)
    root.insertBefore(new TestNode('skip', Node.DOCUMENT_FRAGMENT_NODE), text2)
    root.insertBefore(new Text('before '), root.firstChild)
    root.appendChild(new Text(' after2'))
    root.appendChild(new TestNode('bad', Node.ELEMENT_NODE))
    root.appendChild(new Text(' blocked'))
    assert.strictEqual(text.wholeText, 'before main text after after2')
  })

  it('should support splitText', () => {
    const newText = text.splitText(5)
    assert.strictEqual(text.data, 'main ')
    assert.strictEqual(newText.data, 'text')
    assert.strictEqual(newText.parentNode, root)
    assert.strictEqual(newText.previousSibling, text)
    assert.isNull(newText.nextSibling)
    assert.strictEqual(text.nextSibling, newText)
    assert.strictEqual(text.parentNode, root)
  })
})
