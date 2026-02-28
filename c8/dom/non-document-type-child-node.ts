// @sublibrary(:dom-core-lib)
import {Node} from './node'
import type {Element} from './element'

interface NonDocumentTypeChildNode {
  // Returns the first Element that follows this node, and is a sibling.
  readonly nextElementSibling: Element | null

  // Returns the first Element that precedes this node, and is a sibling.
  readonly previousElementSibling: Element | null
}

const mixinNonDocumentTypeChildNode = <T extends NonDocumentTypeChildNode>(proto: T) => {
  Object.defineProperty(proto, 'nextElementSibling', {
    enumerable: true,
    configurable: false,
    get() {
      let node: Node | null = this
      // eslint-disable-next-line no-cond-assign
      while ((node = node?.nextSibling || null)) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          return node as Element
        }
      }
      return null
    },
  })

  Object.defineProperty(proto, 'previousElementSibling', {
    enumerable: true,
    configurable: false,
    get() {
      let node: Node | null = this
      // eslint-disable-next-line no-cond-assign
      while ((node = node?.previousSibling || null)) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          return node as Element
        }
      }
      return null
    },
  })
}

export {mixinNonDocumentTypeChildNode, NonDocumentTypeChildNode}
