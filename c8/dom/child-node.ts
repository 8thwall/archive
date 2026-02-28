// @sublibrary(:dom-core-lib)
import type {Node} from './node'
import {
  preInsertNode,
  removeNode,
  replaceNode,
} from './node-internal'
import {
  convertNodesIntoNode,
} from './node-methods'

interface ChildNode {
  after(...nodes: (Node | string)[]): void

  before(...nodes: (Node | string)[]): void

  replaceWith(...nodes: (Node | string)[]): void

  remove(): void
}

const mixinChildNode = <T extends ChildNode>(proto: T) => {
  // Inserts a set of Node objects or strings in the children list of the
  // nodes's parent, just after the node object.
  // The after(nodes) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-childnode-after
  proto.after = function after(this: Node, ...nodes: (Node | string)[]): void {
    // 1. Let parent be this’s parent.
    const parent = this.parentNode

    // 2. If parent is null, then return.
    if (!parent) {
      return
    }

    // 3. Let viableNextSibling be this’s first following sibling not in nodes; otherwise null.
    let viableNextSibling: Node | null = this.nextSibling
    while (viableNextSibling && nodes.includes(viableNextSibling)) {
      viableNextSibling = viableNextSibling.nextSibling
    }

    // 4. Let node be the result of converting nodes into a node, given nodes and this’s node
    // document.
    const node = convertNodesIntoNode(nodes, this.ownerDocument!)

    // 5. Pre-insert node into parent before viableNextSibling.
    preInsertNode(node, parent, viableNextSibling)
  }

  // Inserts a set of Node objects or strings in the children list of the
  // nodes's parent, just before the node object.
  // The before(nodes) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-childnode-before
  proto.before = function before(this: Node, ...nodes: (Node | string)[]): void {
    // 1. Let parent be this’s parent.
    const parent = this.parentNode

    // 2. If parent is null, then return.
    if (!parent) {
      return
    }

    // 3. Let viablePreviousSibling be this’s first preceding sibling not in nodes; otherwise null.
    let viablePreviousSibling: Node | null = this.previousSibling
    while (viablePreviousSibling && nodes.includes(viablePreviousSibling)) {
      viablePreviousSibling = viablePreviousSibling.previousSibling
    }

    // 4. Let node be the result of converting nodes into a node, given nodes and this’s node
    // document.
    const node = convertNodesIntoNode(nodes, this.ownerDocument!)

    // 5. If viablePreviousSibling is null, then set it to parent’s first child; otherwise to
    // viablePreviousSibling’s next sibling.
    if (!viablePreviousSibling) {
      viablePreviousSibling = parent.firstChild
    } else {
      viablePreviousSibling = viablePreviousSibling.nextSibling
    }

    // 6. Pre-insert node into parent before viablePreviousSibling.
    preInsertNode(node, parent, viablePreviousSibling)
  }

  // Replaces the characters in the children list of its parent with a set of
  // Node objects or strings.
  // The replaceWith(nodes) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-childnode-replacewith
  proto.replaceWith = function replaceWith(this: Node, ...nodes: (Node | string)[]): void {
    // 1. Let parent be this’s parent.
    const parent = this.parentNode

    // 2. If parent is null, then return.
    if (!parent) {
      return
    }

    // 3. Let viableNextSibling be this’s first following sibling not in nodes; otherwise null.
    let viableNextSibling: Node | null = this.nextSibling
    while (viableNextSibling && nodes.includes(viableNextSibling)) {
      viableNextSibling = viableNextSibling.nextSibling
    }

    // 4. Let node be the result of converting nodes into a node, given nodes and this’s node
    // document.
    const node = convertNodesIntoNode(nodes, this.ownerDocument!)

    // 5. If this’s parent is parent, replace this with node within parent.
    // Note: This could have been inserted into node.
    if (this.parentNode === parent) {
      replaceNode(this, node, parent)
    } else {
      // 6. Otherwise, pre-insert node into parent before viableNextSibling.
      preInsertNode(node, parent, viableNextSibling)
    }
  }

  // Removes the object from its parent children list.
  // The remove() method steps are:
  // See: https://dom.spec.whatwg.org/#dom-childnode-remove
  proto.remove = function remove(): void {
    // 1. If this’s parent is null, then return.
    if (!this.parentNode) {
      return
    }

    // 2. Remove this.
    removeNode(this)
  }
}

export {mixinChildNode, ChildNode}
