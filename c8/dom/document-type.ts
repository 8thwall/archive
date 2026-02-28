// @sublibrary(:dom-core-lib)
import type {Document} from './document'
import {Node} from './node'
import {throwIllegalConstructor} from './exception'
import {mixinChildNode, ChildNode} from './child-node'

let inFactory = false

class DocumentType extends Node implements ChildNode {
  readonly name: string

  readonly publicId: string

  readonly systemId: string

  // Prop textContent has type null in a DocumentType object.
  declare textContent: null

  constructor(ownerDocument: Document, name: string, publicId: string, systemId: string) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, name, Node.DOCUMENT_TYPE_NODE, name)

    Object.defineProperty(this, 'name', {
      enumerable: true,
      configurable: false,
      get() {
        return this.nodeName
      },
    })

    Object.defineProperty(this, 'publicId', {
      enumerable: true,
      configurable: false,
      value: publicId,
    })

    Object.defineProperty(this, 'systemId', {
      enumerable: true,
      configurable: false,
      value: systemId,
    })
  }

  // Type narrowing for the ownerDocument property for any non-Document node.
  get ownerDocument(): Document {
    return super.ownerDocument!
  }
}

// Add mixins to type using declaration merging.
interface DocumentType extends ChildNode {}  // eslint-disable-line no-redeclare

// Add mixins to prototype.
mixinChildNode(DocumentType.prototype)

const createDocumentType = (
  ownerDocument: Document,
  name: string,
  publicId: string,
  systemId: string
) => {
  inFactory = true
  try {
    return new DocumentType(ownerDocument, name, publicId, systemId)
  } finally {
    inFactory = false
  }
}

export {DocumentType, createDocumentType}
