// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import {describe, it, assert, beforeEach} from '@nia/bzl/js/chai-js'

import {HTMLCollection, createHTMLCollection} from './html-collection'
import {Element} from './element'
import type {Document} from './document'

let elementIdx: number

class TestElement extends Element {
  constructor() {
    super(null as unknown as Document, 'elName', 'elTag')
    this.id = `el${elementIdx}`
    this.setAttribute('name', `name${elementIdx}`)
    elementIdx++
  }
}

describe('HTMLCollection tests', () => {
  let htmlCollection: HTMLCollection
  let elementArray: Element[]

  beforeEach(() => {
    // Create HTMLCollection instance with an array of 5 elements.
    elementIdx = 0
    elementArray = new Array(5).fill(null).map(() => new TestElement())

    htmlCollection = createHTMLCollection(elementArray)
  })

  it('should have expected properties', () => {
    assert.instanceOf(htmlCollection, HTMLCollection)
    assert.isNumber(htmlCollection.length)
    assert.isFunction(htmlCollection.item)
    assert.isFunction(htmlCollection.namedItem)
  })

  it('should have correct values', () => {
    assert.strictEqual(htmlCollection.length, 5)
    assert.strictEqual(htmlCollection.item(0)?.id, 'el0')
    assert.strictEqual(htmlCollection.item(1)?.id, 'el1')
    assert.strictEqual(htmlCollection.item(2)?.id, 'el2')
    assert.strictEqual(htmlCollection.item(3)?.id, 'el3')
    assert.strictEqual(htmlCollection.item(4)?.id, 'el4')
    assert.strictEqual(htmlCollection[0].id, 'el0')
    assert.strictEqual(htmlCollection[1].id, 'el1')
    assert.strictEqual(htmlCollection[2].id, 'el2')
    assert.strictEqual(htmlCollection[3].id, 'el3')
    assert.strictEqual(htmlCollection[4].id, 'el4')

    assert.isNull(htmlCollection.item(5))
    assert.isUndefined(htmlCollection[5])
  })

  it('should get named items correctly', () => {
    assert.strictEqual(htmlCollection.namedItem('el2'), htmlCollection[2])
    assert.strictEqual(htmlCollection.namedItem('name3'), htmlCollection[3])
    assert.isNull(htmlCollection.namedItem('foo'))
  })

  it('should iterate over collection correctly', () => {
    const elements = [...htmlCollection]
    assert.deepEqual(elements, [
      htmlCollection[0],
      htmlCollection[1],
      htmlCollection[2],
      htmlCollection[3],
      htmlCollection[4],
    ])
  })

  it('should support Array.from', () => {
    const elements = Array.from(htmlCollection)
    assert.deepEqual(elements, [
      htmlCollection[0],
      htmlCollection[1],
      htmlCollection[2],
      htmlCollection[3],
      htmlCollection[4],
    ])
  })

  it('should support for...of loop', () => {
    const elements: Element[] = []
    for (const element of htmlCollection) {
      elements.push(element)
    }
    assert.deepEqual(elements, [
      htmlCollection[0],
      htmlCollection[1],
      htmlCollection[2],
      htmlCollection[3],
      htmlCollection[4],
    ])
  })

  it('should support Object.keys', () => {
    const elements = Object.keys(htmlCollection)
    assert.deepEqual(elements, [
      '0', '1', '2', '3', '4',
    ])
  })

  it('should support Object.values', () => {
    const elements = Object.values(htmlCollection)
    assert.deepEqual(elements, [
      htmlCollection[0],
      htmlCollection[1],
      htmlCollection[2],
      htmlCollection[3],
      htmlCollection[4],
    ])
  })

  it('should reflect live modifications', () => {
    elementArray.push(new TestElement())
    assert.strictEqual(htmlCollection.length, 6)
    assert.strictEqual(htmlCollection.item(5)?.id, 'el5')
    assert.strictEqual(htmlCollection[5].id, 'el5')

    let elements = [...htmlCollection]
    assert.deepEqual(elements, [
      htmlCollection[0],
      htmlCollection[1],
      htmlCollection[2],
      htmlCollection[3],
      htmlCollection[4],
      htmlCollection[5],
    ])

    elementArray.pop()
    assert.strictEqual(htmlCollection.length, 5)
    assert.isNull(htmlCollection.item(5))
    assert.isUndefined(htmlCollection[5])

    elements = [...htmlCollection]
    assert.deepEqual(elements, [
      htmlCollection[0],
      htmlCollection[1],
      htmlCollection[2],
      htmlCollection[3],
      htmlCollection[4],
    ])
  })
})
