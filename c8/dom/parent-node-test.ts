// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @dep(//third_party/headless-gl)

/* eslint-disable  max-classes-per-file */
import {describe, it, assert, beforeEach} from '@nia/bzl/js/chai-js'

import type {DOMString} from './strings'
import {Element} from './element'
import {Document} from './document'
import {Node} from './node'

class TestElement extends Element {
  constructor(
    ownerDocument: Document,
    id: DOMString = '',
    localName: DOMString = 'body',
    namespaceURI: DOMString | null = null,
    prefix: DOMString | null = null
  ) {
    super(ownerDocument, localName, localName.toUpperCase(), namespaceURI, prefix)
    this.id = id
  }
}

class TestTextNode extends Node {
  constructor(
    ownerDocument: Document,
    nodeName: DOMString = 'name',
    nodeType: number = Node.TEXT_NODE
  ) {
    super(ownerDocument, nodeName, nodeType)
  }
}

describe('ParentNode tests', () => {
  let element: TestElement
  let doc: Document

  beforeEach(() => {
    doc = new Document()
    element = new TestElement(doc)
  })

  it('should have expected properties', () => {
    assert.isObject(element.children)
    assert.isNull(element.firstElementChild)
    assert.isNull(element.lastElementChild)
    assert.isNumber(element.childElementCount)
    assert.isFunction(element.prepend)
    assert.isFunction(element.append)
    assert.isFunction(element.replaceChildren)
    assert.isFunction(element.querySelector)
    assert.isFunction(element.querySelectorAll)
  })

  it('should have expected behavior for children', () => {
    const {children} = element
    assert.strictEqual(children.length, 0)

    const childElement0 = new TestElement(doc, 'childElement0')
    const textChild = new TestTextNode(doc, 'textChild')
    const childElement1 = new TestElement(doc, 'childElement1')
    const childElement2 = new TestElement(doc, 'childElement2')
    const grandChildElement4 = new TestElement(doc, 'grandChildElement')

    element.appendChild(childElement0)
    assert.strictEqual(children.length, 1)
    assert.strictEqual(element.childElementCount, 1)

    element.appendChild(textChild)
    assert.strictEqual(children.length, 1)
    assert.strictEqual(element.childElementCount, 1)

    element.appendChild(childElement1)
    assert.strictEqual(children.length, 2)
    assert.strictEqual(element.childElementCount, 2)

    element.appendChild(childElement2)
    assert.strictEqual(children.length, 3)
    assert.strictEqual(element.childElementCount, 3)

    childElement0.appendChild(grandChildElement4)
    assert.strictEqual(children.length, 3)
    assert.strictEqual(element.childElementCount, 3)

    assert.strictEqual(children[0], childElement0)
    assert.strictEqual(children[1], childElement1)
    assert.strictEqual(children[2], childElement2)

    // Existing nodes get moved, and children should reflect the new order as it
    // is a live collection.
    element.appendChild(childElement0)
    assert.strictEqual(children.length, 3)
    assert.deepEqual([...children], [childElement1, childElement2, childElement0])
  })

  it('should have expected behavior for append and prepend', () => {
    const childElement0 = new TestElement(doc, 'childElement0')
    const childElement1 = new TestElement(doc, 'childElement1')
    const childElement2 = new TestElement(doc, 'childElement2')
    const childElement3 = new TestElement(doc, 'childElement3')
    const childElement4 = new TestElement(doc, 'childElement4')

    element.append(childElement0, childElement1)
    assert.strictEqual(element.childElementCount, 2)
    assert.strictEqual(element.children[0], childElement0)
    assert.strictEqual(element.children[1], childElement1)

    element.prepend(childElement2, childElement3)
    assert.strictEqual(element.childElementCount, 4)
    assert.strictEqual(element.children[0], childElement2)
    assert.strictEqual(element.children[1], childElement3)
    assert.strictEqual(element.children[2], childElement0)
    assert.strictEqual(element.children[3], childElement1)

    element.append(childElement4)
    assert.strictEqual(element.childElementCount, 5)
    assert.strictEqual(element.children[0], childElement2)
    assert.strictEqual(element.children[1], childElement3)
    assert.strictEqual(element.children[2], childElement0)
    assert.strictEqual(element.children[3], childElement1)
    assert.strictEqual(element.children[4], childElement4)
  })

  it('should have expected behavior for replaceChildren', () => {
    const childElement0 = new TestElement(doc, 'childElement0')
    const childElement1 = new TestElement(doc, 'childElement1')
    const childElement2 = new TestElement(doc, 'childElement2')
    const childElement3 = new TestElement(doc, 'childElement3')
    const childElement4 = new TestElement(doc, 'childElement4')

    element.append(childElement0, childElement1, childElement2)
    assert.strictEqual(element.childElementCount, 3)
    assert.strictEqual(element.children[0], childElement0)
    assert.strictEqual(element.children[1], childElement1)
    assert.strictEqual(element.children[2], childElement2)

    element.replaceChildren(childElement3, childElement4)
    assert.strictEqual(element.childElementCount, 2)
    assert.strictEqual(element.children[0], childElement3)
    assert.strictEqual(element.children[1], childElement4)
  })

  it('should have expected behavior for Element.querySelector', () => {
    const childElement0 = new TestElement(doc, 'childElement0', 'div')
    childElement0.className = 'class0 yes'
    const childElement1 = new TestElement(doc, 'childElement1', 'span')
    childElement1.className = 'class1'
    const textChild = new TestTextNode(doc, 'textChild')
    const childElement2 = new TestElement(doc, 'childElement2', 'div')
    childElement2.className = 'class2 yes'
    const childElement3 = new TestElement(doc, 'childElement3', 'p')
    childElement3.className = 'class3'
    childElement3.setAttribute('foo', 'bar')
    const childElement4 = new TestElement(doc, 'childElement4', 'a')
    childElement4.className = 'class4'
    const childElement5 = new TestElement(doc, 'childElement5', 'div')
    childElement5.className = 'class5'
    const childElement6 = new TestElement(doc, 'childElement6', 'table')
    const childElement7 = new TestElement(doc, 'childElement7', 'div')

    element.appendChild(childElement0)
    element.appendChild(childElement1)
    element.appendChild(textChild)
    element.appendChild(childElement2)
    element.appendChild(childElement3)

    childElement3.appendChild(childElement4)
    childElement4.appendChild(childElement5)

    childElement1.appendChild(childElement6)
    childElement6.appendChild(childElement7)

    assert.strictEqual(element.querySelector('div'), childElement0)

    assert.strictEqual(element.querySelector('span'), childElement1)

    assert.strictEqual(element.querySelector('p'), childElement3)

    assert.strictEqual(element.querySelector('table'), childElement6)

    assert.strictEqual(element.querySelector('table > div'), childElement7)

    assert.strictEqual(element.querySelector('span table div'), childElement7)

    assert.strictEqual(element.querySelector('#childElement3'), childElement3)

    assert.strictEqual(element.querySelector('.yes'), childElement0)

    assert.strictEqual(element.querySelector('[foo=bar]'), childElement3)
  })

  it('should have expected behavior for Element.querySelectorAll', () => {
    const childElement0 = new TestElement(doc, 'childElement0', 'div')
    childElement0.className = 'class0 yes'
    const childElement1 = new TestElement(doc, 'childElement1', 'span')
    childElement1.className = 'class1'
    const textChild = new TestTextNode(doc, 'textChild')
    const childElement2 = new TestElement(doc, 'childElement2', 'div')
    childElement2.className = 'class2 yes'
    const childElement3 = new TestElement(doc, 'childElement3', 'p')
    childElement3.className = 'class3'
    childElement3.setAttribute('foo', 'bar')
    const childElement4 = new TestElement(doc, 'childElement4', 'a')
    childElement4.className = 'class4'
    const childElement5 = new TestElement(doc, 'childElement5', 'div')
    childElement5.className = 'class5'
    const childElement6 = new TestElement(doc, 'childElement6', 'table')
    const childElement7 = new TestElement(doc, 'childElement7', 'div')

    element.appendChild(childElement0)
    element.appendChild(childElement1)
    element.appendChild(textChild)
    element.appendChild(childElement2)
    element.appendChild(childElement3)

    childElement3.appendChild(childElement4)
    childElement4.appendChild(childElement5)

    childElement1.appendChild(childElement6)
    childElement6.appendChild(childElement7)

    assert.deepEqual([...element.querySelectorAll('div')], [
      childElement0, childElement7, childElement2, childElement5])

    assert.deepEqual([...element.querySelectorAll('.yes')], [
      childElement0, childElement2])

    assert.deepEqual([...element.querySelectorAll('#childElement4, table')], [
      childElement6, childElement4])
  })

  it('should have expected behavior for Document.querySelector', () => {
    const div = doc.createElement('div')
    const span = doc.createElement('span')
    span.id = 'test'
    div.appendChild(span)
    doc.appendChild(div)

    assert.isNull(doc.querySelector('#missing'))
    assert.strictEqual(doc.querySelector('#test'), span)
  })

  it('should have expected behavior for Document.querySelectorAll', () => {
    const div = doc.createElement('div')
    const span1 = doc.createElement('span')
    const span2 = doc.createElement('span')
    const span3 = doc.createElement('span')

    div.appendChild(span1)
    div.appendChild(span2)
    div.appendChild(span3)
    doc.appendChild(div)

    assert.lengthOf(doc.querySelectorAll('missing'), 0)
    assert.lengthOf(doc.querySelectorAll('span'), 3)
  })
})
