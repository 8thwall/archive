// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import {describe, it, assert, beforeEach} from '@nia/bzl/js/chai-js'

import type {DOMString} from './strings'
import {NodeList, createNodeList} from './node-list'
import {Node} from './node'
import type {Document} from './document'

class TestNode extends Node {
  constructor(
    nodeName: DOMString = 'name',
    nodeType: number = Node.ELEMENT_NODE
  ) {
    super(null as unknown as Document, nodeName, nodeType)
  }
}

describe('NodeList tests', () => {
  let nodeList: NodeList
  let nodeArray: Node[]

  beforeEach(() => {
    // Create NodeList instance with an array of 5 elements.
    nodeArray = [
      new TestNode('node0', Node.ELEMENT_NODE),
      new TestNode('node1', Node.ATTRIBUTE_NODE),
      new TestNode('node2', Node.TEXT_NODE),
      new TestNode('node3', Node.ELEMENT_NODE),
      new TestNode('node4', Node.ATTRIBUTE_NODE),
    ]

    nodeList = createNodeList(nodeArray)
  })

  it('should have expected properties', () => {
    assert.instanceOf(nodeList, NodeList)
    assert.isNumber(nodeList.length)
    assert.isFunction(nodeList.item)
    assert.isFunction(nodeList.entries)
    assert.isFunction(nodeList.forEach)
    assert.isFunction(nodeList.keys)
    assert.isFunction(nodeList.values)
  })

  it('should have correct values', () => {
    assert.strictEqual(nodeList.length, 5)
    assert.strictEqual(nodeList.item(0)?.nodeName, 'node0')
    assert.strictEqual(nodeList.item(1)?.nodeName, 'node1')
    assert.strictEqual(nodeList.item(2)?.nodeName, 'node2')
    assert.strictEqual(nodeList.item(3)?.nodeName, 'node3')
    assert.strictEqual(nodeList.item(4)?.nodeName, 'node4')
    assert.strictEqual(nodeList[0].nodeName, 'node0')
    assert.strictEqual(nodeList[1].nodeName, 'node1')
    assert.strictEqual(nodeList[2].nodeName, 'node2')
    assert.strictEqual(nodeList[3].nodeName, 'node3')
    assert.strictEqual(nodeList[4].nodeName, 'node4')

    assert.isNull(nodeList.item(5))
    assert.isUndefined(nodeList[5])
  })

  it('should iterate over collection correctly', () => {
    const elements = [...nodeList]
    assert.deepEqual(elements, [
      nodeList[0],
      nodeList[1],
      nodeList[2],
      nodeList[3],
      nodeList[4],
    ])
  })

  it('should reflect live modifications', () => {
    nodeArray.push(new TestNode('node5', Node.ELEMENT_NODE))
    assert.strictEqual(nodeList.length, 6)
    assert.strictEqual(nodeList.item(5)?.nodeName, 'node5')
    assert.strictEqual(nodeList[5].nodeName, 'node5')

    let elements = [...nodeList]
    assert.deepEqual(elements, [
      nodeList[0],
      nodeList[1],
      nodeList[2],
      nodeList[3],
      nodeList[4],
      nodeList[5],
    ])

    nodeArray.pop()
    assert.strictEqual(nodeList.length, 5)
    assert.isNull(nodeList.item(5))
    assert.isUndefined(nodeList[5])

    elements = [...nodeList]
    assert.deepEqual(elements, [
      nodeList[0],
      nodeList[1],
      nodeList[2],
      nodeList[3],
      nodeList[4],
    ])
  })

  it('should support keys()', () => {
    const keys = [...nodeList.keys()]
    assert.deepEqual(keys, [0, 1, 2, 3, 4])
  })

  it('should support values()', () => {
    const values = [...nodeList.values()]
    assert.deepEqual(values, nodeArray)
  })

  it('should support entries()', () => {
    const entries = [...nodeList.entries()]
    assert.deepEqual(entries, [
      [0, nodeList[0]],
      [1, nodeList[1]],
      [2, nodeList[2]],
      [3, nodeList[3]],
      [4, nodeList[4]],
    ])
  })

  it('should support forEach()', () => {
    const callback = (value: Node, index: number) => {
      assert.strictEqual(value, nodeList[index])
    }
    nodeList.forEach(callback)
  })

  it('should return expected array for Array.prototype.slice', () => {
    assert.deepEqual(Array.prototype.slice.call(nodeList, 0), nodeArray)
  })
})
