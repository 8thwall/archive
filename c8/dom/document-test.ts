// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @dep(//third_party/headless-gl)

import {describe, it, assert, beforeEach} from '@nia/bzl/js/chai-js'

import {Document, HTMLDocument} from './document'
import {DocumentType} from './document-type'
import {Node} from './node'
import {
  HTMLHtmlElement,
  HTMLBodyElement,
  HTMLHeadElement,
} from './html-elements'

describe('Document tests', () => {
  let doc: Document

  beforeEach(() => {
    doc = new Document()
  })

  it('should have expected behavior for createElement', () => {
    const div = doc.createElement('div')
    assert.strictEqual(div.tagName, 'DIV')
    assert.strictEqual(div.localName, 'div')
    assert.strictEqual(div.ownerDocument, doc)
  })

  it('should have expected behavior for createTextNode', () => {
    const text = doc.createTextNode('hello')
    assert.strictEqual(text.data, 'hello')
    assert.strictEqual(text.ownerDocument, doc)
  })

  it('should have expected behavior for createComment', () => {
    const comment = doc.createComment('hello')
    assert.strictEqual(comment.data, 'hello')
    assert.strictEqual(comment.ownerDocument, doc)
  })

  it('should have expected behavior for createDocumentFragment', () => {
    const fragment = doc.createDocumentFragment()
    assert.strictEqual(fragment.ownerDocument, doc)
  })

  it('should have expected behavior for getElementById', () => {
    const div = doc.createElement('div')
    div.id = 'test'

    assert.isNull(doc.getElementById('test'))
    doc.appendChild(div)
    assert.strictEqual(doc.getElementById('test'), div)

    assert.isNull(doc.getElementById('missing'))

    const span = doc.createElement('span')
    span.setAttribute('id', 'bar')
    div.appendChild(span)
    assert.strictEqual(doc.getElementById('bar'), span)
  })

  it('should have expected behavior for getElementsByTagName', () => {
    const div = doc.createElement('div')
    const span1 = doc.createElement('span')
    const span2 = doc.createElement('span')
    const span3 = doc.createElement('span')

    doc.appendChild(div)
    div.appendChild(span1)
    div.appendChild(span2)
    div.appendChild(span3)

    assert.deepEqual(Array.from(doc.getElementsByTagName('div')), [div])
    assert.isEmpty(Array.from(doc.getElementsByTagName('missing')))
    assert.deepEqual(Array.from(doc.getElementsByTagName('span')), [span1, span2, span3])
  })

  it('should have expected behavior for getElementsByTagNameNS', () => {
    const div = doc.createElementNS('http://www.w3.org/1999/xhtml', 'div')
    const span1 = doc.createElementNS('http://www.w3.org/1999/xhtml', 'span')
    const span2 = doc.createElementNS('http://www.w3.org/1999/xhtml', 'span')
    const span3 = doc.createElementNS('http://www.w3.org/1999/xhtml', 'span')

    doc.appendChild(div)
    div.appendChild(span1)
    div.appendChild(span2)
    div.appendChild(span3)

    assert.deepEqual(Array.from(doc.getElementsByTagNameNS(
      'http://www.w3.org/1999/xhtml', 'div'
    )), [div])
    assert.isEmpty(Array.from(doc.getElementsByTagNameNS(
      'http://www.w3.org/1999/xhtml', 'missing'
    )))
    assert.deepEqual(Array.from(doc.getElementsByTagNameNS(
      'http://www.w3.org/1999/xhtml', 'span'
    )), [span1, span2, span3])
  })

  it('should have expected behavior for getElementsByClassName', () => {
    const div = doc.createElement('div')
    const span1 = doc.createElement('span')
    const span2 = doc.createElement('span')
    const span3 = doc.createElement('span')

    div.className = 'topClass'
    span2.className = 'coolSpan funSpan yeahSpan'
    span3.className = 'neatSpan funSpan'

    doc.appendChild(div)
    div.appendChild(span1)
    div.appendChild(span2)
    div.appendChild(span3)

    assert.isEmpty(Array.from(doc.getElementsByClassName('missing')))
    assert.deepEqual(Array.from(doc.getElementsByClassName('topClass')), [div])
    assert.deepEqual(Array.from(doc.getElementsByClassName('coolSpan')), [span2])
    assert.deepEqual(Array.from(doc.getElementsByClassName('funSpan')), [span2, span3])
  })

  it('should have expected behavior for querySelector', () => {
    const div = doc.createElement('div')
    const span = doc.createElement('span')
    span.id = 'test'
    div.appendChild(span)
    doc.appendChild(div)

    assert.isNull(doc.querySelector('#missing'))
    assert.strictEqual(doc.querySelector('#test'), span)
  })

  it('should have expected behavior for querySelectorAll', () => {
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

  it('should have ability to create new HTML Document', () => {
    const doc2 = doc.implementation.createHTMLDocument('Title')
    assert.instanceOf(doc2, Document)
    assert.instanceOf(doc2, HTMLDocument)
    assert.strictEqual(doc2.title, 'Title')

    assert.strictEqual(doc2.childNodes[0].nodeType, Node.DOCUMENT_TYPE_NODE)
    assert.strictEqual(doc2.childNodes[0].nodeValue, 'html')
    assert.instanceOf(doc2.childNodes[0], DocumentType)
    assert.instanceOf(doc2.documentElement, HTMLHtmlElement)
    assert.strictEqual(doc2.childNodes[1], doc2.documentElement)
    assert.instanceOf(doc2.documentElement?.childNodes[0], HTMLHeadElement)
    assert.instanceOf(doc2.documentElement?.childNodes[1], HTMLBodyElement)
  })
})
