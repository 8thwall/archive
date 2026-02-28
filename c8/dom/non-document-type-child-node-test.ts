// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

// @dep(//third_party/headless-gl)

import {describe, it, assert, beforeEach} from '@nia/bzl/js/chai-js'

import {
  NonDocumentTypeChildNode,
  mixinNonDocumentTypeChildNode,
} from './non-document-type-child-node'

import type {DOMString} from './strings'
import {Node} from './node'
import {Document} from './document'

class TestNode extends Node implements NonDocumentTypeChildNode {
  constructor(
    ownerDocument: Document,
    nodeName: DOMString = 'name',
    nodeType: number = Node.ELEMENT_NODE
  ) {
    super(ownerDocument, nodeName, nodeType)
  }
}

interface TestNode extends NonDocumentTypeChildNode {}  // eslint-disable-line no-redeclare

mixinNonDocumentTypeChildNode(TestNode.prototype)

describe('NonDocumentTypeChildNode tests', () => {
  let root: TestNode
  let doc: Document
  let nodes: TestNode[]

  beforeEach(() => {
    doc = new Document()
    root = new TestNode(doc, 'root', Node.ELEMENT_NODE)
    nodes = [
      new TestNode(doc, 'child0', Node.TEXT_NODE),
      new TestNode(doc, 'child1', Node.ELEMENT_NODE),
      new TestNode(doc, 'child2', Node.TEXT_NODE),
      new TestNode(doc, 'child3', Node.COMMENT_NODE),
      new TestNode(doc, 'child4', Node.ELEMENT_NODE),
      new TestNode(doc, 'child5', Node.TEXT_NODE),
    ]
    nodes.forEach(node => root.appendChild(node))
  })

  it('should have expected sibling nodes', () => {
    assert.strictEqual(nodes[0].previousSibling, null)
    assert.strictEqual(nodes[1].previousSibling, nodes[0])
    assert.strictEqual(nodes[2].previousSibling, nodes[1])
    assert.strictEqual(nodes[3].previousSibling, nodes[2])
    assert.strictEqual(nodes[4].previousSibling, nodes[3])
    assert.strictEqual(nodes[5].previousSibling, nodes[4])

    assert.strictEqual(nodes[0].nextSibling, nodes[1])
    assert.strictEqual(nodes[1].nextSibling, nodes[2])
    assert.strictEqual(nodes[2].nextSibling, nodes[3])
    assert.strictEqual(nodes[3].nextSibling, nodes[4])
    assert.strictEqual(nodes[4].nextSibling, nodes[5])
    assert.strictEqual(nodes[5].nextSibling, null)
  })

  it('should have expected sibling elements', () => {
    assert.strictEqual(nodes[0].previousElementSibling, null)
    assert.strictEqual(nodes[1].previousElementSibling, null)
    assert.strictEqual(nodes[2].previousElementSibling, nodes[1])
    assert.strictEqual(nodes[3].previousElementSibling, nodes[1])
    assert.strictEqual(nodes[4].previousElementSibling, nodes[1])
    assert.strictEqual(nodes[5].previousElementSibling, nodes[4])

    assert.strictEqual(nodes[0].nextElementSibling, nodes[1])
    assert.strictEqual(nodes[1].nextElementSibling, nodes[4])
    assert.strictEqual(nodes[2].nextElementSibling, nodes[4])
    assert.strictEqual(nodes[3].nextElementSibling, nodes[4])
    assert.strictEqual(nodes[4].nextElementSibling, null)
    assert.strictEqual(nodes[5].nextElementSibling, null)
  })
})
