// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import {describe, it, assert, beforeEach} from '@nia/bzl/js/chai-js'

import type {DOMString} from './strings'
import {Node} from './node'
import {Text} from './text'
import type {Document} from './document'

class TestNode extends Node {
  constructor(
    nodeName: DOMString = 'name',
    nodeType: number = Node.ELEMENT_NODE,
    ownerDocument: Document | null = null
  ) {
    super(ownerDocument as unknown as Document, nodeName, nodeType)
  }
}

describe('Node tests', () => {
  let node: TestNode

  beforeEach(() => {
    node = new TestNode('mainElement', Node.ELEMENT_NODE)
  })

  it('should have expected properties', () => {
    // TODO(mc): Add support for other expected Node properties
    // expect(node).to.have.property('baseURI').that.is.a('string')
    assert.isObject(node.childNodes)
    assert.isDefined(node.firstChild)
    assert.isDefined(node.lastChild)
    assert.isDefined(node.nextSibling)
    assert.isDefined(node.previousSibling)
    assert.isDefined(node.parentNode)
    // expect(node).to.have.property('isConnected').that.is.a('boolean')
    assert.isString(node.nodeName)
    assert.isNumber(node.nodeType)
    assert.isNull(node.nodeValue)
    assert.isNull(node.ownerDocument)
    assert.isDefined(node.parentElement)
    assert.isString(node.textContent)
    assert.isFunction(node.appendChild)
    assert.isFunction(node.cloneNode)
    // expect(node).to.have.property('compareDocumentPosition').that.is.a('function')
    // expect(node).to.have.property('contains').that.is.a('function')
    assert.isFunction(node.getRootNode)
    assert.isFunction(node.hasChildNodes)
    assert.isFunction(node.insertBefore)
    // expect(node).to.have.property('isDefaultNamespace').that.is.a('function')
    // expect(node).to.have.property('isEqualNode').that.is.a('function')
    // expect(node).to.have.property('isSameNode').that.is.a('function')
    // expect(node).to.have.property('lookupPrefix').that.is.a('function')
    // expect(node).to.have.property('lookupNamespaceURI').that.is.a('function')
    assert.isFunction(node.normalize)
    assert.isFunction(node.removeChild)
    assert.isFunction(node.replaceChild)
  })

  it('should have correct values', () => {
    assert.strictEqual(node.nodeName, 'mainElement')
    assert.strictEqual(node.nodeType, Node.ELEMENT_NODE)
    assert.isNull(node.nodeValue)
  })

  it('should support appendChild', () => {
    // Get a reference to the live NodeList.
    const {childNodes} = node
    assert.strictEqual(childNodes.length, 0)

    assert.isNull(node.firstChild)
    assert.isNull(node.lastChild)

    const child0 = new TestNode('childElement0', Node.ELEMENT_NODE)
    const child1 = new TestNode('childElement1', Node.ELEMENT_NODE)
    const child2 = new TestNode('childElement3', Node.ELEMENT_NODE)

    node.appendChild(child0)
    assert.strictEqual(childNodes.length, 1)
    node.appendChild(child1)
    assert.strictEqual(childNodes.length, 2)
    node.appendChild(child2)
    assert.strictEqual(childNodes.length, 3)

    assert.strictEqual(childNodes[0], child0)
    assert.strictEqual(childNodes[1], child1)
    assert.strictEqual(childNodes[2], child2)

    assert.isNull(child0.previousSibling)
    assert.strictEqual(child1.previousSibling, child0)
    assert.strictEqual(child2.previousSibling, child1)

    assert.strictEqual(child0.nextSibling, child1)
    assert.strictEqual(child1.nextSibling, child2)
    assert.isNull(child2.nextSibling)

    assert.deepEqual([...childNodes], [child0, child1, child2])

    assert.strictEqual(node.firstChild, child0)
    assert.strictEqual(node.lastChild, child2)

    assert.strictEqual(child0.parentNode, node)
    assert.strictEqual(child1.parentNode, node)
    assert.strictEqual(child2.parentNode, node)

    assert.strictEqual(child0.parentElement, node)
    assert.strictEqual(child1.parentElement, node)
    assert.strictEqual(child2.parentElement, node)

    // Existing nodes get moved.
    node.appendChild(child0)
    assert.strictEqual(childNodes.length, 3)
    assert.deepEqual([...childNodes], [child1, child2, child0])

    assert.isNull(child1.previousSibling)
    assert.strictEqual(child2.previousSibling, child1)
    assert.strictEqual(child0.previousSibling, child2)

    assert.strictEqual(child1.nextSibling, child2)
    assert.strictEqual(child2.nextSibling, child0)
    assert.isNull(child0.nextSibling)
  })

  it('should support textContent', () => {
    assert.strictEqual(node.textContent, '')
    const txt = new Text('Hello')
    node.appendChild(txt)
    assert.strictEqual(node.textContent, 'Hello')
    node.appendChild(new Text(' there!'))
    assert.strictEqual(node.textContent, 'Hello there!')
    txt.textContent = 'Hi'
    assert.strictEqual(node.textContent, 'Hi there!')

    const textNode = new Text('Goodbye')
    assert.strictEqual(textNode.textContent, 'Goodbye')
    textNode.textContent = 'Bye'
    assert.strictEqual(textNode.textContent, 'Bye')
  })

  it('should support parentElement', () => {
    // Test that a node with a non-element parent (DocumentFragement) returns null.
    const fragment = new TestNode('fragment', Node.DOCUMENT_FRAGMENT_NODE)
    const child = new TestNode('child', Node.ELEMENT_NODE)
    fragment.appendChild(child)
    assert.isNull(child.parentElement)
    assert.strictEqual(child.parentNode, fragment)

    // Repeat the test with a node that has an element parent.
    const parent = new TestNode('parent', Node.ELEMENT_NODE)
    parent.appendChild(child)
    assert.strictEqual(child.parentElement, parent)
    assert.strictEqual(child.parentNode, parent)
  })

  it('should support normalize', () => {
    const child0 = new TestNode('childElement0', Node.ELEMENT_NODE)
    const child1 = new TestNode('childElement1', Node.ELEMENT_NODE)
    const child2 = new TestNode('childElement3', Node.ELEMENT_NODE)

    node.appendChild(child0)
    node.appendChild(child1)
    node.appendChild(child2)

    const text0 = new Text('Hello')
    const text1 = new Text(' there! ')
    const text2 = new Text('')
    const text3 = new Text('Goodbye')
    child0.appendChild(text0)
    child0.appendChild(text1)
    child1.appendChild(text2)
    child2.appendChild(text3)

    assert.strictEqual(child0.textContent, 'Hello there! ')
    assert.strictEqual(child1.textContent, '')
    assert.strictEqual(child2.textContent, 'Goodbye')

    assert.strictEqual(node.textContent, 'Hello there! Goodbye')

    node.normalize()

    assert.strictEqual(child0.textContent, 'Hello there! ')
    assert.strictEqual(child0.childNodes.length, 1)
    assert.strictEqual(child0.childNodes[0], text0)

    assert.strictEqual(child1.textContent, '')
    assert.strictEqual(child1.childNodes.length, 0)

    assert.strictEqual(child2.textContent, 'Goodbye')
    assert.strictEqual(child2.childNodes.length, 1)
    assert.strictEqual(child2.childNodes[0], text3)

    assert.strictEqual(text0.parentNode, child0)
    assert.isNull(text1.parentNode)
    assert.isNull(text2.parentNode)
    assert.strictEqual(text3.parentNode, child2)

    assert.strictEqual(node.textContent, 'Hello there! Goodbye')
  })

  it('should support removeChild', () => {
    const {childNodes} = node
    assert.strictEqual(childNodes.length, 0)

    const child0 = new TestNode('childElement0', Node.ELEMENT_NODE)
    const child1 = new TestNode('childElement1', Node.ELEMENT_NODE)
    const child2 = new TestNode('childElement3', Node.ELEMENT_NODE)

    node.appendChild(child0)
    node.appendChild(child1)
    node.appendChild(child2)

    assert.strictEqual(childNodes.length, 3)
    assert.deepEqual([...childNodes], [child0, child1, child2])

    assert.strictEqual(node.removeChild(child1), child1)
    assert.strictEqual(childNodes.length, 2)
    assert.deepEqual([...childNodes], [child0, child2])

    assert.strictEqual(child0.nextSibling, child2)
    assert.strictEqual(child2.previousSibling, child0)
  })

  it('should support replaceChild', () => {
    const {childNodes} = node
    assert.strictEqual(childNodes.length, 0)

    const child0 = new TestNode('childElement0', Node.ELEMENT_NODE)
    const child1 = new TestNode('childElement1', Node.ELEMENT_NODE)
    const child2 = new TestNode('childElement3', Node.ELEMENT_NODE)
    const child3 = new TestNode('childElement4', Node.ELEMENT_NODE)

    node.appendChild(child0)
    node.appendChild(child1)
    node.appendChild(child2)

    assert.strictEqual(childNodes.length, 3)
    assert.deepEqual([...childNodes], [child0, child1, child2])

    assert.strictEqual(node.replaceChild(child3, child1), child1)
    assert.strictEqual(childNodes.length, 3)
    assert.deepEqual([...childNodes], [child0, child3, child2])

    assert.strictEqual(child0.nextSibling, child3)
    assert.strictEqual(child3.previousSibling, child0)
    assert.strictEqual(child3.nextSibling, child2)
    assert.strictEqual(child2.previousSibling, child3)
  })

  it('should support insertBefore', () => {
    const {childNodes} = node
    assert.strictEqual(childNodes.length, 0)

    const child0 = new TestNode('childElement0', Node.ELEMENT_NODE)
    const child1 = new TestNode('childElement1', Node.ELEMENT_NODE)
    const child2 = new TestNode('childElement3', Node.ELEMENT_NODE)
    const child3 = new TestNode('childElement4', Node.ELEMENT_NODE)

    node.appendChild(child0)
    node.appendChild(child1)
    node.appendChild(child2)

    assert.strictEqual(childNodes.length, 3)
    assert.deepEqual([...childNodes], [child0, child1, child2])

    assert.strictEqual(node.insertBefore(child3, child1), child3)
    assert.strictEqual(childNodes.length, 4)
    assert.deepEqual([...childNodes], [child0, child3, child1, child2])

    assert.strictEqual(child0.nextSibling, child3)
    assert.strictEqual(child3.previousSibling, child0)
    assert.strictEqual(child3.nextSibling, child1)
    assert.strictEqual(child1.previousSibling, child3)
    assert.strictEqual(child1.nextSibling, child2)
    assert.strictEqual(child2.previousSibling, child1)
  })

  it('should return expect array for Array.prototype.slice', () => {
    const {childNodes} = node
    assert.strictEqual(childNodes.length, 0)

    const child0 = new TestNode('childElement0', Node.ELEMENT_NODE)
    const child1 = new TestNode('childElement1', Node.ELEMENT_NODE)
    const child2 = new TestNode('childElement3', Node.ELEMENT_NODE)

    node.appendChild(child0)
    node.appendChild(child1)
    node.appendChild(child2)

    assert.deepEqual(Array.prototype.slice.call(node.childNodes, 0), [child0, child1, child2])
  })

  it('should return correct node for getRootNode', () => {
    assert.strictEqual(node.getRootNode(), node)

    const child0 = new TestNode('childElement0', Node.ELEMENT_NODE)
    node.appendChild(child0)
    assert.strictEqual(child0.getRootNode(), node)
  })
})
