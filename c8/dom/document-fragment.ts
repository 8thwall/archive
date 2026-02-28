// @sublibrary(:dom-core-lib)
import {Node} from './node'
import type {Document} from './document'

// See: https://dom.spec.whatwg.org/#interface-documentfragment
class DocumentFragment extends Node {
  constructor() {
    super((globalThis as any).document, '#document-fragment', Node.DOCUMENT_FRAGMENT_NODE, null)
  }

  // Type narrowing for the ownerDocument property for any non-Document node.
  get ownerDocument(): Document {
    return super.ownerDocument!
  }

  // Prop textContent has type string in an DocumentFragment object.
  declare textContent: string
}

export {DocumentFragment}
