// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import {describe, it, beforeEach, assert} from '@nia/bzl/js/chai-js'

import {DOMException} from './dom-exception'
import {DOMTokenList, createDOMTokenList} from './dom-token-list'
import {Element} from './element'
import type {Document} from './document'
import type {DOMString} from './strings'

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

describe('DOMTokenList tests', () => {
  let element: Element
  let domTokenList: DOMTokenList

  beforeEach(() => {
    element = new TestElement()
    domTokenList = createDOMTokenList(element, 'class')
  })

  it('should have expected properties', () => {
    assert.isNumber(domTokenList.length)
    assert.isString(domTokenList.value)
    assert.isFunction(domTokenList.item)
    assert.isFunction(domTokenList.contains)
    assert.isFunction(domTokenList.add)
    assert.isFunction(domTokenList.remove)
    assert.isFunction(domTokenList.replace)
    assert.isFunction(domTokenList.supports)
    assert.isFunction(domTokenList.toggle)
    assert.isFunction(domTokenList.entries)
    assert.isFunction(domTokenList.forEach)
    assert.isFunction(domTokenList.keys)
    assert.isFunction(domTokenList.values)
  })

  it('should add tokens correctly', () => {
    domTokenList.add('token1')
    domTokenList.add('token2')
    domTokenList.add('token3', 'token4')
    assert.isTrue(domTokenList.contains('token1'))
    assert.isTrue(domTokenList.contains('token2'))
    assert.isTrue(domTokenList.contains('token3'))
    assert.isTrue(domTokenList.contains('token4'))
  })

  it('should remove tokens correctly', () => {
    domTokenList.add('token1')
    domTokenList.add('token2')
    domTokenList.remove('token1')
    assert.isFalse(domTokenList.contains('token1'))
    assert.isTrue(domTokenList.contains('token2'))

    domTokenList.add('token3', 'token4')
    domTokenList.remove('token2', 'token4')
    assert.isFalse(domTokenList.contains('token1'))
    assert.isFalse(domTokenList.contains('token2'))
    assert.isTrue(domTokenList.contains('token3'))
    assert.isFalse(domTokenList.contains('token4'))
  })

  it('should replace tokens correctly', () => {
    domTokenList.add('token1')
    domTokenList.add('token2')
    domTokenList.replace('token1', 'token3')
    assert.isFalse(domTokenList.contains('token1'))
    assert.isTrue(domTokenList.contains('token2'))
    assert.isTrue(domTokenList.contains('token3'))
  })

  it('should toggle tokens correctly', () => {
    assert.strictEqual(domTokenList.toggle('token1'), true)
    assert.isTrue(domTokenList.contains('token1'))
    assert.strictEqual(domTokenList.toggle('token1'), false)
    assert.isFalse(domTokenList.contains('token1'))

    assert.strictEqual(domTokenList.toggle('token1', true), true)
    assert.isTrue(domTokenList.contains('token1'))
    assert.strictEqual(domTokenList.toggle('token1', true), true)
    assert.isTrue(domTokenList.contains('token1'))
    assert.strictEqual(domTokenList.toggle('token1', false), false)
    assert.isFalse(domTokenList.contains('token1'))
    assert.strictEqual(domTokenList.toggle('token1', false), false)
    assert.isFalse(domTokenList.contains('token1'))
  })

  it('should iterate over tokens correctly', () => {
    domTokenList.add('token1')
    domTokenList.add('token2')
    domTokenList.add('token3')
    domTokenList.add('token4')
    domTokenList.add('token5')
    domTokenList.add('token6')
    domTokenList.add('token7')
    domTokenList.add('token8')
    domTokenList.add('token9')
    domTokenList.add('token10')

    const tokens = [...domTokenList]
    assert.deepEqual(tokens, [
      'token1',
      'token2',
      'token3',
      'token4',
      'token5',
      'token6',
      'token7',
      'token8',
      'token9',
      'token10',
    ])
  })

  it('should check if supports is working', () => {
    domTokenList = createDOMTokenList(element, 'allow', new Set(['allow-forms', 'allow-camera']))
    assert.isTrue(domTokenList.supports('allow-forms'))
    assert.isTrue(domTokenList.supports('allow-camera'))
    assert.isFalse(domTokenList.supports('allow-microphone'))
    assert.isFalse(domTokenList.supports('allow-gps'))
  })

  it('should return the correct number of tokens', () => {
    assert.strictEqual(domTokenList.length, 0)
    domTokenList.add('token1')
    assert.strictEqual(domTokenList.length, 1)
    domTokenList.add('token2')
    assert.strictEqual(domTokenList.length, 2)
    domTokenList.remove('token1')
    assert.strictEqual(domTokenList.length, 1)
    domTokenList.remove('token2')
    assert.strictEqual(domTokenList.length, 0)
  })

  it('should return the correct value', () => {
    assert.strictEqual(domTokenList.value, '')
    domTokenList.add('token1')
    assert.strictEqual(domTokenList.value, 'token1')
    domTokenList.add('token2')
    assert.strictEqual(domTokenList.value, 'token1 token2')
    domTokenList.remove('token1')
    assert.strictEqual(domTokenList.value, 'token2')
    domTokenList.remove('token2')
    assert.strictEqual(domTokenList.value, '')
  })

  it('should support value modification', () => {
    domTokenList.value = '  token1   token2 '
    assert.isTrue(domTokenList.contains('token1'))
    assert.isTrue(domTokenList.contains('token2'))
    assert.strictEqual(domTokenList.length, 2)
    assert.strictEqual(domTokenList.value, '  token1   token2 ')

    domTokenList.add('token3')
    assert.isTrue(domTokenList.contains('token1'))
    assert.isTrue(domTokenList.contains('token2'))
    assert.isTrue(domTokenList.contains('token3'))
    assert.strictEqual(domTokenList.length, 3)
    assert.strictEqual(domTokenList.value, 'token1 token2 token3')
  })

  it('should return the correct item', () => {
    assert.isNull(domTokenList.item(0))
    domTokenList.add('token1')
    assert.strictEqual(domTokenList.item(0), 'token1')
    assert.strictEqual(domTokenList[0], 'token1')
    domTokenList.add('token2')
    assert.strictEqual(domTokenList.item(0), 'token1')
    assert.strictEqual(domTokenList.item(1), 'token2')
    assert.strictEqual(domTokenList[0], 'token1')
    assert.strictEqual(domTokenList[1], 'token2')
    domTokenList.remove('token1')
    assert.strictEqual(domTokenList.item(0), 'token2')
    assert.strictEqual(domTokenList[0], 'token2')
    assert.isUndefined(domTokenList[1])
    domTokenList.remove('token2')
    assert.isNull(domTokenList.item(0))
    assert.isNull(domTokenList.item(1))
    assert.isUndefined(domTokenList[0])
    assert.isUndefined(domTokenList[1])
  })

  it('should return the correct keys', () => {
    assert.deepEqual([...domTokenList.keys()], [])
    domTokenList.add('token1')
    assert.deepEqual([...domTokenList.keys()], [0])
    domTokenList.add('token2')
    assert.deepEqual([...domTokenList.keys()], [0, 1])
    domTokenList.remove('token1')
    assert.deepEqual([...domTokenList.keys()], [0])
    domTokenList.remove('token2')
    assert.deepEqual([...domTokenList.keys()], [])
  })

  it('should return the correct values', () => {
    assert.deepEqual([...domTokenList.values()], [])
    domTokenList.add('token1')
    assert.deepEqual([...domTokenList.values()], ['token1'])
    domTokenList.add('token2')
    assert.deepEqual([...domTokenList.values()], ['token1', 'token2'])
    domTokenList.remove('token1')
    assert.deepEqual([...domTokenList.values()], ['token2'])
    domTokenList.remove('token2')
    assert.deepEqual([...domTokenList.values()], [])
  })

  it('should return the correct entries', () => {
    assert.deepEqual([...domTokenList.entries()], [])
    domTokenList.add('token1')
    assert.deepEqual([...domTokenList.entries()], [[0, 'token1']])
    domTokenList.add('token2')
    assert.deepEqual([...domTokenList.entries()], [[0, 'token1'], [1, 'token2']])
    domTokenList.remove('token1')
    assert.deepEqual([...domTokenList.entries()], [[0, 'token2']])
    domTokenList.remove('token2')
    assert.deepEqual([...domTokenList.entries()], [])
  })

  it('should throw an error with empty tokens', () => {
    assert.throws(() => domTokenList.add(''), DOMException)
    assert.throws(() => domTokenList.remove(''), DOMException)
    assert.throws(() => domTokenList.replace('', 'foo'), DOMException)
    assert.throws(() => domTokenList.replace('foo', ''), DOMException)
    assert.throws(() => domTokenList.toggle(''), DOMException)
  })

  it('should iterate over tokens correctly with forEach', () => {
    domTokenList.add('token1')
    domTokenList.add('token2')
    domTokenList.add('token3')
    domTokenList.add('token4')

    const tokens: string[] = []
    domTokenList.forEach((token) => {
      tokens.push(token)
    })
    assert.deepEqual(tokens, [
      'token1',
      'token2',
      'token3',
      'token4',
    ])

    const thisObj = {}

    domTokenList.forEach(function callback(token, index) {
      assert.strictEqual(this, thisObj)
      assert.strictEqual(token, tokens[index])
    }, thisObj)
  })

  it('should work with Array.prototype.slice', () => {
    domTokenList.add('token1')
    domTokenList.add('token2')
    domTokenList.add('token3')
    domTokenList.add('token4')

    const tokens = Array.prototype.slice.call(domTokenList, 0)
    assert.deepEqual(tokens, [
      'token1',
      'token2',
      'token3',
      'token4',
    ])
  })

  it('should have expected result for Object.keys()', () => {
    domTokenList.add('token1')
    domTokenList.add('token2')
    ;(domTokenList as any).userProp = 'userValue'

    assert.deepEqual(Object.keys(domTokenList), ['0', '1', 'userProp'])
  })

  it('should have expected result for Object.values()', () => {
    domTokenList.add('token1')
    domTokenList.add('token2')
    ;(domTokenList as any).userProp = 'userValue'

    assert.deepEqual(Object.values(domTokenList), ['token1', 'token2', 'userValue'])
  })

  it('should have expected result for Object.entries()', () => {
    domTokenList.add('token1')
    domTokenList.add('token2')
    ;(domTokenList as any).userProp = 'userValue'

    assert.deepEqual(Object.entries(domTokenList), [
      ['0', 'token1'],
      ['1', 'token2'],
      ['userProp', 'userValue'],
    ])
  })

  it('should have expected result for Array.from()', () => {
    domTokenList.add('token1')
    domTokenList.add('token2')
    ;(domTokenList as any).userProp = 'userValue'

    assert.deepEqual(Array.from(domTokenList), ['token1', 'token2'])
  })

  it('should have expected result for [...domTokenList]', () => {
    domTokenList.add('token1')
    domTokenList.add('token2')
    ;(domTokenList as any).userProp = 'userValue'

    assert.deepEqual([...domTokenList], ['token1', 'token2'])
  })
})
