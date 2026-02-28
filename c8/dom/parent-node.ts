// @sublibrary(:dom-core-lib)
/* eslint-disable import/no-unresolved, max-classes-per-file */
// @ts-ignore
import {selectOne, selectAll} from 'css-select'
// @ts-ignore
import selectAdapter from 'css-select-browser-adapter'
/* eslint-enable import/no-unresolved, max-classes-per-file */

import {Node} from './node'
import {NodeList, createNodeList} from './node-list'
import {createHTMLCollection} from './html-collection'
import type {Element} from './element'
import type {DOMString} from './strings'
import type {HTMLCollection} from './html-collection'
import {
  appendNode,
  preInsertNode,
  ensurePreInsertionValidity,
  replaceAll,
  nodeDocument,
} from './node-internal'
import {
  convertNodesIntoNode,
} from './node-methods'

declare type Predicate<Value> = (v: Value) => boolean

const findOne = (test: Predicate<Node>, nodes: IterableIterator<Node>): Node | null => {
  const stack = Array.from(nodes).reverse()
  while (stack.length) {
    const node = stack.pop()!
    if (test(node)) {
      return node
    }
    if (node.nodeType === Node.ELEMENT_NODE && node.childNodes.length) {
      stack.push(...Array.from(node.childNodes).reverse())
    }
  }
  return null
}
const findAll = (test: Predicate<Node>, nodes: IterableIterator<Node>): Node[] => {
  const result: Node[] = []
  const stack = Array.from(nodes).reverse()
  while (stack.length) {
    const node = stack.pop()!
    if (test(node)) {
      result.push(node)
    }
    if (node.nodeType === Node.ELEMENT_NODE && node.childNodes.length) {
      stack.push(...Array.from(node.childNodes).reverse())
    }
  }
  return result
}
const selectOptions = {
  adapter: {
    ...selectAdapter,
    findOne,
    findAll,
  },
}

interface ParentNode {
  readonly children: HTMLCollection

  readonly firstElementChild: Element | null

  readonly lastElementChild: Element | null

  readonly childElementCount: number

  prepend(...nodes: (Node | DOMString)[]): void

  append(...nodes: (Node | DOMString)[]): void

  replaceChildren(...nodes: (Node | DOMString)[]): void

  querySelector(selectors: DOMString): Element | null

  querySelectorAll(selectors: DOMString): NodeList<Element>
}

const mixinParentNode = <T extends ParentNode>(proto: T) => {
  Object.defineProperty(proto, 'children', {
    enumerable: true,
    configurable: false,
    get: function children() {
      if (!this._children) {
        const {childNodes} = this
        Object.defineProperty(this, '_children', {
          enumerable: false,
          configurable: false,
          writable: false,
          value: createHTMLCollection({
            * [Symbol.iterator]() {
              const iter = childNodes[Symbol.iterator]()
              let result = iter.next()
              while (!result.done) {
                const child = result.value
                if (child.nodeType === Node.ELEMENT_NODE) {
                  const element = child as Element
                  yield element
                }
                result = iter.next()
              }
            },
          }),
        })
      }
      return this._children
    },
  })

  Object.defineProperty(proto, 'firstElementChild', {
    enumerable: true,
    configurable: false,
    get() {
      let node: Node | null = this.firstChild
      while (node && node.nodeType !== Node.ELEMENT_NODE) {
        node = node.nextSibling
      }
      return node as Element | null
    },
  })

  Object.defineProperty(proto, 'lastElementChild', {
    enumerable: true,
    configurable: false,
    get() {
      let node: Node | null = this.lastChild
      while (node && node.nodeType !== Node.ELEMENT_NODE) {
        node = node.previousSibling
      }
      return node as Element | null
    },
  })

  Object.defineProperty(proto, 'childElementCount', {
    enumerable: true,
    configurable: false,
    get() {
      let count = 0
      let node: Node | null = this.firstChild
      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          count++
        }
        node = node.nextSibling
      }
      return count
    },
  })

  // The prepend(nodes) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-parentnode-prepend
  proto.prepend = function prepend(this: Node, ...nodes: (Node | DOMString)[]): void {
    // 1. Let node be the result of converting nodes into a node given nodes and this’s node
    // document.
    const node = convertNodesIntoNode(nodes, nodeDocument(this))

    // 2. Pre-insert node into this before this’s first child.
    preInsertNode(node, this, this.firstChild)
  }

  // The append(nodes) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-parentnode-append
  proto.append = function append(this: Node, ...nodes: (string | Node)[]): void {
    // 1. Let node be the result of converting nodes into a node given nodes and this’s node
    // document.
    const node = convertNodesIntoNode(nodes, nodeDocument(this))

    // 2. Append node to this.
    appendNode(node, this)
  }

  // The replaceChildren(nodes) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-parentnode-replacechildren
  proto.replaceChildren = function replaceChildren(this: Node, ...nodes: (string | Node)[]): void {
    // 1. Let node be the result of converting nodes into a node given nodes and this’s node
    // document.
    const node = convertNodesIntoNode(nodes, nodeDocument(this))

    // 2. Ensure pre-insertion validity of node into this before null.
    ensurePreInsertionValidity(node, this, null)

    // 3. Replace all with node within this.
    replaceAll(node, this)
  }

  proto.querySelector = function querySelector(selectors: DOMString): Element | null {
    return selectOne(selectors, this as any, selectOptions)
  }

  proto.querySelectorAll = function querySelectorAll(selectors: DOMString): NodeList<Element> {
    // Return a 'static' NodeList for querySelectorAll.
    const elements: Element[] = selectAll(selectors, this as any, selectOptions)
    return createNodeList(elements)
  }
}

export {mixinParentNode, ParentNode}
