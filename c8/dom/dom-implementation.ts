// @sublibrary(:dom-core-lib)
import type {DOMString} from './strings'
import {DocumentType, createDocumentType} from './document-type'
import type {Document, HTMLDocument} from './document'
import {throwIllegalConstructor} from './exception'

let inFactory = false

type CreateHTMLDocumentCallback = (title?: DOMString) => HTMLDocument

class DOMImplementation {
  readonly _document: Document

  readonly _createHTMLDocument: CreateHTMLDocumentCallback

  constructor(ownerDocument: Document, createHTMLDocument: CreateHTMLDocumentCallback) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    Object.defineProperty(this, '_document', {
      writable: false,
      enumerable: false,
      configurable: false,
      value: ownerDocument,
    })
    Object.defineProperty(this, '_createHTMLDocument', {
      writable: false,
      enumerable: false,
      configurable: false,
      value: createHTMLDocument,
    })
  }

  // eslint-disable-next-line class-methods-use-this
  createDocument(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    namespaceURI: DOMString, qualifiedName: DOMString, doctype?: DocumentType
  ): Document {
    throw new Error('XMLDocument creation not implemented, use createHTMLDocument.')
  }

  createDocumentType(
    qualifiedName: DOMString, publicId: DOMString, systemId: DOMString
  ): DocumentType {
    return createDocumentType(this._document, qualifiedName, publicId, systemId)
  }

  // eslint-disable-next-line class-methods-use-this
  createHTMLDocument(title?: DOMString): Document {
    return this._createHTMLDocument(title)
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  hasFeature(feature: DOMString, version: DOMString) {
    // Deprecated feature that should always return true.
    return true
  }
}

const createDOMImplementation = (
  ownerDocument: Document,
  createHTMLDocument: CreateHTMLDocumentCallback
) => {
  inFactory = true
  try {
    return new DOMImplementation(ownerDocument, createHTMLDocument)
  } finally {
    inFactory = false
  }
}

export {DOMImplementation, createDOMImplementation}
