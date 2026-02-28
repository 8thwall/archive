// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @dep(//third_party/headless-gl)

/* eslint-disable max-classes-per-file */

import {describe, it, assert, beforeEach} from '@nia/bzl/js/chai-js'

import type {DOMString} from './strings'
import {DOMTokenList} from './dom-token-list'
import {Element} from './element'
import {Document} from './document'
import {Node} from './node'
import {Text} from './text'
import {DOMException} from './dom-exception'
import {assertThrowsWith} from './assert-throws-with'

class TestElement extends Element {
  constructor(
    id: DOMString = '',
    localName: DOMString = 'body',
    namespaceURI: DOMString | null = 'http://www.w3.org/1999/xhtml',
    prefix: DOMString | null = null,
    ownerDocument: Document | null = null
  ) {
    super(
      ownerDocument as unknown as Document,
      localName,
      localName.toUpperCase(),
      namespaceURI, prefix
    )
    if (id) {
      this.id = id
    }
  }
}

describe('Element tests', () => {
  let element: TestElement
  let doc: Document

  beforeEach(() => {
    doc = new Document()
    element = new TestElement('', 'body', 'http://www.w3.org/1999/xhtml', null, doc)
  })

  it('should have expected properties', () => {
    assert.isString(element.id)
    assert.isString(element.className)
    assert.isObject(element.classList)
    assert.isFunction(element.getElementsByClassName)
    assert.isFunction(element.getElementsByTagName)
    assert.isFunction(element.getElementsByTagNameNS)
    assert.isFunction(element.querySelector)
    assert.isFunction(element.querySelectorAll)
    assert.isFunction(element.after)
    assert.isFunction(element.before)
    assert.isFunction(element.remove)
    assert.isFunction(element.replaceWith)
    assert.isFunction(element.setPointerCapture)
    assert.isFunction(element.releasePointerCapture)
    assert.isFunction(element.hasPointerCapture)
    assert.isNull(element.previousElementSibling)
    assert.isNull(element.nextElementSibling)

    assert.isString(element.innerHTML)
    assert.isString(element.outerHTML)
    assert.isNumber(element.clientHeight)

    assert.instanceOf(element, Element)
    assert.instanceOf(element, Node)
  })

  it('should have expected type for classList', () => {
    assert.instanceOf(element.classList, DOMTokenList)
  })

  it('should have expected behavior for id', () => {
    element.id = 'testId'
    assert.strictEqual(element.id, 'testId')
    assert.strictEqual(element.getAttribute('id'), 'testId')

    element.setAttribute('id', 'testId2')
    assert.strictEqual(element.id, 'testId2')
    assert.strictEqual(element.getAttribute('id'), 'testId2')

    element.removeAttribute('id')
    assert.strictEqual(element.id, '')
    assert.isNull(element.getAttribute('id'))
  })

  it('should have expected behavior for className', () => {
    assert.strictEqual(element.className, '')
    assert.strictEqual(element.classList.value, '')
    assert.isNull(element.getAttribute('class'))

    element.className = 'testClass'
    assert.strictEqual(element.className, 'testClass')
    assert.strictEqual(element.classList.value, 'testClass')
    assert.strictEqual(element.getAttribute('class'), 'testClass')

    element.classList.add('testClass2')
    assert.strictEqual(element.className, 'testClass testClass2')
    assert.strictEqual(element.classList.value, 'testClass testClass2')
    assert.strictEqual(element.getAttribute('class'), 'testClass testClass2')

    element.classList.remove('testClass')
    assert.strictEqual(element.className, 'testClass2')
    assert.strictEqual(element.classList.value, 'testClass2')
    assert.strictEqual(element.getAttribute('class'), 'testClass2')

    element.classList.remove('testClass2')
    assert.strictEqual(element.className, '')
    assert.strictEqual(element.classList.value, '')
    assert.strictEqual(element.getAttribute('class'), '')

    element.setAttribute('class', 'testClass4 testClass5')
    assert.strictEqual(element.className, 'testClass4 testClass5')
    assert.strictEqual(element.classList.value, 'testClass4 testClass5')
    assert.strictEqual(element.getAttribute('class'), 'testClass4 testClass5')
  })

  it('should have expected behavior for classList', () => {
    assert.strictEqual(element.className, '')
    assert.strictEqual(element.classList.value, '')
    assert.isNull(element.getAttribute('class'))

    element.classList.add('testClass')
    assert.strictEqual(element.className, 'testClass')
    assert.strictEqual(element.classList.value, 'testClass')
    assert.strictEqual(element.getAttribute('class'), 'testClass')

    element.classList.add('testClass2')
    assert.strictEqual(element.className, 'testClass testClass2')
    assert.strictEqual(element.classList.value, 'testClass testClass2')
    assert.strictEqual(element.getAttribute('class'), 'testClass testClass2')

    element.classList.remove('testClass')
    assert.strictEqual(element.className, 'testClass2')
    assert.strictEqual(element.classList.value, 'testClass2')
    assert.strictEqual(element.getAttribute('class'), 'testClass2')

    element.classList.toggle('testClass2')
    assert.strictEqual(element.className, '')
    assert.strictEqual(element.classList.value, '')
    assert.strictEqual(element.getAttribute('class'), '')

    element.classList = 'testClass3'
    assert.strictEqual(element.className, 'testClass3')
    assert.strictEqual(element.classList.value, 'testClass3')
    assert.strictEqual(element.getAttribute('class'), 'testClass3')

    element.setAttribute('class', 'testClass4 testClass5')
    assert.strictEqual(element.className, 'testClass4 testClass5')
    assert.strictEqual(element.classList.value, 'testClass4 testClass5')
    assert.deepEqual([...element.classList.values()], ['testClass4', 'testClass5'])
    assert.strictEqual(element.classList[0], 'testClass4')
    assert.strictEqual(element.classList[1], 'testClass5')
    assert.strictEqual(element.classList.length, 2)
    assert.strictEqual(element.getAttribute('class'), 'testClass4 testClass5')
  })

  it('should have expected behavior for children', () => {
    const {children} = element
    assert.strictEqual(children.length, 0)

    const childElement0 = new TestElement('childElement0')
    const textChild = new Text('textChild')
    const childElement1 = new TestElement('childElement1')
    const childElement2 = new TestElement('childElement2')
    const grandChildElement4 = new TestElement('grandChildElement')

    element.appendChild(childElement0)
    assert.strictEqual(children.length, 1)

    element.appendChild(textChild)
    assert.strictEqual(children.length, 1)

    element.appendChild(childElement1)
    assert.strictEqual(children.length, 2)
    element.appendChild(childElement2)
    assert.strictEqual(children.length, 3)

    childElement0.appendChild(grandChildElement4)
    assert.strictEqual(children.length, 3)

    assert.strictEqual(children[0], childElement0)
    assert.strictEqual(children[1], childElement1)
    assert.strictEqual(children[2], childElement2)

    // Existing nodes get moved, and children should reflect the new order as it
    // is a live collection.
    element.appendChild(childElement0)
    assert.strictEqual(children.length, 3)
    assert.deepEqual([...children], [childElement1, childElement2, childElement0])
  })

  it('should have expected behavior for insertAdjacentElement', () => {
    const beforeBeginElement = new TestElement('Before Begin', 'p')
    const afterBeginElement = new TestElement('After Begin', 'p')
    const beforeEndElement = new TestElement('Before End', 'p')
    const afterEndElement = new TestElement('After End', 'p')
    const parentElement = new TestElement('parent', 'div', null, null, doc)
    const childElement = new TestElement('child', 'span', null, null, doc)
    const orphanElement = new TestElement('orphan', 'span', null, null, doc)
    parentElement.appendChild(childElement)

    // Insert with invalid position parameter must throw SyntaxError
    assertThrowsWith(
      () => childElement.insertAdjacentElement('invalidParameter' as any, afterEndElement),
      DOMException, 'position parameter must be: beforebegin, afterbegin, beforeend, or afterend'
    )

    // Insert at beforebegin of child
    assert.strictEqual(childElement.insertAdjacentElement('beforebegin', beforeBeginElement),
      beforeBeginElement)
    assert.strictEqual(parentElement.childNodes.length, 2)
    assert.strictEqual((parentElement.childNodes[0] as Element).outerHTML,
      '<p id="Before Begin"></p>')
    assert.strictEqual(parentElement.childNodes[1], childElement)

    // Insert at beforebegin without parent should return null
    assert.isNull(orphanElement.insertAdjacentElement('beforebegin', beforeBeginElement))

    // Insert at afterbegin of parent
    assert.strictEqual(parentElement.insertAdjacentElement('afterbegin', afterBeginElement),
      afterBeginElement)
    assert.strictEqual(parentElement.childNodes.length, 3)
    assert.strictEqual((parentElement.childNodes[0] as Element).outerHTML,
      '<p id="After Begin"></p>')
    assert.strictEqual((parentElement.childNodes[1] as Element).outerHTML,
      '<p id="Before Begin"></p>')
    assert.strictEqual(parentElement.childNodes[2], childElement)

    // Insert at beforeend of parent
    assert.strictEqual(parentElement.insertAdjacentElement('beforeend', beforeEndElement),
      beforeEndElement)
    assert.strictEqual(parentElement.childNodes.length, 4)
    assert.strictEqual(parentElement.childNodes[2], childElement)
    assert.strictEqual((parentElement.childNodes[3] as Element).outerHTML,
      '<p id="Before End"></p>')

    // Insert at afterend of child
    assert.strictEqual(childElement.insertAdjacentElement('afterend', afterEndElement),
      afterEndElement)
    assert.strictEqual(parentElement.childNodes.length, 5)
    assert.strictEqual(parentElement.childNodes[2], childElement)
    assert.strictEqual((parentElement.childNodes[3] as Element).outerHTML,
      '<p id="After End"></p>')
    assert.strictEqual((parentElement.childNodes[4] as Element).outerHTML,
      '<p id="Before End"></p>')

    // Insert at afterend without parent should return null
    assert.isNull(orphanElement.insertAdjacentElement('afterend', afterEndElement))
  })

  it('should have expected behavior for insertAdjacentHTML', () => {
    const beforeBeginHTML = '<p>Before Begin</p>'
    const afterBeginHTML = '<p>After Begin</p>'
    const beforeEndHTML = '<p>Before End</p>'
    const afterEndHTML = '<p>After End</p>'
    const parentElement = new TestElement('parent', 'div', null, null, doc)
    const childElement = new TestElement('child', 'span', null, null, doc)
    const orphanElement = new TestElement('orphan', 'span', null, null, doc)
    parentElement.appendChild(childElement)

    // Insert with invalid position parameter must throw SyntaxError
    assertThrowsWith(() => childElement.insertAdjacentHTML('invalidParameter' as any, afterEndHTML),
      DOMException, 'position parameter must be: beforebegin, afterbegin, beforeend, or afterend')

    // Insert at beforebegin of child
    childElement.insertAdjacentHTML('beforebegin', beforeBeginHTML)
    assert.strictEqual(parentElement.childNodes.length, 2)
    assert.strictEqual((parentElement.childNodes[0] as Element).outerHTML, '<p>Before Begin</p>')
    assert.strictEqual(parentElement.childNodes[1], childElement)

    // Insert at beforebegin without parent should throw NoModificationAllowedError
    assertThrowsWith(() => orphanElement.insertAdjacentHTML('beforebegin', beforeBeginHTML),
      DOMException, 'The element has no parent or the parent is the document')

    // Insert at afterbegin of parent
    parentElement.insertAdjacentHTML('afterbegin', afterBeginHTML)
    assert.strictEqual(parentElement.childNodes.length, 3)
    assert.strictEqual((parentElement.childNodes[0] as Element).outerHTML, '<p>After Begin</p>')
    assert.strictEqual((parentElement.childNodes[1] as Element).outerHTML, '<p>Before Begin</p>')
    assert.strictEqual(parentElement.childNodes[2], childElement)

    // Insert at beforeend of parent
    parentElement.insertAdjacentHTML('beforeend', beforeEndHTML)
    assert.strictEqual(parentElement.childNodes.length, 4)
    assert.strictEqual(parentElement.childNodes[2], childElement)
    assert.strictEqual((parentElement.childNodes[3] as Element).outerHTML, '<p>Before End</p>')

    // Insert at afterend of child
    childElement.insertAdjacentHTML('afterend', afterEndHTML)
    assert.strictEqual(parentElement.childNodes.length, 5)
    assert.strictEqual(parentElement.childNodes[2], childElement)
    assert.strictEqual((parentElement.childNodes[3] as Element).outerHTML, '<p>After End</p>')
    assert.strictEqual((parentElement.childNodes[4] as Element).outerHTML, '<p>Before End</p>')

    // Insert at afterend without parent should throw NoModificationAllowedError
    assertThrowsWith(() => orphanElement.insertAdjacentHTML('afterend', afterEndHTML),
      DOMException,
      'The element has no parent or the parent is the document')
  })

  it('should have expected behavior for insertAdjacentText', () => {
    const beforeBeginText = 'Before Begin'
    const afterBeginText = 'After Begin'
    const beforeEndText = 'Before End'
    const afterEndText = 'After End'
    const parentElement = new TestElement('parent', 'div', null, null, doc)
    const childElement = new TestElement('child', 'span', null, null, doc)
    parentElement.appendChild(childElement)

    // Insert with invalid position parameter must throw SyntaxError
    assertThrowsWith(() => childElement.insertAdjacentText('invalidParameter' as any, afterEndText),
      DOMException, 'position parameter must be: beforebegin, afterbegin, beforeend, or afterend')

    // Insert at beforebegin of child
    childElement.insertAdjacentText('beforebegin', beforeBeginText)
    assert.strictEqual(parentElement.childNodes.length, 2)
    assert.strictEqual((parentElement.childNodes[0] as Element).textContent, 'Before Begin')
    assert.strictEqual(parentElement.childNodes[1], childElement)

    // Insert at afterbegin of parent
    parentElement.insertAdjacentText('afterbegin', afterBeginText)
    assert.strictEqual(parentElement.childNodes.length, 3)
    assert.strictEqual((parentElement.childNodes[0] as Element).textContent, 'After Begin')
    assert.strictEqual((parentElement.childNodes[1] as Element).textContent, 'Before Begin')
    assert.strictEqual(parentElement.childNodes[2], childElement)

    // Insert at beforeend of parent
    parentElement.insertAdjacentText('beforeend', beforeEndText)
    assert.strictEqual(parentElement.childNodes.length, 4)
    assert.strictEqual(parentElement.childNodes[2], childElement)
    assert.strictEqual((parentElement.childNodes[3] as Element).textContent, 'Before End')

    // Insert at afterend of child
    childElement.insertAdjacentText('afterend', afterEndText)
    assert.strictEqual(parentElement.childNodes.length, 5)
    assert.strictEqual(parentElement.childNodes[2], childElement)
    assert.strictEqual((parentElement.childNodes[3] as Element).textContent, 'After End')
    assert.strictEqual((parentElement.childNodes[4] as Element).textContent, 'Before End')
  })

  it('should have expected behavior for getElementsByTagName', () => {
    const childElement0 = new TestElement('childElement0', 'div')
    const childElement1 = new TestElement('childElement1', 'span')
    const textChild = new Text('textChild')
    const childElement2 = new TestElement('childElement2', 'div')
    const childElement3 = new TestElement('childElement3', 'p')
    const childElement4 = new TestElement('childElement4', 'a')
    const childElement5 = new TestElement('childElement5', 'div')
    const childElement6 = new TestElement('childElement6', 'table')
    const childElement7 = new TestElement('childElement7', 'div')

    element.appendChild(childElement0)
    element.appendChild(childElement1)
    element.appendChild(textChild)
    element.appendChild(childElement2)
    element.appendChild(childElement3)

    childElement3.appendChild(childElement4)
    childElement4.appendChild(childElement5)

    childElement1.appendChild(childElement6)
    childElement6.appendChild(childElement7)

    const collection = element.getElementsByTagName('div')
    assert.deepEqual([...collection],
      [childElement0, childElement7, childElement2, childElement5])
    assert.strictEqual(collection.length, 4)

    // The collection is live, and should reflect changes to the DOM.
    const childElement8 = new TestElement('childElement8', 'div')
    childElement4.insertBefore(childElement8, childElement5)

    assert.deepEqual([...collection], [
      childElement0, childElement7, childElement2, childElement8, childElement5])

    childElement6.removeChild(childElement7)

    assert.deepEqual([...collection], [
      childElement0, childElement2, childElement8, childElement5])
  })

  it('should have expected behavior for getElementsByTagNameNS', () => {
    const childElement0 = new TestElement('childElement0', 'div', 'http://example.com')
    const childElement1 = new TestElement('childElement1', 'span', 'http://example.com')
    const textChild = new Text('textChild')
    const childElement2 = new TestElement('childElement2', 'div', 'http://example.com')
    const childElement3 = new TestElement('childElement3', 'p', 'http://example.com')
    const childElement4 = new TestElement('childElement4', 'a', 'http://example.com')
    const childElement5 = new TestElement('childElement5', 'div', 'http://example.com')
    const childElement6 = new TestElement('childElement6', 'table', 'http://example.com')
    const childElement7 = new TestElement('childElement7', 'div', 'http://example.com')

    element.appendChild(childElement0)
    element.appendChild(childElement1)
    element.appendChild(textChild)
    element.appendChild(childElement2)
    element.appendChild(childElement3)

    childElement3.appendChild(childElement4)
    childElement4.appendChild(childElement5)

    childElement1.appendChild(childElement6)
    childElement6.appendChild(childElement7)

    const collection = element.getElementsByTagNameNS('http://example.com', 'div')
    assert.deepEqual([...collection], [
      childElement0, childElement7, childElement2, childElement5])
    assert.strictEqual(collection.length, 4)

    // The collection is live, and should reflect changes to the DOM.
    const childElement8 = new TestElement('childElement8', 'div', 'http://example.com')
    childElement4.insertBefore(childElement8, childElement5)

    assert.deepEqual([...collection], [
      childElement0, childElement7, childElement2, childElement8, childElement5])

    childElement6.removeChild(childElement7)

    assert.deepEqual([...collection], [
      childElement0, childElement2, childElement8, childElement5])
  })

  it('should have expected behavior for getElementsByClassName', () => {
    const childElement0 = new TestElement('childElement0')
    childElement0.className = 'class0 yes'
    const childElement1 = new TestElement('childElement1')
    childElement1.className = 'class1 no'
    const textChild = new Text('textChild')
    const childElement2 = new TestElement('childElement2')
    childElement2.className = 'yes class2 extra'
    const childElement3 = new TestElement('childElement3')
    const childElement4 = new TestElement('childElement4')
    const childElement5 = new TestElement('childElement5')
    childElement5.className = 'yes class5 yes'
    const childElement6 = new TestElement('childElement6')
    childElement6.className = 'class6'
    const childElement7 = new TestElement('childElement7')
    childElement7.className = 'class7 yes more'

    element.appendChild(childElement0)
    element.appendChild(childElement1)
    element.appendChild(textChild)
    element.appendChild(childElement2)
    element.appendChild(childElement3)

    childElement3.appendChild(childElement4)
    childElement4.appendChild(childElement5)

    childElement1.appendChild(childElement6)
    childElement6.appendChild(childElement7)

    const collection = element.getElementsByClassName('yes')
    assert.deepEqual([...collection], [
      childElement0, childElement7, childElement2, childElement5])
    assert.strictEqual(collection.length, 4)

    const collectionExtra = element.getElementsByClassName('extra yes')
    assert.deepEqual([...collectionExtra], [childElement2])

    // The collection is live, and should reflect changes to the DOM.
    const childElement8 = new TestElement('childElement8')
    childElement8.className = 'yes class8 extra'
    childElement4.insertBefore(childElement8, childElement5)

    assert.deepEqual([...collection], [
      childElement0, childElement7, childElement2, childElement8, childElement5])

    childElement6.removeChild(childElement7)

    assert.deepEqual([...collection], [
      childElement0, childElement2, childElement8, childElement5])
    assert.deepEqual([...collectionExtra], [childElement2, childElement8])
  })

  it('should have expected behavior for querySelector', () => {
    const childElement0 = new TestElement('childElement0', 'div')
    childElement0.className = 'class0 yes'
    const childElement1 = new TestElement('childElement1', 'span')
    childElement1.className = 'class1'
    const textChild = new Text('textChild')
    const childElement2 = new TestElement('childElement2', 'div')
    childElement2.className = 'class2 yes'
    const childElement3 = new TestElement('childElement3', 'p')
    childElement3.className = 'class3'
    childElement3.setAttribute('foo', 'bar')
    const childElement4 = new TestElement('childElement4', 'a')
    childElement4.className = 'class4'
    const childElement5 = new TestElement('childElement5', 'div')
    childElement5.className = 'class5'
    const childElement6 = new TestElement('childElement6', 'table')
    const childElement7 = new TestElement('childElement7', 'div')

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

  it('should have expected behavior for querySelectorAll', () => {
    const childElement0 = new TestElement('childElement0', 'div', 'http://www.w3.org/1999/xhtml')
    childElement0.className = 'class0 yes'
    const childElement1 = new TestElement('childElement1', 'span', 'http://www.w3.org/1999/xhtml')
    childElement1.className = 'class1'
    const textChild = new Text('textChild')
    const childElement2 = new TestElement('childElement2', 'div', 'http://www.w3.org/1999/xhtml')
    childElement2.className = 'class2 yes'
    const childElement3 = new TestElement('childElement3', 'p', 'http://www.w3.org/1999/xhtml')
    childElement3.className = 'class3'
    childElement3.setAttribute('foo', 'bar')
    const childElement4 = new TestElement('childElement4', 'a', 'http://www.w3.org/1999/xhtml')
    childElement4.className = 'class4'
    const childElement5 = new TestElement('childElement5', 'div', 'http://www.w3.org/1999/xhtml')
    childElement5.className = 'class5'
    const childElement6 = new TestElement('childElement6', 'table', 'http://www.w3.org/1999/xhtml')
    const childElement7 = new TestElement('childElement7', 'div', 'http://www.w3.org/1999/xhtml')

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

    assert.deepEqual([...element.querySelectorAll('.yes')], [childElement0, childElement2])
    assert.deepEqual([...element.querySelectorAll('#childElement4, table')], [
      childElement6, childElement4])
  })

  it('should correctly serialize HTML for outerHTML and innerHTML', () => {
    const div = new TestElement('div-id', 'div')
    div.className = 'div-class'
    const span = new TestElement('span-id', 'span')
    span.className = 'span-class'
    const br = new TestElement('', 'br')
    const text0 = new Text('Hello')
    const text1 = new Text(' World!')

    element.appendChild(div)
    div.appendChild(span)
    span.appendChild(text0)
    span.appendChild(br)
    span.appendChild(text1)
    assert.strictEqual(element.outerHTML,
      '<body><div id="div-id" class="div-class">' +
      '<span id="span-id" class="span-class">Hello<br> World!</span></div></body>')

    assert.strictEqual(element.innerHTML,
      '<div id="div-id" class="div-class">' +
      '<span id="span-id" class="span-class">Hello<br> World!</span></div>')
  })

  it('should correctly parse HTML for innerHTML and outerHTML', () => {
    element.innerHTML =
      '<div id="div-id" class="div-class">' +
      '  <span id="span-id" class="span-class">Hello<br> World!</span><p>after</p>' +
      '</div>'

    assert.strictEqual(element.innerHTML,
      '<div id="div-id" class="div-class">' +
      '  <span id="span-id" class="span-class">Hello<br> World!</span><p>after</p>' +
      '</div>')

    element.children[0].children[0].outerHTML = '<p>Updated</p>'

    assert.strictEqual(element.innerHTML,
      '<div id="div-id" class="div-class">  <p>Updated</p><p>after</p></div>')
  })
})
