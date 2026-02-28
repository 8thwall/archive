// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import {describe, it, assert, beforeEach} from '@nia/bzl/js/chai-js'

import {NamedNodeMap, createNamedNodeMap} from './named-node-map'
import {Attr, createAttr} from './attr'
import {Element} from './element'
import type {DOMString} from './strings'
import type {Document} from './document'

const makeAttr = (
  name: string,
  value: string,
  namespaceURI?: string | null,
  prefix?: string | null
): Attr => createAttr(null as unknown as Document, null, name, value, namespaceURI, prefix)

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

describe('NamedNodeMap tests', () => {
  let namedNodeMap: NamedNodeMap

  beforeEach(() => {
    const element = new TestElement()
    namedNodeMap = createNamedNodeMap(element)
  })

  it('should have expected properties', () => {
    assert.isNumber(namedNodeMap.length)
    assert.isFunction(namedNodeMap.getNamedItem)
    assert.isFunction(namedNodeMap.setNamedItem)
    assert.isFunction(namedNodeMap.removeNamedItem)
    assert.isFunction(namedNodeMap.item)
    assert.isFunction(namedNodeMap.getNamedItemNS)
    assert.isFunction(namedNodeMap.setNamedItemNS)
    assert.isFunction(namedNodeMap.removeNamedItemNS)
  })

  it('should return the correct length', () => {
    assert.strictEqual(namedNodeMap.length, 0)
    namedNodeMap.setNamedItem(makeAttr('name1', 'value1'))
    assert.strictEqual(namedNodeMap.length, 1)
    namedNodeMap.setNamedItem(makeAttr('name2', 'value2'))
    assert.strictEqual(namedNodeMap.length, 2)
    namedNodeMap.removeNamedItem('name1')
    assert.strictEqual(namedNodeMap.length, 1)
    namedNodeMap.removeNamedItem('name2')
    assert.strictEqual(namedNodeMap.length, 0)
  })

  it('should have expected result for Object.keys()', () => {
    namedNodeMap.setNamedItem(makeAttr('name1', 'value1'))
    namedNodeMap.setNamedItem(makeAttr('name2', 'value2'))
    namedNodeMap.userProp = 'userValue'

    assert.deepEqual(Object.keys(namedNodeMap), ['0', '1', 'userProp'])
  })

  it('should have expected result for Object.values()', () => {
    namedNodeMap.setNamedItem(makeAttr('name1', 'value1'))
    namedNodeMap.setNamedItem(makeAttr('name2', 'value2'))
    namedNodeMap.userProp = 'userValue'

    const readable = (val: Attr | string) => ((typeof val === 'string') ? val : `Attr:${val.value}`)
    assert.deepEqual(
      Object.values(namedNodeMap).map(attr => readable(attr)),
      ['Attr:value1', 'Attr:value2', 'userValue']
    )
  })

  it('should have expected result for Object.entries()', () => {
    namedNodeMap.setNamedItem(makeAttr('name1', 'value1'))
    namedNodeMap.setNamedItem(makeAttr('name2', 'value2'))
    namedNodeMap.setNamedItem(makeAttr('name2', 'value2'))
    namedNodeMap.userProp = 'userValue'

    const readable = (val: Attr | string) => ((typeof val === 'string') ? val : `Attr:${val.value}`)
    assert.deepEqual(Object.entries(namedNodeMap).map(([key, attr]) => [key, readable(attr)]), [
      ['0', 'Attr:value1'],
      ['1', 'Attr:value2'],
      ['userProp', 'userValue'],
    ])
  })

  it('should have expected result for Array.from()', () => {
    namedNodeMap.setNamedItem(makeAttr('name1', 'value1'))
    namedNodeMap.setNamedItem(makeAttr('name2', 'value2'))
    namedNodeMap.userProp = 'userValue'

    assert.deepEqual(Array.from(namedNodeMap).map(attr => attr.value), ['value1', 'value2'])
  })

  it('should have expected result for [...namedNodeMap]', () => {
    namedNodeMap.setNamedItem(makeAttr('name1', 'value1'))
    namedNodeMap.setNamedItem(makeAttr('name2', 'value2'))
    namedNodeMap.userProp = 'userValue'

    assert.deepEqual([...namedNodeMap].map(attr => attr.value), ['value1', 'value2'])
  })

  it('should have expected result for Object.getOwnPropertyNames()', () => {
    namedNodeMap.setNamedItem(makeAttr('name1', 'value1'))
    namedNodeMap.setNamedItem(makeAttr('name2', 'value2'))
    namedNodeMap.userProp = 'userValue'

    assert.deepEqual(Object.getOwnPropertyNames(namedNodeMap), [
      '0',
      '1',
      'userProp',
      'name1',
      'name2',
    ])
  })

  it('should get and set named items correctly', () => {
    namedNodeMap.setNamedItem(makeAttr('name1', 'value1'))
    namedNodeMap.setNamedItem(makeAttr('name2', 'value2'))

    assert.strictEqual(namedNodeMap.getNamedItem('name1')?.value, 'value1')
    assert.strictEqual(namedNodeMap.getNamedItem('name2')?.value, 'value2')

    assert.strictEqual(namedNodeMap.name1?.value, 'value1')
    assert.strictEqual(namedNodeMap.name2?.value, 'value2')

    namedNodeMap.setNamedItem(makeAttr('name1', 'updatedValue1'))
    assert.strictEqual(namedNodeMap.getNamedItem('name1')?.value, 'updatedValue1')
    assert.strictEqual(namedNodeMap.name1?.value, 'updatedValue1')
  })

  it('should remove named items correctly', () => {
    namedNodeMap.setNamedItem(makeAttr('name1', 'value1'))
    namedNodeMap.setNamedItem(makeAttr('name2', 'value2'))

    namedNodeMap.removeNamedItem('name1')
    assert.isNull(namedNodeMap.getNamedItem('name1'))
    assert.strictEqual(namedNodeMap.getNamedItem('name2')?.value, 'value2')

    namedNodeMap.removeNamedItem('name2')
    assert.isNull(namedNodeMap.getNamedItem('name2'))
  })

  it('should get items by index correctly', () => {
    namedNodeMap.setNamedItem(makeAttr('name1', 'value1'))
    namedNodeMap.setNamedItem(makeAttr('name2', 'value2'))

    assert.strictEqual(namedNodeMap.item(0)?.value, 'value1')
    assert.strictEqual(namedNodeMap.item(1)?.value, 'value2')

    assert.deepEqual([...namedNodeMap].map(attr => attr.value), ['value1', 'value2'])

    assert.strictEqual(namedNodeMap[0]?.value, 'value1')
    assert.strictEqual(namedNodeMap[1]?.value, 'value2')

    namedNodeMap.setNamedItem(makeAttr('name1', 'updatedValue1'))
    assert.strictEqual(namedNodeMap.item(0)?.value, 'updatedValue1')
    assert.strictEqual(namedNodeMap[0]?.value, 'updatedValue1')
  })

  it('should get and set named items with namespace correctly', () => {
    namedNodeMap.setNamedItemNS(makeAttr('name1', 'value1', 'namespace1', 'prefix1'))
    namedNodeMap.setNamedItemNS(makeAttr('name2', 'value2', 'namespace2', 'prefix2'))

    assert.strictEqual(namedNodeMap.getNamedItemNS('namespace1', 'name1')?.value, 'value1')
    assert.strictEqual(namedNodeMap.getNamedItemNS('namespace2', 'name2')?.value, 'value2')

    assert.strictEqual(namedNodeMap.getNamedItem('prefix1:name1')?.value, 'value1')
    assert.strictEqual(namedNodeMap.getNamedItem('prefix2:name2')?.value, 'value2')

    namedNodeMap.setNamedItemNS(makeAttr('name1', 'updatedValue1', 'namespace1', 'prefix1'))
    assert.strictEqual(namedNodeMap.getNamedItemNS('namespace1', 'name1')?.value, 'updatedValue1')
    assert.strictEqual(namedNodeMap.getNamedItem('prefix1:name1')?.value, 'updatedValue1')
  })

  it('should remove named items with namespace correctly', () => {
    namedNodeMap.setNamedItemNS(makeAttr('name1', 'value1', 'namespace1', 'prefix1'))
    namedNodeMap.setNamedItemNS(makeAttr('name2', 'value2', 'namespace2', 'prefix2'))

    namedNodeMap.removeNamedItemNS('namespace1', 'name1')
    assert.isUndefined(namedNodeMap.getNamedItemNS('namespace1', 'name1')?.value)
    assert.strictEqual(namedNodeMap.getNamedItemNS('namespace2', 'name2')?.value, 'value2')

    namedNodeMap.removeNamedItem('prefix2:name2')
    assert.isUndefined(namedNodeMap.getNamedItemNS('namespace2', 'name2')?.value)
  })

  it('should work with Array.prototype.from.slice', () => {
    namedNodeMap.setNamedItem(makeAttr('name1', 'value1'))
    namedNodeMap.setNamedItem(makeAttr('name2', 'value2'))

    assert.deepEqual(Array.prototype.slice.call(namedNodeMap, 0).map((
      attr: Attr
    ) => attr.value), [
      'value1',
      'value2',
    ])
  })
})
